---
title: Hadi Perfumes
type: project
status: active
stack: NestJS, TypeScript, PostgreSQL, TypeORM, BullMQ, Redis, Stripe, SQLite
sources:
  - mirror/project-sync/hadi/context.md
  - mirror/project-sync/hadi/diff.md
  - mirror/project-sync/hadi/CLAUDE.md
related:
  - wiki/people/muzammil-ck.md
created: 2026-03-27
last-updated: 2026-08-03
---

# Hadi Perfumes Backend

Hadi Perfumes is a production-grade, FTC-compliant, MLM-enabled eCommerce application backend. Operating on a NestJS modular monolithic architecture, the system is designed to allow participants to refer members and earn commission payments purely based on verified retail sales transactions.

Originally designed with a peer-to-peer (P2P) marketplace, it was architecturally pivoted in Phase 4 to constrain all catalog item creation exclusively to the company administrator account (single-vendor configuration).

## System Architecture

### Modularity
The codebase is structured inside NestJS module compartments to facilitate later microservice extraction. It tracks database modifications using versioned TypeORM migrations.

### Core Pipelines
1. **Rules Engine**: Model-based, deterministic rules database tables (`CompensationPolicyVersion`, `CommissionRule`, `RankRule`, and `ComplianceDisclosure`) that calculate upline commissions without hardcoding math inside service functions.
2. **Onboarding & Referrals**: SMS/OTP mobile verification flow, strict coupon-code referral tracking, and graph invariants preventing loop or self-reference exploits.
3. **Materialized Path Graph**: Materialized path maps (`network_nodes.upline_path`) maintaining linear parent-child paths, resolving ancestral lookups in O(1) database queries.
4. **Volume Ledger & Checkout**: Idempotent orders processor, atomic database stock reservation logic with 15-minute TTL constraints, and custom database events auditing.

## Historical Decisions & Pivots
See the complete list of system designs and code changes in [[hadi-decisions|Hadi Perfumes Decision Log]].
