---
title: AI Invoice Studio
type: project
status: active
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

AI Invoice Studio is an enterprise-grade, billing and invoicing platform equipped with AI-powered features like speech-to-invoice dictation, natural-language invoice generation, compliance auditing, and intelligent notes rewriting.

Originally built on Google Gemini 2.5 Flash, the project is migrating to local, offline-first AI processing to reduce costs, enhance PII data privacy, support offline usage, and enable fine-tuning.

## System Architecture

### Frontend (React SPA)
The client is a single page application built on React 19, Vite, and TailwindCSS v4. It uses Zod configuration schemas and holds state utilizing the **Zustand** store with `localStorage` persistent storage and a history buffer to enable undo/redo operations. All financial math is protected by **Decimal.js** to handle subtotal, tax, discount, and total pricing calculations accurately.

### Backend (Express Server)
The backend is an Express server running TypeScript. It serves the Vite frontend and manages the AI generation and authentication endpoints. It implements a dual-strategy authentication layer using manual JWT tokens (for web users) and custom API Keys (`X-API-Key` headers) for CLI/automated deployments.

### Local AI Engine
1. **Ollama Instance**: Runs local LLMs (specifically `qwen3:8b` via a systemd background service on port 11434) using an OpenAI SDK-compatible adapter.
2. **Speech-to-Text (STT) Sidecar**: A Python Flask microservice (port 5050) wrapping **faster-whisper** (`large-v3-turbo` model, quantized to running in `int8` mode) executing on the Intel CPU to transcribe voice dictation in English and over 100 other languages.

## API Contracts (Unchanged)
The frontend relies on 3 endpoints:
- `POST /api/v1/generate-invoice` — maps prompt terms into a structured invoice JSON schema.
- `POST /api/v1/audio-to-invoice` — accepts raw recorded audio files, runs local STT, and maps resulting transcripts to invoice JSON.
- `POST /api/v1/rewrite` — rewrites custom invoice notes into professional business copy.

## Historical Decisions & Pivots
See the complete list of system designs and code changes in [[invoice-studio-decisions|AI Invoice Studio Decision Log]].
