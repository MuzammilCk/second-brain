#!/usr/bin/env bash
# scripts/migrate.sh
#
# Run from the repo root, in Git Bash — not PowerShell directly. This uses
# mkdir -p, mv, and POSIX-style redirects that PowerShell doesn't support
# natively.
#
# This is a cleaned version of the plan's Phase 1 + Path Migration Map.
# Several of the original commands had stray "[cite: 1]" text appended,
# which isn't valid shell syntax. The "rm -rf wiki/[cite: 1]" line in
# particular would have silently done nothing — no space before the
# bracket meant "wiki/" itself was never passed as a clean path, and -f
# swallows the resulting "no such file" error, so it looks like it ran
# successfully while the old wiki/ directory quietly stays put.
#
# Do NOT run this until: the exposed API key has been rotated, the
# placement-portal credentials have been changed, and git history has
# been scrubbed of both. This script only reorganizes the working tree —
# it does nothing about secrets already sitting in prior commits.

set -e

echo "== Phase 1: remove legacy mirrors + build artifacts =="
git rm -rf mirror/project-sync/ 2>/dev/null || true
rm -rf mirror/
git rm -rf site/dist/ 2>/dev/null || true

echo "== Remove legacy mirroring/sync/fix scripts =="
for f in auto_sync_projects.py sync_github_projects.py pull-sources.cmd \
         auto_extract_watcher.py extract_exports.py fix_null_fields.py \
         fix_markdown_rendering.py lint_wiki.py; do
  git rm -f "scripts/$f" 2>/dev/null || true
done

echo "== Phase 2: new directory structure =="
mkdir -p core/private/interviews core/private/scratchpad core/private/operations
mkdir -p core/progress
mkdir -p core/wiki/concepts core/wiki/projects
mkdir -p site/src/data/generated

echo "== Migrate existing content =="
[ -d wiki/placements ] && mv wiki/placements/* core/private/interviews/ 2>/dev/null
[ -d wiki/concepts ] && mv wiki/concepts/* core/wiki/concepts/ 2>/dev/null
[ -d wiki/projects ] && mv wiki/projects/* core/wiki/projects/ 2>/dev/null
true  # so the script doesn't exit non-zero if any of the [ -d ] checks above were false

echo ""
echo "== Verify before deleting legacy wiki/ =="
echo "Check that core/private/interviews/, core/wiki/concepts/, and"
echo "core/wiki/projects/ now actually contain the migrated files."
echo "Once you've confirmed that, run this yourself:"
echo ""
echo "    rm -rf wiki/"
echo ""
echo "Deliberately not automated here — that line caused the original"
echo "citation-artifact bug, and it's the one truly destructive step."
