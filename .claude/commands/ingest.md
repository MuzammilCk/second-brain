---
description: Ingest new material from raw/ and mirror/ into wiki/
argument-hint: "[count]"
---
You are in run-command mode to ingest new material into the personal wiki from local directories.

Please perform the following flow:
1. Read unprocessed or new files from raw/ (all subfolders) and mirror/project-sync/ (all subfolders). Remember, under no circumstances should you write to or modify files in raw/ or mirror/ (these are read-only).
2. For each file to process:
   - Extract content, metadata, and key entities (projects, concepts, people, decisions).
   - Before creating a new page in the wiki, Use Grep to search wiki/ frontmatter titles for an existing page matching the same title. If a match is found, edit/update it to merge the information rather than duplicating it.
   - Create or update:
     - Source-summary pages under wiki/ if needed.
     - Concept pages under wiki/concepts/ (following .claude/rules/concepts.md).
     - Project pages under wiki/projects/ (following .claude/rules/projects.md).
       - Critical: If the source describes a new architecture, approach, or pivot for a project, propose a structured entry in wiki/projects/<slug>-decisions.md matching the decisions schema rather than only editing the overview file.
       - Critical: If the status of a project has changed (e.g. "shipped", "submitted", "migrating to X"), update the status in the project overview frontmatter and explicitly highlight the change in wiki/log.md. Never change status silently.
     - People pages under wiki/people/ (following the style guide in CLAUDE.md).
   - Ensure all references are cross-linked using standard [[wiki-links]] to interconnect related pages.
   - Update the table of contents and lists in wiki/index.md and sub-indices if any new pages are created.
3. Append a timestamped entry describing this ingestion batch to the change log at wiki/log.md (in format YYYY-MM-DD - ingested sources ...).
4. Process 5-10 sources by default. If $ARGUMENTS is provided and is a valid number, process that number of sources instead.
5. Once complete, run git commands to stage and commit the changes:
   git add -A && git commit -m "ingest: <n> sources — <one-line summary of what was added or changed>"
   Note: Remember to add the co-author trailer to your commit message:
   Co-Authored-By: Claude <noreply@anthropic.com>
