#!/usr/bin/env python3
"""
scripts/compile_concepts.py
Parses core/wiki/concepts/ and generates site/src/data/generated/concepts.json.

This didn't exist before — the /concepts route in the new site architecture
has no other data source. Concepts aren't case studies: no 6-section
requirement, no repo_reference, no telemetry merge. Just frontmatter +
sanitized body, same PRIVATE-block stripping as projects for consistency
(the physical separation of core/wiki/ from core/private/ is still the real
control — this is defense-in-depth, same caveat as in compile_portfolio.py).
"""

import os
import json
from datetime import datetime, timezone
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from frontmatter_utils import parse_frontmatter_and_body  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CONCEPTS_DIR = os.path.join(ROOT, "core", "wiki", "concepts")
OUTPUT_FILE = os.path.join(ROOT, "site", "src", "data", "generated", "concepts.json")


def main():
    compiled = []

    if os.path.exists(CONCEPTS_DIR):
        for filename in sorted(os.listdir(CONCEPTS_DIR)):
            if not filename.endswith(".md"):
                continue
            filepath = os.path.join(CONCEPTS_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as handle:
                fm, body = parse_frontmatter_and_body(handle.read())

            # Concepts default to exported unless explicitly marked otherwise —
            # unlike projects, there's no expectation these start as drafts.
            if fm.get("export") == "false":
                continue

            slug = fm.get("id", filename.replace(".md", ""))
            compiled.append({
                "id": slug,
                "title": fm.get("title", slug.replace("-", " ").title()),
                "tags": [t.strip() for t in fm.get("tags", "").split(",") if t.strip()],
                "last_verified": fm.get("last_verified"),
                "body_markdown": body,
            })

    payload = {
        "compiled_at": datetime.now(timezone.utc).isoformat(),
        "concepts": compiled,
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)

    print(f"[Compiled Concepts] Output written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
