#!/bin/bash
# Stop hook: commit any pending changes as a checkpoint, then push if a
# remote is configured. No-ops on a clean tree with no push needed.
cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  git add -A
  git commit -q -m "auto-checkpoint: $(date '+%Y-%m-%d %H:%M')"
fi

# Push only if a remote called "origin" actually exists — keeps this a
# no-op for anyone who hasn't done this step yet, and never lets a
# network failure surface as an error in the session.
if git remote get-url origin >/dev/null 2>&1; then
  CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)
  if [ -n "$CURRENT_BRANCH" ]; then
    git push -q origin "$CURRENT_BRANCH" >/dev/null 2>&1
  fi
fi

exit 0
