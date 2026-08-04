# Build Ledger — Codex Part 2: Daily Operating System

> What we build at each step, and exactly what to build. Companion to `implementation_plan.md` (plan) and `task.md` (tasks).
> Legend: ✅ built · ⬜ to build · 🧍 build needs a user gate first (interview/approval).

---

## Step 1 — Confirm vault is ready

**Builds nothing.** Verifies Part 1 artifacts already exist:

| Artifact | Location | State |
|---|---|---|
| 8 slash commands | `.claude/commands/*.md` | ✅ exists (verified) |
| `Edit(raw/**)` deny rule | `.claude/settings.json` → `permissions.deny` | ✅ exists (verified) |
| Stop hook | `.claude/hooks/auto-checkpoint.sh` wired in `hooks.Stop` | ✅ exists (verified) |

---

## Step 2 — Push to GitHub + push-capable Stop hook

**Builds:** a hook that checkpoints and pushes.

| Artifact | Location | State | Spec |
|---|---|---|---|
| `origin` remote | repo config | ✅ exists | `https://github.com/MuzammilCk/second-brain.git` (Private repo already created) |
| Push-capable auto-checkpoint hook | `.claude/hooks/auto-checkpoint.sh` | ✅ built + syntax-checked | `cd "$CLAUDE_PROJECT_DIR"` → commit pending changes (`auto-checkpoint: YYYY-MM-DD HH:MM`) → push current branch to `origin` **only if** `git remote get-url origin` succeeds → silence all errors → `exit 0`. No-op on clean tree / no remote. |

**Not a build, but recorded:** active branch is `feat/scaffold-placements` (hook pushes current branch — correct by design).

---

## Step 3 — Split `priorities.md` / `people.md`, lock both

**Builds:** two root-level steering files + permission/gitignore/docs updates.

| Artifact | Location | State | Spec |
|---|---|---|---|
| ✅ `priorities.md` | vault root | ✅ built | Sections in order: `## Projects` · `## Areas` · `## Resources` · `## Archive`; weekly-edit top comment; **pushed to GitHub** (untracked, will be committed on next Stop) |
| ✅ `people.md` | vault root | ✅ built | `## Key People`: own-profile entry + placeholder slots for collaborators / recruiters / mentors. **Gitignored.** |
| ✅ `ask` permission rules | `.claude/settings.json` → `permissions.ask` | ✅ built | `["Edit(priorities.md)", "Edit(people.md)"]` merged; `deny` + `hooks` preserved; JSON validated |
| ✅ `people.md` ignore entry | `.gitignore` | ✅ built | `people.md` added at line 2, next to `raw/`; `git check-ignore` confirms |
| ✅ CLAUDE.md Project Structure update | `CLAUDE.md` | ✅ built | Lines 11–12 document both files: user-owned, propose-only for Claude, gitignore status of each stated |

---

## Step 4 — Connect MCP servers

**Builds:** MCP connectivity for the vault (only if not already connected via Claude.ai account).

| Artifact | Location | State | Spec |
|---|---|---|---|
| ✅ `.mcp.json` (project-scope connectors) | vault root | ✅ built | Two **stdio** servers (no hosted endpoints — they need the unavailable Claude.ai flow): `gmail` → `npx -y @klodr/gmail-mcp` + `google-calendar` → `npx -y @cocal/google-calendar-mcp` (env `GOOGLE_OAUTH_CREDENTIALS` → `C:/Users/THINKPAD L13/.gmail-mcp/gcp-oauth.keys.json`). **Corrected 2026-08-04**: gmail re-pointed from archived `@gongrzhe/server-gmail-autoauth-mcp` to its maintained fork `@klodr/gmail-mcp`. Git-tracked so Cloud Routines can read it. |
| 🧍 Authenticated sessions | Google OAuth (browser) | 🧍 pending | Full walkthrough delivered 2026-08-04 (17-requirement brief). User gates: GCP project/APIs/consent/Desktop client → keys file at `C:/Users/THINKPAD L13/.gmail-mcp/gcp-oauth.keys.json` (dir pre-created, outside repo) → `npx -y @klodr/gmail-mcp auth --scopes=gmail.readonly` → calendar token auto-created on first use (`C:/Users/THINKPAD L13/.config/google-calendar-mcp/tokens.json`). Verify via `search_emails` (last 5) + `list-events` (today). |

**Constraint to respect when building:** Notion's hosted MCP requires live browser OAuth — no unattended re-auth. Keep any Cloud Routine briefing free of Notion.

---

## Step 5 — Build `/pull-sources`

**Builds:** one command + its output directory convention.

| Artifact | Location | State | Spec |
|---|---|---|---|
| 🧍 `pull-sources.md` | `.claude/commands/` | ⬜ | See full spec in `implementation_plan.md` Step 5. Highlights: Claude Code sessions = source 1 (`~/.claude/projects/` JSONL, last 7 days → `mirror/pulled/claude-sessions/<date>-<slug>.md`, frontmatter `source/captured/session_id`); per-source blocks into `mirror/pulled/<source-slug>/` with cap + filters applied **before** write; priorities match-line (`matches: <name>` / `no match — check first`); triage header line above frontmatter; dedupe by source+id; `wiki/log.md` batch entry; final `/ingest` reminder; trailing `# Add your own source here` template block. Never writes to `raw/` or `wiki/` (except the log entry). |
| Output directory | `mirror/pulled/` | ⬜ | Auto-created by the command; already gitignored via `mirror/*` |

**Already compatible (no build needed):** `/ingest` reads all of `mirror/` from Part 1 → pulled files flow into the wiki unchanged.

---

## Step 6 — Build `/briefing` and `/debrief`

**Builds:** two commands.

| Artifact | Location | State | Spec |
|---|---|---|---|
| 🧍 `briefing.md` | `.claude/commands/` | ⬜ | Reads priorities (skip Archive); calendar/tickets via MCP (graceful skip if none); last 3–5 `wiki/log.md` entries; per project: `status` + latest `<slug>-decisions.md` entry (or say plainly there's no wiki page); `people.md` only for a clearly relevant person, one line; outputs Today's Schedule · Active Threads · Priority Reminders · Suggested Actions; appends one-line timestamped briefing marker to `wiki/log.md`. |
| 🧍 `debrief.md` | `.claude/commands/` | ⬜ | Reads priorities; empty `$ARGUMENTS` → 3–4 one-at-a-time questions, else use `$ARGUMENTS` as summary; log entry `timestamp, type: debrief, 3–5 bullets`; pivots → **propose** `-decisions.md` entry (same shape as `/decide`); update existing pages, propose new ones; priorities shifts → propose exact edit + say what's changing; end with one-line day summary. |

**Build-support action:** restart Claude Code (`/exit` → `claude`) so both commands load.

---

## Step 7 — Automate

**Builds:** OS-level + cloud-level automation — no repo files.

| Artifact | Location | State | Spec |
|---|---|---|---|
| 🧍 Task Scheduler task (local) | Windows Task Scheduler | ⬜ | Daily, before sit-down time. Program `claude`; Arguments `-p "/pull-sources" --permission-mode acceptEdits` (+ `--allowedTools "Bash(git add:*) Bash(git commit:*) Bash(git push:*)"` if git steps stall); Start in = vault path. Manual test-run before trusting. |
| 🧍 Cloud Routine (cloud) | claude.ai/code/routines via `/schedule` | ⬜ | Name + `/briefing` + daily cadence + repo (`second-brain`) + connectors. **Enable unrestricted branch pushes** so the brief lands on `main`, not a `claude/…` branch. Watch usage caps for the first 1–2 weeks. |

---

## Step 8 — The operating rhythm

**Builds nothing** — an operating table to live by:

| Command | Cadence | Runs where |
|---|---|---|
| `/log`, `/decide` | As needed | Local, interactive |
| `/sync-projects` | When a project's control files change | Local, interactive |
| `/pull-sources` | Daily | Local, scheduled (Task Scheduler) |
| `/ingest` | After triaging `/pull-sources` output | Local, interactive |
| `/briefing` | Every weekday morning | Cloud Routine, unattended |
| `/debrief` | Every evening | Local, interactive |
| `/query`, `/review` | As needed | Local, interactive |
| `/lint`, `/standup` | Monthly / weekly | Local, interactive |

---

## Step 9 — Wrapping up

**Builds/tears down nothing by default.** Keep going (no-op) · Pause (disable Task Scheduler task + pause routine) · Undo (delete routine + scheduled task; pushes stop on their own).

---

## Cumulative artifact inventory (repo files)

| File | Step | Status |
|---|---|---|
| `.claude/hooks/auto-checkpoint.sh` | 2 | ✅ built |
| `priorities.md` | 3 | ✅ built |
| `people.md` | 3 | ✅ built |
| `.claude/settings.json` (ask rules) | 3 | ✅ built |
| `.gitignore` (+`people.md`) | 3 | ✅ built |
| `CLAUDE.md` (structure) | 3 | ✅ built |
| `.mcp.json` | 4 | ✅ built |
| `.claude/commands/pull-sources.md` | 5 | ⬜ |
| `.claude/commands/briefing.md` | 6 | ⬜ |
| `.claude/commands/debrief.md` | 6 | ⬜ |
| `mirror/pulled/**` (generated) | 5 | ⬜ generated |
| Task Scheduler task + Cloud Routine | 7 | ⬜ OS/cloud, not repo |

---

## Update log

| Date | Session | Changes |
|---|---|---|
| 2026-08-04 | Part 2 kickoff | Created ledger; recorded Step 2 hook as built, everything else pending, user gates flagged 🧍 |
| 2026-08-04 | Step 3 executed | All Step 3 artifacts ✅ built: `priorities.md`, `people.md`, settings.json ask rules, `.gitignore` entry, CLAUDE.md update |
| 2026-08-04 | Step 4 config executed | `.mcp.json` built with both Google connectors; authenticated sessions still a user gate |
| 2026-08-04 | Step 4 corrected + walkthrough | GongRzhe Gmail server found **archived** on re-verification → gmail connector switched to maintained fork `@klodr/gmail-mcp`; full Google-OAuth setup walkthrough (project → keys → auth → verify) delivered; user gates = console clicks + 2 browser logins |
