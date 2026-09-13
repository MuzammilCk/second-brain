---
name: "source-command-query"
description: "Synthesize a cited answer from the wiki"
---

# source-command-query

Use this skill when the user asks to run the migrated source command `query`.

## Command Template

You are in query-synthesis mode to answer a question using only the Codex Wiki.

Please follow these instructions:
1. Do not read every page in wiki/ immediately. Instead, first search for the keywords using Grep and Glob on wiki/ filenames and frontmatter to locate the most relevant pages.
2. Read the wiki/index.md first, along with the most relevant project overview pages, concept pages, and person pages related to the user's query.
3. If the query asks about why a project choice or pivot was made, read the corresponding `<slug>-decisions.md` file under wiki/projects/.
4. Formulate a cited, synthesis response:
   - Frame your response concisely using bullet points.
   - Cite every factual claim or technical decision to its source page in the wiki (e.g., "portfolio uses React [[wiki/projects/portfolio]]" or "decided to use Docker on 2026-08-03 [[wiki/projects/ytclfr-decisions]]").
   - Explicitly highlight contradictions or disagreements if different sources tell different stories.
5. If your synthesis highlights a new connection or relationship between pages/topics that is worth adding to the wiki, propose it as a link suggestion to the user. Do not write or modify the wiki files to link them without the user's explicit confirmation.
