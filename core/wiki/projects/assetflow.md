---
id: "assetflow"
title: AssetFlow
type: project
status: shipped
export: "true"
repo_reference: https://github.com/MuzammilCk/Odoo-hackthon
last_verified: 2026-08-03
stack: React, Tailwind CSS, Node.js, Express, Supabase, Prisma, Recharts
sources:
  - mirror/project-sync/Odoo-hackthon/README.md
related: []
created: 2026-08-03
last-updated: 2026-08-03
---

# AssetFlow

Enterprise-grade ERP-style physical asset management system built in an 8-hour sprint for the Odoo Hackathon 2026 preliminary round. The project qualified Muzammil CK as a Grand Finale finalist in Odoo's primary software engineering recruitment pipeline.

## Problem

Organizations managing shared physical assets (equipment, rooms, vehicles) face booking conflicts and double-allocations with no automated enforcement. Manual coordination creates operational downtime, untracked maintenance backlogs, and audit gaps. The Odoo Hackathon 2026 required a fully working prototype solving a real business workflow within 8 hours.

## Architecture

A monorepo containing two services:

- **Frontend**: React SPA with Tailwind CSS. Role-based dashboard routing for four actor types: `Admin`, `Asset Manager`, `Department Head`, `Employee`. Recharts-powered analytics dashboard with utilization heatmaps.
- **Backend**: Node.js/Express REST API. Prisma ORM managing PostgreSQL on Supabase. Custom JWT auth with `httpOnly` cookies.
- **Double-Allocation Engine**: Before confirming any booking, the API performs an overlap intersection query against existing confirmed slots for the same asset. Conflicting requests are rejected with a structured error payload.
- **Maintenance Kanban**: Six-stage state machine (`Pending → Approved → Technician Assigned → In Progress → Resolved → Closed`) tracked in the database with audit timestamps.

## Constraints & Trade-offs

- **8-hour build constraint**: Scope was ruthlessly cut. Advanced features (approval workflow emails, calendar sync) were deprioritized in favor of a working demo with correct conflict prevention.
- **Supabase as hosting**: Chosen for zero-config PostgreSQL provisioning under time pressure. A self-hosted Postgres instance would be preferred for production.
- **No real-time updates**: WebSocket or SSE for live booking conflict notifications was cut from scope. The UI refreshes on demand.

## Implementation Evidence

- Four role-scoped dashboard layouts with resource-specific access guards.
- Double-allocation prevention: overlap query logic in the booking service with conflict rejection.
- Maintenance Kanban with 6-stage state machine and audit log timestamps.
- Audit cycle scheduler for periodic asset inventory review.
- Recharts analytics dashboard: utilization rates, conflict rates, maintenance backlog counts.

## Current State

Shipped. Submitted as the Odoo Hackathon 2026 preliminary round entry. No active development. Codebase archived as a competition artefact.

## Decisions

See the complete list of system designs and code changes in [[assetflow-decisions|AssetFlow Decision Log]].

