---
name: decide
description: Record an architecture/approach decision in a project's decision log
---

# decide

Add a new record to a project's architecture/approach decision log.

## Flow
1. Parse the first word of arguments as the project slug. Verify `wiki/projects/<slug>.md` exists.
2. If the slug does not match any existing project overview, ask one clarifying question.
3. Append a structured entry to `wiki/projects/<slug>-decisions.md`:
   ```markdown
   ## YYYY-MM-DD — <short title>
   **Context:** <what problem or constraint forced a choice>
   **Decision:** <what was chosen, based on the arguments provided>
   **Alternatives considered:** <what else was on the table, and why it lost>
   **Status:** active
   ```
4. If this decision supersedes an earlier entry in the same log, update the earlier entry: `Status: superseded by [[wiki/projects/<slug>-decisions#link-to-new-entry]]` (never delete existing entries).
5. Update the project overview file's (`wiki/projects/<slug>.md`) frontmatter fields (`status` and/or `stack`) if this decision results in structural changes.
