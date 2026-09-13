# Agent Directives: Operational Boundaries & Governance

You operate as an autonomous systems and engineering co-developer across
strictly partitioned security tiers. All file reads, writes, and
transformations must satisfy the directional data-flow invariants below.

This file is the single source of truth for these rules. `CLAUDE.md` just
imports this file — don't duplicate these rules there, and don't let them
drift apart.

## 1. Security Domains & Classification

### Tier 1: Private Vault (`core/private/`)
* **Classification**: `RESTRICTED` | **Export**: `FORBIDDEN`
* **Paths**: `core/private/interviews/`, `core/private/scratchpad/`, `core/private/operations/`
* **Rules**:
  - NEVER copy, summarize, parse, or bundle any file under `core/private/` into `core/progress/`, `core/wiki/`, or `site/`.
  - Content here is non-indexable and must never be exposed to public compilers.
  - Never echo the contents of files here into commit messages, PR descriptions, or command output that could end up in a public CI log.

### Tier 2: Progress Radar (`core/progress/`)
* **Classification**: `CONFIDENTIAL` | **Export**: `AUTHORIZED`
* **Paths**: `core/progress/current-sprint.md`, `core/progress/stack-inventory.json`, `core/progress/logs/`
* **Rules**:
  - `stack-inventory.json` is a state definition file, not an event log.
  - Every technology listed under `production` or `active_sprint` MUST include an `evidence.reference`. `production` additionally requires that reference to point to a real, existing file under `core/wiki/projects/`.
  - `current-sprint.md` records current development objectives; it does not contain private career strategy.

### Tier 3: Curated Wiki (`core/wiki/`)
* **Classification**: `CONFIDENTIAL` | **Export**: `AUTHORIZED`
* **Paths**: `core/wiki/projects/`, `core/wiki/concepts/`
* **Rules**:
  - Any project doc with `export: true` in frontmatter must conform to the 6-part schema: Problem, Architecture, Constraints/Trade-offs, Implementation Evidence, Current State, Decisions. Drafts (`export: false`) are exempt until marked ready.
  - Concept notes are technical deep dives, decoupled from local filesystem mirrors.

### Tier 4: Public Site Projection (`site/src/data/generated/`)
* **Classification**: `PUBLIC` | **Export**: `DEPLOYED`
* **Rules**:
  - The frontend reads exclusively from `site/src/data/generated/*.json`.
  - Files here are produced solely by `scripts/compile_*.py`. No manual edits.

## 2. Banned Operations
1. **Zero Git Mirroring**: Never clone repositories, pull commit logs, or create `commits.md`/`diff.md` files locally. `mirror/` is permanently deprecated.
2. **No Monolithic Build Bundling**: Never check `site/dist/` into git tracking.
3. **Strict Directional Flows**: Any action reading from `core/private/` and writing to an exportable destination is a critical breach — abort the action, don't just log it after the fact.

## 3. What actually enforces this
This file states intent, and a capable agent should follow it — but intent
alone isn't a guarantee. Platform is Antigravity, not Claude Code — hooks
live flat in `.agents/plugins/codex-core/hooks.json` (no nested `hooks/`
subdirectory), and a `PreToolUse` hook blocks by printing
`{"decision": "deny"}` to stdout, not via process exit code.

As of now, the real-time blocking hook does not exist yet — there's only a
temporary diagnostic entry (`vault-boundary-diagnostic`) that logs the
real tool-call schema and never blocks anything. Until the real logic
replaces it, the only thing actually enforcing these boundaries is
`scripts/verify_boundaries.py`, run in CI before and after compilation.
Don't treat this file's rules as enforced in real time until that's
explicitly confirmed working, not just present.
