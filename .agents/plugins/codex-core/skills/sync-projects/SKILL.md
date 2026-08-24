---
name: sync-projects
description: Mirror CLAUDE.md/context.md/diff.md from other project repos into mirror/project-sync/
---

# sync-projects

Mirror critical context and metadata files from sibling project repositories into `mirror/project-sync/`.

## Flow
1. Check sibling project repositories under `D:/projects/`.
2. For each project containing `CLAUDE.md`, `context.md`, `diff.md`, or accompanying `README.md`:
   - Copy only those files to `mirror/project-sync/<project-name>/`.
   - Prepend standardized YAML frontmatter (`source: project-sync`, `project`, `original-path`, `synced: YYYY-MM-DD`).
3. Skip files whose body content is identical to existing copies.
4. Report a summary of newly synced vs skipped files.
