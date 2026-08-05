# Task List — Codex Part 2: Daily Operating System

> Companion to `implementation_plan.md` (plan, gates, risks) and `build.md` (artifacts).
> Status legend: ✅ done · 🔶 in progress · ⬜ pending · ⛔ blocked · 🧍 waits on the user.

---

## Step 1 — Confirm vault is ready

| ID | Task | Status | Verification |
|---|---|---|---|
| T-1.1 | List all 8 slash commands | ✅ | `/ingest /query /lint /log /decide /sync-projects /review /standup` all present in `.claude/commands/` |
| T-1.2 | Confirm `Edit(raw/**)` deny rule | ✅ | `permissions.deny` in `.claude/settings.json` |
| T-1.3 | Confirm `Stop` hook | ✅ | `hooks.Stop` → `.claude/hooks/auto-checkpoint.sh` in settings.json |

---

## Step 2 — Push to GitHub + push-capable Stop hook

| ID | Task | Status | Verification |
|---|---|---|---|
| T-2.1 | Private GitHub repo exists + `origin` remote | ✅ | `git remote get-url origin` → `https://github.com/MuzammilCk/second-brain.git` |
| T-2.2 | Replace `auto-checkpoint.sh` with push version | ✅ | File matches guide version; `bash -n` passes |
| T-2.3 | Push leg verified end-to-end (commit → push) | ✅ | **2026-08-06**: hook run manually with dirty tree → commit `d019243` "auto-checkpoint: 2026-08-06 01:55" created + pushed; local == remote HEAD on `origin/feat/scaffold-placements`; tree clean |
| T-2.4 | Record branch reality (`feat/scaffold-placements`, not `main`) | ✅ | Noted in all three control files; hook pushes current branch so no change needed |

---

## Step 3 — Split `priorities.md` / `people.md`, lock both

| ID | Task | Status | Verification |
|---|---|---|---|
| T-3.1 | 🧍 Interview user: 3–4 questions about current work | ✅ | Projects: ytclfr, MetaTune, AI Invoice Studio · Areas: placement prep, DevOps & cloud, local/offline-first AI, second brain upkeep · Resources: AutoML, video intelligence, Three.js physics, DSA & system design, local LLM inference · Key People: own profile, collaborators, recruiters/mentors |
| T-3.2 | Create `priorities.md` (Projects/Areas/Resources/Archive + weekly-edit comment) | ✅ | Sections in order; weekly-edit comment at top; no personal identifiers |
| T-3.3 | Create `people.md` (Key People, one entry each) | ✅ | Own-profile entry complete; placeholder slots for collaborators + recruiters/mentors |
| T-3.4 | Merge `ask: ["Edit(priorities.md)","Edit(people.md)"]` into settings.json | ✅ | VALID JSON; `deny` + `hooks` blocks preserved (verified via python -m json.tool) |
| T-3.5 | Add `people.md` to `.gitignore` | ✅ | `git check-ignore -v people.md` → ignored via `.gitignore:2` |
| T-3.6 | Update `CLAUDE.md` Project Structure section | ✅ | Both files documented (lines 11–12); gitignore status of each stated |

---

## Step 4 — Connect MCP servers

| ID | Task | Status | Verification |
|---|---|---|---|
| T-4.1 | 🧍 Check `/mcp` for already-connected servers | ✅ | Config state fully inspected (2026-08-04): `claude` v2.1.221; user's `google-calendar` add found; `google-gmail` added; `claude mcp list` verified. Interactive Claude.ai-connector check merged into T-4.3 |
| T-4.2 | (Conditional) Add missing connectors at project scope → `.mcp.json` | ✅ | `.mcp.json` (git-tracked) runs two **stdio** servers — `gmail` → `npx -y @klodr/gmail-mcp`, `google-calendar` → `npx -y @cocal/google-calendar-mcp` with `GOOGLE_OAUTH_CREDENTIALS` → `C:/Users/THINKPAD L13/.gmail-mcp/gcp-oauth.keys.json`. **Corrected 2026-08-04**: gmail re-pointed from the archived `@gongrzhe/server-gmail-autoauth-mcp` (repo archived 2026-03-03) to its maintained, hardened fork `@klodr/gmail-mcp` (v1.3.3, published 2026-07-27). Both packages verified on npm + GitHub API |
| T-4.3 | (Conditional) Authenticate servers needing it | ✅ | **2026-08-04** both Google logins complete + verified end-to-end. gmail ✔ (`credentials.json`; direct `search_emails` probe returned real messages — placement + course emails). google-calendar ✔ (`tokens.json` created 22:04; direct `list-events` probe returned clean response `{"events":[],"totalCount":0}` for next 3 days — auth OK, calendar just empty). `/mcp` → both connected. |
| T-4.4 | Record Notion limitation for Step 7 | ✅ | Noted in plan (`build.md`); Calendar/Linear OK unattended, Notion is not |

---

## Step 5 — Build `/pull-sources`

| ID | Task | Status | Verification |
|---|---|---|---|
| T-5.1 | 🧍 Interview: sources + per-source config (path, window, cap, filters, naming, frontmatter) | ✅ | **2026-08-04**: Sources = Claude Code sessions (mandatory, 7d) + Gmail (everything, 3d) + Google Calendar (**upcoming** 3d, primary only) + 8 local folders (ytclfr, vizier, voiceNew, portfolio, Odoo-hackthon, esg-audit-system, hadi, hostelassetcontrol) + GitHub (via `gh`) + Notion. Window 3d (sessions 7d) · cap **25/source** · naming `<date>-<slug>.md` · frontmatter: `source`, `captured`, `tags`/project match, `url`, `author`. |
| T-5.1a | 🧍 Install `gh` CLI + `gh auth login` (GitHub source) | ✅ | **2026-08-04**: gh v2.97.0 installed; logged in as MuzammilCk (scopes gist/read:org/repo/workflow); API probe verified (`gh api repos/MuzammilCk/theytclfr/commits` → real data, latest 2026-04-20). 0 commits in 3-day window across all 5 repos = no recent pushes, not an error. |
| T-5.1b | 🧍 Notion integration token (Notion source) — **deferred** | ⬜ | **Deferred 2026-08-04** (user: setup later). `.mcp.json` wiring kept (secret-free wrapper); `notion` shows failed in `/mcp` until token added. When ready: Internal integration at notion.so/my-integrations → secret (`ntn_…`) → `C:/Users/THINKPAD L13/.notion-mcp/notion.token` → share pages/databases → restart. |
| T-5.2 | 🧍 Get user approval before writing | ✅ | **Approved 2026-08-04** (draft reviewed in-session) |
| T-5.3 | Write `.claude/commands/pull-sources.md` | ✅ | File written; 6 source blocks (sessions + gmail + calendar + 8 local folders + github-skip + notion-skip); dedupe by source+id with `-<8-char-id>` collision suffix; fail-soft on source errors; `mirror/pulled/` tree pre-created; `git status` clean under `mirror/` |
| T-5.4 | Test-run `/pull-sources` | ✅ | **2026-08-05**: Full run executed — Gmail 16/18 (2 already written), Calendar 0, Local 3, Claude Code 30 sessions, GitHub 0, Notion skipped. `wiki/log.md` entry appended. All sources exercised end-to-end. |
| T-5.5 | Update `/ingest` to read `mirror/pulled/` | ✅ | **2026-08-04**: `/ingest` step 1 now reads `raw/` + `mirror/project-sync/` + `mirror/pulled/`; description updated. Pull → ingest loop is now end-to-end |
| T-5.5 | Update `/ingest` to read `mirror/pulled/` | ✅ | **2026-08-04**: `/ingest` step 1 now reads `raw/` + `mirror/project-sync/` + `mirror/pulled/`; description updated. Pull → ingest loop is now end-to-end |

---

## Step 6 — Build `/briefing` and `/debrief`

| ID | Task | Status | Verification |
|---|---|---|---|
| T-6.1 | Write `.claude/commands/briefing.md` | ✅ | **2026-08-04**: written + approved. Reads priorities (skip Archive); calendar via MCP `list-events` (graceful skip); last 3–5 log entries; per-project `status` + latest decision-log citation; honest "no wiki page" note; people.md conditional + absent-safe (one line, read-only); outputs Schedule/Threads/Reminders/Actions; appends one-line briefing marker to log; commit with co-author trailer |
| T-6.2 | Write `.claude/commands/debrief.md` | ✅ | **2026-08-04**: written + approved. Reads priorities; 3–4 one-at-a-time questions or `$ARGUMENTS` summary; log entry `YYYY-MM-DD - debrief` 3–5 bullets; **proposes** `-decisions.md` entries for pivots (writes only after explicit yes); proposes (never silently creates) new pages; proposes exact priorities.md edits + states what changes; one-line day summary; commit with co-author trailer |
| T-6.3 | 🧍 Approve both command files | ✅ | **Approved 2026-08-04** in-session ("Approve both, save them") |
| T-6.4 | Restart Claude Code (`/exit` → `claude`) | ✅ | **2026-08-05**: Restarted; both `/briefing` and `/debrief` now loaded and available as slash commands |
|  |  |  |  |

## Step 7 — Automate

| ID | Task | Status | Verification |
|---|---|---|---|
| T-7.1 | 🧍 Task Scheduler: daily task for `claude -p "/pull-sources" --permission-mode acceptEdits `(Start in = vault path) | ⬜ | Task created |
| T-7.2 | 🧍 Run the task once manually; confirm completion | ⬜ | Files land in `mirror/pulled/`; check run history |
| T-7.3 | (Conditional) Add `--allowedTools "Bash(git add:*) Bash(git commit:*) Bash(git push:*)"` if it stalls on git | ⬜ | Scheduled run completes end-to-end |
| T-7.4 | 🧍 Create Cloud Routine via `/schedule` (name, `/briefing`, daily cadence, repo + connectors) | ⬜ | Routine visible on claude.ai/code/routines |
| T-7.5 | 🧍 Enable unrestricted branch pushes on the routine (for `main`) | ⬜ | Brief lands in `wiki/log.md` on `main`, not a `claude/…` branch |
| T-7.6 | Watch usage for first 1–2 weeks (plan cap + routine daily cap) | ⬜ | No unexpected cap hits |

---

## Step 8 — Operating rhythm

| ID | Task | Status | Verification |
|---|---|---|---|
| T-8.1 | Adopt cadence table (see `build.md`) | ⬜ | Each slot filled for one week |

---

## Step 9 — Wrapping up

| ID | Task | Status | Verification |
|---|---|---|---|
| T-9.1 | Choose keep-going / pause / undo; act accordingly | ⬜ | Choice made; Task Scheduler + routine consistent with it |

---

## Task dependency map

```
T-1.x ──► T-2.x ──► (T-2.3 verify)
   │
   └────► T-3.1 ─► T-3.2/3.3 ─► T-3.4/3.5/3.6 ─► T-5.1 ─► T-5.2 ─► T-5.3 ─► T-5.4
                                          │                └──► T-6.1 ─► T-6.2 ─► T-6.3 ─► T-6.4
                                          └─────────────────────────────────┘
T-4.1 ─► (T-4.2/4.3)  ──────────────────► T-5.x, T-6.x (connectors)
T-5.4, T-6.4 ─► T-7.1/2/3 (local) and T-7.4/5/6 (cloud) ─► T-8.1 ─► T-9.1
```

---

## Update log

| Date | Session | Changes |
|---|---|---|
| 2026-08-04 | Part 2 kickoff | Created task list; marked T-1.x, T-2.1, T-2.2, T-4.4 done; T-2.3/2.4 in progress; the rest pending/blocked on user gates |
| 2026-08-04 | Step 3 executed | T-3.1 → T-3.6 all ✅; T-2.4 ✅; T-2.3 🔶 (connectivity verified, live push on next Stop) |
| 2026-08-04 | Step 4 config executed | T-4.1 ✅, T-4.2 ✅ (both Google connectors in `.mcp.json`, git-tracked, verified via `claude mcp list`); T-4.3 🧍 waits on user's interactive approval + browser OAuth; DCR incompatibility + `claude mcp login` + `--client-id` fallback documented |
| 2026-08-04 | Step 4 corrected + walkthrough | npm/GitHub re-verification: GongRzhe Gmail server **archived** → T-4.2 revised to `@klodr/gmail-mcp` (maintained fork). T-4.3 walkthrough delivered (GCP console steps, keys placement, `auth --scopes=gmail.readonly`, verification queries); user gates listed in T-4.3 row. |
| 2026-08-04 | Step 4 gates progressed | User completed console gates (keys file present, verified `installed` Desktop client) + Gmail browser login (`credentials.json`; `/mcp` → gmail ✔ 10 tools). google-calendar failed in `/mcp` only because the keys file did not exist at that time — re-verified now: server starts cleanly; T-4.3 → 🔶, only the calendar login remains. |
| 2026-08-04 | Step 5 interview done | T-5.1 ✅ — sources locked (sessions + Gmail + Calendar-upcoming + 8 local folders + GitHub + Notion; window 3d/7d, cap 25, `<date>-<slug>.md`, frontmatter tags/url/author). New user gates T-5.1a (gh install) + T-5.1b (Notion token). `notion` connector added to `.mcp.json` via secret-free wrapper. |
| 2026-08-04 | Step 5 gates verified | T-4.3 → ✅ (calendar login done; direct `list-events` probe clean; `search_emails` probe returned real mail). `gh` still not installed (T-5.1a ⛔). Notion **deferred** by user (T-5.1b ⬜). |
| 2026-08-04 | Step 5 command built | T-5.2 ✅ + T-5.3 ✅ (`.claude/commands/pull-sources.md` written + approved; collision-safe dedupe added after review). T-5.4 🔶 (mechanics smoke-tested with real probes + 3 sample files; full run = user invokes `/pull-sources`). New follow-up T-5.5: `/ingest` doesn't read `mirror/pulled/`. |
| 2026-08-04 | GitHub gate done | T-5.1a → ✅: gh v2.97.0 installed + authed (MuzammilCk); API probe verified. No repo had commits in the last 3 days (expected — last push 2026-04-20). |
| 2026-08-04 | /ingest fixed | T-5.5 → ✅: `ingest.md` now reads `mirror/pulled/`. Pull → ingest loop ready for first Claude Code run. |
| 2026-08-04 | Step 6 commands built | T-6.1 ✅ + T-6.2 ✅ + T-6.3 ✅ — `briefing.md` (read-only except one log marker; graceful calendar skip; people.md absent-safe) and `debrief.md` (interview loop; proposes decisions/new pages/priorities edits, writes only on explicit yes) written to `.claude/commands/` and approved in-session. T-6.4 ⬜ — restart Claude Code to load both. |
| 2026-08-04 | Step 6 review-hardened | Post-review fixes: `briefing.md` `allowed-tools` block **removed** (would have blocked the MCP `list-events` call — a silent, permanent "calendar not available" in unattended cloud runs); name→slug mapping hint added; `debrief.md` explicit "never edit people.md/priorities.md silently — propose only" carve-out. |
| 2026-08-04 | GitHub source expanded | T-5.3 follow-up: `pull-sources.md` Source 5 no longer hardcodes 5 repos — now **enumerates all 36 repos dynamically** via `gh repo list MuzammilCk --limit 200`. Verified: enumeration returns all 36 (incl. private); empty repos (409 "Git Repository is empty", e.g. `waste-recycling-credit-app`) fail-soft; 4 commits in window (all `second-brain` — this vault's own recent pushes). |
| 2026-08-05 | Step 5 completed | T-5.4 → ✅. Full /pull-sources run: 30 claude-sessions + 16 gmail + 0 calendar + 3 local + 0 github + notion skipped. wiki/log.md entry written. Step 5 is DONE. Moving to Step 6 (T-6.4) then Step 7. |
| 2026-08-06 | T-2.3 completed | Hook executed manually with dirty tree (`CLAUDE_PROJECT_DIR` set; Stop hooks don't fire in Freebuff sessions — the reason it hadn't run). Commit `d019243` pushed to `origin/feat/scaffold-placements`; local == remote HEAD; tree clean. Step 2 fully verified. |
