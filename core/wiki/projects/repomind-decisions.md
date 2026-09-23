# Repo Mind - Decision Log

Chronological record of architecture, design, and pivot decisions made during the development of Repo Mind.

## 2026-01-31 — Adaptive Multi-Step Planning for API Rate Compliance
**Context:** The project targets executing comprehensive, LLM-based repository reviews. However, direct deep-reasoning API requests for every small tool execution fail due to the Gemini free tier limit of 5 Requests Per Minute (RPM) and high query latency.
**Decision:** Implemented a "Dual-Gear" architecture. The tool requests a single long-thinking Gemini response to generate a structured JSON execution plan (the "Planning" gear). This plan is then executed by a local python orchestrator calling fast, low-latency tools command-line style (the "Execution" gear). Only one main synthesis call is made back to the LLM.
**Alternatives considered:** 
- Autonomous agent loops (e.g. CrewAI): Rejected because standard agent loops trigger dozens of intermediate API calls, exceeding rate limits almost instantly.
- Purely local rule engine: Rejected because static analysis loses conceptual context of user queries.
**Status:** active

## 2026-09-21 — Reconcile Canonical Repo Reference to repo_mind
**Context:** The `repo_reference` in `core/wiki/projects/repomind.md` pointed to `https://github.com/MuzammilCk/repomind-cli`, which is a dead link (HTTP 404). Telemetry and GitHub repository probe confirm the project repository is `https://github.com/MuzammilCk/repo_mind`.
**Decision:** Updated `repo_reference` in `core/wiki/projects/repomind.md` to `https://github.com/MuzammilCk/repo_mind` and refreshed `last_verified` to 2026-09-21.
**Alternatives considered:** Retaining `repomind-cli` (rejected because the repository was renamed to `repo_mind` and the old URL no longer resolves).
**Status:** active
