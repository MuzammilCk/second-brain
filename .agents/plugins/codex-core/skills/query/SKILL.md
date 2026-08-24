---
name: query
description: Synthesize a cited answer from the wiki
---

# query

Answer user questions by synthesizing cited information directly from the Codex Wiki.

## Flow
1. Search keywords using Grep and Glob on `wiki/` filenames and frontmatter to locate relevant pages.
2. Read `wiki/index.md`, along with relevant project overviews, concept pages, and decision logs (`<slug>-decisions.md`).
3. Formulate a concise, bulleted response citing source pages (e.g. `[[wiki/projects/ytclfr]]` or `[[wiki/projects/ytclfr-decisions]]`).
4. Explicitly document any contradictions between sources.
