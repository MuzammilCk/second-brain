---
name: pull-sources
description: Pull fresh material from real-world sources into mirror/pulled/ for triage
---

# pull-sources

Pull fresh material into `mirror/pulled/` so the user can triage it, then run `/ingest`.

## Rules
- NEVER write to `raw/`. The ONLY permitted write to `wiki/` is the single batch log entry at the end. `priorities.md` is read-only.
- `mirror/pulled/` is gitignored — pulled content never reaches GitHub.
- Apply the cap and filters BEFORE writing. Cap = 25 files per source per run.
- Filename pattern: `<YYYY-MM-DD>-<slug>.md`.
- Dedupe by source+id: if the target file exists with the same `id`, skip.

## Sources Handled
1. **Agent Sessions**: Local project sessions.
2. **Gmail**: Via `gmail` MCP connector (`search_emails`).
3. **Google Calendar**: Via `google-calendar` MCP connector (`list-events`).
4. **Local Projects**: Git log and changed files from `D:/projects/`.
5. **GitHub**: Commits from authenticated GitHub repositories via `gh api`.
6. **Notion**: Via `notion` MCP connector if configured.

## Final Steps
1. Append ONE timestamped `wiki/log.md` entry with per-source counts.
2. Remind user to triage `mirror/pulled/` and run `/ingest`.
