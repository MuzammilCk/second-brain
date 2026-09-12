# AssetFlow - Decision Log

Chronological track of design, optimization, and sprint decisions during the Odoo Hackathon.

## 2026-08-03 — Relational Integrity Over Custom Code for Allocation Guarding
**Context:** During the 8-hour hackathon, we needed to guarantee that a physical asset could not be allocated to two departments simultaneously or booked with overlapping timeframes without writing huge chunks of nested JS checking code.
**Decision:** Handled conflict constraints directly in PostgreSQL transactions using Prisma schemas:
1. Implemented uniqueness constraints linking asset status and active allocation.
2. Formulated Postgres query queries checking `(start_time, end_time) OVERLAPS` directly at the DB connection layer, returning structured errors on overlap and rejecting the booking transaction.
**Alternatives considered:** Custom JS validation arrays (rejected due to race condition bugs during concurrent requests).
**Status:** active
