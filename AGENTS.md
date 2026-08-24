# Codex Vault

Vault configuration and documentation guidelines. Keep under 100 lines. Refer to `.claude/rules/` for details.

## 1. Project Structure
- `raw/`: Locked directory containing raw, one-time data exports. Never attempt to write or edit files there.
- `mirror/`: Refreshable copies of project files. Safe to write to only via the `/sync-projects` command.
- `wiki/`: Domain space fully owned by Codex/user editing.
  - `wiki/index.md`: The main entrypoint and index for the entire knowledge vault.
  - `wiki/log.md`: The running journal of updates and changes.
- `priorities.md`: Vault root, user-owned steering file (Projects/Areas/Resources/Archive). Codex reads it; may only propose edits (ask-gated), typically during `/debrief`. Pushed to GitHub.
- `people.md`: Vault root, user-owned Key People file. Same read / propose-only rules as `priorities.md`. **Gitignored** — never reaches GitHub.
- Refer to `.claude/rules/` for folder-specific page-type conventions (projects, concepts, placements).

## 2. Style Guide
- Write clear, concise prose using bullet points.
- Attribute every claim to a source. Explicitly document contradictions rather than picking a favorite view.
- Every page must be atomic (focusing on one single idea or entity).
- Use [[wiki-links]] to interconnect pages.
- People pages (`wiki/people/<name>.md`) require only:
  - Name as title.
  - How the person is known.
  - Which projects, concepts, or topics connect to them.
  - Sources.
  - Note: `wiki/people/` is strictly for people other than the vault owner. Never create a self-referential profile page there. Vault owner bio/steering lives in `people.md` (private) and `priorities.md`.
- No separate rules file is required for `wiki/people/`.

## 3. Domain Context
The user actively tracks 13 projects across the vault (primary focus: `ytclfr`, `metatune`, `invoice-studio`, `realme`, alongside `repomind`, `esg-audit-system`, `assetflow`, `masm-studio`, `healthsync`, `crisissignal`, `fitness-platform`, and family ventures `hadi`, `viva`). They want to instantly pull up architectural decisions and implementation history from past work. In addition to these projects, they are preparing for campus placements (DSA, system design) and sharpening DevOps & cloud skills.

