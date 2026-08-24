# Audit and Fix — Codex Vault (paste this whole thing into Claude Code, run from the vault root)

An external review of this repo's public GitHub state (github.com/MuzammilCk/second-brain, `main`, as of 2026-08-22) found the items below. Work through them in priority order. Ask before anything destructive — history rewrites, deletions outside `wiki/`, or un-tracking files I haven't confirmed.

---

## P0 — Security. Do this section first, before anything else.

The value `sk-...[REDACTED]` is committed in **two** tracked files: `.claude/settings.json` (`env` block, first appeared 2026-08-06) and `.codex/config.toml`. It has been sitting in this public repo for over two weeks and is recoverable from git history even after being removed from the current commit — `git log --all -p -- .claude/settings.json` surfaces it in under a second.

1. **Tell me directly, in your first response, that this credential needs to be rotated at the source right now** (the OmniRoute gateway / OpenRouter, whichever actually issued it). You can't do this part — say so plainly rather than treating the file edit below as if it fixes the exposure.
2. Remove both occurrences from tracked files:
   - `.claude/settings.json`: delete the `env` block, or move it into `.claude/settings.local.json` (already gitignored) instead.
   - `.codex/config.toml`: check whether it can read `shell_environment_policy.set` values from a real OS environment variable or an untracked file instead of inline. If not, gitignore `.codex/config.toml` itself and commit a `.codex/config.toml.example` with placeholder values in its place.
3. Update `.claude/scripts/pull-sources.cmd` (its own comments say it reads gateway config from `.claude/settings.json` "at run time — single source of truth") and anything else pointing at the old location, so headless runs still work after the value moves.
4. Verify: `grep -rn "sk-..." --include="*" .` (excluding `.git/`) should return nothing once you're done.
5. Ask me — don't just do it — whether I also want the string scrubbed from git history itself (`git filter-repo`, followed by a force-push). Explain that this rewrites shared history and requires a force-push before I answer either way.

---

## P1 — Privacy: `mirror/project-sync/` exposes more than your own work

`.gitignore` has `!mirror/project-sync/`, un-ignoring it specifically, so it's pushed. Most of what's in there is your own project documentation — reasonable to have public as a portfolio. Two folders are a different category: `hadi/` and `hadi_old/` (Hadi Perfumes) and `viva/` (Viva Business Team) are both your father's businesses, not just your own side projects.

1. Ask me explicitly whether `hadi/`, `hadi_old/`, and `viva/` should stay public or go private — don't assume either direction.
2. If private: add explicit `.gitignore` lines for those three paths (under `mirror/project-sync/`), `git rm -r --cached` each, and commit.
3. Separately: `wiki/people/` and `wiki/placements/` are also currently public right now. Keeping people-related and placement-prep content local-only was already decided in an earlier conversation and never actually implemented in this repo — ask me if that's still what I want, and if so, gitignore and untrack both.

---

## P2 — `wiki/people/muzammil-ck.md` is a self-referential page that shouldn't exist in that form

It's a profile of the vault owner, sourced from `raw/claude-exports/user-profile.md` and `conversations-memory.md`. `wiki/people/` was meant for people the user interacts with — not the user. Nothing in CLAUDE.md or `.claude/rules/` currently rules this out, so `/ingest` had no way to know better when it processed that source.

1. Ask me whether to delete this page outright, or fold its useful content (the project list, mainly) into somewhere it actually belongs — `priorities.md` context, or nowhere, since `wiki/projects/index.md` already lists everything it links to.
2. Either way, add one explicit line to `.claude/rules/` (or CLAUDE.md's Style Guide) stating: "`wiki/people/` is for people other than the vault owner. Never create a self-referential profile page there." — so the next `raw/claude-exports/` source describing the user doesn't recreate this.

---

## P3 — Tighten `/sync-projects`'s matching rule

`.claude/commands/sync-projects.md` currently syncs any folder containing `CLAUDE.md`, `context.md`, `diff.md`, **or** `README.md`. That last clause alone is why roughly 15 of the ~24 folders under `mirror/project-sync/` — `Zenith`, `samename`, `waste`, `backup-repo`, `Shell-1`, `sentinal`, `life`, `vid`, `portfolio`, `Intern`, `HealthCare-main`, `Odoo-hackthon`, `meta_tune`, `esg-audit-system`, `shell` — are bare-README noise with none of the actually-useful control files behind them.

1. Change the match criterion to require `CLAUDE.md`, `context.md`, or `diff.md` specifically. A bare `README.md` alone is no longer sufficient.
2. Re-run `/sync-projects` and confirm those folders stop getting pulled going forward. Ask me whether to also clean out the ones already sitting in `mirror/project-sync/` from before this fix, or leave them.

---

## P4 — Smaller fixes, work through after P0–P3

- `AGENTS.md` says "Refer to `.Codex/rules/` for details" — that path doesn't exist (the real rules live in `.claude/rules/`, lowercase, different directory entirely). Fix the reference, or create the actual equivalent if OpenAI Codex needs its own copy.
- `CLAUDE.md`'s and `AGENTS.md`'s Domain Context sections both still say "three projects: ytclfr, portfolio, metatune automl" from the original setup interview. `wiki/projects/` has 13 pages now. Ask me the domain-context questions again and refresh both files to match reality.
- `wiki/log.md` has no entry for two things that actually happened: the 2026-08-18 incident where the entire `.claude/` scaffold was accidentally deleted from the working tree and recovered via `git reflog` (worth recording on its own merits — it's a real instance of the git setup from Part 1 doing its job, not a hypothetical), and today's addition of `AGENTS.md`, `.codex/config.toml`, and the `.agents/skills/` files. Backfill both as real log entries rather than leaving them as gaps in the history.
- Only 4 of the 9 commands (`briefing`, `lint`, `pull-sources`, `query`) have a matching file under `.agents/skills/`. Check whether anything actually reads that directory at all. If nothing does, either finish the set for consistency or remove it so it stops looking like wired-up infrastructure that isn't.
- Per `task.md`, Step 7b (Cloud Routine for `/briefing`) is still an open gate waiting on a decision. Ask me whether to set it up now or keep deferring it.

---

## When you're done

Report back three things: what actually got fixed, what's still waiting on a decision from me, and the result of re-running the P0 grep check to confirm the credential is gone from every tracked file — not just the ones you remembered to check.
