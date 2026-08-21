# Codex Vault

Vault configuration and documentation guidelines. Keep under 100 lines. Refer to `.Codex/rules/` for details.

## 1. Project Structure
- `raw/`: Locked directory containing raw, one-time data exports. Never attempt to write or edit files there.
- `mirror/`: Refreshable copies of project files. Safe to write to only via the `/sync-projects` command.
- `wiki/`: Domain space fully owned by Codex/user editing.
  - `wiki/index.md`: The main entrypoint and index for the entire knowledge vault.
  - `wiki/log.md`: The running journal of updates and changes.
- `priorities.md`: Vault root, user-owned steering file (Projects/Areas/Resources/Archive). Codex reads it; may only propose edits (ask-gated), typically during `/debrief`. Pushed to GitHub.
- `people.md`: Vault root, user-owned Key People file. Same read / propose-only rules as `priorities.md`. **Gitignored** — never reaches GitHub.
- Refer to `.Codex/rules/` for folder-specific page-type conventions (projects, concepts, placements).

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
- No separate rules file is required for `wiki/people/`.

## 3. Domain Context
The user is actively building three projects: `ytclfr` (a video intelligence pipeline), `portfolio`, and `metatune automl`. They want to be able to instantly pull up everything from their own past work when working through technical decisions. Aside from these projects, they are looking to sharpen their skills in DevOps, cloud computing, and specific technical tools. They rely on code history and architectural logs to inform future technical paths.
