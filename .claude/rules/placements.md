---
paths: ["wiki/placements/**"]
---
# Placements Guide

Conventions for tracking career placements, company pipelines, DSA preparation, and mock interviews.

## 1. Directory Structure

- `wiki/placements/index.md`: The main index for all career placement tracks and physical infrastructure placements.
- `wiki/placements/companies/`: Directory containing one page per company or recruitment pipeline.
- `wiki/placements/dsa-tracker.md`: DSA topics preparation tracker and confidence matrix.
- `wiki/placements/mock-interviews.md`: Append-only log of practice and mock interviews.

## 2. Placements Index (`wiki/placements/index.md`)

The index page should present a high-level overview including:
- **Target Roles**: Roles being targeted.
- **Target Companies**: Companies currently aiming for.
- **Timeline**: Critical dates and roadmap.
- **At a Glance**: Highlighted milestones (such as upcoming hackathons or confirmation deadlines) and workspace placements.

## 3. Company Pages (`wiki/placements/companies/<company_slug>.md`)

One file per target company or recruitment pipeline.

### Frontmatter Schema
```yaml
company: <Company Name>
status: researching | applied | oa | interview | offer | rejected
rounds:
  - <Description of Round 1 and its status/outcome>
  - <Description of Round 2 and its status/outcome>
notes:
  - <Key note, deadline, travel info, or salary package>
sources:
  - <Source document or context file>
```

### Page Structure
Must contain:
- A title referencing the placement status.
- A status summary (Target company, current recruitment status, primary contacts).
- An overview of each round.
- Logistics or timeline details if dynamic/applicable.

## 4. DSA Tracker (`wiki/placements/dsa-tracker.md`)

Used to track algorithmic confidence and identify improvement areas.

### Document Structure
- **Frontmatter**: Standard metadata (`title`, `type: placement`, `created`, `last-updated`, `sources`, `related`).
- **Confidence Matrix**: A table mapping core topics (e.g. Dynamic Programming, Graphs) to their confidence levels, rating (1-5), and core strengths / focus areas.
- **Weak Areas & Focus Action Items**: Detailed breakdown of topics marked weak/moderate, listing specific implementation challenges and concrete LeetCode action items.
- **Practice Progress Logs**: Step-by-step log of canonical problems resolved (e.g., sliding window, two pointers) with checklists.

## 5. Mock Interview Log (`wiki/placements/mock-interviews.md`)

An append-only log of mock interviews, practice sessions, and placement exams.

### Entry Schema
Entries use the same shape as a decision log:
```markdown
## YYYY-MM-DD — <short title / company context>
**Format:** <Interview format, e.g., Behavioral, SQL, DSA>
**What went well:** <Strengths demonstrated, quick recognition of algorithms, structured explanation>
**What to fix next time:** <Weak spots, syntax issues, index off-by-one errors, time management improvements>
```
