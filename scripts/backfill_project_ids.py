#!/usr/bin/env python3
"""
scripts/backfill_project_ids.py
One-off: adds a missing `id` frontmatter field to every core/wiki/projects/
*.md file (not *-decisions.md), using the filename (minus .md) as the id.
Skips any file that already has an id. Prints what it changed; makes no
changes on a dry run.

Usage:
  python scripts/backfill_project_ids.py           # dry run, shows what would change
  python scripts/backfill_project_ids.py --apply   # actually writes the files
"""

import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECTS_DIR = os.path.join(ROOT, "core", "wiki", "projects")


def process(path, apply):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if not text.startswith("---"):
        print(f"SKIP (no frontmatter block): {path}")
        return

    parts = text.split("---", 2)
    if len(parts) < 3:
        print(f"SKIP (malformed frontmatter): {path}")
        return

    fm_block = parts[1]
    if any(line.strip().startswith("id:") for line in fm_block.split("\n")):
        print(f"SKIP (already has id): {path}")
        return

    filename_id = os.path.basename(path)[:-3]  # strip ".md"
    new_fm_block = f'\nid: "{filename_id}"' + fm_block
    new_text = "---" + new_fm_block + "---" + parts[2]

    print(f"{'WRITE' if apply else 'WOULD WRITE'}: {path}  ->  id: \"{filename_id}\"")
    if apply:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_text)


def main():
    apply = "--apply" in sys.argv
    if not os.path.exists(PROJECTS_DIR):
        print(f"No such directory: {PROJECTS_DIR}")
        return
    for filename in sorted(os.listdir(PROJECTS_DIR)):
        if filename.endswith(".md") and not filename.endswith("-decisions.md"):
            process(os.path.join(PROJECTS_DIR, filename), apply)
    if not apply:
        print("\nDry run only — re-run with --apply to actually write changes.")


if __name__ == "__main__":
    main()
