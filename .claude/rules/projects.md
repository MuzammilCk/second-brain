---
paths: ["wiki/projects/**"]
---
# Project Pages Guide

Every project gets exactly two files, never merged:

## 1. Overview File (`wiki/projects/<slug>.md`)
Overview of the project. Must use this exact valid YAML frontmatter block:

```yaml
---
title: Project Display Name
type: project
status: active # active | paused | archived | shipped
stack: Tech1, Tech2, Tech3
sources:
  - mirror/project-sync/<slug>/README.md
related:
  - "[[wiki/concepts/concept-slug]]"
created: YYYY-MM-DD
last-updated: YYYY-MM-DD
---
```

### Strict Syntax Rules for Overviews
- **YAML Lists**: `sources` and `related` MUST be formatted as YAML block lists (`- item`).
- **Quotes on Wikilinks in YAML**: Always quote wikilinks in frontmatter (e.g. `- "[[wiki/concepts/automl]]"`). Never write `related: [[a]], [[b]]` as unquoted strings because brackets break YAML flow parsing.
- **No Self-Referential Links**: Never link to `[[wiki/people/muzammil-ck]]` (owner bio lives privately in `people.md` and `priorities.md`). Write plain text `Muzammil CK`.
- **No Raw Placeholders**: Never write `[[PLACEHOLDER]]` (triggers false wikilink errors). Use `[PLACEHOLDER]` or `TBD`.
- **Decision Log Link**: Every overview page must end with a link to its decision log:
  `## Historical Decisions & Pivots`
  `See the complete list of system designs and code changes in [[<slug>-decisions|<Title> Decision Log]].`

## 2. Decision Log File (`wiki/projects/<slug>-decisions.md`)
Append-only decision log. Each entry must use this schema:

```markdown
## YYYY-MM-DD — <short title>
**Context:** what problem or constraint forced a choice
**Decision:** what was chosen
**Alternatives considered:** what else was on the table, and why it lost
**Status:** proposed | active | superseded by [[link]]
```

Never delete an entry, even a superseded one. Mark it superseded and link forward to the new decision. The history of why something changed is the entire point.
