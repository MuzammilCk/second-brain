# Repo Mind - Decision Log

Chronological record of architecture, design, and pivot decisions made during the development of Repo Mind.

## 2026-01-31 — Adaptive Multi-Step Planning for API Rate Compliance
**Context:** The project targets executing comprehensive, LLM-based repository reviews. However, direct deep-reasoning API requests for every small tool execution fail due to the Gemini free tier limit of 5 Requests Per Minute (RPM) and high query latency.
**Decision:** Implemented a "Dual-Gear" architecture. The tool requests a single long-thinking Gemini response to generate a structured JSON execution plan (the "Planning" gear). This plan is then executed by a local python orchestrator calling fast, low-latency tools command-line style (the "Execution" gear). Only one main synthesis call is made back to the LLM.
**Alternatives considered:** 
- Autonomous agent loops (e.g. CrewAI): Rejected because standard agent loops trigger dozens of intermediate API calls, exceeding rate limits almost instantly.
- Purely local rule engine: Rejected because static analysis loses conceptual context of user queries.
**Status:** active
