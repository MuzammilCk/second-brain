---
description: Pull fresh material from real-world sources into mirror/pulled/ for triage
argument-hint: ""
---
You are in run-command mode to pull fresh material into mirror/pulled/ so the user can
triage it, then run /ingest. Source 1 (Claude Code sessions) is always included; other
sources come from the confirmed list below.

## Rules that apply to every source
- NEVER write to `raw/`. The ONLY permitted write to `wiki/` is the single batch log
  entry at the end. `priorities.md` is read-only (ask-gated): read it, never edit it.
- `mirror/pulled/` is gitignored — pulled content never reaches GitHub.
- All paths are relative to the vault root (the directory the command runs in).
  `captured` timestamps are UTC ISO 8601.
- Apply the cap and any filters BEFORE writing. Cap = 25 files per source per run.
- Dedupe by source+id: if the exact target file already exists with the same `id` in
  frontmatter, skip (reruns never duplicate). If the filename exists but the `id`
  differs (slug collision, e.g. two emails with the same subject on one day), append
  `-<8-char-id>` to the slug instead of skipping or overwriting.
- Read `priorities.md` (Projects + Areas) ONCE at the start. For every file, append a
  triage match line to the one-line header: `matches: <name>` or `no match — check first`.
  This is a sort signal only — never filter by it.
- Filename pattern everywhere: `<YYYY-MM-DD>-<slug>.md` (slug = lowercase, hyphens;
  `-<8-char-id>` suffix on collision, see dedupe rule).
- Triage header (one line, ABOVE frontmatter):
  `> <source>: <who/what>, <subject>. <one-sentence summary>. <match line>`
- Frontmatter keys: `source`, `captured`, `id` (dedupe key), `tags`, plus per-source
  extras below.
- If a source is unavailable or errors (missing connector, API error, expired auth,
  missing folder), do NOT abort the run: record `(failed: <reason>)` in the final log
  entry and continue with the other sources.
- Create `mirror/pulled/<source-slug>/` as needed; make `mirror/pulled/` if missing.

## Source 1 — Claude Code sessions (always, window 7 days)
- Read JSONL from `C:/Users/THINKPAD L13/.claude/projects/**/*.jsonl`, keep sessions whose
  first message is within the last 7 days, all subdirectories.
- One file per session → `mirror/pulled/claude-sessions/<date>-<slug>.md`.
- Slug: short slug of the first user message subject (fallback: first 8 chars of session id).
- Content: user messages + assistant summaries distilled to signal (never transcribe).
- Frontmatter: `source: claude-code`, `captured`, `id` (= session id), `session_id`, `tags` (matched project).

## Source 2 — Gmail (via `gmail` MCP connector, window 3 days)
- Call `search_emails` with `query: "newer_than:3d"`, capped at 25 results.
- One file per message → `mirror/pulled/gmail/<date>-<slug>.md` (slug from subject).
- Header: `> gmail: <sender>, <subject>. <one-sentence body summary>. <match line>`
- Frontmatter: `source: gmail`, `captured`, `id` (Gmail message id), `url` (thread link
  for that id), `author` (sender), `tags`.

## Source 3 — Google Calendar (via `google-calendar` MCP connector, upcoming 3 days)
- Call `list-events` with `calendarId: "primary"`, `timeMin: <now>`, `timeMax: <now + 3 days>`.
- One file per event → `mirror/pulled/calendar/<date>-<slug>.md` (slug from event title;
  date = event start date).
- Header: `> calendar: <event title>, <start datetime>. <summary>. <match line>`
- Frontmatter: `source: google-calendar`, `captured`, `id` (event id), `url` (event
  `htmlLink` if present), `author` (organizer), `tags`.

## Source 4 — Local project folders (window 3 days)
- Folders under `D:/projects/`: ytclfr, vizier, voiceNew, portfolio, Odoo-hackthon,
  esg-audit-system, hadi, hostelassetcontrol.
- For git repos: pull commits since 3 days (`git -C <dir> log --since="3 days ago"`); also
  write one summary file per repo noting uncommitted changes (`git status --porcelain`).
- Non-git folders: recently modified files (mtime within 3 days).
- One file per commit/file → `mirror/pulled/local/<date>-<folder>-<slug>.md`.
- Header: `> local: <repo/file>, <commit subject>. <summary>. <match line>`
- Frontmatter: `source: local`, `captured`, `id` (commit sha / file path), `url` (origin
  remote URL if any), `author` (committer), `tags`.

## Source 5 — GitHub (ALL repos, graceful skip if `gh` unavailable)
- If `gh` is not installed or not authenticated → SKIP this source with a one-line note.
- Enumerate EVERY repo at run time — no hardcoded list, new repos are picked up
  automatically: `gh repo list MuzammilCk --limit 200 --json name --jq '.[].name'`
  (36 repos as of 2026-08-04; private ones included — content lands only in the
  gitignored `mirror/pulled/`, never pushed).
- For EACH repo, fetch commits in the last 3 days via
  `gh api repos/MuzammilCk/{repo}/commits?since=<iso-3d-ago>&per_page=25`.
  Repos with no commits in the window contribute nothing. Repos that ERROR (e.g. empty
  repos return 409 "Git Repository is empty") are skipped silently — fail-soft per run.
  (Known as of 2026-08-04: `waste-recycling-credit-app` is empty.)
- Apply the 25-file cap across the whole source (per run) BEFORE writing.
- One file per commit → `mirror/pulled/github/<date>-<slug>.md` (slug from commit message).
- Header: `> github: <repo>, <commit subject>. <summary>. <match line>`
- Frontmatter: `source: github`, `captured`, `id` (commit sha), `url` (commit `html_url`),
  `author` (committer), `tags`.
- `second-brain` (this vault's repo) is included like any other — its commits are the
  vault's own history, which is useful context and dedupes cleanly on reruns.

## Source 6 — Notion (graceful skip until token exists)
- If `C:/Users/THINKPAD L13/.notion-mcp/notion.token` is missing → SKIP this source with a
  one-line note (connector wired but deferred).
- Otherwise, if the `notion` connector responds: search recently-edited pages / query the
  shared databases the integration can see (last 3 days).
- One file per page → `mirror/pulled/notion/<date>-<slug>.md` (slug from page title).
- Header: `> notion: <page title>, <last-edited time>. <summary>. <match line>`
- Frontmatter: `source: notion`, `captured`, `id` (page id), `url` (page url), `tags`.

## Final steps (after all sources)
1. Append ONE timestamped `wiki/log.md` entry: date + per-source counts, e.g.
   `2026-08-04 - pulled: claude-code 3, gmail 12, calendar 0, local 5, github (skipped), notion (skipped)`.
2. Do NOT commit — leave the working tree for the user to review.
3. Remind the user: triage `mirror/pulled/` (skim the one-line headers, delete anything that
   doesn't belong, look at "no match — check first" items first), then run `/ingest`.

# Add your own source here
# Shape for a new source:
# - Where it lives:    MCP connector name OR local path
# - What to pull:      e.g. last 7 days
# - Volume cap:        e.g. 25 files (applied BEFORE write)
# - Include filter:    e.g. only senders/labels X (applied BEFORE write)
# - Exclude filter:    e.g. skip category Y
# - Output folder:     mirror/pulled/<source-slug>/
# - Naming:            <YYYY-MM-DD>-<slug>.md
# - Frontmatter:       source, captured, + extras (url, author, tags)
# - Dedupe:            skip if <YYYY-MM-DD>-<slug>.md already exists for source+id
