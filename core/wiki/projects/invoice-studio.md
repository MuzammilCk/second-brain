---
title: AI Invoice Studio
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/invoice-studio
last_verified: 2026-08-03
stack: React 19, Vite, TypeScript, TailwindCSS v4, Zustand, Express.js, Decimal.js, jsonwebtoken, bcryptjs, Python, Flask, faster-whisper, OpenAI SDK
sources:
  - mirror/project-sync/invoice/context.md
  - mirror/project-sync/invoice/diff.md
  - mirror/project-sync/invoice/README.md
related: []
created: 2026-06-01
last-updated: 2026-08-03
---

# AI Invoice Studio

Enterprise-grade billing and invoicing platform with AI-powered features: speech-to-invoice dictation, natural-language invoice generation, compliance auditing, and intelligent notes rewriting. Originally cloud-based (Gemini 2.5 Flash), now migrating to local, offline-first AI to reduce costs, protect PII, and enable fine-tuning.

## Problem

Billing workflows in small businesses involve repetitive data entry (client details, line items, tax calculations) that is error-prone and slow. Voice-first data entry and natural-language invoice generation could dramatically reduce this overhead. However, sending invoice data (client PII, pricing, terms) to cloud AI APIs creates data privacy risks and ongoing per-call costs. The system needs to be functionally rich while remaining cost-neutral and privacy-safe in production.

## Architecture

A three-tier application with a local AI sidecar:

- **Frontend** (React 19 + Vite + TailwindCSS v4): Single-page application with Zustand state management, `localStorage`-persisted state, undo/redo history buffer. Decimal.js handles all financial arithmetic to prevent floating-point subtotal errors.
- **Backend** (Express + TypeScript): Serves the Vite SPA and manages AI and auth endpoints. Dual-strategy auth: JWT tokens (web users) and API Key headers (`X-API-Key`) for CLI/automated integrations. Three core endpoints: `POST /api/v1/generate-invoice`, `POST /api/v1/audio-to-invoice`, `POST /api/v1/rewrite`.
- **Local AI Engine**:
  - *Ollama Instance*: Runs `qwen3:8b` locally via a systemd background service on port 11434. OpenAI SDK-compatible adapter eliminates vendor lock-in.
  - *STT Sidecar*: Python Flask microservice on port 5050 wrapping `faster-whisper` (`large-v3-turbo`, `int8` quantized) for local voice transcription in 100+ languages.

## Constraints & Trade-offs

- **Cloud → local AI migration**: The original Gemini 2.5 Flash backend is being replaced by Ollama. The trade-off is higher hardware requirements (local model RAM footprint) for zero per-call API cost and full PII isolation.
- **Decimal.js for financial math**: JavaScript's native `Number` type cannot represent financial values accurately (e.g. `0.1 + 0.2 ≠ 0.3`). Decimal.js is used throughout the pricing pipeline — non-negotiable for a billing tool.
- **Offline-first STT**: `faster-whisper` runs on CPU only (`int8` mode). Transcription speed is acceptable for dictation but not suitable for real-time streaming ASR.
- **Dual auth strategies**: JWT for browser sessions; API keys for automation. Two codepaths to maintain, but necessary for the CLI integration use case.

## Implementation Evidence

- React 19 SPA with Zustand store, `localStorage` persistence, and undo/redo buffer.
- Decimal.js integrated at every pricing calculation point (subtotal, tax, discount, total).
- Express dual-auth middleware: JWT verification and API key lookup on the same route.
- Ollama adapter implementing OpenAI SDK `chat.completions.create` interface.
- Flask STT sidecar (`faster-whisper`, `large-v3-turbo`, `int8`) accepting audio blobs and returning transcripts.

## Current State

Active development. Core invoicing, JWT auth, and generate-invoice endpoint functional. Local AI migration in progress — Ollama adapter built, voice endpoint (`audio-to-invoice`) integrated with local STT sidecar.

## Decisions

See the complete list of system designs and code changes in [[invoice-studio-decisions|AI Invoice Studio Decision Log]].

