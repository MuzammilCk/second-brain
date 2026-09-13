#!/usr/bin/env python3
"""
scripts/compile_progress.py
Validates and compiles core/progress/ into site/src/data/generated/progress.json.

Quadrant derivation: stack-inventory.json only stores 'category' (the single
source of truth). The 0-3 quadrant index the radar UI uses is computed here,
not hand-entered — so category and quadrant can't quietly drift apart the
way they would if both were separate fields someone edits by hand.
"""

import os
import sys
import json
from datetime import datetime, timezone

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INVENTORY_FILE = os.path.join(ROOT, "core", "progress", "stack-inventory.json")
SPRINT_FILE = os.path.join(ROOT, "core", "progress", "current-sprint.md")
OUTPUT_FILE = os.path.join(ROOT, "site", "src", "data", "generated", "progress.json")

# Keep this in sync with the QUADRANTS array in TechRadar.tsx.
CATEGORY_TO_QUADRANT = {
    "Systems": 0,
    "AI/ML": 1,
    "Architecture": 2,
    "Tooling": 3,
}


def with_derived_quadrant(technologies):
    resolved = []
    for item in technologies:
        category = item.get("category")
        if category not in CATEGORY_TO_QUADRANT:
            print(
                f"[compile_progress] ERROR: technology '{item.get('name', 'Unknown')}' "
                f"has category '{category}', which isn't in CATEGORY_TO_QUADRANT "
                f"{sorted(CATEGORY_TO_QUADRANT)}. Fix the category or add it to the "
                f"map — refusing to guess a quadrant.",
                file=sys.stderr,
            )
            sys.exit(1)
        resolved.append({**item, "quadrant": CATEGORY_TO_QUADRANT[category]})
    return resolved


def main():
    payload = {
        "compiled_at": datetime.now(timezone.utc).isoformat(),
        "active_focus": {},
        "current_sprint_summary": "",
        "technologies": [],
    }

    if os.path.exists(INVENTORY_FILE):
        with open(INVENTORY_FILE, "r", encoding="utf-8") as handle:
            data = json.load(handle)
            payload["active_focus"] = data.get("active_focus", {})
            payload["technologies"] = with_derived_quadrant(data.get("technologies", []))

    if os.path.exists(SPRINT_FILE):
        with open(SPRINT_FILE, "r", encoding="utf-8") as handle:
            lines = [line.strip() for line in handle.readlines() if line.strip() and not line.startswith("#")]
            payload["current_sprint_summary"] = " ".join(lines[:4])

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)

    print(f"[Compiled Progress] Output written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
