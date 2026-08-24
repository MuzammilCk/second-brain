---
name: "source-command-log"
description: "Append a timestamped note to wiki/log.md"
---

# source-command-log

Use this skill when the user asks to run the source command `log`.

## Command Template

You are in logging mode to record a quick timestamped note in the Codex changelog.

## Flow
1. Append a timestamped entry (using today's date `YYYY-MM-DD`) containing the provided note arguments to `wiki/log.md`. Ensure it is formatted consistently with the existing entries in `wiki/log.md` (under an appropriate date header or list item).
2. If the note references a project, concept, or person path with an existing page, search for and update the corresponding overview page in the wiki repository (e.g., updating the `last-updated` field or appending context to the page).
3. Critical constraint: Do NOT update or write to any project decision logs (`<slug>-decisions.md`) from this command. Decision log entries are handled specifically via `/decide` or other commands. Keep updates lightweight.
4. Stage and commit the logging update:
   git add -A && git commit -m "log: <note>"
   (co-author trailer: Co-Authored-By: Codex <noreply@anthropic.com>)
