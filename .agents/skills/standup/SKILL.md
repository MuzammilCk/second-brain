---
name: standup
description: Cross-project digest — what moved, what's open, what's gone quiet
---

# standup

Generate a cross-project digest. Read-only command compiling a summary report without writing files.

## Flow
1. Parse period argument (defaults to last 7 days).
2. Read entries in `wiki/log.md` and query git commits within the window.
3. For each active project:
   - Identify `status` from overview page frontmatter.
   - Retrieve the most recent decision entry from `<slug>-decisions.md`.
4. Identify projects that have gone quiet (no updates in 14+ days).
5. Print the compiled standup report to console.
