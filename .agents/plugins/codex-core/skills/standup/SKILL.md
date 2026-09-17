---
name: standup
description: Cross-project digest — what moved, what's open, what's gone quiet
---

# standup

Generate a cross-project digest. Read-only command compiling a summary report without writing files.

## Flow
1. Parse period argument (defaults to last 7 days).
2. Read entries in `core/wiki/log.md`, local vault git commits, and `core/progress/github-telemetry.json` (for remote repo push activity within the window).
3. For each active project:
   - Identify `status` and `health` from overview page frontmatter in `core/wiki/projects/<slug>.md`.
   - Retrieve the most recent decision entry from `<slug>-decisions.md`.
   - Note recent GitHub pushes if active in the window.
4. Identify projects that have gone quiet (no updates or commits in 14+ days).
5. Print the compiled standup report to console.
