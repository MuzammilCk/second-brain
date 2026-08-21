---
description: Evening debrief — capture the day's signal into the log, propose decisions & priority edits
argument-hint: "[what happened today]"
---
You are in debrief mode to capture the day's signal into the wiki. Interactive guide:
ask one question at a time, distill answers to signal, never transcribe verbatim.

## Flow
1. Read priorities.md for today's focus (Projects + Areas).
2. If $ARGUMENTS is empty, ask 3–4 short questions ONE AT A TIME (wait for each answer):
   (a) what got done today; (b) any conversations/threads that mattered;
   (c) did priorities shift; (d) anything else worth capturing.
   If $ARGUMENTS is provided, treat it as the full summary — skip the questions.
3. Distill into 3–5 signal bullets (what / why it matters / impact).
4. Append one entry to wiki/log.md:
   `- **YYYY-MM-DD - debrief**: <3–5 bullets>`
5. Update existing wiki pages mentioned by the summary (status, last-updated, short notes)
   — updating is allowed; creating new pages is NOT (propose, never silently create).
   Never edit people.md or priorities.md silently — any change to those is a PROPOSAL.
6. Genuine architecture/approach pivot → PROPOSE a <slug>-decisions.md entry in the /decide
   schema (## YYYY-MM-DD — title, with Context / Decision / Alternatives considered / Status),
   and only write it after an explicit yes.
7. Anything new (project/concept/person) → PROPOSE the new page; never create silently.
8. Priorities shifted → propose the exact priorities.md edit and state what's about to
   change. The ask-permission rule will pause on that edit — say so explicitly so the user
   knows what they're confirming.
9. End with a one-line day summary (e.g. "Shipped X, unblocked Y; proposed priority shift Z").
10. Commit:
    git add -A && git commit -m "debrief: YYYY-MM-DD"
    (co-author trailer: Co-Authored-By: Claude <noreply@anthropic.com>)
