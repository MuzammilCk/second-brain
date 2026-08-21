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
| ✅ `.mcp.json` (project-scope connectors) | vault root | ✅ built | Three **stdio** servers (no hosted endpoints — they need the unavailable Claude.ai flow): `gmail` → `npx -y @klodr/gmail-mcp` + `google-calendar` → `npx -y @cocal/google-calendar-mcp` (env `GOOGLE_OAUTH_CREDENTIALS` → `C:/Users/THINKPAD L13/.gmail-mcp/gcp-oauth.keys.json`). **Corrected 2026-08-04**: gmail re-pointed from archived `@gongrzhe/server-gmail-autoauth-mcp` to its maintained fork `@klodr/gmail-mcp`. **Extended 2026-08-04**: `notion` → official `@notionhq/notion-mcp-server` v2.5.1 via PowerShell wrapper injecting `NOTION_TOKEN` from `~/.notion-mcp/notion.token` at runtime (`.mcp.json` env is literal-only → secret kept out of git). Git-tracked so Cloud Routines can read it. |
| ✅ Authenticated sessions | Google OAuth (browser) | ✅ both connected | **2026-08-04**: keys file verified (`installed` Desktop client); gmail login done (`credentials.json`; `search_emails` probe → real messages); calendar login done (`tokens.json` at `C:/Users/THINKPAD L13/.config/google-calendar-mcp/tokens.json`; `list-events` probe → clean response). `/mcp` → both ✔. |

**Constraint to respect when building:** Notion's hosted MCP requires live browser OAuth — no unattended re-auth. Keep any Cloud Routine briefing free of Notion.

---

## Step 5 — Build `/pull-sources`

**Builds:** one command + its output directory convention.

| Artifact | Location | State | Spec |
|---|---|---|---|
| ✅ `pull-sources.md` | `.claude/commands/` | ✅ built | See full spec in `implementation_plan.md` Step 5. Built 2026-08-04: 6 source blocks (sessions + gmail + calendar-upcoming + 8 local folders + github-skip + notion-skip); cap 25 applied **before** write; dedupe by source+id with `-<8-char-id>` collision suffix; fail-soft on source errors; priorities match-line; triage header above frontmatter; `wiki/log.md` batch entry; `/ingest` reminder; `# Add your own source here` block. Smoke-tested with real probes + 3 sample files. |
| ✅ `gh` CLI | PATH (Windows) | ✅ installed + authed | **2026-08-04**: v2.97.0 installed; `gh auth status` green (MuzammilCk, scopes gist/read:org/repo/workflow); `gh api` commit probe verified. GitHub source repos (MuzammilCk): theytclfr, RealMe, invoice, esg-audit-system, hadi. |
| 🧍 `notion.token` (source deferred) | `C:/Users/THINKPAD L13/.notion-mcp/notion.token` (outside repo) | ⬜ deferred | **Deferred by user 2026-08-04** (setup later). When ready: Internal integration at notion.so/my-integrations → raw token (`ntn_…`); share pages/databases; restart. Wrapper in `.mcp.json` reads it. |
| ✅ Output directory | `mirror/pulled/` | ✅ built | Pre-created 2026-08-04 with all source subdirs; gitignored via `mirror/*` |

**Fixed 2026-08-04 (T-5.5 ✅):** `/ingest` step 1 now reads `raw/` + `mirror/project-sync/` + `mirror/pulled/`, so pulled files flow into the wiki. The pull → ingest loop is end-to-end.

---

## Step 6 — Build `/briefing` and `/debrief`

**Builds:** two commands.

| Artifact | Location | State | Spec |
|---|---|---|---|
| ✅ `briefing.md` | `.claude/commands/` | ✅ built | Reads priorities (skip Archive); calendar via `google-calendar` MCP `list-events` for today (graceful skip); last 3–5 `wiki/log.md` entries; per project: `status` + latest `<slug>-decisions.md` entry (or plainly "no wiki page yet"); `people.md` conditional, one line, read-only, absent-safe; outputs Today's Schedule · Active Threads · Priority Reminders · Suggested Actions; appends one-line briefing marker to `wiki/log.md`; commits. **Built + approved 2026-08-04 (T-6.1, T-6.3 ✅).** |
| ✅ `debrief.md` | `.claude/commands/` | ✅ built | Reads priorities; empty `$ARGUMENTS` → 3–4 one-at-a-time questions, else treat as summary; log entry `YYYY-MM-DD - debrief` 3–5 bullets; pivots → **propose** `-decisions.md` entry (writes only after explicit yes); updates existing pages, **proposes** new ones; priorities shifts → propose exact edit + say what's changing; one-line day summary; commits. **Built + approved 2026-08-04 (T-6.2, T-6.3 ✅).** |

**Build-support action:** restart Claude Code (`/exit` → `claude`) so both commands load.

---

## Step 7 — Automate

**Builds:** OS-level + cloud-level automation — one repo file + two external configs.

| Artifact | Location | State | Spec |
|---|---|---|---|
| ✅ `pull-sources.cmd` wrapper | `.claude/scripts/` | ✅ built + tested | Reads gateway config from `.claude/settings.json` (single source of truth); retries on OmniRoute 503 (2 attempts, 60s apart); prepends `C:\Program Files\Git\cmd` to PATH; streams `pull-sources.md` body as prompt (slash commands not expanded in `-p` mode); `--allowedTools 'Bash(*)' 'mcp__gmail__*' 'mcp__google-calendar__*'`; commit+push on exit; suppresses unknown-model warning. Headless `claude -p` tested → exit 0. |
| ✅ Task Scheduler task (local) | Windows Task Scheduler `\claude-pull-sources` | ✅ active | Daily 08:00. Runs `pull-sources.cmd`. Start in = vault path. Manual test verified 2026-08-06. |
| ⬜ Broken duplicate task | Windows Task Scheduler `\Codex Pull Sources` | ⬜ harmless | Fails instantly (`0x80070002` — bare `claude` not on PATH). Cannot delete without admin. No side effects. |
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
| `.claude/commands/pull-sources.md` | 5 | ✅ built |
| `.claude/commands/briefing.md` | 6 | ✅ built |
| `.claude/commands/debrief.md` | 6 | ✅ built |
| `mirror/pulled/**` (generated) | 5 | ✅ sample files written |
| Task Scheduler task + Cloud Routine | 7 | ⬜ OS/cloud, not repo |

---

## Update log

| Date | Session | Changes |
|---|---|---|
| 2026-08-04 | Part 2 kickoff | Created ledger; recorded Step 2 hook as built, everything else pending, user gates flagged 🧍 |
| 2026-08-04 | Step 3 executed | All Step 3 artifacts ✅ built: `priorities.md`, `people.md`, settings.json ask rules, `.gitignore` entry, CLAUDE.md update |
| 2026-08-04 | Step 4 config executed | `.mcp.json` built with both Google connectors; authenticated sessions still a user gate |
| 2026-08-04 | Step 4 corrected + walkthrough | GongRzhe Gmail server found **archived** on re-verification → gmail connector switched to maintained fork `@klodr/gmail-mcp`; full Google-OAuth setup walkthrough (project → keys → auth → verify) delivered; user gates = console clicks + 2 browser logins |
| 2026-08-04 | Step 4 gates progressed | User completed console gates (keys file present, valid `installed` Desktop client) + Gmail browser login (`credentials.json`; `/mcp` → gmail ✔ 10 tools). google-calendar `/mcp` failure diagnosed: keys file absent at run time — re-verified after: server starts cleanly, only calendar login remains. |
| 2026-08-04 | Step 5 interview done | T-5.1 ✅ — source/config spec recorded (see plan). `notion` connector added to `.mcp.json` (official server, secret-free wrapper). New user gates: gh CLI install + `notion.token` (Step 5 table). |
| 2026-08-04 | Step 5 gates verified | T-4.3 → ✅ (both Google sessions authenticated; `list-events` + `search_emails` probes clean). `gh` blocked on install. `notion.token` deferred by user. |
| 2026-08-04 | Step 5 command built | `pull-sources.md` ✅ built + smoke-tested; `mirror/pulled/` tree ✅ created. Follow-up T-5.5: `/ingest` must read `mirror/pulled/` (currently only `raw/` + `mirror/project-sync/`). |
| 2026-08-04 | GitHub gate done | `gh` v2.97.0 installed + authenticated (MuzammilCk); API probe verified. T-5.1a → ✅. |
| 2026-08-04 | /ingest fixed | T-5.5 → ✅ — `ingest.md` reads `mirror/pulled/`; pull → ingest loop ready. |
| 2026-08-04 | Step 6 commands built | `briefing.md` + `debrief.md` ✅ built + approved (T-6.1/6.2/6.3). T-6.4 ⬜ — restart Claude Code to load both. |
| 2026-08-04 | Step 6 review-hardened | `allowed-tools` removed from `briefing.md` (was blocking the MCP calendar tool); slug-mapping hint added; `debrief.md` gained explicit people.md/priorities.md propose-only carve-out. |
| 2026-08-05 | Step 5 completed | Full `/pull-sources` run: 30 claude-sessions, 16 gmail, 0 calendar, 3 local, 0 github, notion skipped. Step 5 artifacts fully operational. Step 6 T-6.4 still ⬜ (restart needed). |
| 2026-08-05 | Step 7 initiated | User gates laid out for Step 7: Task Scheduler (T-7.1/7.2/7.3) + Cloud Routine (T-7.4/7.5/7.6). |
| 2026-08-06 | Step 2 verified | Hook executed manually with dirty tree → commit + push to `origin/feat/scaffold-placements` confirmed (local == remote HEAD, tree clean). Push leg live — future Stop hooks will push automatically. |
| 2026-08-18 | Scaffold restored | `.claude/` scaffold (17 committed files) had been deleted in the working tree but was intact at HEAD `2cdb03c`; reflog confirms no git op removed them (uncommitted working-tree deletions only). Restored all 17 — `git diff HEAD -- .claude/` clean afterward. No build artifacts changed state; every ✅ in the cumulative inventory (lines 127–137) is still accurate. SkillOpt-Sleep ([[wiki/concepts/skillopt]]) lives outside this repo and did not touch these files. Remaining ⬜ artifacts are OS/cloud, not repo: Task Scheduler task (T-7.1–7.3 ✅ already in place) + Cloud Routine (T-7.4–7.6 🧍). |
