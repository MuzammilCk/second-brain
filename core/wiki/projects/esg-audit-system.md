---
title: Zero-Trust Multiagent ESG Audit System
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/esg-audit-system
last_verified: 2026-08-03
stack: LangGraph, Qdrant, OpenAI, Microsoft Presidio, C2PA, AWS Nitro Enclaves, PyRIT, Kubernetes, Ray, FastAPI, Python
sources:
  - mirror/project-sync/esg-audit-system/README.md
related: []
created: 2026-08-03
last-updated: 2026-08-03
---

# Zero-Trust Multiagent ESG Audit System

Enterprise-grade AI engineering portfolio application automating ESG (Environmental, Social, Governance) compliance audits for multinational supply chains. Combines multiagent orchestration (LangGraph), confidential computing (AWS Nitro Enclaves), data provenance verification (C2PA), PII masking (Presidio), and adversarial robustness testing (PyRIT) in a single pipeline.

## Problem

ESG compliance auditing for multinational supply chains requires processing thousands of unstructured supplier documents against evolving regulatory frameworks (SEC climate rules, CSRD, CBAM). Manual audit processes are slow, inconsistent, and costly. Automating ESG audits with LLMs introduces new risks: hallucinated findings, tampered documentation, PII leakage to public APIs, and prompt injection attacks from adversarial suppliers.

## Architecture

A five-node LangGraph workflow:

1. **Data Retrieval Node**: Pulls relevant regulatory frameworks and supplier documents from Qdrant (hybrid dense/sparse vector retrieval).
2. **Provenance Verification Node**: Validates cryptographic C2PA signatures on supplier documents to detect AI-synthesized or tampered content.
3. **PII Masking Node**: Microsoft Presidio anonymizes personal identifiers before text reaches any public AI API. A local Redis mapping key allows de-anonymization for the final report only.
4. **Compliance Analysis Node**: GPT-4 evaluates document content against SEC, CSRD, and CBAM guidelines with structured output requirements.
5. **Reporting Node**: Compiles evidence-backed Markdown audit reports with citation trails.

**Security hardening**: LLM execution runs inside AWS Nitro Enclaves to isolate from host environment. PyRIT red-teaming campaigns detect prompt injection and database honeypots flag adversarial query patterns.

**Scale layer**: Kubernetes + Ray for distributed multi-supplier parallel processing.

## Constraints & Trade-offs

- **AWS Nitro Enclaves complexity**: Confidential computing adds significant operational overhead (attestation, sealed secrets, limited network surface). Justified for enterprise deployments handling genuinely sensitive supplier data.
- **C2PA dependency**: Provenance verification is only as strong as the original document signing. Documents not signed at creation time cannot be retroactively verified.
- **GPT-4 cost**: Compliance analysis at scale is expensive with GPT-4. The architecture is designed to swap in a fine-tuned open-source model once budget allows.
- **PII masking round-trip**: Presidio + Redis mapping adds latency per document. The mapping key must be protected — loss of the key makes de-anonymization impossible.

## Implementation Evidence

- LangGraph five-node workflow with conditional edge routing on provenance failure.
- Qdrant hybrid (dense + sparse) vector retrieval for regulatory framework lookup.
- C2PA signature verification on ingested supplier documents.
- Microsoft Presidio PII masking with Redis-backed de-anonymization mapping.
- AWS Nitro Enclave execution environment for GPT-4 compliance analysis.
- PyRIT red-teaming campaign detecting prompt injection in 3/5 adversarial test cases.
- Database honeypot triggers logging anomalous query patterns.

## Current State

Active development. Core LangGraph pipeline (retrieval → provenance → PII masking → analysis → reporting) functional in local development. Nitro Enclave and Kubernetes/Ray deployment configurations are infrastructure work-in-progress.

## Decisions

See the complete list of system designs and code changes in [[esg-audit-system-decisions|Zero-Trust Multiagent ESG Audit System Decision Log]].


