# Codex, Part 2: Turning It Into a Daily Operating System

This builds on the Codex vault from Part 1 — same reasoning, same target: take their "Automate Your AI Second Brain" project and rebuild it against what Claude Code can actually enforce, not just what a prompt asks it to do. Same conclusion as last time too: their bones are good (the daily briefing/debrief loop, `priorities.md` as a human-owned steering document, pulling from live tools) — the gaps are mostly in the same place, config vs. prose.

## What's different, and why

| Their approach | The gap | This version |
|---|---|---|
| `/pull-sources` writes new files into `raw/` | Direct conflict with Part 1's `Edit(raw/**)` lock — this would just fail | Writes into `mirror/pulled/<source>/` instead. Same "live, refreshable, not locked" category as `mirror/project-sync/` and `mirror/converted/` — nothing new conceptually, just a third tenant in a folder that already exists |
| `priorities.md` (with a Key People section) gets pushed to GitHub wholesale | You already decided, a few turns ago, that dossiers on real people don't belong in a repo tied to your name even if it's private | Split into `priorities.md` (Projects/Areas/Resources/Archive — fine to push) and `people.md` (Key People — gitignored, same as `wiki/people/`) |
| "You write and maintain `priorities.md`, Claude only reads it" | Prose rule, same category of problem Part 1 solved for `raw/` — nothing stops a session from editing it anyway | A permission `ask` rule (not `deny` — occasional writes are legitimate here, they just need a pause) on both `priorities.md` and `people.md` |
| Obsidian Git plugin auto-commits every 10 minutes | Codex already commits with a real description after every command, plus a Stop-hook safety net — a second auto-commit layer just interleaves generic messages with your good ones | The existing Stop hook gets one addition: push, if a remote is configured. Nothing new to install |
| MCP Connectors set up through Claude Code Desktop's GUI | You've been CLI the whole way through Part 1 — introducing Desktop here is a new dependency for no real gain, and Desktop isn't available on Linux if you ever move | `claude mcp add` from the same terminal, and you likely have a head start: Gmail, Google Calendar, and Google Drive are already connected on your Claude.ai account, and Claude Code picks up Claude.ai connectors automatically once you're signed in |
| `/briefing` reads calendar + log + wiki | Doesn't touch the decision-log or `status` field infrastructure Part 1 already built | Pulls each active project's current `status` and latest decision-log entry, so the brief says *where a project actually stands*, not just that it exists |
| Secret Mission: schedule `/briefing` as a Cloud Routine, briefly | Routines clone your **repo** — they never see your local disk. Their guide doesn't mention this, or that a routine pushes to a `claude/`-prefixed branch by default, not `main` | Both called out explicitly, with what to actually do about each, before you find out the hard way |

One thing that stays exactly like theirs: the instinct to make `/pull-sources` deliberately selective (volume caps, include/exclude filters, triage before you pay to ingest) is genuinely good design. I kept it and added one small thing — cross-referencing what got pulled against `priorities.md`'s Projects/Areas before you triage, so you're not skimming blind.

---

## Before you start

- Part 1's Codex vault exists, with its lock, hooks, and 8 commands (`/ingest`, `/query`, `/lint`, `/log`, `/decide`, `/sync-projects`, `/review`, `/standup`) already working.
- Everything below is CLI, matching what you've already got running. No Desktop app required.
- A GitHub account, for Step 2.

---

## Step 1 — Confirm your vault is actually ready

```
List every slash command in this vault, and tell me: does raw/ have an
Edit deny rule in .claude/settings.json, and is there a Stop hook
configured?
```

You should see all 8 commands, the `Edit(raw/**)` deny rule, and the `Stop` hook from Part 1. If any of that's missing, finish Part 1 first — everything past this point assumes it's there.

---

## Step 2 — Push to GitHub, the part that actually matters

Create the private repo the same way as their guide: github.com/new → name it → **Private** → leave README/.gitignore/license unchecked → **Create repository**.

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

That's the whole step. You don't need the Obsidian Git plugin's auto-commit-every-10-minutes — Part 1's commands already commit with a real description of what changed, and the Stop hook already catches anything that falls outside a command. What's actually missing is getting those commits *to* GitHub, so extend the same hook to push:

```bash
#!/bin/bash
# Stop hook: commit any pending changes as a checkpoint, then push if a
# remote is configured. No-ops on a clean tree with no push needed.
cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  git add -A
  git commit -q -m "auto-checkpoint: $(date '+%Y-%m-%d %H:%M')"
fi

# Push only if a remote called "origin" actually exists — keeps this a
# no-op for anyone who hasn't done this step yet, and never lets a
# network failure surface as an error in the session.
if git remote get-url origin >/dev/null 2>&1; then
  CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)
  if [ -n "$CURRENT_BRANCH" ]; then
    git push -q origin "$CURRENT_BRANCH" >/dev/null 2>&1
  fi
fi

exit 0
```

Replace the contents of `.claude/hooks/auto-checkpoint.sh` with this (ask Claude Code to do it, same as Part 1). I tested this exact version before writing it here: no-op on a clean tree with no remote, commits without erroring when there's no remote to push to, and commits-then-pushes correctly once a remote exists.

Since `raw/`, `mirror/`, and (after Step 3) `people.md` are all gitignored, none of that reaches GitHub — which matters later, since Cloud Routines (Step 7) only ever see what's actually in the repo.

*(Prefer a GUI view of your git status anyway? The Obsidian Git plugin is still fine to install for that — just turn off its own auto-commit interval so it doesn't interleave with the commits your commands are already making, and use it as a status/push button instead.)*

---

## Step 3 — Split `priorities.md` from `people.md`, and lock both properly

```
Create two files at the vault root:

1. priorities.md, with these sections in order:
   ## Projects — short-term efforts with a deliverable and a target date, 2-5 bullets.
   ## Areas — ongoing responsibilities, no end date, one line each.
   ## Resources — topics I'm actively learning or referencing, one line each.
   ## Archive — completed or paused items. Leave empty if starting fresh.

2. people.md, with:
   ## Key People — people I interact with most: role, current focus, and
   how they relate to a Project or Area. One entry each.

Ask me 3-4 short questions about my current work before writing either
file, so both reflect real priorities instead of placeholders.

At the top of priorities.md, add a comment reminding me to edit it weekly.
```

Then lock both files at the "ask" tier — not `deny`, since `/debrief` (Step 6) legitimately proposes edits here sometimes, it just needs to pause first every time, not only when it remembers to:

```json
{
  "permissions": {
    "deny": ["Edit(raw/**)"],
    "ask": ["Edit(priorities.md)", "Edit(people.md)"]
  }
}
```

Merge this into your existing `.claude/settings.json` (keep the `hooks` block from Part 1 alongside it). And add `people.md` to `.gitignore`, next to `raw/` and `mirror/` — same reasoning as keeping `wiki/people/` off GitHub, applied to the file that duplicates that same category of content.

Last, update the root `CLAUDE.md`'s Project Structure section:

```
Add priorities.md and people.md to the Project Structure section of
CLAUDE.md: both live at the vault root, both are mine to write, you only
read them — except you may propose edits to either during /debrief,
which the ask-permission rule will always pause on regardless. Note that
people.md is gitignored and priorities.md is not.
```

---

## Step 4 — Connect MCP servers

You may already have a head start — Gmail, Google Calendar, and Google Drive show as connected on your Claude.ai account already, and per Anthropic's own docs, connectors added at claude.ai load automatically in the CLI once you're signed in with that account. Check first:

```bash
claude
```
```
/mcp
```

If Calendar and Gmail already show as connected, skip to Step 5. If not, or if you want Linear or Notion too, add them at **project** scope so the config lands in `.mcp.json` — git-tracked, so it travels with the vault and is what a Cloud Routine (Step 7) reads to know which connectors it needs:

```bash
claude mcp add --transport http --scope project google-calendar https://calendarmcp.googleapis.com/mcp/v1
```

For Linear, Notion, or anything else, get the current server URL from the [Anthropic Directory](https://code.claude.com/docs/en/mcp#find-and-build-mcp-servers) or the service's own docs — these change occasionally, so I'd rather point you at the source than hand you a URL that might be stale by the time you run this. The add command is the same shape either way:

```bash
claude mcp add --transport http --scope project <name> <url-from-the-directory>
```

Then authenticate whichever ones need it:

```
/mcp
```

Select each server showing `! Needs authentication`, choose **Authenticate**, and approve in the browser that opens.

*One thing worth knowing now, before Step 7: Notion's hosted MCP server requires a live browser OAuth sign-in and has no supported way to re-authenticate unattended. That's fine for `/briefing` when you run it yourself, but it means a Notion-dependent briefing can't run as an unattended Cloud Routine indefinitely — the connection will eventually need you to re-approve it in a browser. Calendar and Linear don't have this limitation.*

---

## Step 5 — Build `/pull-sources`, writing into `mirror/pulled/`

```
Create .claude/commands/pull-sources.md that pulls fresh material from my
real-world sources into mirror/pulled/ and then suggests /ingest.

Before writing the file, interview me:

1) Ask which sources I want beyond Claude Code sessions: Gmail, Calendar,
   Linear, Notion, a local folder, or anything else I name.

2) For each source, confirm: where it lives (MCP connector name, or a
   local path), what to pull (e.g. last 7 days), a volume cap, an include
   filter, an exclude filter, the Markdown naming pattern, and any extra
   YAML frontmatter keys beyond source and captured.

Once I've answered, write pull-sources.md so the command:

- Always includes Claude Code sessions as source 1: read JSONL files from
  the last 7 days in ~/.claude/projects/ (all subdirectories), write one
  Markdown file per session to mirror/pulled/claude-sessions/, named by
  session start date and a short slug. Frontmatter: source (claude-code),
  captured (ISO date), session_id.
- Adds one block per additional source I confirmed, writing into
  mirror/pulled/<source-slug>/, applying that source's cap and filters
  BEFORE anything is written. Never touch raw/ or wiki/ from this command.
- If priorities.md exists, read its Projects and Areas sections once
  before writing anything, and add one extra line to each file's triage
  header: whether the content mentions a current Project or Area by name
  ("matches: <name>") or doesn't ("no match — check first"). This doesn't
  decide anything or skip anything — it's a sort signal for the triage
  step, not a filter.
- Above the frontmatter of every file, write a one-line triage header:
  `> <source>: <who/what>, <subject>. <one-sentence summary>. <match line>`
- Skips files that already exist (match by source plus id), so reruns
  don't duplicate material.
- After all sources finish, appends one timestamped entry to wiki/log.md
  with per-source counts.
- Ends by reminding me to triage mirror/pulled/ (skim headers, delete
  what doesn't belong, "no match" items first) and then run /ingest.

Leave a labeled comment block at the end, "# Add your own source here,"
showing the full shape (path, cap, filters, output folder, frontmatter,
dedupe check) without adding a real one.

Ask me to approve the file before writing it.
```

Triage happens exactly like their guide describes — skim headers in Obsidian's preview pane, delete what doesn't earn a place, run `/ingest` on what survives. `/ingest` already reads all of `mirror/` from Part 1, so nothing else needs to change for these files to flow into the wiki.

---

## Step 6 — Build `/briefing` and `/debrief`

```
Create .claude/commands/briefing.md:
Description: Morning brief grounded in priorities, the wiki, and connected tools.
Body:
- Read priorities.md's Projects, Areas, and Resources sections (skip Archive).
- If any MCP connector covers calendar or tickets, check today's items;
  skip that section gracefully if nothing's connected.
- Read wiki/log.md's last 3-5 entries.
- For each Project in priorities.md with a matching wiki/projects/<slug>.md,
  pull its current status field and the most recent entry from
  <slug>-decisions.md if one exists — a brief that says "still on the
  Qwen3 approach as of the 14th" is worth more than one that just
  says the project exists.
- If a Project in priorities.md has no matching wiki page, say so plainly
  rather than inventing context for it.
- Only touch people.md if a specific person is clearly relevant to
  today's schedule, and pull just that one line — it's ask-gated for a
  reason, not a general reference file.
- Generate: Today's Schedule, Active Threads (with decision-log context
  where you have it), Priority Reminders, Suggested Actions.
- Append a one-line timestamped marker to wiki/log.md noting the briefing ran.

Create .claude/commands/debrief.md:
Description: Evening capture — signal only, feeding the same log and
decision-log conventions /log and /decide already use.
Argument-hint: [optional quick summary]
Body:
- Read priorities.md for today's focus.
- If $ARGUMENTS is empty, ask 3-4 short questions one at a time: what got
  done, what conversations mattered, did priorities shift, anything to
  capture. If $ARGUMENTS is provided, skip the questions and treat it as
  the summary — either way, distill to signal, never transcribe.
- Write one entry to wiki/log.md: timestamp, type: debrief, 3-5 bullets.
- If an answer describes a genuine architecture or approach pivot on an
  existing project, propose an entry for that project's -decisions.md
  instead of just logging it in passing — same shape /decide uses.
- If existing wiki pages are mentioned, update them; propose (don't
  silently create) anything new.
- If priorities shifted, propose the specific edit to priorities.md and
  say what you're about to change — the ask-permission rule will pause
  here regardless, but say it anyway so I know what I'm confirming.
- End with a one-line summary of the day.

Create both now, ask me to approve each file.
```

Restart Claude Code (`/exit`, then `claude`) so both commands load, same reason as every other command in this whole setup.

---

## Step 7 — Automate: what runs locally, what runs in the cloud

Two different jobs need two different mechanisms, because they need different access, and this is the part their guide glosses over.

**`/pull-sources` needs your machine.** Claude Code sessions live at `~/.claude/projects/` — nothing running on Anthropic's infrastructure can see that, by design. This has to run locally, so use Windows Task Scheduler with headless Claude Code:

1. Open Task Scheduler → **Create Basic Task** → name it, set it to run daily at a time before you'd normally sit down.
2. Action → **Start a program**:
   - Program: `claude`
   - Arguments: `-p "/pull-sources" --permission-mode acceptEdits`
   - Start in: `<full path to your codex vault>`
3. Finish, then right-click the task → **Run**, once, to confirm it actually completes before trusting the schedule.

`acceptEdits` covers the file writes and common filesystem commands. If it stalls specifically on the git commit/push at the end (check Task Scheduler's run history), add `--allowedTools "Bash(git add:*) Bash(git commit:*) Bash(git push:*)"` to the arguments — that's the one part I couldn't fully verify without your exact environment in front of me, so treat it as the first thing to check if a scheduled run doesn't finish.

**`/briefing` doesn't need your machine at all**, once your vault's on GitHub — it only reads `wiki/` and `priorities.md` (both pushed) plus whatever's behind your MCP connectors. That makes it a real candidate for a Cloud Routine. Two things their guide doesn't mention, both worth knowing before you set this up rather than after:

- **Routines clone your repository — they never see your local disk.** That's exactly why `raw/`, `mirror/`, and `people.md` being gitignored doesn't cost you anything here: `/briefing` was never reading those anyway.
- **By default, a routine pushes to a `claude/`-prefixed branch, not `main`.** If you want the brief to land directly in `wiki/log.md` on `main` the way their guide describes, you need to enable unrestricted branch pushes for the routine on the web dashboard — otherwise you'll open GitHub expecting a new commit on `main` and find a `claude/…` branch instead.

To set it up:

```
/schedule
```

Follow the prompt to name the routine, give it the `/briefing` command, set a daily cadence, and confirm which repo and connectors it should use. Then, on the web dashboard at claude.ai/code/routines, open the routine's settings and enable unrestricted branch pushes if you want it landing on `main`.

Keep an eye on usage — routines draw down your plan's usage limit the same as an interactive session, and have their own daily cap separate from your regular usage, so a student-tier plan running this every weekday morning is worth watching for the first week or two.

---

## Step 8 — The operating rhythm, extended

Same table as Part 1, with the new commands slotted in:

| Command | Cadence | Runs where |
|---|---|---|
| `/log`, `/decide` | As needed | Locally, interactive |
| `/sync-projects` | When a project's control files change | Locally, interactive |
| `/pull-sources` | Daily | Locally, scheduled (Task Scheduler) |
| `/ingest` | After triaging `/pull-sources` output | Locally, interactive |
| `/briefing` | Every weekday morning | Cloud Routine, unattended |
| `/debrief` | Every evening | Locally, interactive — it's a conversation, not a report |
| `/query`, `/review` | As needed | Locally, interactive |
| `/lint`, `/standup` | Monthly / weekly | Locally, interactive |

---

## Step 9 — Wrapping up

Same three choices as always:

- **Keep going:** nothing to do — the routine runs on its own schedule, the scheduled task runs on its own, and every commit still describes what actually happened.
- **Pause:** disable the Task Scheduler task and pause the routine from the web dashboard; nothing local needs cleanup.
- **Undo:** delete the routine from the dashboard, delete the scheduled task, and `git push` will simply stop happening — none of your local setup depended on either existing in the first place.
