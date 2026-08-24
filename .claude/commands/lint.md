---
description: Health-check the wiki. Read-only by design
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---
You are running a read-only health check (linting) on the Codex wiki. You can run `python .claude/scripts/lint_wiki.py` to execute the automated quality suite.

Please perform these validation checks:
1. **Automated Linter**: Run `python .claude/scripts/lint_wiki.py` to check for YAML syntax, missing fields, broken wikilinks, and project/decision parity.
2. **Scan for Broken [[wiki-links]]**: Ensure all links point to existing markdown targets. Check for accidental `[[wiki/people/muzammil-ck]]` or `[[PLACEHOLDER]]`.
3. **Validate YAML Frontmatter**:
   - Project pages (`wiki/projects/*.md`) must have: `title`, `type: project`, `status`, `stack`, `sources` (list), `related` (list), `created`, `last-updated`.
   - Concept pages (`wiki/concepts/*.md`) must have: `title`, `type: concept`, `sources` (list), `related` (list), `created`, `last-updated`.
   - Frontmatter wikilinks must be quoted (`- "[[wiki/concepts/...]]"`).
4. **Project Parity**: Ensure every project overview (`wiki/projects/<slug>.md`) has a matching decision log (`wiki/projects/<slug>-decisions.md`) and vice versa.
5. **Identify Stale Pages**: Pages whose `last-updated` is older than 30 days.
6. **Locate Orphan Pages**: Pages in `wiki/` that have no incoming wiki-links from other pages or `wiki/index.md`.
7. **Report Findings**: Report all findings as a structured markdown list detailing the issue type, file page, and necessary action.
