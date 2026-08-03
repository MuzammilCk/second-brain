---
description: Health-check the wiki. Read-only by design
allowed-tools:
  - Read
  - Grep
  - Glob
---
You are running a read-only health check (linting) on the Codex wiki. You are restricted to Read, Grep, and Glob tools for this command and cannot write or modify any files on disk.

Please perform these validation checks:
1. Scan for broken [[wiki-links]] (links pointing to pages that do not exist).
2. Locate orphan pages (pages in wiki/ that have no incoming wiki-links from other pages, especially from wiki/index.md).
3. Validate frontmatter fields for all project and concept pages:
   - Project pages (wiki/projects/*.md) must have all required fields (title, type, status, stack, sources, related, created, last-updated). Pay close attention to a missing `status` field.
   - Concept pages (wiki/concepts/*.md) must have required fields (title, type, sources, related, created, last-updated).
4. Identify any stale pages (i.e. pages whose frontmatter `last-updated` or git modification timestamp is older than 30 days).
5. Ensure consistency between project overviews and project decision logs: every project Overview (`wiki/projects/<slug>.md`) should have a corresponding Decisions Log (`wiki/projects/<slug>-decisions.md`), and vice versa. Report any files that exist without their counterpart.
6. Look for likely-duplicate pages that describe the same technical project, concept, or person (e.g., similar titles or matching descriptions).
7. Report all findings as a structured markdown list detailing the issue type, file page, and necessary action.
8. State clearly that you cannot fix these findings automatically during this command run due to tool restrictions, and they must be resolved manually or in a separate session.
