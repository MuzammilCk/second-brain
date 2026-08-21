---
title: Repo Mind
type: project
status: active
stack: FastAPI, Python, Google Gemini, FAISS, SeaGOAT, CodeQL CLI, GitPython
sources: mirror/project-sync/cli/README.md, mirror/project-sync/cli/context.md
related: [[wiki/people/muzammil-ck]]
created: 2026-08-03
last-updated: 2026-08-03
---

# Repo Mind

Repo Mind is an advanced CLI tool and API that leverages Google Gemini (Gemini 2.5 Flash / Gemini 2.0 Flash Thinking) and GitHub CodeQL to perform deep, semantic, and security analysis of codebases. It is built to go beyond standard static analysis, using LLM-backed macro-planning and logical reasoning to identify architectural patterns and security vulnerabilities with cited evidence.

## Core Features
- **Adaptive Macro-Planning**: Gemini acts as a stateful orchestrator, creating dynamic multi-step analysis plans based on repository context.
- **Stateful Memory integration**: Uses a hybrid approach combining a Gemini Interaction API's conversation thread storage and a local FAISS vector store.
- **Double-Verification (Anti-Hallucination)**: AI-cited code findings are validated directly against local files to prevent hallucinations.
- **Security Audit integration**: Integrates CodeQL for deep vulnerability intelligence.
- **Semantic Code Search**: Employs SeaGOAT to query and locate code matching architectural or security concepts.

## System Architecture
Repo Mind utilizes a **Dual-Gear Architecture** to comply with API rate limit constraints (e.g. Gemini Free Tier 5 RPM limits):
- **Planning Gear (High-latency)**: Uses Gemini Thinking to decompose user queries into specific search and scanning operations.
- **Execution Gear (Low-latency/Local)**: Executes local tools (SeaGOAT, CodeQL, repository traversal) and aggregates evidence.
- **Synthesis Gear**: Gemini synthesizes the findings and outputs a comprehensive Markdown/JSON report.

## Directory Mappings
- `api/`: Router modules (Ingest, Search, CodeQL, Orchestrator).
- `services/`: Shared business logic layer wrapper services.
- `memory/`: FAISS vector DB indexer and conversation history log operations.
- `utils/`: Structured JSON logging and metrics gathering.
- `workspace/`: local working files for cloned source repositories.
