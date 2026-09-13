---
name: "source-command-decide"
description: "Record an architecture/approach decision in a project's decision log"
---

# source-command-decide

Use this skill when the user asks to run the source command `decide`.

## Command Template

You are in decision-recording mode to add a new record to a project's architecture/approach decision log.

## Flow
1. Parse the first word of the arguments as the project slug. Check if a corresponding overview file exists at `wiki/projects/<slug>.md`.
2. If the first word does not match any existing project overview, pause and ask the user for confirmation (ask exactly one clarifying question to identify which project this concerns) before proceeding.
3. Append a structured entry to `wiki/projects/<slug>-decisions.md` using the decisions schema defined in `.claude/rules/projects.md`:
   ```markdown
   ## YYYY-MM-DD — <short title>
   **Context:** <what problem or constraint forced a choice>
   **Decision:** <what was chosen, based on the arguments provided>
   **Alternatives considered:** <what else was on the table, and why it lost>
   **Status:** active
   ```
4. If this new decision supersedes any earlier entry in the same log, locate that earlier entry and update its status field to: `Status: superseded by [[wiki/projects/<slug>-decisions#link-to-new-entry]]` (never delete existing entries).
5. Update the project overview file's (`wiki/projects/<slug>.md`) frontmatter fields (`status` and/or `stack`) if this decision results in structural changes to the project state.
6. Once complete, stage and commit the changes:
   git add -A && git commit -m "decide: <project> — <short summary>"
   (co-author trailer: Co-Authored-By: Codex <noreply@anthropic.com>)
