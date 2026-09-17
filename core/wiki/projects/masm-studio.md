---
id: "masm-studio"
title: MASM Studio
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/MasM8086
last_verified: 2026-08-03
stack: React, Monaco Editor, Express, Node.js, TypeScript, MongoDB, Redis, Gemini, LangChain
sources:
  - mirror/project-sync/MasM8086/README.md
  - mirror/project-sync/MasM8086/CLAUDE.md
related: []
created: 2026-08-03
last-updated: 2026-08-03
tier: flagship
health: on-track
visibility: public
current_milestone: "Deterministic 16-bit 8086 Assembly cloud IDE"
next_action: "Expand Monaco syntax autocompletions for register trace mapping"
---

# MASM Studio

AI-assisted, web-based 16-bit 8086 assembly language cloud IDE designed for education. Removes all local installation blockers (DOSBox configuration, micro-assembler setup, custom terminal paths) so students can write, run, and analyze 8086 assembly directly in a browser with AI assistance and step-by-step register visualization.

## Problem

Setting up a traditional 8086 assembly toolchain (DOSBox, MASM/TASM, custom path configurations) is a significant blocker for students entering systems programming courses. Classroom time is lost to environment configuration rather than learning. Existing online emulators lack educational features — no AI guidance, no register-level trace visualization, no syntax assistance.

## Architecture

A two-tier web application:

- **Frontend**: React SPA embedding Monaco Editor (VS Code core) for assembly syntax highlighting and register auto-completion. Communicates with the backend via a REST API.
- **Backend**: Express/Node.js server managing session state, routing AI prompts through LangChain, and proxying to Gemini 2.5 Flash.
- **Execution Model** (in-progress pivot): Transitioning from LLM-simulated CPU execution to a deterministic local 8086 interpreter. The interpreter handles register arithmetic, memory addressing, and flag mutations. The LLM role is constrained to educational narration of the interpreter's output and error correction.
- **Persistence**: MongoDB for user session and code snapshot storage; Redis for ephemeral run state.

## Constraints & Trade-offs

- **LLM simulation replaced by interpreter**: The V1 MVP used Gemini to simulate register state, which produced plausible but incorrect results (hallucinated flag values, wrong addressing mode results). This was a fundamental correctness failure for a classroom environment — a deterministic interpreter was the only acceptable solution.
- **Zero-install constraint**: All execution must remain browser-side or proxied through the backend. No DOSBox, no native binaries on the client.
- **Cost**: Gemini 2.5 Flash minimizes API call cost, but the migration to a local interpreter removes per-execution API cost entirely.

## Implementation Evidence

- Monaco Editor with custom 8086 assembly language grammar and register token completion.
- LangChain integration to Gemini 2.5 Flash for educational chat and error explanation.
- Step-by-step trace UI displaying register diffs (AX, BX, CX, DX, SP, BP, SI, DI, flags) after each instruction.
- Deterministic interpreter module under active development to replace LLM simulation.

## Current State

Active development. The LLM-based MVP is functional. The interpreter refactor is in progress — the goal is to complete the simulation-to-interpreter migration before classroom integration.

## Decisions

See the complete list of system designs and code changes in [[masm-studio-decisions|MASM Studio Decision Log]].

