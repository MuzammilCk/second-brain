#!/usr/bin/env python3
"""
scripts/boundary_policy.py
Shared boundary-check logic for BOTH real-time hooks:
  - scripts/check_write_boundary.py   (Claude Code, PreToolUse, exit-code contract)
  - scripts/antigravity_boundary_hook.py (Antigravity, PreToolUse, JSON-decision contract)

Why this file exists: the two hosts speak different protocols (see the two
wrapper scripts for the specifics), but "is this write actually dangerous"
should only be decided in one place. Before this file, that logic would have
had to be copied into both wrappers -- which is exactly the kind of
duplication that let the 9 paired SKILL.md files drift once already. Import
this from both; don't reimplement it in either.

This module has ZERO third-party dependencies on purpose. A PreToolUse hook
runs on every single Edit/Write/Bash call in the session -- it has to work
even if a venv isn't activated, `pip install` hasn't been run, or the hook is
invoked in some path context that isn't the normal project shell. Anything
this can't catch is exactly what the CI-side, dependency-friendly layer
(gitleaks, see check_gitleaks_available below) is for.
"""

import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PRIVATE_DIR = os.path.join(ROOT, "core", "private")

EXPORT_ZONES = (
    os.path.join(ROOT, "core", "progress"),
    os.path.join(ROOT, "core", "wiki"),
    os.path.join(ROOT, "site"),
)

# --- Layer 1: your own named terms (unchanged from check_write_boundary.py) ---

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
    abs_path = os.path.normcase(os.path.abspath(path))
    return any(abs_path.startswith(os.path.normcase(zone)) for zone in EXPORT_ZONES)


# --- Layer 2: NEW -- generic secret-SHAPE detection, independent of the term list ---
#
# The original incident (mirror/project-sync/invoice/diff.md) was a live API
# key, not a name from .sensitive-terms.txt -- a named-term scanner cannot
# catch a secret it doesn't know the name of. This is a deliberately small,
# high-confidence pattern bank (not a reimplementation of gitleaks' ~150
# rules) so it stays fast and dependency-free inside a PreToolUse hook.
# Treat this as a tripwire for the obvious shapes, not a substitute for
# actually running gitleaks (see below) as the authoritative scanner.
SECRET_PATTERNS = [
    ("AWS Access Key ID", re.compile(r"\b(AKIA|ASIA)[0-9A-Z]{16}\b")),
    ("AWS Secret Access Key (heuristic)", re.compile(r"(?i)aws_secret_access_key\s*[:=]\s*['\"]?[A-Za-z0-9/+=]{40}['\"]?")),
    ("OpenAI-style key", re.compile(r"\bsk-[A-Za-z0-9]{20,}\b")),
    ("Anthropic-style key", re.compile(r"\bsk-ant-[A-Za-z0-9\-_]{20,}\b")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z\-_]{35}\b")),
    ("Generic Bearer token", re.compile(r"(?i)bearer\s+[A-Za-z0-9\-_.]{20,}")),
    ("Slack token", re.compile(r"\bxox[baprs]-[0-9A-Za-z\-]{10,}\b")),
    ("GitHub token", re.compile(r"\bgh[pousr]_[A-Za-z0-9]{36,}\b")),
    ("Private key block", re.compile(r"-----BEGIN[ A-Z]*PRIVATE KEY-----")),
    ("Generic assignment to a high-entropy secret", re.compile(
        r"(?i)(api[_-]?key|secret|token|password|passwd|client[_-]?secret)\s*[:=]\s*['\"][A-Za-z0-9+/_\-]{24,}['\"]"
    )),
]


def scan_for_secret_patterns(content):
    """Return a list of (label, matched_snippet_is_withheld) for any secret-shaped
    string found. Never returns the actual matched text -- same reasoning as
    verify_boundaries.py's check_no_private_leaks: don't re-leak the secret
    into a hook's stdout/stderr, which may end up in a log."""
    hits = []
    if not content:
        return hits
    for label, pattern in SECRET_PATTERNS:
        if pattern.search(content):
            hits.append(label)
    return hits


def check_gitleaks_available():
    """Advisory only. The hook itself never shells out to gitleaks (that would
    add a dependency + latency to every tool call); this just lets a wrapper
    print a one-time nudge if gitleaks isn't installed, since gitleaks should
    still be doing the authoritative pre-commit scan alongside this hook, not
    instead of it. See APPLY.md for wiring it in as a pre-commit hook."""
    import shutil
    return shutil.which("gitleaks") is not None


# --- Combined decision, used by both wrappers ---

def evaluate_write(target_path, content, private_terms=None):
    """Returns (blocked: bool, reason: str | None).
    target_path may be '' / None for a Bash-command evaluation -- callers pass
    the command string as `content` in that case and skip the export-zone
    gate (see evaluate_bash_command)."""
    if private_terms is None:
        private_terms = load_private_terms()

    if is_export_zone(target_path):
        lowered = (content or "").lower()
        for term in private_terms:
            if len(term) >= 2 and term.lower() in lowered:
                return True, (
                    f"Write to {os.path.relpath(target_path, ROOT)} contains a "
                    f"restricted term from core/private/.sensitive-terms.txt."
                )
        secret_hits = scan_for_secret_patterns(content)
        if secret_hits:
            return True, (
                f"Write to {os.path.relpath(target_path, ROOT)} matches a "
                f"secret-shaped pattern ({', '.join(secret_hits)}). If this is a "
                f"false positive, this hook still fails closed -- fix the content, "
                f"don't suppress the hook."
            )
    return False, None


def evaluate_bash_command(command, private_terms=None):
    if private_terms is None:
        private_terms = load_private_terms()
    lowered = (command or "").lower()
    if "core/private" in lowered or "core\\private" in lowered:
        return True, (
            "This command references core/private/ directly -- review it manually "
            "before running; this hook can't reliably verify Bash-based moves/copies."
        )
    for term in private_terms:
        if len(term) >= 2 and term.lower() in lowered:
            return True, "This command's text contains a restricted term from core/private/.sensitive-terms.txt."
    secret_hits = scan_for_secret_patterns(command)
    if secret_hits:
        return True, f"This command's text matches a secret-shaped pattern ({', '.join(secret_hits)})."
    return False, None
