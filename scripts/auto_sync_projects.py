r"""
Automated Project Sync for Codex Vault
Mirrors CLAUDE.md, context.md, and diff.md from sibling repositories in D:\projects
into mirror/project-sync/<project-name>/ with standardized frontmatter.
"""

import os
import sys
from datetime import datetime
from pathlib import Path

# Configure utf-8 encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

VAULT_ROOT = Path(__file__).resolve().parent.parent
if not (VAULT_ROOT / "wiki").exists() and (Path(__file__).resolve().parent / "wiki").exists():
    VAULT_ROOT = Path(__file__).resolve().parent

PROJECTS_ROOT = VAULT_ROOT.parent

CONTROL_FILES = ["CLAUDE.md", "context.md", "diff.md"]

def sync_projects(root_dir: Path = PROJECTS_ROOT) -> dict:
    today_str = datetime.now().strftime("%Y-%m-%d")
    mirror_dir = VAULT_ROOT / "mirror" / "project-sync"
    mirror_dir.mkdir(parents=True, exist_ok=True)
    log_file = VAULT_ROOT / "wiki" / "log.md"

    synced_files = []
    skipped_files = []
    projects_found = []

    print(f"[Scanning] Sibling project repos in: {root_dir}")

    for item in root_dir.iterdir():
        # Skip codex vault itself or hidden folders
        if not item.is_dir() or item.name.startswith(".") or item.name.lower() == "codex":
            continue

        # Check if folder contains control files
        found_control = [cf for cf in CONTROL_FILES if (item / cf).exists()]
        if not found_control:
            continue

        proj_name = item.name
        projects_found.append(proj_name)
        dest_proj_dir = mirror_dir / proj_name
        dest_proj_dir.mkdir(parents=True, exist_ok=True)

        files_to_sync = found_control.copy()
        if (item / "README.md").exists():
            files_to_sync.append("README.md")

        for fname in files_to_sync:
            src_file = item / fname
            dest_file = dest_proj_dir / fname

            try:
                src_content = src_file.read_text(encoding="utf-8", errors="replace")
            except Exception as e:
                print(f"[Error] Could not read {src_file}: {e}")
                continue

            # Strip existing frontmatter if any
            body_content = src_content
            if body_content.startswith("---"):
                parts = body_content.split("---", 2)
                if len(parts) >= 3:
                    body_content = parts[2].lstrip("\r\n")

            # Create standardized frontmatter
            frontmatter = f"""---
source: project-sync
project: "{proj_name}"
original-path: "{src_file.as_posix()}"
synced: {today_str}
---

"""
            full_new_content = frontmatter + body_content

            # Check if destination file exists and is identical (ignoring synced date)
            if dest_file.exists():
                try:
                    existing = dest_file.read_text(encoding="utf-8", errors="replace")
                    existing_body = existing
                    if existing_body.startswith("---"):
                        parts = existing_body.split("---", 2)
                        if len(parts) >= 3:
                            existing_body = parts[2].lstrip("\r\n")

                    if existing_body.strip() == body_content.strip():
                        skipped_files.append(f"{proj_name}/{fname}")
                        continue
                except Exception:
                    pass

            dest_file.write_text(full_new_content, encoding="utf-8")
            synced_files.append(f"{proj_name}/{fname}")

    print(f"[Done] Project sync completed.")
    print(f"  - Projects found: {len(projects_found)}")
    print(f"  - Files newly synced/updated: {len(synced_files)}")
    print(f"  - Files already up to date: {len(skipped_files)}")

    # Update wiki/log.md
    if synced_files and log_file.exists():
        log_content = log_file.read_text(encoding="utf-8", errors="replace")
        entry = f"- **{today_str} - auto project-sync**: Synced {len(synced_files)} files across {len(projects_found)} projects ({', '.join(projects_found[:4])})"
        if entry not in log_content:
            lines = log_content.splitlines()
            insert_idx = 3
            for idx, l in enumerate(lines[:10]):
                if l.startswith("- **"):
                    insert_idx = idx
                    break
            lines.insert(insert_idx, entry)
            log_file.write_text("\n".join(lines) + "\n", encoding="utf-8")

    return {
        "synced": synced_files,
        "skipped": skipped_files,
        "projects": projects_found
    }

if __name__ == "__main__":
    sync_projects()
