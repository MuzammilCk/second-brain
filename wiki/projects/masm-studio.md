---
title: MASM Studio
type: project
status: active
stack: React, Monaco Editor, Express, Node.js, TypeScript, MongoDB, Redis, Gemini, LangChain
sources:
  - mirror/project-sync/MasM8086/README.md
  - mirror/project-sync/MasM8086/CLAUDE.md
related: []
created: 2026-08-03
last-updated: 2026-08-03
---

# MASM Studio

MASM Studio is an AI-assisted, web-based 16-bit 8086 assembly language cloud IDE designed for education. By removing installation blockers (such as configuring DOSBox, micro-assemblers, and custom terminal paths), MASM Studio enables students to write, run, and analyze 8086 assembly code with syntax assistance and step-by-step register updates in a modern interface.

The project is currently undergoing a structural refactor to transition its simulation logic from generative model approximations to a deterministic, local CPU interpreter.

## Key Features
- **Zero-Setup IDE**: Runs inside modern web browsers with zero configuration.
- **Modern Code Editor**: Integrated Monaco Editor (VS Code core) providing assembly syntax highlighting and register auto-completion tags.
- **AI-Powered Code Assistant**: Educational chat assistant powered by Gemini 2.5 Flash and LangChain to troubleshoot compilation errors, explain specific addressing modes, and highlight issues.
- **Step-by-Step execution (Trace)**: Displays register and memory changes to visualize assembly instruction effects.

## Compiler & CPU Execution Pivot
The original MVP relied on a language model to simulate CPU execution and improvise register values. To prevent logic errors and syntax hallucinations during classroom integration, the system is migrating to:
- A deterministic, local interpreter acting as the core simulator.
- Constraining the LLM's role to educational narration of the interpreter's output and fixing assembly errors.

## Historical Decisions & Pivots
See the complete list of system designs and code changes in [[masm-studio-decisions|MASM Studio Decision Log]].

