---
name: standup
description: "Cross-project digest of what moved, what's open, what's gone quiet. Use when the user asks for a status roundup across their projects."
---

# standup (Claude Code pointer)

This is a thin pointer, not a second copy. The actual instructions for this
skill live in `.agents/skills/standup/SKILL.md` -- read that file now and
follow it exactly.

Why a pointer instead of a copy: this repo already has one drift incident
(a find-and-replace pass corrupted a skill file) and currently keeps
`.agents/skills/` and `.agents/plugins/codex-core/skills/` in sync as two
hand-copied files, checked by scripts/check_skill_parity.py. Adding a THIRD
hand-copied location here would triple the drift surface for no benefit --
this file has nothing in it to drift, on purpose.

If `.agents/skills/standup/SKILL.md` doesn't exist, stop and say so rather
than improvising the skill's behavior from this file's name alone.
