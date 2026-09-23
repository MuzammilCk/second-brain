# MASM Studio - Decision Log

Chronological track of design decisions and architectural pivots.

## 2026-08-03 — Deprecating Generative Execution Simulation for a Deterministic Local CPU Interpreter
**Context:** The original MVP utilized Gemini 2.5 Flash in "executor mode" to simulate the runs of assembly operations (e.g. tracking index values, memory offsets, and instruction lines). While functional for simple runs, this led to frequent logic errors and syntax hallucinations for complex nested loops, making the tool unreliable for formal classroom grading.
**Decision:** Overhauled the application execution path to separate simulation from narration:
1. Implemented a deterministic local interpreter backend (written in TypeScript) to parse instructions and execute them step-by-step.
2. Restricted the LLM's role to standard troubleshooting analysis (explaining compiler messages and providing addressing mode suggestions), strictly forbidding it from proposing or simulating state.
**Alternatives considered:** 
- Running containerized DOSBox instances in the cloud (rejected because hosting and scaling thousands of interactive DOS environments is financially prohibitive).
**Status:** active

## 2026-09-21 — Reconcile Canonical Repo Reference to Masm_16-bit_8086
**Context:** The `repo_reference` in `core/wiki/projects/masm-studio.md` pointed to `https://github.com/MuzammilCk/MasM8086`, which is a dead link (HTTP 404). Telemetry confirms the active repository is `https://github.com/MuzammilCk/Masm_16-bit_8086`.
**Decision:** Updated `repo_reference` in `core/wiki/projects/masm-studio.md` to `https://github.com/MuzammilCk/Masm_16-bit_8086` and refreshed `last_verified` to 2026-09-21.
**Alternatives considered:** Keeping the historical name `MasM8086` (rejected because the GitHub repo was renamed to `Masm_16-bit_8086` and the old URL 404s).
**Status:** active
