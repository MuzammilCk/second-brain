#!/usr/bin/env python3
"""
scripts/sync_github_tracker.py
Pulls repository telemetry across all repos under @MuzammilCk using GitHub CLI (gh)
or direct GitHub API, saving machine-readable telemetry to core/progress/github-telemetry.json.

Complies strictly with AGENTS.md:
- Zero Git Mirroring: queries remote metadata only, never clones repositories.
- Tier 2 Progress Radar: writes solely to core/progress/ (confidential, export authorized).
"""

import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROGRESS_DIR = os.path.join(ROOT, "core", "progress")
PROJECTS_DIR = os.path.join(ROOT, "core", "wiki", "projects")
OUTPUT_FILE = os.path.join(PROGRESS_DIR, "github-telemetry.json")
GITHUB_USER = "MuzammilCk"


def get_repos_via_gh():
    """Fetch repositories using the authenticated GitHub CLI."""
    if not shutil.which("gh"):
        return None
    try:
        cmd = [
            "gh", "repo", "list", GITHUB_USER,
            "--limit", "100",
            "--json", "name,description,isPrivate,pushedAt,primaryLanguage,repositoryTopics,defaultBranchRef,url,stargazerCount,forkCount"
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True, encoding="utf-8")
        return json.loads(res.stdout)
    except Exception as exc:
        print(f"Warning: gh CLI call failed: {exc}", file=sys.stderr)
        return None


def get_repo_readme_summary(repo_name):
    """Fetch the first few paragraphs of a repository README via gh view."""
    if not shutil.which("gh"):
        return ""
    try:
        cmd = ["gh", "repo", "view", f"{GITHUB_USER}/{repo_name}", "--json", "readme"]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True, encoding="utf-8")
        data = json.loads(res.stdout)
        readme = data.get("readme", "")
        clean_lines = []
        for line in readme.splitlines():
            line_str = line.strip()
            if not line_str.startswith("#") and line_str:
                clean_lines.append(line_str)
            if len(clean_lines) >= 3:
                break
        return " ".join(clean_lines)[:300]
    except Exception:
        return ""


def find_documented_slugs():
    """Map existing markdown documents in core/wiki/projects/ to repo names/references."""
    documented = {}
    if not os.path.exists(PROJECTS_DIR):
        return documented

    for f in os.listdir(PROJECTS_DIR):
        if f.endswith(".md") and not f.endswith("-decisions.md") and f != "index.md":
            slug = f.replace(".md", "")
            filepath = os.path.join(PROJECTS_DIR, f)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as handle:
                    content = handle.read()
                # Find repo_reference
                repo_ref_match = re.search(r"repo_reference:\s*(\S+)", content)
                repo_ref = repo_ref_match.group(1).strip().strip('"').strip("'") if repo_ref_match else None
                id_match = re.search(r"id:\s*(\S+)", content)
                doc_id = id_match.group(1).strip().strip('"').strip("'") if id_match else slug

                documented[slug] = {
                    "file": f,
                    "id": doc_id,
                    "repo_reference": repo_ref,
                }
            except Exception:
                continue
    return documented


# Known aliases where GitHub repo name differs from vault slug
REPO_ALIASES = {
    "invoice": "invoice-studio",
    "masm_16-bit_8086": "masm-studio",
    "healthcare": "healthsync",
    "useme": "fitness-platform",
    "hadi": "hadi",
    "odoo-hackthon": "assetflow",
    "repo_mind": "repomind",
    "theytclfr": "ytclfr",
    "crisissignal": "crisissignal",
    "second-brain": "second-brain",
}


def match_repo_to_doc(repo_name, repo_url, documented_slugs):
    """Match a remote GitHub repository to a local project markdown file."""
    repo_name_lower = repo_name.lower()
    
    # Check explicit alias table first
    if repo_name_lower in REPO_ALIASES:
        target = REPO_ALIASES[repo_name_lower]
        if target in documented_slugs:
            return target

    for slug, info in documented_slugs.items():
        # 1. Match by repo_reference URL
        ref = info.get("repo_reference") or ""
        if ref and repo_name_lower == ref.rstrip("/").split("/")[-1].lower():
            return slug
        # 2. Match by exact slug or normalized slug
        norm_slug = slug.lower().replace("-", "").replace("_", "")
        norm_repo = repo_name_lower.replace("-", "").replace("_", "")
        if norm_slug == norm_repo:
            return slug
    return None


def main():
    print("[GitHub Project Tracker Sync]")
    repos_raw = get_repos_via_gh()
    if not repos_raw:
        print("Error: Could not retrieve repositories via gh CLI.", file=sys.stderr)
        sys.exit(1)

    now = datetime.now(timezone.utc)
    documented_slugs = find_documented_slugs()

    processed_repos = {}
    untracked = []
    active_in_7d = []
    active_in_30d = []

    for r in repos_raw:
        name = r.get("name")
        pushed_at_str = r.get("pushedAt")
        days_since_push = None
        if pushed_at_str:
            try:
                pushed_dt = datetime.fromisoformat(pushed_at_str.replace("Z", "+00:00"))
                days_since_push = (now - pushed_dt).days
            except Exception:
                pass

        if days_since_push is not None:
            if days_since_push <= 7:
                activity_status = "active_7d"
                active_in_7d.append(name)
            elif days_since_push <= 30:
                activity_status = "recent_30d"
                active_in_30d.append(name)
            else:
                activity_status = "dormant"
        else:
            activity_status = "unknown"

        topics_data = r.get("repositoryTopics") or []
        topics = [t.get("name") for t in topics_data if isinstance(t, dict) and t.get("name")]
        matched_slug = match_repo_to_doc(name, r.get("url"), documented_slugs)

        if not matched_slug:
            untracked.append(name)

        lang_data = r.get("primaryLanguage")
        primary_lang = lang_data.get("name") if lang_data else None

        processed_repos[name] = {
            "name": name,
            "description": r.get("description") or "",
            "is_private": r.get("isPrivate", False),
            "pushed_at": pushed_at_str,
            "days_since_push": days_since_push,
            "activity_status": activity_status,
            "primary_language": primary_lang,
            "topics": topics,
            "stars": r.get("stargazerCount", 0),
            "forks": r.get("forkCount", 0),
            "url": r.get("url"),
            "default_branch": (r.get("defaultBranchRef") or {}).get("name", "main"),
            "matched_vault_slug": matched_slug,
        }

    payload = {
        "last_synced_at": now.isoformat(),
        "total_repositories": len(processed_repos),
        "tracked_in_vault_count": len(processed_repos) - len(untracked),
        "untracked_count": len(untracked),
        "active_last_7_days": active_in_7d,
        "active_last_30_days": active_in_30d,
        "untracked_repos": untracked,
        "repositories": processed_repos,
    }

    os.makedirs(PROGRESS_DIR, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)

    print(f"-> Successfully synced {len(processed_repos)} repositories to {os.path.relpath(OUTPUT_FILE, ROOT)}")
    print(f"-> Tracked in Vault: {len(processed_repos) - len(untracked)} | Untracked: {len(untracked)}")
    print(f"-> Active in last 7 days: {', '.join(active_in_7d) if active_in_7d else 'None'}")
    if untracked:
        print(f"-> Untracked repos: {', '.join(untracked)}")


if __name__ == "__main__":
    main()
