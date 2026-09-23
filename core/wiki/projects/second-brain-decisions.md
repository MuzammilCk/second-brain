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

## 2026-09-18 — DR-03: Close the repo_reference / boundary-enforcement gap found in review
**Context:** A review of the live repo found the ytclfr/theytclfr flagship link problem was one instance of a broader pattern -- `verify_repo_reference_integrity.py` found the same class of mismatch on invoice-studio, masm-studio, and repomind, three more flagship-tier pages, and confirmed 3 of those old repo_reference URLs (MasM8086, hadi-perfumes, healthsync) are dead links (HTTP 404) rather than just stale. Separately, the real-time boundary hook was still the diagnostic no-op stub on both Antigravity and Claude Code.
**Decision:** Added `scripts/verify_repo_reference_integrity.py` and `scripts/check_skill_parity.py` to the CI verify step; added a shared `boundary_policy.py` used by both a completed Claude Code hook wiring and a new Antigravity PreToolUse hook; added Flagship Tier Criteria to `rules/projects.md`. Reconciled canonical repo references across all four flagship projects.
**Alternatives considered:** Auto-correcting repo_reference values directly instead of flagging them for manual confirmation -- rejected, since two repos sharing a matched slug aren't guaranteed to be the same project and a wrong auto-correction would be worse than the current staleness.
**Status:** active
