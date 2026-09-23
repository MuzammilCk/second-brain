---
name: log
description: "Append a timestamped note to wiki/log.md. Use for quick, one-line capture of something worth remembering right now."
---

# log (Claude Code pointer)

This is a thin pointer, not a second copy. The actual instructions for this
skill live in `.agents/skills/log/SKILL.md` -- read that file now and
follow it exactly.

Why a pointer instead of a copy: this repo already has one drift incident
(a find-and-replace pass corrupted a skill file) and currently keeps
`.agents/skills/` and `.agents/plugins/codex-core/skills/` in sync as two
hand-copied files, checked by scripts/check_skill_parity.py. Adding a THIRD
hand-copied location here would triple the drift surface for no benefit --
this file has nothing in it to drift, on purpose.

If `.agents/skills/log/SKILL.md` doesn't exist, stop and say so rather
than improvising the skill's behavior from this file's name alone.
