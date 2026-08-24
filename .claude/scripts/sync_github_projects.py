"""
GitHub Direct Project Extractor for Codex Vault
Fetches repository metadata, READMEs, control files, and recent commit logs
directly from GitHub using the authenticated GitHub CLI (gh).
Mirrors files into mirror/project-sync/<repo>/ and updates project indices.
"""

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

# Configure utf-8 encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

VAULT_ROOT = Path(__file__).resolve().parent.parent.parent
MIRROR_DIR = VAULT_ROOT / "mirror" / "project-sync"
MIRROR_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = VAULT_ROOT / "wiki" / "log.md"

def run_gh_command(args: list) -> str:
    """Execute a gh CLI command and return stdout."""
    cmd = ["gh"] + args
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if res.returncode != 0:
        return ""
    return res.stdout.strip()

def sync_github_repositories():
    today_str = datetime.now().strftime("%Y-%m-%d")
    print("🐙 [GitHub] Fetching repository list for authenticated user...")

    repos_json = run_gh_command(["repo", "list", "--limit", "100", "--json", "name,description,isPrivate,updatedAt,primaryLanguage,url"])
    if not repos_json:
        print("❌ [Error] Failed to fetch repositories from GitHub CLI.")
        return

    repos = json.loads(repos_json)
    print(f"📦 [GitHub] Found {len(repos)} repositories.")

    synced_projects = []

    for r in repos:
        name = r.get("name", "")
        desc = r.get("description", "") or ""
        lang = r.get("primaryLanguage", {}).get("name", "Unknown") if r.get("primaryLanguage") else "Unknown"
        updated_at = r.get("updatedAt", "")[:10]
        url = r.get("url", "")
        is_private = r.get("isPrivate", False)

        # Skip the second-brain vault itself
        if name.lower() in ["second-brain", "codex"]:
            continue

        proj_dir = MIRROR_DIR / name
        proj_dir.mkdir(parents=True, exist_ok=True)

        print(f"  ⬇️  Syncing {name} ({lang})...")

        # 1. Fetch README.md if available
        readme_content = run_gh_command(["api", f"repos/:owner/{name}/readme", "--jq", ".content"])
        if readme_content:
            try:
                import base64
                decoded_readme = base64.b64decode(readme_content).decode("utf-8", errors="replace")
                readme_dest = proj_dir / "README.md"
                frontmatter = f"""---
source: github-api
project: "{name}"
language: "{lang}"
updated: {updated_at}
synced: {today_str}
url: "{url}"
---

"""
                readme_dest.write_text(frontmatter + decoded_readme, encoding="utf-8")
            except Exception:
                pass

        # 2. Fetch Recent Commits (Last 5 commits for dev context)
        commits_json = run_gh_command(["api", f"repos/:owner/{name}/commits?per_page=5", "--jq", "[.[] | {message: .commit.message, date: .commit.author.date, author: .commit.author.name}]"])
        if commits_json:
            try:
                commits = json.loads(commits_json)
                commit_lines = [f"# {name} Recent Git History\n"]
                for c in commits:
                    msg = c.get("message", "").strip().replace("\n", " ")
                    c_date = c.get("date", "")[:10]
                    commit_lines.append(f"- **{c_date}**: {msg}")
                
                (proj_dir / "commits.md").write_text("\n".join(commit_lines) + "\n", encoding="utf-8")
            except Exception:
                pass

        # 3. Create/Update project context summary
        context_file = proj_dir / "context.md"
        context_md = f"""---
source: github-api
project: "{name}"
language: "{lang}"
description: "{desc.replace('"', '\\"')}"
private: {str(is_private).lower()}
last-updated: {updated_at}
synced: {today_str}
url: "{url}"
---

# {name}

- **Description**: {desc or "No description provided."}
- **Primary Stack**: {lang}
- **GitHub URL**: {url}
- **Visibility**: {"Private" if is_private else "Public"}
- **Last Active on GitHub**: {updated_at}
"""
        context_file.write_text(context_md, encoding="utf-8")
        synced_projects.append(name)

    print(f"\n✅ [Done] Successfully extracted details for {len(synced_projects)} projects from GitHub!")

    # Log to wiki/log.md
    if LOG_FILE.exists():
        log_content = LOG_FILE.read_text(encoding="utf-8", errors="replace")
        entry = f"- **{today_str} - github sync**: Extracted metadata, READMEs, and commit history for {len(synced_projects)} GitHub repositories"
        if entry not in log_content:
            lines = log_content.splitlines()
            insert_idx = 3
            for idx, l in enumerate(lines[:10]):
                if l.startswith("- **"):
                    insert_idx = idx
                    break
            lines.insert(insert_idx, entry)
            LOG_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")

if __name__ == "__main__":
    sync_github_repositories()
