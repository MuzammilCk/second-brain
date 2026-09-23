---
id: "hadi"
title: Hadi Perfumes
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/hadi
last_verified: 2026-09-21
stack: NestJS, TypeScript, PostgreSQL, TypeORM, BullMQ, Redis, Stripe, SQLite
sources:
  - mirror/project-sync/hadi/context.md
  - mirror/project-sync/hadi/diff.md
  - mirror/project-sync/hadi/CLAUDE.md
related: []
created: 2026-03-27
last-updated: 2026-08-03
tier: client
health: on-track
visibility: public
current_milestone: "Modular monolithic MLM checkout engine"
next_action: "Enforce strict catalog concurrency guards in checkout pipeline"
---

# Hadi Perfumes Backend

Production-grade, FTC-compliant, MLM-enabled eCommerce backend. Built on NestJS modular monolithic architecture — participants earn commissions based on verified retail sales, not recruitment volume, satisfying FTC pyramid-scheme safe harbor requirements.

## Problem

MLM systems are legally hazardous when compensation derives from recruitment rather than retail sales. Building a compliant system requires a rules engine enforcing retail-sales-first commission calculation, a fraud-resistant referral graph (loop-free, self-reference-free), and a full audit trail per commission event. Existing open-source eCommerce platforms provide none of these constraints natively.

## Architecture

NestJS modular monolith designed for future microservice extraction:

- **Rules Engine**: Commission logic lives in versioned database tables (`CompensationPolicyVersion`, `CommissionRule`, `RankRule`, `ComplianceDisclosure`) — not hardcoded in service functions. Policy changes are auditable without code deploys.
- **Referral Graph**: Materialized Path pattern in `network_nodes.upline_path`. Resolves ancestral lookups in O(1). Loop and self-reference invariants enforced at insert time.
- **Onboarding**: SMS/OTP mobile verification, strict coupon-code referral tracking, graph invariant enforcement.
- **Volume Ledger & Checkout**: Idempotent order processor with `SELECT FOR UPDATE` atomic stock reservation, 15-minute TTL, and custom database event audit triggers.
- **Queue Layer**: BullMQ on Redis for async commission calculation jobs triggered on order fulfillment.
- **Module boundaries**: Users, Products, Orders, Network, Commissions, Compliance, Auth — each independently testable and extraction-ready.

## Constraints & Trade-offs

- **FTC compliance**: All commission calculations must trace to verified retail sales. The rules engine enforces this at database level.
- **Materialized Path vs. Adjacency List**: Adjacency list requires recursive CTEs for ancestor lookup. Materialized path trades write complexity for O(1) reads on a frequently-queried hierarchy — correct choice given commission rollup query frequency.
- **Monolith-first**: Module compartmentalization is deliberate — designed for microservice extraction, but the monolith keeps operational complexity low during initial build.
- **Stripe in test mode**: Integration complete; production payment processing requires merchant account verification.

## Implementation Evidence

- NestJS module structure with clearly partitioned domains.
- `CompensationPolicyVersion` table with versioned `CommissionRule` and `RankRule` rows.
- Materialized path network graph with loop-prevention insert invariant.
- Idempotent checkout: `SELECT FOR UPDATE` lock, 15-minute TTL, atomic stock deduction on confirm.
- BullMQ commission job queue triggered on order-fulfilled events.
- TypeORM migration history covering all schema changes.

## Current State

Active development. Core pipelines (onboarding, referral graph, checkout, commission engine) functional. Stripe test-mode integration complete. Frontend not yet scoped — backend API is current focus.

## Decisions

See the complete list of system designs and code changes in [[hadi-decisions|Hadi Perfumes Decision Log]].



