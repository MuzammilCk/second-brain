# 🧠 Codex: AI-Powered Second Brain & Operating System

**Codex** is a personal knowledge vault, engineering decision ledger, and agentic daily operating system. It enables effortless daily tracking, project context mirroring across 30+ GitHub/local repos, and systematic preparation for **campus placements, DSA interviews, and system design rounds**.

---

## 🏛️ Vault Architecture: The 3-Tier Boundary Model

```
d:\projects\codex\
├── raw/               <-- 🔒 Read-Only: Immutable data exports (Claude, ChatGPT, Notion)
├── mirror/            <-- 🔄 Refreshable: Project mirrors (CLAUDE.md/context.md) & GitHub syncs
│   └── project-sync/  <-- Auto-synced context & commit history across all 30+ project repos
├── wiki/              <-- ✍️ Curated Second Brain: Interconnected notes with [[wiki-links]]
│   ├── projects/      <-- Project overviews (<slug>.md) & Decision logs (<slug>-decisions.md)
│   ├── concepts/      <-- Atomic technical concepts (AutoML, Video Intelligence, Three.js, etc.)
│   ├── placements/    <-- Placement trackers, DSA matrix, company pipelines, mock logs
│   ├── people/        <-- Directory of external mentors, contacts, and collaborators
│   ├── index.md       <-- Master table of contents & entrypoint
│   └── log.md         <-- Vault audit journal & running daily log
├── journal/           <-- 📅 Daily morning briefings & time-ordered snapshots
├── priorities.md      <-- 🎯 Root steering file: P.A.R.A (Projects, Areas, Resources, Archive)
├── people.md          <-- 👤 Private Key People file (Gitignored)
├── scripts/           <-- ⚡ Automation controllers & launcher scripts (Gitignored)
└── .docs/             <-- 📚 Archived build ledgers, audit guides, and task trackers (Gitignored)
```

---

## ☀️ Daily Operating Rhythm

| Routine | Trigger | What It Does |
| :--- | :--- | :--- |
| **Morning Briefing** | `/briefing` | Reads [`priorities.md`](priorities.md) & active project statuses, generates today's focus & 2–4 immediate tasks, and logs to [`wiki/log.md`](wiki/log.md). |
| **Daytime Decisions** | `/decide` | Appends structured decisions (`Context`, `Decision`, `Alternatives`, `Status`) into `<slug>-decisions.md`. |
| **Daytime Quick Note** | `/log` | Appends a timestamped note to [`wiki/log.md`](wiki/log.md). |
| **Active Recall Quiz** | `/review` | Interactive scenario-based quiz on concepts/DSA without spoiling the answers. |
| **Evening Debrief** | `/debrief` | Interactive 3–4 questions, extracts signal bullets, updates wiki notes, and proposes priority edits. |

---

## 🎓 Placement & Career Command Center

Located under [`wiki/placements/`](wiki/placements/):

1. **DSA Mastery & Confidence Tracker** ([`wiki/placements/dsa-tracker.md`](wiki/placements/dsa-tracker.md)):
   - 1–5 confidence rating matrix across core topics (Two Pointers, Sliding Window, Graphs, Trees, DP).
   - Weak areas breakdown and solved problem checklists.
2. **Mock Interview Feedback Logs** ([`wiki/placements/mock-interviews.md`](wiki/placements/mock-interviews.md)):
   - Append-only log capturing format, demonstrated strengths, and concrete items to improve next time.
3. **Company Recruitment Pipelines** ([`wiki/placements/companies/`](wiki/placements/companies/)):
   - Status tracking across application stages (researching, applied, OA, interview, offer) for target companies.

---

## 🤖 Multi-Agent Compatibility

Codex natively supports all major agentic AI coding tools:
- **Google Antigravity IDE**: Runs all 11 skills, terminal tools, and python automation out of the box with zero configuration.
- **Claude Code CLI**: Configured via `.claude/` with slash commands and project permissions.
- **OpenAI Codex**: Integrated via `.codex/config.toml` and `.agents/skills/`.

---

## ⚡ Automation Suite (`scripts/`)

Codex comes with an end-to-end automation controller:

```powershell
# Run all automation tasks end-to-end:
.\scripts\automate-codex.ps1 -Task all

# Run individual modules:
.\scripts\automate-codex.ps1 -Task briefing     # Generate daily morning brief
.\scripts\automate-codex.ps1 -Task sync         # Sync local project repos & GitHub repositories
.\scripts\automate-codex.ps1 -Task extract      # Auto-extract Claude/ChatGPT/Notion export files
.\scripts\automate-codex.ps1 -Task checkpoint   # Git commit & push backup to main

# Register Windows Task Scheduler background jobs (08:00 AM brief, 11:00 PM sync):
.\scripts\automate-codex.ps1 -InstallScheduledTasks
```

---

## 💎 Obsidian Graph Setup

The vault includes optimized Obsidian configuration:
- **Graph Search Query**: `path:wiki OR file:priorities.md`
- **Color Clusters**: 🟢 Green (Projects) · 🟣 Purple (Concepts) · 🟡 Orange (Placements) · 🔵 Blue (Index Hubs).
- **Clean Explorer**: Automatically ignores backend archive folders (`raw/`, `mirror/`, `scripts/`, `.docs/`).