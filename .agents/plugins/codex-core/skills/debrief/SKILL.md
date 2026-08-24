---
name: debrief
description: Evening debrief — capture the day's signal into the log, propose decisions & priority edits
---

# debrief

Capture the day's signal into the vault log. Interactive guide: ask one question at a time, distill answers to signal, never transcribe verbatim.

## Flow
1. Read `priorities.md` for today's focus (Projects + Areas).
2. If arguments are empty, ask 3–4 short questions ONE AT A TIME (wait for each answer):
   (a) what got done today; (b) any conversations/threads that mattered; (c) did priorities shift; (d) anything else worth capturing.
   If arguments are provided, treat them as the summary and skip questions.
3. Distill into 3–5 signal bullets (what / why it matters / impact).
4. Append one entry to `wiki/log.md`:
   `- **YYYY-MM-DD - debrief**: <3–5 bullets>`
5. Update existing wiki pages mentioned by the summary (status, last-updated, short notes). Updating is allowed; creating new pages is a PROPOSAL.
   Never edit `people.md` or `priorities.md` silently — propose changes explicitly.
6. Genuine architecture/approach pivot → PROPOSE a `<slug>-decisions.md` entry in the `/decide` schema.
7. End with a one-line day summary.
