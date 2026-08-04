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
| T-2.3 | Push leg verified end-to-end (commit → push) | 🔶 | Remote reachability confirmed (`git ls-remote origin` exit 0; `main` + `feat/scaffold-placements` on GitHub); live commit+push fires on the next automatic Stop |
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
| T-4.3 | (Conditional) Authenticate servers needing it | 🧍 | **Walkthrough delivered 2026-08-04** (all 17 brief requirements answered in-session). Remaining **user gates**: (a) Google Cloud Console: create project → enable Gmail API + Google Calendar API → OAuth consent screen (External, test user, scopes `gmail.readonly`, `calendar.events`, `calendar`) → **Desktop** OAuth client → download JSON → save as `C:/Users/THINKPAD L13/.gmail-mcp/gcp-oauth.keys.json` (dir pre-created, outside repo); (b) run `npx -y @klodr/gmail-mcp auth --scopes=gmail.readonly` → approve in browser, wait for callback; (c) calendar token auto-created on first `google-calendar` connect (stored `C:/Users/THINKPAD L13/.config/google-calendar-mcp/tokens.json`). Verify: `claude mcp list` shows both connected; `search_emails` returns last 5 messages; `list-events` returns today's events. |
| T-4.4 | Record Notion limitation for Step 7 | ✅ | Noted in plan (`build.md`); Calendar/Linear OK unattended, Notion is not |

---

## Step 5 — Build `/pull-sources`

| ID | Task | Status | Verification |
|---|---|---|---|
| T-5.1 | 🧍 Interview: sources + per-source config (path, window, cap, filters, naming, frontmatter) | ⛔ | Config table recorded |
| T-5.2 | 🧍 Get user approval before writing | ⛔ | Explicit yes |
| T-5.3 | Write `.claude/commands/pull-sources.md` | ⬜ | Claude sessions = source 1 (JSONL → `mirror/pulled/claude-sessions/`); per-source blocks; priorities match-line; triage header; dedupe by source+id; log entry; `# Add your own source here` block; never touches `raw/`/`wiki/` |
| T-5.4 | Test-run `/pull-sources` | ⬜ | Files in `mirror/pulled/`; rerun adds no duplicates; `wiki/log.md` entry added; `git status` clean under `mirror/` |

---

## Step 6 — Build `/briefing` and `/debrief`

| ID | Task | Status | Verification |
|---|---|---|---|
| T-6.1 | Write `.claude/commands/briefing.md` | ⬜ | Reads priorities (skip Archive); live calendar/tickets section (graceful skip); last 3–5 log entries; per-project `status` + latest decision-log citation; honest "no wiki page" note; people.md only when relevant (one line); outputs Schedule/Threads/Reminders/Actions; appends briefing marker to log |
| T-6.2 | Write `.claude/commands/debrief.md` | ⬜ | Reads priorities; interview loop or `$ARGUMENTS` summary; log entry `type: debrief` 3–5 bullets; proposes `-decisions.md` entries for pivots; proposes (not creates) new pages; proposes priorities edits explicitly; one-line day summary |
| T-6.3 | 🧍 Approve both command files | ⛔ | Explicit yes per file |
| T-6.4 | Restart Claude Code (`/exit` → `claude`) | ⬜ | Both commands load; brief shows a real `status` + decision citation |

---

## Step 7 — Automate

| ID | Task | Status | Verification |
|---|---|---|---|
| T-7.1 | 🧍 Task Scheduler: daily task for `claude -p "/pull-sources" --permission-mode acceptEdits` (Start in = vault path) | ⬜ | Task created |
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
