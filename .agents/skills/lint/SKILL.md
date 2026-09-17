---
name: lint
description: Health-check the wiki. Read-only by design
---

# lint

Perform a read-only health check (linting) on the Codex wiki.

## Flow
1. **Automated Linter**: Execute `python scripts/lint_wiki.py` to run the comprehensive quality suite.
2. **Scan for Broken [[wiki-links]]**: Ensure all links point to existing markdown targets. Verify zero `[[wiki/people/muzammil-ck]]` or `[[PLACEHOLDER]]`.
3. **Validate YAML Frontmatter**:
   - Project pages (`wiki/projects/*.md`) must have: `title`, `type: project`, `status`, `stack`, `sources` (list), `related` (list), `created`, `last-updated`.
   - Concept pages (`wiki/concepts/*.md`) must have: `title`, `type: concept`, `sources` (list), `related` (list), `created`, `last-updated`.
   - Frontmatter wikilinks must be quoted (`- "[[wiki/concepts/...]]"`).
4. **Project Parity**: Ensure every project overview (`wiki/projects/<slug>.md`) has a matching decision log (`wiki/projects/<slug>-decisions.md`) and vice versa.
5. **Identify Stale Pages**: Pages whose `last-updated` is older than 30 days.
6. **Locate Orphan Pages**: Pages in `wiki/` that have no incoming wiki-links.
7. **Report Findings**: Output a structured summary list.
