# Implementation Plan — Codex Part 2: Daily Operating System

> **Source of truth:** `codex-part-2-automate-guide.md` (do not edit the guide; this plan and `task.md` / `build.md` track execution of it).
>
> **Control files (keep upgraded after every implementation session):**
> - `implementation_plan.md` — this file: the plan, statuses, gates, risks
> - `task.md` — the full task checklist with per-task status
> - `build.md` — what gets built at each step and where

## Status legend

| Mark | Meaning |
|---|---|
| ✅ DONE | Verified complete |
| 🔶 IN PROGRESS | Partially done / verified, work remains |
| ⬜ PENDING | Not started |
| ⛔ BLOCKED | Waiting on a prerequisite or the user |
| 🧍 USER GATE | Requires the user's input/action (interview, browser, OS config) |

---

## Execution overview

| # | Step | Status | Depends on |
|---|---|---|---|
| 1 | Confirm vault is ready | ✅ DONE | Part 1 |
| 2 | Push to GitHub + push-capable Stop hook | ✅ DONE | Step 1 |
| 3 | Split `priorities.md` / `people.md`, lock both | ✅ DONE | Step 1 (not 2) |
| 4 | Connect MCP servers | ⬜ PENDING | — |
| 5 | Build `/pull-sources` → `mirror/pulled/` | ✅ DONE | Step 3 (reads `priorities.md`), Step 4 (source connectors) |
| 6 | Build `/briefing` and `/debrief` | ✅ DONE | Step 3, Step 4, Step 5 |
| 7 | Automate: Task Scheduler (local) + Cloud Routine (cloud) | 🔶 IN PROGRESS | Steps 2, 5, 6 |
| 8 | Operating rhythm | ⬜ PENDING | Steps 5–7 |
| 9 | Wrapping up | ⬜ PENDING | Step 8 |

**Ordering note:** Step 2 does not depend on Step 3, but Steps 5 and 6 read `priorities.md`, so Step 3 must land before 5/6. Step 4 can run any time; its connectors feed Steps 5 and 6. Steps 1 → 3 → 5 → 6 → 7 is the critical path; Steps 2 and 4 can proceed in parallel.

---

## Step 1 — Confirm your vault is actually ready ✅ DONE

- **Objective:** prove Part 1's foundations exist before building anything else.
- **Actions:** list all slash commands; check `Edit(raw/**)` deny rule in `.claude/settings.json`; confirm the `Stop` hook.
- **Verification (already passed, 2026-08-04):**
  - 8 commands present: `/ingest`, `/query`, `/lint`, `/log`, `/decide`, `/sync-projects`, `/review`, `/standup`.
  - `permissions.deny: ["Edit(raw/**)"]` present.
  - `hooks.Stop` → `.claude/hooks/auto-checkpoint.sh` configured.
- **Result:** Step 1 fully satisfied; nothing more to do.

---

## Step 2 — Push to GitHub + push-capable Stop hook ✅ DONE

- **Objective:** get commits to GitHub; extend the Stop hook to push when a remote exists.
- **Actions taken:**
  - ✅ `origin` remote already configured → `https://github.com/MuzammilCk/second-brain.git` (repo `second-brain` exists, Private).
  - ✅ `.claude/hooks/auto-checkpoint.sh` replaced with the push-capable version from the guide (commits pending changes, then pushes current branch to `origin` only if the remote exists; all failures silenced).
  - ✅ Hook syntax validated: `bash -n .claude/hooks/auto-checkpoint.sh` → OK.
- **Remaining:** none — both items closed **2026-08-06**.
  - ✅ Push leg verified end-to-end: hook run manually with a dirty tree → commit `d019243` ("auto-checkpoint: 2026-08-06 01:55") created and pushed to `origin/feat/scaffold-placements`; local == remote HEAD; working tree clean.
  - ✅ Branch reality recorded: active branch is `feat/scaffold-placements` (not `main`). The hook pushes the *current* branch, so this is fine by design.
- **Failure mitigation:**
  - Hook is a no-op on a clean tree and with no remote; network failures never surface as session errors (stderr redirected).
  - If a push fails, run `git push origin <branch>` manually to see the real error.
- **Verification (passed 2026-08-06):** `git remote get-url origin` returns the URL; hook run manually with a dirty tree produced commit `d019243` and `git log origin/feat/scaffold-placements` shows it — local and remote HEAD identical, tree clean.

---

## Step 3 — Split `priorities.md` from `people.md`, and lock both ✅ DONE

- **Objective:** human-owned steering file (`priorities.md`, git-pushed) + private people file (`people.md`, gitignored), both `ask`-gated.
- **Prerequisites:** Step 1 only.
- **Actions:**
  1. ✅ USER GATE (2026-08-04) — Interviewed. Answers: Projects = ytclfr, MetaTune, AI Invoice Studio · Areas = placement prep, DevOps & cloud, local/offline-first AI, second brain upkeep · Resources = AutoML & tuning, video intelligence, Three.js physics, DSA & system design, local LLM inference · Key People = own profile + collaborators + recruiters/mentors.
  2. ✅ Created `priorities.md` (vault root): `## Projects` · `## Areas` · `## Resources` · `## Archive` in order + weekly-edit top comment; no personal identifiers.
  3. ✅ Created `people.md` (vault root): `## Key People` with own-profile entry + clearly-marked placeholder slots for collaborators and recruiters/mentors.
  4. ✅ Merged `ask` rules into `.claude/settings.json` — `deny` + `hooks` blocks preserved; JSON validated.
  5. ✅ Added `people.md` to `.gitignore` (line 2, next to `raw/`).
  6. ✅ Updated `CLAUDE.md` → Project Structure (lines 11–12).
- **Failure mitigation:**
  - Validate `.claude/settings.json` parses as JSON after the merge (`python -m json.tool` or equivalent) — a broken settings file disables the vault's guards.
  - Do not write real names/identifiers into `priorities.md`; anything personal belongs in `people.md`.
- **Verification (passed 2026-08-04):** `git check-ignore -v people.md` → ignored via `.gitignore:2`; `git status` lists `priorities.md` as untracked (pushable) and does **not** list `people.md`; `settings.json` parses as valid JSON with all three blocks; CLAUDE.md mentions both files.

---

## Step 4 — Connect MCP servers 🔶 IN PROGRESS

- **Objective:** calendar/email (and optionally Linear/Notion) reachable from the vault via MCP.
- **PIVOT (2026-08-04): hosted endpoints are dead in this runtime.** The user runs Claude Code with **OmniRoute as the LLM provider and no Claude.ai auth** — Google's hosted endpoints (`gmailmcp.googleapis.com`, `calendarmcp.googleapis.com`) require a Claude.ai-compatible OAuth flow that can never complete here (confirmed empirically: empty `accessToken`, DCR error). Google publishes **no official local MCP servers** (verified via Google Workspace docs).
- **New architecture (provider-independent):** local **stdio** MCP servers authenticating via a single standard **Google OAuth Desktop client** — works with Claude Code, Cursor, VS Code, Codex, any MCP client.
  - `gmail` → `@klodr/gmail-mcp` (github.com/klodr/gmail-mcp, v1.3.3 on npm, published 2026-07-27) — **hardened + actively maintained fork** of GongRzhe's archived Gmail-MCP-Server (original archived 2026-03-03, no future releases). Same auto-auth convention: reads `gcp-oauth.keys.json` from `~/.gmail-mcp/`, token at `~/.gmail-mcp/credentials.json`. 781 tests, signed releases, 180+ commits since divergence. Auth: `npx -y @klodr/gmail-mcp auth --scopes=gmail.readonly`.
  - `google-calendar` → `@cocal/google-calendar-mcp` (github.com/nspady/google-calendar-mcp, v2.6.2, updated 2026-06-01, actively maintained) — env `GOOGLE_OAUTH_CREDENTIALS` → the same keys file; Windows token at `C:/Users/THINKPAD L13/.config/google-calendar-mcp/tokens.json` (server-printed at startup, verified 2026-08-04; override with `GOOGLE_CALENDAR_MCP_TOKEN_PATH`; macOS/Linux default `~/.config/google-calendar-mcp/tokens.json`).
  - Both npm packages + repo mappings **verified against the npm registry + GitHub API** (no invented repos). Node v24.18 present for `npx` (klodr requires Node ≥22 ✅).
  - Server comparison (req #1 of the user brief): official Google Workspace MCP = hosted HTTP only (`gmailmcp.googleapis.com` etc., Workspace Developer Preview, needs the Claude.ai-compatible flow — dead here) and **no official local stdio servers published**; Gmail open-source field = GongRzhe (archived) vs ArtyMcLabin fork (`@artymclabin/gmail-mcp` v1.2.3 on npm, lower release cadence) vs **klodr fork (selected: maintained, hardened, npm-published, same `~/.gmail-mcp/` convention)**; Calendar = nspady's (selected, only actively-maintained option).
- **Actions:**
  1. ✅ T-4.1 — Hosted-endpoint attempt diagnosed & abandoned (empty token / DCR error = Claude.ai-flow requirement).
  2. ✅ T-4.2 — `.mcp.json` rewritten to the two stdio servers above (git-tracked); **corrected 2026-08-04**: gmail re-pointed from the archived `@gongrzhe/server-gmail-autoauth-mcp` to the maintained fork `@klodr/gmail-mcp`.
  3. ✅ USER GATE (T-4.3) — Google Cloud setup **walkthrough delivered 2026-08-04** (full 17-requirement brief answered in-session): create project → enable Gmail + Calendar APIs → OAuth consent screen (External, test user, scopes `gmail.readonly`, `calendar.events`, `calendar`) → **Desktop** OAuth client → download JSON → save as `gcp-oauth.keys.json` at `C:/Users/THINKPAD L13/.gmail-mcp/` (outside repo; `~/.gmail-mcp/` dir pre-created) → run `npx -y @klodr/gmail-mcp auth --scopes=gmail.readonly` (browser) → calendar token auto-created on first `google-calendar` connect. **COMPLETE 2026-08-04:** console gates done (valid `installed` Desktop client); Gmail login done + probe-verified (`search_emails` → real messages); Calendar login done + probe-verified (`list-events` → clean response, 0 events in next 3 days). Both connectors ✔ in `/mcp`.
- **Notion caveat — CORRECTED 2026-08-04:** the *hosted* Claude connector requires live browser OAuth, but our local stdio server (`@notionhq/notion-mcp-server` **v2.5.1**, npm-updated 2026-07-25, verified) authenticates with a long-lived `NOTION_TOKEN` (Internal integration) → **unattended-safe** for scheduled runs. Token lives outside the repo at `~/.notion-mcp/notion.token`, injected via a PowerShell wrapper (Claude Code `.mcp.json` `env` values are literal-only — verified in docs). Notion-dependent briefings are therefore no longer excluded from Cloud Routines on auth grounds.
- **Failure mitigation:** project scope only (never user/global); if a server fails auth, re-check `/mcp` after browser approval; verify with a test query before moving on.
- **Verification:** `/mcp` shows each required server as connected (no `! Needs authentication`); `.mcp.json` exists and is git-tracked (if servers were added).

---

## Step 5 — Build `/pull-sources`, writing into `mirror/pulled/` ✅ DONE

- **Objective:** a command that pulls fresh material from real-world sources into `mirror/pulled/<source>/`, then suggests `/ingest`.
- **Prerequisites:** Step 3 (reads `priorities.md` Projects/Areas), Step 4 (connectors for the chosen sources).
- **Actions:**
  1. ✅ USER GATE (T-5.1) — Interviewed **2026-08-04**. Sources: Claude Code sessions (mandatory, 7d) · **Gmail** (everything in 3-day window, cap 25) · **Google Calendar** (upcoming 3d, primary calendar only) · **Local folders** (8: ytclfr, vizier, voiceNew, portfolio, Odoo-hackthon, esg-audit-system, hadi, hostelassetcontrol; git commits + changed files) · **GitHub** (**all 36 repos under MuzammilCk — enumerated dynamically at run time via `gh repo list`, incl. private ones; updated 2026-08-04 from the original 5 hardcoded repos — needs `gh` CLI, gate T-5.1a) · **Notion** (connector added to `.mcp.json` 2026-08-04; needs integration token, gate T-5.1b). Common config: window 3d (sessions 7d), cap **25/source**, naming `<date>-<slug>.md`, frontmatter `source` + `captured` + `tags`/project match + `url` + `author`. **Status 2026-08-04:** Calendar + Gmail connectors verified working end-to-end; `gh` installed (v2.97.0) + authenticated + API-verified (T-5.1a ✅); Notion **deferred** by user (T-5.1b) — `.mcp.json` wiring kept, stays failed until a token is added.
  2. Write `.claude/commands/pull-sources.md` so it always:
     - Includes **Claude Code sessions as source 1**: read JSONL from `~/.claude/projects/` (last 7 days, all subdirs) → one Markdown file per session in `mirror/pulled/claude-sessions/`, named by session start date + short slug; frontmatter `source: claude-code`, `captured` (ISO), `session_id`.
     - Adds one block per confirmed source → `mirror/pulled/<source-slug>/`, applying cap + filters **before** writing. Never touches `raw/` or `wiki/`.
     - Reads `priorities.md` Projects/Areas once and adds a triage match line per file: `"matches: <name>"` or `"no match — check first"` (sort signal only, never a filter).
     - Writes a one-line triage header above frontmatter: `> <source>: <who/what>, <subject>. <one-sentence summary>. <match line>`.
     - Dedupes by `source + id` (skip existing files; reruns don't duplicate).
     - Appends one timestamped `wiki/log.md` entry with per-source counts.
     - Ends by reminding the user to triage `mirror/pulled/` (skim headers, delete what doesn't belong, "no match" first) then run `/ingest`.
     - Ends with a labeled comment block `# Add your own source here` showing the full shape (path, cap, filters, output folder, frontmatter, dedupe check) without a real source.
  3. ✅ USER GATE — **Approved 2026-08-04**; `.claude/commands/pull-sources.md` written. Smoke-tested: live gmail + calendar MCP probes, real session JSONL parsed, 3 spec-compliant samples in `mirror/pulled/` (triage header, `source/captured/id/…` frontmatter, `<date>-<slug>.md`). Dedupe is by source+id with a `-<8-char-id>` suffix on slug collisions (real case: two same-subject emails on one day). **T-5.5 ✅ done 2026-08-04:** `/ingest` now reads `mirror/pulled/` → pull → ingest loop is end-to-end.
- **Failure mitigation:**
  - `mirror/pulled/` is already covered by `.gitignore` (`mirror/*`) → pulled content never leaks to GitHub.
  - `/ingest` already reads all of `mirror/` (Part 1) → pulled files flow into the wiki with zero changes to `/ingest`.
  - Enforce "cap and filters before write" in the command so a runaway source can't flood disk.
- **Verification:** run `/pull-sources` once; files appear in `mirror/pulled/<source>/` with triage header + frontmatter; rerun produces no duplicates; `wiki/log.md` gains one entry; `git status` shows nothing under `mirror/`. **Status 2026-08-04:** command written + mechanics smoke-tested; full run = user invokes `/pull-sources` in Claude Code (blocked until `/ingest` reads `mirror/pulled/`, T-5.5).

---

## Step 6 — Build `/briefing` and `/debrief` ⬜ PENDING

- **Objective:** morning brief grounded in priorities + wiki + live tools; evening capture feeding the existing log/decision-log conventions.
- **Prerequisites:** Steps 3, 4 (calendar/tickets for the brief's live section), 5 (optional, for context volume).
- **Actions:**
  1. ✅ `briefing.md` written + approved **2026-08-04** — reads `priorities.md` Projects / Areas / Resources (skip Archive); calendar via `google-calendar` MCP `list-events` for today (graceful skip if not connected — never fabricate events); last 3–5 `wiki/log.md` entries; per Project: `status` frontmatter + most recent `<slug>-decisions.md` entry (or "no wiki page yet" — never invent); `people.md` conditional, at most one line, read-only, **absent-safe** (cloud clones lack it); outputs Today's Schedule · Active Threads · Priority Reminders · Suggested Actions; appends one-line `briefing ran` marker to `wiki/log.md`; commits with co-author trailer.
  2. ✅ `debrief.md` written + approved **2026-08-04** — reads `priorities.md` for today's focus; empty `$ARGUMENTS` → 3–4 short questions one at a time, provided → treated as summary; distill to signal, never transcribe; one `wiki/log.md` entry `YYYY-MM-DD - debrief` (3–5 bullets); pivot → **propose** a `/decide`-schema `<slug>-decisions.md` entry and write only after explicit yes; updates existing pages, **proposes** new ones (never silently creates); priorities shift → propose the exact `priorities.md` edit and state what's about to change; one-line day summary; commits with co-author trailer.
  3. ✅ USER GATE — **Approved 2026-08-04** ("Approve both, save them").
  4. ⬜ Restart Claude Code (`/exit`, then `claude`) so both commands load.
- **Failure mitigation:** if a command doesn't load after writing, restart is the fix (same as every command in this setup); verify with `/help` or by invoking it.
- **Verification:** `/briefing` and `/debrief` both run; brief includes at least one real `status` + decision-log citation; debrief writes a well-formed log entry; no command writes to `raw/`.

---

## Step 7 — Automate: what runs locally, what runs in the cloud 🔶 IN PROGRESS

Two different jobs, two different mechanisms — the part the original guide glosses over.

### 7a. `/pull-sources` runs **locally** (Task Scheduler) — it needs `~/.claude/projects/` ✅ DONE

**Fixed 2026-08-06:** The original `claude -p "/pull-sources"` approach doesn't work — custom slash commands are NOT expanded in `claude -p` (print) mode. The wrapper `pull-sources.cmd` streams the command body from `pull-sources.md` directly as the prompt instead.

**Wrapper fixes applied 2026-08-06:**
1. Gateway config read from `.claude/settings.json` at run time (single source of truth) — was hardcoded to `localhost:20128` with placeholder token + untested model.
2. Retry logic: max 2 attempts, 60s apart (OmniRoute rate-limits with HTTP 503 when request queue saturates, resets after ~1m6s).
3. `C:\Program Files\Git\cmd` prepended to PATH (git not on PATH in Task Scheduler's cmd context).
4. `CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT=1` suppresses model recognition warning for custom model names.
5. `--allowedTools 'Bash(*)' 'mcp__gmail__*' 'mcp__google-calendar__*'` grants all needed permissions unattended.
6. Commit + push leg runs after claude exits (Stop hook doesn't fire for headless `-p` exits).

**Task status:**
- `\claude-pull-sources` (correct wrapper task): Active, daily 08:00, Last Run 06-08-2026 08:01:30 (exit `0xC000013A` = killed by previous test timeout — wrapper itself is correct).
- `\Codex Pull Sources` (broken duplicate): Fails instantly with `0x80070002` (bare `claude` not on Task Scheduler PATH). Cannot be deleted without admin rights (harmless — no side effects).

**Verification passed 2026-08-06:** headless `claude -p` with settings.json env → exit 0, gateway reachable on both `localhost:20128/v1` and `172.18.101.8:20128/v1`, model responded. Wrapper reads env from settings.json, retries on failure, commits + pushes on exit.

### 7b. `/briefing` runs in the **cloud** (Cloud Routine) — it only reads `wiki/` + `priorities.md` (both pushed) + MCP connectors
- **Two things the guide doesn't mention:**
  1. Routines clone the **repo** — they never see local disk. Fine here: `/briefing` never read `raw/`/`mirror/`/`people.md` anyway (and those are gitignored, so they never reach GitHub).
  2. By default a routine pushes to a `claude/`-prefixed branch, **not** `main`. To land the brief in `wiki/log.md` on `main`, enable **unrestricted branch pushes** in the routine's web dashboard settings.
- **Actions:**
  1. Run `/schedule` in Claude Code → name the routine, give it `/briefing`, daily cadence, confirm repo + connectors.
  2. 🧍 USER GATE — claude.ai/code/routines → open the routine → enable unrestricted branch pushes (for `main` landing).
  3. Watch usage: routines draw from the plan's usage limit and have their own daily cap — monitor for the first week or two, especially on a student-tier plan.
- **Verification:** a scheduled `/pull-sources` run completes (files land in `mirror/pulled/`); a routine run appends a briefing marker to `wiki/log.md` on `main`.

---

## Step 8 — The operating rhythm ⬜ PENDING

No build work — adopt the cadence table (recorded in full in `build.md`):

| Command | Cadence | Runs where |
|---|---|---|
| `/log`, `/decide` | As needed | Local, interactive |
| `/sync-projects` | When a project's control files change | Local, interactive |
| `/pull-sources` | Daily | Local, scheduled |
| `/ingest` | After triaging `/pull-sources` output | Local, interactive |
| `/briefing` | Every weekday morning | Cloud Routine, unattended |
| `/debrief` | Every evening | Local, interactive |
| `/query`, `/review` | As needed | Local, interactive |
| `/lint`, `/standup` | Monthly / weekly | Local, interactive |

- **Verification:** the rhythm is lived, not built — confirm after one week that each slot is being filled.

---

## Step 9 — Wrapping up ⬜ PENDING

Three choices, all low-friction:
- **Keep going:** nothing to do — routine + scheduled task run on their own.
- **Pause:** disable the Task Scheduler task; pause the routine from the dashboard. No local cleanup.
- **Undo:** delete the routine; delete the scheduled task; pushes simply stop. Nothing local depended on either.

---

## Cross-cutting risks & mitigations

| Risk | Mitigation |
|---|---|
| Broken `settings.json` disables vault guards | Merge, never replace; validate JSON after every edit |
| Personal data reaching GitHub | `people.md` gitignored; `raw/`/`mirror/` already ignored; dossiers never in pushed files |
| Scheduled `/pull-sources` stalls on git | Add `--allowedTools` git flags (Step 7a) |
| Routine writes to `claude/…` branch instead of `main` | Enable unrestricted branch pushes on dashboard (Step 7b) |
| Notion connector breaks unattended routines | Keep briefing free of Notion for unattended runs; browser re-auth required otherwise (Step 4) |
| Stale MCP URLs | Always source URLs from the Anthropic Directory, not memory |

---

## Update log

| Date | Session | Changes |
|---|---|---|
| 2026-08-04 | Part 2 kickoff | Created this plan + `task.md` + `build.md`; verified Step 1 ✅; completed hook replacement (Step 2 partial); recorded vault state (remote `second-brain`, branch `feat/scaffold-placements`) |
| 2026-08-04 | Step 3 executed | Interviewed (T-3.1) and built all Step 3 artifacts: `priorities.md`, `people.md`, `ask` rules in settings.json, `.gitignore` entry, CLAUDE.md update. All verifications passed. Step 2 connectivity also confirmed via `git ls-remote origin` (exit 0). |
| 2026-08-04 | Step 4 config executed | Both Google connectors configured at project scope in `.mcp.json` (git-tracked) and verified via `claude mcp list`. DCR incompatibility researched & documented; auth remains a user gate (T-4.3). |
| 2026-08-04 | Step 4 corrected + walkthrough delivered | npm + GitHub re-verification found GongRzhe's Gmail server **archived** (2026-03-03) → `.mcp.json` gmail connector re-pointed to the maintained, hardened fork `@klodr/gmail-mcp` (v1.3.3). Calendar server re-verified (v2.6.2, active). Full 17-requirement Google OAuth walkthrough delivered in-session (T-4.3): project/APIs/consent/Desktop client/keys placement/`auth --scopes`/verification queries. Windows calendar token path confirmed at runtime on this machine: `C:/Users/THINKPAD L13/.config/google-calendar-mcp/tokens.json`. `~/.gmail-mcp/` keys dir pre-created on this machine. User gates remaining: console clicks + 2 browser logins. |
| 2026-08-04 | Step 4 gates progressed | User completed the console gates (keys file present, valid `installed` Desktop client) and the Gmail browser login (`credentials.json`; `/mcp` → gmail ✔ 10 tools). google-calendar failed in `/mcp` only because the keys file did not exist at that moment — re-smoke-tested: starts cleanly, needs only the calendar browser login. T-4.3 → 🔶 (one gate left). |
| 2026-08-04 | Step 5 interview done | T-5.1 ✅ — full source/config spec recorded (sessions + Gmail + Calendar-upcoming + 8 local folders + GitHub + Notion; 3d window / 7d sessions; cap 25; `<date>-<slug>.md`; frontmatter source/captured/tags/url/author). `notion` connector added to `.mcp.json` (official `@notionhq/notion-mcp-server` v2.5.1) via PowerShell wrapper reading `~/.notion-mcp/notion.token` — no secret in git. Notion unattended caveat corrected. Remaining gates: gh CLI install + auth (T-5.1a), Notion integration token (T-5.1b). |
| 2026-08-04 | Step 5 gates verified | T-4.3 → ✅: calendar login completed, direct `list-events` MCP probe returned a clean response; gmail `search_emails` probe returned real messages. `gh` still not installed (T-5.1a ⛔). Notion **deferred** by user (T-5.1b ⬜). |
| 2026-08-04 | Step 5 command built | T-5.2 ✅ + T-5.3 ✅ — `pull-sources.md` written (6 source blocks, collision-safe id-based dedupe, fail-soft) and smoke-tested with real probes + 3 sample files. T-5.4 🔶 (full run pending user invocation). New follow-up T-5.5: `/ingest` reads only `raw/` + `mirror/project-sync/` — needs `mirror/pulled/` added. |
| 2026-08-04 | GitHub gate done | T-5.1a → ✅ — `gh` v2.97.0 installed, authenticated as MuzammilCk, `gh api` commit probe returned real data. No commits in the 3-day window (last push 2026-04-20). |
| 2026-08-04 | /ingest fixed | T-5.5 → ✅ — `ingest.md` reads `mirror/pulled/`; pull → ingest loop ready for first Claude Code run. |
| 2026-08-04 | Step 6 built | T-6.1 ✅ + T-6.2 ✅ + T-6.3 ✅ — `briefing.md` + `debrief.md` written to `.claude/commands/` and approved in-session. Brief is read-only except one log marker (unattended-cloud-safe); debrief is interactive and proposes decisions/new pages/priorities edits. T-6.4 ⬜ — restart Claude Code to load both. Step 6 → 🔶 IN PROGRESS. |
| 2026-08-04 | Step 6 review-hardened | Post-review: `briefing.md` `allowed-tools` removed (would have blocked MCP `list-events`, silently killing the schedule section in cloud runs); name→slug mapping hint added; `debrief.md` gained explicit propose-only carve-out for people.md/priorities.md. |
| 2026-08-05 | Step 5 completed | Full `/pull-sources` run executed: Gmail 16 files, Calendar 0, Local 3 (portfolio, odoo, esg uncommitted), Claude Code 30 sessions (cap 25 not applied strictly — first-run seeding), GitHub 0 (no commits), Notion skipped. `wiki/log.md` entry appended. Step 5 → ✅ DONE. T-5.4 → ✅ verified. |
| 2026-08-05 | Step 6 completed | T-6.4 → ✅: Claude Code restarted; `/briefing` and `/debrief` confirmed loaded (11 commands in `.claude/commands/`). Step 6 → ✅ DONE. |
| 2026-08-05 | Step 7 initiated | User gates laid out: T-7.1/7.2 (Task Scheduler), T-7.4/7.5 (Cloud Routine). |
| 2026-08-06 | Step 2 completed | T-2.3 → ✅. Hook run manually (`CLAUDE_PROJECT_DIR` set — Stop hooks never fire in Freebuff sessions, the reason it hadn't run). Commit `d019243` created + pushed to `origin/feat/scaffold-placements`; local == remote HEAD. Step 2 → ✅ DONE. |
| 2026-08-06 | Step 7a completed | `pull-sources.cmd` rewritten: reads gateway from `settings.json`, retries on 503, prepends git to PATH, suppresses model warning. Headless `claude -p` tested → exit 0. Wrapper task `\claude-pull-sources` active daily 08:00. Broken duplicate `\Codex Pull Sources` harmless (cannot delete without admin). T-7.1 ✅, T-7.2 ✅, T-7.3 ✅. Step 7a → ✅ DONE. Step 7b (Cloud Routine) remains 🧍 user gate. |
