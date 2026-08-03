#!/bin/bash
# Stop hook: commit any pending wiki/journal/content changes as a checkpoint.
# No-ops on a clean tree — never creates an empty commit.
cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  git add -A
  git commit -q -m "auto-checkpoint: $(date '+%Y-%m-%d %H:%M')"
fi
exit 0
