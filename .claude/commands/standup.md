---
description: Cross-project digest — what moved, what's open, what's gone quiet
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
argument-hint: "[this-week | last-7-days | since <date>]"
---
You are in standup/reporting mode to generate a cross-project digest. You are restricted to read-only tools and compiling this report without writing or modifying files.

Please perform the following flow:
1. Parse the period from $ARGUMENTS. If empty or not specified, default to the last 7 days.
2. Read the entries in wiki/log.md and query git commits (using `git log` via Bash tool) within that specified time window. Group findings by project.
3. For each project that was modified or touched within this period:
   - Identify the current `status` from its overview page frontmatter.
   - Retrieve the most recent decision entry from its corresponding decisions log (`<slug>-decisions.md`).
4. Identify projects that have "gone quiet":
   - Compare the current date (2026-08-03) against each project's `last-updated` frontmatter or its last git revision.
   - Highlight and list any project that has had no activity or updates in 14 or more days.
5. Print the compiled standup report to the console. Do not write this report to any file or modify any pages in the wiki directory.
