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
