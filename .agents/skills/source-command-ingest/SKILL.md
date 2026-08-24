---
name: "source-command-ingest"
description: "Ingest new material from raw/ and mirror/ (incl. pulled) into wiki/"
---

# source-command-ingest

Use this skill when the user asks to run the source command `ingest`.

## Command Template

You are in run-command mode to ingest new material into the personal wiki from local directories.

## Flow
1. Read unprocessed or new files from `raw/` (all subfolders), `mirror/project-sync/` (all subfolders), and `mirror/pulled/` (all subfolders — fresh material written by `/pull-sources`). Remember, under no circumstances should you write to or modify files in `raw/` or `mirror/` (these are read-only).
2. For each file to process:
   - Extract content, metadata, and key entities (projects, concepts, people, decisions).
   - Before creating a new page in the wiki, use Grep to search `wiki/` frontmatter titles for an existing page matching the same title. If a match is found, edit/update it to merge the information rather than duplicating it.
   - Create or update:
     - **Concept pages** under `wiki/concepts/` (using `.claude/rules/concepts.md` YAML schema).
     - **Project pages** under `wiki/projects/` (using `.claude/rules/projects.md` YAML schema):
       - Frontmatter MUST use YAML block lists for `sources:` and `related:` (`- "[[wiki/concepts/...]]"`).
       - If a new architecture or pivot is described, create an entry in `wiki/projects/<slug>-decisions.md`.
       - Every overview page must link to `[[<slug>-decisions|<Title> Decision Log]]` at the bottom.
       - If project status changed, update the frontmatter `status` and highlight in `wiki/log.md`.
     - **People pages** under `wiki/people/` (external contacts only; never create a self-referential profile for the vault owner).
   - Ensure all references are cross-linked using standard `[[wiki-links]]`. Never write unquoted comma brackets in YAML or raw `[[PLACEHOLDER]]`.
   - Update the table of contents and lists in `wiki/index.md` and sub-indices if any new pages are created.
3. **Run Validation Hook**: Execute `python .claude/scripts/lint_wiki.py` to confirm zero errors or broken links.
4. Append a timestamped entry describing this ingestion batch to the change log at `wiki/log.md` (in format `YYYY-MM-DD - ingested sources ...`).
5. Process 5-10 sources by default. If a count argument is provided, process that number of sources instead.
6. Once complete, stage and commit the changes:
   `git add -A && git commit -m "ingest: <n> sources — <one-line summary of what was added or changed>"`
