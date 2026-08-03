---
paths: ["wiki/projects/**"]
---
# Project Pages Guide

Every project gets exactly two files, never merged:

## 1. Overview File (`wiki/projects/<slug>.md`)
Overview of the project.
Frontmatter fields:
- `title`
- `type`: project
- `status`: active | paused | archived | shipped
- `stack`: comma-separated list of technologies
- `sources`
- `related`
- `created`: YYYY-MM-DD
- `last-updated`: YYYY-MM-DD

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
