#!/usr/bin/env python3
"""
scripts/compile_portfolio.py
Parses core/wiki/projects/ and generates site/src/data/generated/portfolio.json.
"""

import os
import sys
import json
import re
from datetime import datetime, timezone
from urllib.parse import urlparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from frontmatter_utils import parse_frontmatter_and_body  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECTS_DIR = os.path.join(ROOT, "core", "wiki", "projects")
TELEMETRY_FILE = os.path.join(ROOT, "site", "src", "data", "generated", "telemetry.json")
OUTPUT_FILE = os.path.join(ROOT, "site", "src", "data", "generated", "portfolio.json")


def repo_key_from_url(url):
    """Derive the telemetry lookup key from the canonical repo_reference URL
    instead of guessing from the display slug (e.g. 'masm-studio' -> 'masmstudio',
    which never matched the real repo name 'MasM8086'). Self-maintaining: as
    long as repo_reference is correct — and it has to be, for the link to work
    at all — the stats lookup stays correct too."""
    if not url:
        return None
    parts = urlparse(url).path.strip("/").split("/")
    return parts[1].lower() if len(parts) >= 2 else None


def parse_decisions(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8", errors="ignore") as handle:
        lines = handle.read().splitlines()
    decisions = []
    current = None
    for line in lines:
        header_match = re.match(r"^##\s+(\d{4}-\d{2}-\d{2})\s*[—–-]\s*(.+)", line)
        if header_match:
            if current:
                decisions.append(current)
            current = {
                "date": header_match.group(1),
                "title": header_match.group(2).strip(),
                "context": "",
                "decision": "",
                "alternatives": "",
                "status": "active",
            }
            continue
        if not current:
            continue
        if line.startswith("**Context:**"):
            current["context"] = line.replace("**Context:**", "").strip()
        elif line.startswith("**Decision:**"):
            current["decision"] = line.replace("**Decision:**", "").strip()
        elif line.startswith("**Alternatives considered:**"):
            current["alternatives"] = line.replace("**Alternatives considered:**", "").strip()
        elif line.startswith("**Status:**"):
            current["status"] = line.replace("**Status:**", "").strip()
    if current:
        decisions.append(current)
    return decisions


def main():
    telemetry = {}
    if os.path.exists(TELEMETRY_FILE):
        with open(TELEMETRY_FILE, "r", encoding="utf-8") as handle:
            telemetry = json.load(handle).get("repositories", {})

    compiled_projects = []

    if os.path.exists(PROJECTS_DIR):
        for filename in sorted(os.listdir(PROJECTS_DIR)):
            if filename.endswith(".md") and not filename.endswith("-decisions.md"):
                filepath = os.path.join(PROJECTS_DIR, filename)
                with open(filepath, "r", encoding="utf-8") as handle:
                    fm, body = parse_frontmatter_and_body(handle.read())

                if fm.get("export") != "true":
                    continue

                proj_id = fm.get("id", filename.replace(".md", ""))
                repo_ref = fm.get("repo_reference")
                repo_key = repo_key_from_url(repo_ref) or proj_id.lower().replace("-", "")
                repo_stats = telemetry.get(repo_key, {})

                # Stack pills
                raw_stack = fm.get("stack", "")
                if isinstance(raw_stack, list):
                    stack = [str(s).strip() for s in raw_stack]
                elif isinstance(raw_stack, str) and raw_stack.strip():
                    stack = [s.strip() for s in raw_stack.split(",") if s.strip()]
                else:
                    stack = []

                # Decisions
                slug = filename.replace(".md", "")
                decisions_file = os.path.join(PROJECTS_DIR, f"{slug}-decisions.md")
                decisions = parse_decisions(decisions_file)

                compiled_projects.append({
                    "id": proj_id,
                    "slug": slug,
                    "title": fm.get("title", proj_id.title()),
                    "status": fm.get("status", "active"),
                    "repo_reference": repo_ref or repo_stats.get("html_url"),
                    "stars": repo_stats.get("stars", 0),
                    "primary_language": repo_stats.get("primary_language"),
                    "last_verified": fm.get("last_verified"),
                    "created": str(fm.get("created", "")),
                    "stack": stack,
                    "decisions": decisions,
                    "decision_count": len(decisions),
                    "body_markdown": body,
                })

    payload = {
        "compiled_at": datetime.now(timezone.utc).isoformat(),
        "projects": compiled_projects,
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)

    print(f"[Compiled Portfolio] Output written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
