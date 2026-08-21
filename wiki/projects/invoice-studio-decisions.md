# AI Invoice Studio Decision Log

Decision journal and architectural audit trail for the AI Invoice Studio project.

## 2026-06-10 — DR-INV-01: Local AI Migration via Ollama and faster-whisper
**Context:** Running Google Gemini 2.5 Flash cloud API resulted in continuous per-token runtime costs, privacy concerns relating to PII in invoices, internet dependence, and credential risk from managing keys.
**Decision:** Replaced `@google/genai` dependency with `openai` SDK to direct prompts locally to Ollama running `qwen3:8b` (port 11434). Speech-to-text is routed to a Python Flask sidecar running `faster-whisper` (`large-v3-turbo` in INT8) on port 5050.
**Alternatives considered:** Using local llama.cpp bindings (rejected to stay clean without native compilation dependencies on Windows); cloud API alternatives like Groq or Together (rejected to preserve full offline capability).
**Status:** active

## 2026-06-15 — DR-INV-02: Structured Output Schema Conversion
**Context:** Local Ollama requires OpenAI-compatible JSON Schema representations for structured extraction, whereas previous definitions used the Google-specific `Type.OBJECT` schema shapes.
**Decision:** Converted the shared `invoiceSchema` to standard JSON Schema format and updated `/generate-invoice` and `/audio-to-invoice` controllers to send `response_format` JSON schema descriptors compatible with the OpenAI API protocol.
**Alternatives considered:** Relying on raw text outputs and parsing JSON manually with regex (rejected due to instability and risk of parsing errors).
**Status:** active

## 2026-06-20 — DR-INV-03: Dual-Strategy Authentication Flow
**Context:** Self-hosted and CLI integrations require headless scripting access, whereas standard web clients require temporary token-based credentials.
**Decision:** Structured a dual-auth middleware `requireAuth()` allowing credentials validated via JWT Bearer headers (with access token rotation) OR secret headers (`X-API-Key` matched against `API_SECRET` environment strings).
**Alternatives considered:** Enforcing API keys for everyone (too complex for standard users); enforcing JWT (not friendly to scripting/CLI consumers).
**Status:** active

## 2026-06-25 — DR-INV-04: Decimal.js Migration for Financial Integrity
**Context:** Standard JavaScript IEEE-754 double-precision floats introduce rounding errors during subtotal, tax, discount, and total equations, which is unacceptable for billing compliance.
**Decision:** Migrated all calculations in `src/lib/calculations.ts` and `src/lib/utils.ts` to `Decimal.js` internals, forcing total amounts to remain precise decimal strings.
**Alternatives considered:** Handling integers (converting all amounts to cents) - rejected because currency rates and fractional tax percentages can still introduce precision anomalies.
**Status:** active
