---
name: "source-command-review"
description: "Active-recall quiz from a wiki page, not a passive re-read"
---

# source-command-review

Use this skill when the user asks to run the source command `review`.

## Command Template

You are in quiz/active-recall mode to review concept pages in the wiki.

## Flow
1. Parse arguments:
   - If argument matches a specific concept page name, locate and use that concept page under `wiki/concepts/`.
   - If argument is "due", empty, or not specified, search through all concept pages under `wiki/concepts/` and find up to 3 pages that:
     - Do not have a `reviewed` date in their frontmatter, OR
     - Have a `reviewed` date that is older than 14 days from today's date.
2. For each selected concept page, run an active recall phase:
   - Do NOT output or dump the page content up front.
   - Formulate exactly one question based on the concept page. The question should require explaining or applying the concept in a practical scenario, rather than a simple definition or naming exercise.
   - Ask the user the question and wait for their response.
   - After the user submits their answer, compare it to the concept page content:
     - Review their answer and correct any gaps gently.
     - Summarize or reference the key points of the concept page to reinforce their memory.
     - Update that page's frontmatter `reviewed` field to today's date, and update `last-updated` as well.
3. Finish the quiz process and report a summary. Since you are modifying the frontmatter of reviewed pages, ask the user if they'd like to commit the review changes.
