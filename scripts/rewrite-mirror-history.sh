#!/usr/bin/env bash
# scripts/rewrite-mirror-history.sh
#
# Full history rewrite to strip BOTH mirror/project-sync/ and core/private/
# out of every commit, not just the current tree. Run in Git Bash. Requires
# git-filter-repo (pip install git-filter-repo --break-system-packages, or
# see https://github.com/newren/git-filter-repo).
#
# ============================================================================
# READ THIS BEFORE RUNNING ANYTHING
# ============================================================================
# core/private/ contains real, current, valuable content (interview prep,
# DSA tracker, etc.) that needs to keep existing ON DISK after this — it
# should only stop being TRACKED BY GIT. Those are different things, and
# doing this in the wrong order risks the files themselves disappearing:
#
#   1. First, in your actual working repo (not a clone), make sure
#      core/private/ is untracked and gitignored, and that change is
#      committed:
#         git rm -r --cached core/private/
#         echo "core/private/" >> .gitignore
#         git add .gitignore
#         git commit -m "untrack core/private/"
#      `git reset --hard` does not touch untracked/ignored files — so once
#      this step is done, nothing below can delete those files from disk,
#      no matter what happens to git history.
#   2. ALSO make a plain, non-git backup of core/private/ somewhere else
#      entirely (a zip, a copy to another folder) as a second safety net.
#      Confirm it actually has your real content before proceeding.
#   3. Only then run this script.
#
# This script will refuse to proceed if it detects core/private/ is still
# tracked at HEAD — that's the check, not a suggestion.
# ============================================================================

set -e

REPO_URL="$1"
if [ -z "$REPO_URL" ]; then
  echo "Usage: ./rewrite-mirror-history.sh <path-or-url-to-original-repo>"
  exit 1
fi

WORK_DIR="second-brain-history-rewrite.git"

echo "== Making a fresh mirror clone to operate on (never rewrite in place) =="
git clone --mirror --no-local "$REPO_URL" "$WORK_DIR"
cd "$WORK_DIR"

echo "== Pre-flight: confirming core/private/ is already untracked at HEAD =="
if git ls-tree -r HEAD --name-only | grep -q '^core/private/'; then
  echo ""
  echo "ABORTING: core/private/ is still tracked at HEAD in the source repo."
  echo "Go do step 1 from the header comment in this script FIRST —"
  echo "untrack and gitignore core/private/, commit that, THEN come back"
  echo "and run this script again. Not proceeding without that in place."
  cd ..
  rm -rf "$WORK_DIR"
  exit 1
fi
echo "OK — core/private/ is not in the tracked tree. Proceeding."

echo "== Removing mirror/project-sync/ and core/private/ from every commit =="
git filter-repo --path mirror/project-sync --path core/private --invert-paths

# Optional, effectively free since we're already rewriting history anyway:
# scrub the old .claude/settings.json key and placement-portal credential
# strings wherever they appear, in case they're ever needed again for
# defense-in-depth. Skip this block entirely if you'd rather not touch it —
# it's not required given the key was local-only and the repo is private.
#
# cat > /tmp/replacements.txt << 'REPLACEMENTS'
# <the old api key value>==>REDACTED
# <the old portal password>==>REDACTED
# REPLACEMENTS
# git filter-repo --replace-text /tmp/replacements.txt

echo ""
echo "== filter-repo removes the 'origin' remote as a safety measure — expected =="
echo "== Re-add it deliberately, then review before pushing =="
echo "    git remote add origin $REPO_URL"
echo "    git log --oneline | head -20   # sanity check the history still looks right"
echo "    git ls-tree -r HEAD --name-only | grep -c core/private/   # should print 0"
echo ""
echo "== Then, when ready (this is destructive — get explicit confirmation first): =="
echo "    git push --force origin --all"
echo "    git push --force origin --tags"
echo ""
echo "== Afterward: anyone with an existing clone should re-clone OR fetch + reset. =="
echo "== Since core/private/ was already untracked+gitignored before this ran, =="
echo "== a reset --hard against the new history will NOT remove those files from =="
echo "== disk — they're untracked, reset only touches tracked files. Still worth =="
echo "== confirming the backup from step 2 exists before you do that reset, though. =="
