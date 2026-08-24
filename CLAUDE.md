# Codex Vault

Vault configuration and documentation guidelines for AI Agents (Antigravity, Codex, Claude Code). Keep under 100 lines. Refer to `.agents/plugins/codex-core/rules/` for details.

## 1. Project Structure & Security
- `raw/`: Locked directory containing raw, immutable exports (Claude, ChatGPT, Notion). Never write or edit files there directly; use `scripts/extract_exports.py` to unpack.
- `mirror/`: Refreshable copies of project files (local sibling repos & GitHub). Safe to update only via `/sync-projects` or `scripts/automate-codex.ps1 -Task sync`.
- `wiki/`: Domain space fully owned by Agent/user editing.
  - `wiki/index.md`: The main entrypoint and index for the entire knowledge vault.
  - `wiki/log.md`: The running journal of updates and changes.
  - `wiki/projects/`: Project overviews (`<slug>.md`) and append-only decision logs (`<slug>-decisions.md`).
  - `wiki/concepts/`: Atomic engineering concepts and technical notes.
  - `wiki/placements/`: DSA tracker, mock interview feedback, and company recruitment pipelines.
- `priorities.md`: Vault root, user-owned steering file (Projects/Areas/Resources/Archive). Agent reads it; may only propose edits (ask-gated), typically during `/debrief`. Pushed to GitHub `main`.
- `people.md`: Vault root, user-owned Key People file. Same read / propose-only rules as `priorities.md`. **Gitignored** — never reaches GitHub.
- `scripts/`: Automation controllers, quality linters, and synchronization scripts. PowerShell scripts (`*.ps1`) are **gitignored**.
- `.agents/plugins/codex-core/`: Core vault plugin bundling 11 workflow skills, rule definitions, hooks, and MCP configurations.
- `.docs/`: Archived build ledgers, audit prompts, and guides. **Gitignored**.

## 2. Style Guide & Rules
- Write clear, concise prose using bullet points.
- Attribute every claim to a source. Explicitly document contradictions rather than picking a favorite view.
- Every page must be atomic (focusing on one single idea or entity).
- Use `[[wiki-links]]` to interconnect pages.
- **Frontmatter Syntax**: Use valid YAML block lists for `sources:` and `related:`, and always quote wikilinks in frontmatter (`- "[[wiki/concepts/...]]"`). Never write unquoted bracket strings.
- **No Self-Referential Links**: `wiki/people/` is strictly for external people. Never link to `[[wiki/people/muzammil-ck]]` (owner bio lives in `people.md`/`priorities.md`). Never write raw `[[PLACEHOLDER]]`.
- **Project Parity**: Every project overview (`wiki/projects/<slug>.md`) must link to its decision log (`[[<slug>-decisions|<Title> Decision Log]]`).
- All automated tasks and commits target the `main` branch.

## 3. Core Commands & Skills
All 11 skills are bundled in `.agents/plugins/codex-core/skills/`:
`/briefing`, `/debrief`, `/review`, `/decide`, `/log`, `/sync-projects`, `/ingest`, `/standup`, `/lint`, `/pull-sources`, `/query`.

## 4. Domain Context
The user actively tracks 13+ projects across the vault (primary focus: `ytclfr`, `metatune`, `invoice-studio`, `realme`, alongside `repomind`, `esg-audit-system`, `assetflow`, `masm-studio`, `healthsync`, `crisissignal`, `fitness-platform`, `browser-agent`, and family ventures `hadi`, `viva`). They want to instantly pull up architectural decisions and implementation history from past work. In addition to these projects, they are actively preparing for campus placements (DSA mastery, system design) and sharpening DevOps & cloud skills.
