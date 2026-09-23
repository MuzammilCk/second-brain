---
id: "repomind"
title: Repo Mind
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/repo_mind
last_verified: 2026-09-21
stack: FastAPI, Python, Google Gemini, FAISS, SeaGOAT, CodeQL CLI, GitPython
sources:
  - mirror/project-sync/cli/README.md
  - mirror/project-sync/cli/context.md
related: []
created: 2026-08-03
last-updated: 2026-09-21
tier: flagship
health: on-track
visibility: public
current_milestone: "Dual-gear CodeQL & Gemini repository security analyzer"
next_action: "Tune rate compliance cache for large codebase indexing"
---

# Repo Mind

Advanced CLI tool and API for deep semantic and security analysis of codebases. Uses Google Gemini as a stateful orchestrator to plan multi-step analysis operations, then executes them locally using FAISS vector search, SeaGOAT semantic code search, and CodeQL vulnerability scanning — with anti-hallucination verification of all cited findings.

## Problem

Standard static analysis tools (linters, SASTs) operate on syntax rules but cannot reason about intent, architectural patterns, or cross-file semantic relationships. LLMs can reason about code but hallucinate file paths and code references. There is no tool that combines LLM macro-reasoning with grounded, locally-verified code evidence for codebase-level analysis.

## Architecture

A **Dual-Gear Architecture** designed around Gemini Free Tier's 5 RPM rate limit:

- **Planning Gear** (Gemini 2.0 Flash Thinking): Decomposes a user query into a structured multi-step analysis plan — specifying which files to ingest, which semantic queries to run, and which CodeQL checks to invoke.
- **Execution Gear** (local, zero-latency): Executes the plan against the local repository. Uses SeaGOAT for semantic code search, FAISS for vector similarity retrieval, GitPython for repository traversal, and CodeQL CLI for vulnerability scanning.
- **Synthesis Gear** (Gemini 2.5 Flash): Aggregates execution results and produces a structured Markdown/JSON report with cited evidence.
- **Anti-Hallucination Layer**: Every AI-cited file path or code snippet is cross-referenced against the actual local file before inclusion in the report. Unverifiable citations are flagged, not silently included.

Module layout: `api/` (FastAPI routers), `services/` (business logic), `memory/` (FAISS indexer + conversation history), `utils/` (JSON logging), `workspace/` (cloned repo working directory).

## Constraints & Trade-offs

- **Rate limit compliance**: The dual-gear model serializes expensive Gemini calls. High-latency planning calls (Thinking model) are made once per query; local execution fills the gap. This keeps the tool viable on the free tier.
- **FAISS is ephemeral**: The vector index is rebuilt per session. Persistent indexing would require a vector database (Qdrant/Pinecone), deferred for cost reasons.
- **CodeQL requires pre-compilation**: For compiled languages (Java, C++), CodeQL needs a build database. The tool handles interpreted languages (Python, JS/TS) without this overhead.

## Implementation Evidence

- FastAPI server with four router modules: Ingest, Search, CodeQL, Orchestrator.
- FAISS vector index built per-session from repository source files.
- SeaGOAT integration for semantic queries against code structure.
- CodeQL CLI wrapper executing pre-built QL queries for common vulnerability patterns.
- Anti-hallucination verification: all cited code paths validated against `os.path.exists` before report inclusion.
- Structured JSON logging in `utils/` for analysis session replay.

## Current State

Active development. Core pipeline (ingest → plan → execute → synthesize) is functional. Anti-hallucination layer implemented. Persistent indexing and a richer CodeQL query library are next milestones.

## Decisions

See the complete list of system designs and code changes in [[repomind-decisions|Repo Mind Decision Log]].

