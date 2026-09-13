---
title: Odoo Hackathon 2026 Grand Finale
type: project
status: active
export: "true"
last_verified: 2026-09-06
stack: Odoo 17 (Python/OWL), PostgreSQL
sources:
  - wiki/placements/odoo-hackathon.md
  - wiki/placements/companies/odoo.md
related:
  - "[[assetflow|AssetFlow]]"
  - "[[odoo-hackathon|Odoo Hackathon Placement]]"
created: 2026-08-25
last-updated: 2026-09-06
---

# Odoo Hackathon 2026 Grand Finale

Team 583's participation in the Odoo Hackathon 2026 Grand Finale — a 24-hour in-person coding competition at Odoo India Pvt Ltd, Gandhinagar, used as Odoo's primary Software Engineer recruitment pipeline.

## Problem

Building a complete, working Odoo native module within a 24-hour competition window, with a problem statement revealed only at coding start, under full evaluator observation. The challenge is not just technical — it is scope discipline, demo prioritization, and execution under pressure. Evaluators score running, deployable code over feature completeness.

## Architecture

An Odoo 17 native module with:

- **Backend**: Python model definitions (`models/`) extending Odoo's ORM. Business logic in service methods following Odoo's `@api.model` and `@api.depends` compute patterns.
- **Frontend**: OWL (Odoo Web Library) components — Odoo's native reactive frontend framework. No external JavaScript frameworks.
- **Database**: PostgreSQL managed entirely through Odoo's ORM. No raw SQL.
- **Integration constraints**: All features must be Odoo-native. Third-party Python libraries are permitted but external APIs are avoided to reduce deployment risk during the competition.

Prior entry: AssetFlow (preliminary round) — a conflict-prevention physical asset tracker. Its architecture and decisions inform the Grand Finale strategy.

## Constraints & Trade-offs

- **24-hour build window**: Feature scope is cut aggressively at coding start. A working demo of 3 core features outscores a 10-feature prototype with bugs.
- **Odoo-native constraint**: All solutions must be Odoo module–based. This eliminates microservice architectures, standalone Flask/FastAPI services, and non-Odoo frontends.
- **GitHub collaborator deadline**: The evaluator must be added as a GitHub collaborator within 1 hour of coding start (11:00 AM hard disqualifier). Missing this means disqualification.
- **Problem domain uncertainty**: The problem statement is revealed at 10:00 AM on 5 Sep 2026. Architecture decisions must be made in the first 30 minutes.

## Implementation Evidence

- Team 583 qualified to the Grand Finale through the AssetFlow preliminary submission.
- Preliminary module (AssetFlow) demonstrated: role-based access, conflict-prevention booking, maintenance Kanban, and analytics dashboards — all in Odoo 17 native stack.
- Grand Finale module: development in progress (coding window: 5–6 Sep 2026).

## Current State

Active. The Grand Finale coding window runs 5 Sep 2026 10:00 AM – 6 Sep 2026 10:00 AM. Presentations on 6 Sep 2026 at 1:00 PM. Result and feedback to be recorded post-event.

## Decisions

See the complete list of strategy and technical decisions in [[odoo-hackathon-decisions|Odoo Hackathon Decision Log]].

