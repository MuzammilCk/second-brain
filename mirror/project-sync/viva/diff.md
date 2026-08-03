---
source: project-sync
project: viva
original-path: D:\projects\viva\diff.md
synced: 2026-08-03
---

# diff.md — Build Change Log

**Project:** Viva Business Team Website ("Signal Chain")
**Purpose:** Append-only running log of what actually changed, session by session. `context.md` tells you where things stand right now; this file tells you how it got there. Don't duplicate current-status info here — this is history, not a status board.

**How to use this file:**
- Add a new entry at the **top** for every work session — most recent first
- Keep entries factual and scannable: what was built/changed, which files, anything that deviated from the `docs/` specs and why
- If a deviation was a genuine judgment call (not just a bug fix), log it here **and** add a matching entry to `decisions.md` — this file is the "what happened," `decisions.md` is the "why we decided this, generally"
- Never delete or rewrite past entries

---

## Entry template

```
### [YYYY-MM-DD] — One-line session summary
**Phase:** (matches roadmap.md)
**Changed:**
- ...
**Files touched:**
- ...
**Deviations from spec (if any):**
- ... (cross-reference decisions.md if this became a real decision)
```

---

## Log

*(No entries yet — the first one goes here once Phase 0 starts.)*
