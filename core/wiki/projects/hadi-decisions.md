# Hadi Perfumes Decision Log

Decision journal and architectural audit trail for the Hadi Perfumes project.

## 2026-03-27 — DR-HADI-01: Immutable Metadata-Based Rules Engine
**Context:** Multi-level marketing (MLM) math changes frequently. Hardcoding commission splits or levels directly inside the codebase would lead to continuous refactoring, redeploys, and audit gaps.
**Decision:** Constructed a database-driven, versioned, immutable rules schema comprising `CompensationPolicyVersion`, `CommissionRule`, `RankRule`, and `RuleAuditLog` tables. The codebase queries these rules dynamically during calculations.
**Alternatives considered:** JSON configuration files (rejected; lacks audit trails and database referential integrity); hardcoding plan coefficients (rejected).
**Status:** active

## 2026-03-27 — DR-HADI-02: SQLite Testing Dialect Utility
**Context:** Integration tests run on an in-memory SQLite database, which does not support PostgreSQL-native types like `timestamptz`, `jsonb`, and `inet`, causing tests to crash with `DataTypeNotSupportedError`.
**Decision:** Created a conditional typing mapper `db-type.util.ts` (`tstz()`, `enumType()`, etc.) that returns PostgreSQL decorators in production, but falls back to SQLite-compatible equivalents (like text fields or simple JSON) in testing environments.
**Alternatives considered:** Running PostgreSQL in Docker containers for tests (rejected due to speed constraints in in-memory test setups).
**Status:** active

## 2026-03-28 — DR-HADI-03: Materialized Path Graph Optimization
**Context:** Recursive queries traversing active MLM downlines or uplines are highly expensive, causing standard Postgres databases to freeze under deep parent-child lookups.
**Decision:** Implemented a materialized path strategy (`network_nodes.upline_path`) storing parent chains as strings. This enables ancestral lookups in O(1) read operations.
**Alternatives considered:** Adjacency tables alone (rejected; recursive CTEs degrade quickly at depth); nested sets (rejected; expensive re-indexing during downline insertions).
**Status:** active

## 2026-04-01 — DR-HADI-04: Single-Vendor Catalog Architecture Pivot
**Context:** P2P marketplace features (allowing any user to create a store and receive payout splits) introduce extreme regulatory risk (FTC retail definitions, KYC compliance liability) and payment complexity.
**Decision:** Pivoted the app to an admin-owned single-vendor catalog. Restrained listing creation routes solely to admin keys, and simplified the checkout pipeline to route 100% of revenue to the company's Stripe account (no vendor splits needed).
**Alternatives considered:** Sticking with the P2P marketplace and implementing Stripe Connect Custom accounts (rejected due to compliance overhead and development complexity).
**Status:** active

## 2026-04-01 — DR-HADI-05: Atomic Inventory Concurrency Guards
**Context:** Under high traffic, concurrent order checkout attempts can lead to double-selling (overselling) inventory when using read-modify-write patterns.
**Decision:** Implemented atomic database updates (`UPDATE inventory_items SET available_qty = available_qty - X WHERE available_qty >= X`) combined with a 15-minute checkout reservation TTL.
**Alternatives considered:** Redis distributed locks (rejected; adds infrastructure complexity and overhead); database row-level locking (`SELECT FOR UPDATE`) - rejected due to deadlock risks during busy carts.
**Status:** active
