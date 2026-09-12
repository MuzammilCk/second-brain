#!/usr/bin/env python3
"""
scripts/check_write_boundary.py
PreToolUse hook. Reads the tool call Claude Code is about to make (JSON on
stdin) and blocks (exit code 2) a write that looks like it's putting
restricted content somewhere export-authorized or public.

Register this under "PreToolUse" (matcher: "Edit|Write|Bash") directly in
.claude/settings.json's "hooks" key. Two things NOT to do:
  - Don't call the event "post_write" — Claude Code doesn't have that event;
    the real ones are PreToolUse, PostToolUse, UserPromptSubmit, Stop,
    SessionStart, SessionEnd, Notification, PreCompact.
  - Don't ship this only inside a plugin's own hooks.json — there's a
    reported case of plugin-sourced hooks registering and matching in the
    logs but never actually firing, while the same hook placed directly in
    settings.json runs normally.
PostToolUse also isn't the right event even if correctly wired: it fires
*after* the tool has already run, so "abort immediately" isn't something it
can actually do — the write has already landed by then.

Coverage note: Edit/Write detection is solid (Claude Code hands you the
exact file_path and content). Bash detection here is best-effort — arbitrary
shell commands are hard to parse reliably, so this only catches the common
cases. Don't treat this as a substitute for scripts/verify_boundaries.py
running in CI; treat it as an earlier, partial tripwire, with CI as the
actual backstop.
"""

import json
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PRIVATE_DIR = os.path.join(ROOT, "core", "private")

EXPORT_ZONES = (
    os.path.join(ROOT, "core", "progress"),
    os.path.join(ROOT, "core", "wiki"),
    os.path.join(ROOT, "site"),
)


def load_private_terms():
    terms = set()
    sensitive_file = os.path.join(PRIVATE_DIR, ".sensitive-terms.txt")
    if os.path.exists(sensitive_file):
        with open(sensitive_file, "r", encoding="utf-8") as handle:
            terms.update(
                line.strip() for line in handle if line.strip() and not line.startswith("#")
            )
    return terms


def is_export_zone(path):
    if not path:
        return False
    abs_path = os.path.abspath(path)
    return any(abs_path.startswith(zone) for zone in EXPORT_ZONES)


def block(reason):
    print(f"[BOUNDARY BLOCK] {reason}", file=sys.stderr)
    sys.exit(2)


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)  # can't parse it, don't block on a guess

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {})
    private_terms = load_private_terms()
    if not private_terms:
        sys.exit(0)

    if tool_name in ("Edit", "Write"):
        target_path = tool_input.get("file_path", "")
        content = tool_input.get("content") or tool_input.get("new_string") or ""
        if is_export_zone(target_path):
            lowered = content.lower()
            for term in private_terms:
                if len(term) >= 2 and term.lower() in lowered:
                    block(
                        f"Write to {os.path.relpath(target_path, ROOT)} contains a "
                        f"restricted term from core/private/.sensitive-terms.txt."
                    )

    elif tool_name == "Bash":
        command = tool_input.get("command", "")
        lowered = command.lower()
        if "core/private" in lowered or "core\\private" in lowered:
            block(
                "This command references core/private/ directly — review it manually "
                "before running; this hook can't reliably verify Bash-based moves/copies."
            )
        for term in private_terms:
            if len(term) >= 2 and term.lower() in lowered:
                block(
                    "This command's text contains a restricted term from "
                    "core/private/.sensitive-terms.txt."
                )

    sys.exit(0)


if __name__ == "__main__":
    main()
