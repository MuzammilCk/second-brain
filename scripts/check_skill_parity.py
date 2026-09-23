#!/usr/bin/env python3
"""
scripts/check_skill_parity.py

The 9 codex-core skills currently exist as two hand-copied, byte-identical
files each:
    .agents/skills/<name>/SKILL.md
    .agents/plugins/codex-core/skills/<name>/SKILL.md

They are identical today (verified 2026-09-18). Nothing stops that from
changing -- this is the exact failure mode a prior audit already found once,
in a different pair of files (the source-command-* skill/command files, hit
by a bulk find-and-replace pass). scripts/diagnostic_hook.py solved this for
itself with a loader-stub pattern (one file execs the other) -- markdown
can't do that, so this script is the equivalent for SKILL.md: a parity
check, not a runtime pointer.

If you added .claude/skills/<name>/SKILL.md pointer files (see APPLY.md),
this also checks each pointer still names the file it's supposed to point
at, so a rename on one side can't silently orphan the pointer.

Wire this into the SAME PostToolUse hook that already runs lint_wiki.py
("vault-linter" in hooks.json) and into verify_boundaries.py's CI run --
both are one line to add, see APPLY.md.
"""

import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SOURCE_A = os.path.join(ROOT, ".agents", "skills")
SOURCE_B = os.path.join(ROOT, ".agents", "plugins", "codex-core", "skills")
CLAUDE_SKILLS = os.path.join(ROOT, ".claude", "skills")

# The 9 codex-core skills as of 2026-09-18. If you add a 10th to
# .agents/plugins/codex-core/skills/, add its name here too -- this list is
# intentionally explicit rather than "whatever's on disk", so a skill that
# only exists in one location gets caught as a problem, not silently skipped.
CODEX_CORE_SKILLS = [
    "briefing", "debrief", "decide", "ingest", "lint", "log", "query", "review", "standup",
]


def check_skill_parity():
    """Returns (errors: list[str], warnings: list[str])."""
    errors, warnings = [], []

    for name in CODEX_CORE_SKILLS:
        path_a = os.path.join(SOURCE_A, name, "SKILL.md")
        path_b = os.path.join(SOURCE_B, name, "SKILL.md")

        a_exists, b_exists = os.path.exists(path_a), os.path.exists(path_b)
        if not a_exists and not b_exists:
            errors.append(f"Skill '{name}' is in CODEX_CORE_SKILLS but exists in neither location.")
            continue
        if a_exists != b_exists:
            missing = path_b if a_exists else path_a
            errors.append(f"Skill '{name}' exists in only one location -- missing: {os.path.relpath(missing, ROOT)}")
            continue

        with open(path_a, "r", encoding="utf-8") as f:
            content_a = f.read()
        with open(path_b, "r", encoding="utf-8") as f:
            content_b = f.read()

        if content_a != content_b:
            errors.append(
                f"Skill '{name}' has DRIFTED: {os.path.relpath(path_a, ROOT)} and "
                f"{os.path.relpath(path_b, ROOT)} are no longer identical. Diff them and "
                f"decide which one is right, then sync both -- this is the exact class of bug "
                f"a find-and-replace pass caused once before."
            )

        # If a Claude Code pointer file exists for this skill, make sure it still
        # names a real path (catches a rename on the .agents/ side orphaning it).
        pointer_path = os.path.join(CLAUDE_SKILLS, name, "SKILL.md")
        if os.path.exists(pointer_path):
            with open(pointer_path, "r", encoding="utf-8") as f:
                pointer_content = f.read()
            expected_ref = f".agents/skills/{name}/SKILL.md"
            if expected_ref not in pointer_content:
                warnings.append(
                    f".claude/skills/{name}/SKILL.md doesn't reference '{expected_ref}' -- "
                    f"check it still points at the right file."
                )

    return errors, warnings


def main():
    print("[Checking skill file parity across .agents/skills/ and .agents/plugins/codex-core/skills/...]")
    errors, warnings = check_skill_parity()
    for w in warnings:
        print(f"  [WARN] {w}")
    for e in errors:
        print(f"  [ERROR] {e}", file=sys.stderr)
    if errors:
        print(f"[FAIL] {len(errors)} skill parity error(s).", file=sys.stderr)
        sys.exit(1)
    print(f"[OK] All {len(CODEX_CORE_SKILLS)} codex-core skills are in sync ({len(warnings)} warning(s)).")


if __name__ == "__main__":
    main()
