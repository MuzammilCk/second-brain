---
paths: ["wiki/concepts/**"]
---
# Concept Pages Guide

Concept pages are atomic (one engineering concept or framework each).

## Frontmatter Schema
Every concept page must use this exact valid YAML frontmatter block:

```yaml
---
title: Concept Display Name
type: concept
sources:
  - raw/claude-exports/source-file.md
related:
  - "[[wiki/projects/project-slug]]"
created: YYYY-MM-DD
last-updated: YYYY-MM-DD
---
```

## Strict Syntax Rules for Concepts
- **YAML Lists**: `sources` and `related` MUST be formatted as YAML block lists (`- item`).
- **Quotes on Wikilinks in YAML**: Always quote wikilinks in frontmatter (e.g. `- "[[wiki/projects/metatune]]"`). Never write unquoted comma brackets.
- **Cross-linking**: Each concept page should link to every project that uses this concept.
- **No Self-Referential Links**: Do not link to `[[wiki/people/muzammil-ck]]` in frontmatter or body.
