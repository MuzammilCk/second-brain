#!/usr/bin/env python3
"""
scripts/antigravity_boundary_hook.py
Antigravity PreToolUse hook -- the REAL boundary check, meant to replace the
no-op diagnostic stub ("vault-boundary-diagnostic" in hooks.json, backed by
scripts/diagnostic_hook.py, which always prints {"decision": "allow"}).

READ THIS BEFORE WIRING IT IN. Antigravity's PreToolUse contract is NOT the
same shape as Claude Code's, and getting the difference backwards is
dangerous in opposite directions on each platform:

  - Decision values: allow | deny | ask | force_ask. There is no "no
    opinion" value.
  - An EMPTY or UNRECOGNIZED decision DENIES the tool call on Antigravity.
    This is the opposite of Claude Code, where an empty {} defers to the
    agent's own permission system. A hook ported from Claude Code's "return
    {} to mean carry on" convention will, on Antigravity, silently block
    every tool call in the session -- fail-closed, but in a way that looks
    like the whole session is broken, not like a security control working.
  - Multiple third-party integration notes (not Anthropic/Google docs)
    report that Antigravity's PreToolUse *firing* behavior itself has been
    inconsistent across recent builds -- some versions reportedly only
    fired PostToolUse, which can't block anything (the write has already
    landed by the time it runs). Confirm PreToolUse actually fires and
    actually blocks on YOUR installed version before trusting this for
    anything: write one call that should obviously be denied, make it,
    and check it was actually stopped, not just logged.
  - Field names on stdin below (tool_name/tool_input) are carried over from
    Claude Code's shape as a starting guess -- at least one third-party
    integration note found Antigravity naming things differently instead
    (e.g. a shell command under .toolCall.args.CommandLine). CONFIRM the
    real shape against your own scripts/diagnostic-log.jsonl (gitignored,
    produced by the current diagnostic stub -- run a few tool calls, then
    read that file) and adjust the three extraction lines marked below.

Because of all of the above: scripts/verify_boundaries.py in CI remains the
real backstop regardless of whether this hook works. Treat this file as a
second, earlier tripwire you're actively trying to get working -- not as
something to remove that CI step in favor of.
"""

import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from boundary_policy import evaluate_write, evaluate_bash_command, load_private_terms  # noqa: E402


def _respond(decision, reason=None):
    body = {"decision": decision}
    if reason:
        body["reason"] = reason
    print(json.dumps(body))
    sys.exit(0)  # decision travels via stdout JSON here, not the exit code


def deny(reason):
    _respond("deny", reason)


def allow():
    _respond("allow")


def main():
    try:
        raw = sys.stdin.read()
        payload = json.loads(raw)
    except (json.JSONDecodeError, ValueError):
        # Can't parse the call. On Claude Code this would be "don't block on
        # a guess" (sys.exit(0), no output). On Antigravity, garbage/absent
        # decision DENIES -- so this deliberately denies rather than mimics
        # the Claude Code wrapper's silent pass-through.
        deny("antigravity_boundary_hook: could not parse PreToolUse payload; failing closed.")
        return

    private_terms = load_private_terms()

    # Extract tool name and input args from Antigravity toolCall shape or fallback
    tool_call = payload.get("toolCall") or {}
    tool_name = payload.get("tool_name") or payload.get("toolName") or tool_call.get("name") or ""
    tool_input = payload.get("tool_input") or tool_call.get("args") or {}

    if tool_name in ("Edit", "Write", "write_to_file", "replace_file_content", "multi_replace_file_content"):
        target_path = (
            tool_input.get("file_path")
            or tool_input.get("path")
            or tool_input.get("TargetFile")
            or ""
        )
        content = (
            tool_input.get("CodeContent")
            or tool_input.get("ReplacementContent")
            or tool_input.get("content")
            or tool_input.get("new_string")
            or tool_input.get("CodeEdit")
            or ""
        )
        if not content and "ReplacementChunks" in tool_input:
            chunks = tool_input.get("ReplacementChunks") or []
            content = "\n".join(chunk.get("ReplacementContent", "") for chunk in chunks if isinstance(chunk, dict))

        blocked, reason = evaluate_write(target_path, content, private_terms)
        if blocked:
            deny(reason)
            return

    elif tool_name in ("Bash", "run_command", "run_shell_command"):
        command = tool_input.get("command") or tool_input.get("CommandLine") or ""
        blocked, reason = evaluate_bash_command(command, private_terms)
        if blocked:
            deny(reason)
            return

    allow()


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # Our own crash must not silently open the gate on this platform.
        deny(f"antigravity_boundary_hook crashed ({exc}); failing closed.")
