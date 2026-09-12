#!/usr/bin/env python3
"""
scripts/verify_boundaries.py
Enforces security classifications, directional flow rules, and schema compliance.
Exits with code 1 upon any boundary violation.

Run this as a CI step (both before and after compilation — see live-sync.yml).
This is the reliable backstop regardless of whether the PreToolUse hook
(scripts/check_write_boundary.py) is wired up correctly on someone's machine.
"""

import os
import sys
import json
import re

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from frontmatter_utils import parse_frontmatter_and_body  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PRIVATE_DIR = os.path.join(ROOT, "core", "private")
PROGRESS_DIR = os.path.join(ROOT, "core", "progress")
WIKI_DIR = os.path.join(ROOT, "core", "wiki")
GENERATED_DIR = os.path.join(ROOT, "site", "src", "data", "generated")

REQUIRED_SECTIONS = [
    "1. Problem Statement",
    "2. Architecture & Design",
    "3. Constraints & Technical Trade-offs",
    "4. Implementation Evidence",
    "5. Current State",
    "6. Architectural Decision Log",
]

_STRUCTURED_TERM_RE = re.compile(r"(?:company|target|package|offer|client):\s*([A-Za-z0-9_\-]+)", re.I)


def fail(message):
    print(f"\n[CRITICAL BOUNDARY ERROR] {message}", file=sys.stderr)
    sys.exit(1)


def load_explicit_terms():
    """Terms you've explicitly flagged as sensitive, one per line.
    See core/private/.sensitive-terms.txt for the format. This is the real
    list — the auto-extraction below is just a supplementary net."""
    path = os.path.join(PRIVATE_DIR, ".sensitive-terms.txt")
    if not os.path.exists(path):
        return set()
    with open(path, "r", encoding="utf-8") as handle:
        return {line.strip() for line in handle if line.strip() and not line.startswith("#")}


def extract_structured_terms():
    """Auto-extract 'company: X' / 'client: X' style lines from private notes.
    Deliberately narrow — only catches that exact key: value shape, not free
    prose. Don't rely on this alone; .sensitive-terms.txt is the real list."""
    terms = set()
    if not os.path.exists(PRIVATE_DIR):
        return terms
    for root, _, files in os.walk(PRIVATE_DIR):
        for f in files:
            if f.endswith(".md"):
                path = os.path.join(root, f)
                with open(path, "r", encoding="utf-8", errors="ignore") as handle:
                    for line in handle:
                        terms.update(_STRUCTURED_TERM_RE.findall(line))
    return terms


def check_no_private_leaks():
    """Scan every generated public JSON file for restricted terms.
    No length-based cutoff — a blanket 'len(term) > 4' filter would silently
    pass through short-but-real terms (three-letter company names, etc).
    Deliberately does not print the offending term in the failure message:
    doing so would leak it a second time, into a CI log that may be public."""
    if not os.path.exists(PRIVATE_DIR):
        return

    private_terms = load_explicit_terms() | extract_structured_terms()
    if not private_terms:
        return

    if not os.path.exists(GENERATED_DIR):
        return

    for root, _, files in os.walk(GENERATED_DIR):
        for f in files:
            if f.endswith(".json"):
                path = os.path.join(root, f)
                with open(path, "r", encoding="utf-8", errors="ignore") as handle:
                    content = handle.read().lower()
                for term in private_terms:
                    if len(term) >= 2 and term.lower() in content:
                        fail(
                            f"Public artifact '{os.path.relpath(path, ROOT)}' references a "
                            f"restricted term from your private notes. Check .sensitive-terms.txt "
                            f"and grep the file yourself to find it — intentionally not printed here."
                        )


def check_stack_inventory_evidence():
    """production and active_sprint both require evidence.reference.
    Only production additionally requires that reference to point to a
    real, already-written case study under core/wiki/projects/."""
    inventory_path = os.path.join(PROGRESS_DIR, "stack-inventory.json")
    if not os.path.exists(inventory_path):
        return

    with open(inventory_path, "r", encoding="utf-8") as handle:
        try:
            data = json.load(handle)
        except json.JSONDecodeError as exc:
            fail(f"stack-inventory.json is not valid JSON: {exc}")
            return

    for item in data.get("technologies", []):
        name = item.get("name", "Unknown")
        status = item.get("status")
        evidence = item.get("evidence", {})

        if status in ("production", "active_sprint"):
            if not evidence.get("reference"):
                fail(f"Technology '{name}' is marked '{status}' but has no evidence.reference.")
            if status == "production" and evidence.get("type") == "project_id":
                proj_ref = evidence.get("reference")
                expected_doc = os.path.join(WIKI_DIR, "projects", f"{proj_ref}.md")
                if not os.path.exists(expected_doc):
                    fail(
                        f"Technology '{name}' cites project_id '{proj_ref}', but "
                        f"'{os.path.relpath(expected_doc, ROOT)}' does not exist."
                    )


def check_project_schemas():
    """Enforce the 6-part schema only for docs marked export: true.
    Drafts (export: false, or missing entirely) are allowed to be incomplete —
    a work-in-progress case study shouldn't fail CI just for existing."""
    projects_dir = os.path.join(WIKI_DIR, "projects")
    if not os.path.exists(projects_dir):
        return

    for f in os.listdir(projects_dir):
        if f.endswith(".md") and not f.endswith("-decisions.md"):
            path = os.path.join(projects_dir, f)
            with open(path, "r", encoding="utf-8") as handle:
                text = handle.read()

            frontmatter, _ = parse_frontmatter_and_body(text)
            if frontmatter.get("export") != "true":
                continue  # draft, not held to the full schema yet

            for section in REQUIRED_SECTIONS:
                if section not in text:
                    fail(
                        f"Project document '{f}' is marked export: true but is "
                        f"missing required section: '{section}'"
                    )


def main():
    print("[Verifying System Boundaries & Schemas...]")
    check_no_private_leaks()
    check_stack_inventory_evidence()
    check_project_schemas()
    print("[SUCCESS] All security boundaries and schemas verified.")


if __name__ == "__main__":
    main()
