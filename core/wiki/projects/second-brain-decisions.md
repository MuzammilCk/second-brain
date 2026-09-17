# Codex Second Brain Decision Log

Decision journal and architectural audit trail for the Codex Second Brain & Autonomous Developer Vault project.

## 2026-08-03 — DR-01: Four-Tier Security Classification Architecture
**Context:** Need a strict information boundary between private job placement notes, confidential engineering case studies, and public static portfolio files.
**Decision:** Established a 4-tier directional security architecture enforced by CI verification scripts (`verify_boundaries.py`) and pre-tool-use agent hooks.
**Alternatives considered:** Single flat wiki or monorepo without access boundaries (rejected due to high risk of leaking private keys and candidate profiles).
**Status:** active

## 2026-09-17 — DR-02: Dual-Plane Project Tracker & Zero-Mirroring GitHub Telemetry
**Context:** Project tracking was static and out of sync with active GitHub work across 34 repositories.
**Decision:** Upgraded project pages to an agile tracking schema and implemented a zero-mirroring GitHub telemetry sync script (`scripts/sync_github_tracker.py`) reading via authenticated `gh api`.
**Alternatives considered:** Local git mirroring (rejected by AGENTS.md Zero Git Mirroring policy).
**Status:** active
