# Zero-Trust Multiagent ESG Audit System - Decision Log

Chronological log of design decisions and architectural trade-offs.

## 2026-03-15 — Selecting LangGraph for Orchestrating State Loops
**Context:** Auditing ESG supply chains requires a strictly reviewable, non-hallucinated progression of steps (provenance -> PII masking -> RAG compilation -> audit analysis -> human approval). 
**Decision:** Selected LangGraph over CrewAI for core multiagent orchestration.
**Alternatives considered:** 
- CrewAI / AutoGen: Rejected because conversational agents drift and make routing decisions non-deterministic.
- Custom state machines: Rejected because they lack native step-by-step checkpointing, pausing, and resuming for human-in-the-loop workflows.
**Status:** active

## 2026-03-20 — Qdrant Select for Data Residency Compliance
**Context:** Multinational corporate audits involve sensitive supplier records subject to regulatory data residency mandates (e.g., GDPR in the EU).
**Decision:** Selected Qdrant over Pinecone as the target vector database for standard retriever workflows.
**Alternatives considered:** Pinecone (rejected as it is a SaaS-only engine that forces data outbound to third-party hosts).
**Rationale:** Qdrant is open-source, Rust-based, and can be containerized on private Kubernetes networks, ensuring data residency is preserved.
**Status:** active

## 2026-03-25 — Type-Safe Structured Finding Output Via Function Calling
**Context:** Compliance audit findings must be programmatically processed to update dashboard statistics, trigger alerts, and populate templates.
**Decision:** Implemented GPT-4 function calling to enforce strict Pydantic models on outputs.
**Alternatives considered:** Free-form text parsing using regular expressions (rejected due to high rate of formatting drift in LLM output).
**Status:** active
