---
source: project-sync
project: MasM8086
original-path: D:\projects\MasM8086\CLAUDE.md
synced: 2026-08-03
---

# CLAUDE.md

This repo is mid-refactor under a written plan. Read this file fully before doing anything else — it's short on purpose, because it needs to be re-read at the start of *every* session, not just the first one.

## The plan lives in five files
`00_START_HERE.md`, `01_CURRENT_STATE_AUDIT.md`, `02_TARGET_ARCHITECTURE.md`, `03_MIGRATION_ROADMAP.md`, `04_AGENT_OPERATING_RULES.md`.

**At the start of every session, in this order:**
1. Read `00_START_HERE.md` in full (short — orientation and the one core problem).
2. Read `04_AGENT_OPERATING_RULES.md` in full (short — the standing rules; these apply to everything you do below).
3. Open `03_MIGRATION_ROADMAP.md` and check the **Progress tracker** table near the top. That table, not this file, is the source of truth for what's already done. Resume from the first task that isn't `Done`.
4. Consult `01_CURRENT_STATE_AUDIT.md` and `02_TARGET_ARCHITECTURE.md` **on demand** — look up the specific finding ID or decision number the current task references. Don't re-read either in full every session; they're reference material, not a briefing.

## The one thing not to lose sight of
This app's "compiler" and "CPU" are currently a language model improvising plausible-looking register values. Nothing about that can be patched — it has to be replaced with a real, deterministic interpreter (Phase 1 of the roadmap), and after that, the AI's only job is narrating real engine output, never inventing program state. If a task you're working on involves the AI producing a number that describes what code did, stop and re-read `04_AGENT_OPERATING_RULES.md` Rule 3.

## How to work
- **One phase at a time**, roughly in the order the roadmap lists them — later phases assume earlier ones landed. Within Phase 1 specifically, go task by task (`P1-1`, `P1-2`, ...) rather than attempting the whole engine in one pass; it's the highest-stakes, most novel piece of this rebuild.
- **Verify, then check the box.** Run each task's acceptance criteria for real before marking it done. Don't infer that something works because the code looks right.
- **Update the Progress tracker table in `03_MIGRATION_ROADMAP.md` before ending a session** — which task IDs are done, which is in progress, anything you'd want a fresh session to know that isn't obvious from the code or git log.
- **Commit with the finding/task IDs in the message** (e.g. `fix(security): scope projects.ts to authenticated owner (SEC-01, P0-1)`), per `04_AGENT_OPERATING_RULES.md` Rule 12 — this is what makes the audit traceable later.
- If something in the roadmap turns out to be wrong, outdated, or already handled a different way — say so and propose the change, rather than silently deviating from it or silently forcing the original plan.

## If you're not Claude Code
This file is written for tools that auto-load a root-level `CLAUDE.md` at the start of a session. If you're driving this repo with a different agentic tool, paste this file's contents into that tool's equivalent persistent-context mechanism (e.g. `.cursorrules` / `.cursor/rules` for Cursor, `.windsurfrules` for Windsurf) so the same session-start protocol applies — otherwise a fresh session has no reason to know this plan exists.
