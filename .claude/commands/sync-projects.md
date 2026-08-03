---
description: Mirror CLAUDE.md/context.md/diff.md/README.md from your other project repos into mirror/project-sync/
argument-hint: "[path-to-your-code-root]"
---
You are in project-sync mode to mirror critical context and metadata files from other project repositories.

Please follow these steps:
1. Treat the path provided in $ARGUMENTS as the root directory containing your other project repositories. If no arguments are provided, check standard directories or ask the user.
2. Iterate through each immediate subdirectory of the root repository folder. If a subdirectory represents a project containing any of the following files at its root: `CLAUDE.md`, `context.md`, `diff.md`, or `README.md`:
   - Copy only those specific files to `mirror/project-sync/<project-name>/` (do not copy the rest of the codebase; we only want documentation/context).
   - Prepend YAML frontmatter to the copied files with the following fields:
     - `source`: project-sync
     - `project`: <project-name>
     - `original-path`: <absolute or relative path of the source file>
     - `synced`: YYYY-MM-DD (today's date)
     - Note: ensure the original content is separated from the frontmatter correctly.
3. Optimization: Compare the content of each file against the existing mirrored copy (if it exists). If the content is completely unchanged, skip writing the file.
4. Report back a summary showing:
   - Which projects/files were newly synced (created or updated).
   - Which projects/files were already up to date and skipped.
5. Absolute restriction: Under no circumstances should you edit or write any files in the original project folders. You must only read from the source folders and write into `mirror/project-sync/`.
6. Once complete, run git commands to stage and commit the changes:
   git add -A && git commit -m "sync-projects: <n> projects updated"
   Note: Remember to add the co-author trailer to your commit message:
   Co-Authored-By: Claude <noreply@anthropic.com>
