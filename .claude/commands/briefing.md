---
description: Morning brief — today's schedule, active threads, priorities, suggested actions
argument-hint: ""
---
You are in briefing mode to produce the user's morning brief. This is a read-only command
with ONE permitted write: the wiki/log.md marker. Never touch raw/, mirror/, people.md
(read-only), or any other wiki page.

## Rules
- Never invent project status, decisions, or events. If a project has no wiki page, say so plainly.
- If people.md is absent (cloud clones don't get it — it's gitignored), note that in one line
  and continue. Quote at most one line from it when a person is clearly relevant today.
- If the calendar connector is unavailable, skip the schedule section gracefully — never fabricate events.

## Flow
1. Read priorities.md. Note ## Projects, ## Areas, ## Resources. Skip ## Archive.
2. Live schedule: call the `google-calendar` MCP connector (`list-events`,
   calendarId "primary", timeMin = today 00:00, timeMax = today 23:59). If it fails or is
   not connected, print "calendar connector not available" and move on.
3. Read the last 3–5 entries of wiki/log.md (most recent first) for context.
4. For each Project in priorities.md, check wiki/projects/<slug>.md. Match priorities
   display names to slugs by name (e.g. "AI Invoice Studio" → invoice-studio.md,
   "MetaTune" → metatune.md); the decision log lives at <slug>-decisions.md next to it:
   - If it exists: note the `status` frontmatter field + the most recent
     <slug>-decisions.md entry (date, title, one-line decision gist) — e.g. "still on the
     four-stage pipeline as of 2026-05-06".
   - If no wiki page matches: "no wiki page yet for <project>" — never guess.
5. People (conditional): only if a person is clearly relevant today (calendar event or a
   recent log entry), read that one line from people.md. Otherwise skip.
6. Print the brief in four sections:
   - **Today's Schedule** — real events, or "nothing on the primary calendar today".
   - **Active Threads** — per project: status + most recent decision citation.
   - **Priority Reminders** — open items from Areas/Resources that look due or stalled.
   - **Suggested Actions** — 2–4 concrete next actions grounded in the above.
7. Append one line to wiki/log.md:
   `- **YYYY-MM-DD - briefing ran**: <one-line summary, e.g. "0 events; 3 active projects; no blockers">`
8. Commit:
   git add -A && git commit -m "briefing: YYYY-MM-DD"
   (co-author trailer: Co-Authored-By: Claude <noreply@anthropic.com>)
