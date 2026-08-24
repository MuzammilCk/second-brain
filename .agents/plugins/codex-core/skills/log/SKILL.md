---
name: log
description: Append a timestamped note to wiki/log.md
---

# log

Record a quick timestamped note in the Codex changelog (`wiki/log.md`).

## Flow
1. Append a timestamped entry (using today's date `YYYY-MM-DD`) containing the note arguments to `wiki/log.md`.
2. If the note references a project, concept, or person with an existing page, update the `last-updated` field or append context to that page.
3. Constraint: Do NOT write to project decision logs (`<slug>-decisions.md`) from this command. Decision log entries are handled specifically via `/decide`.
