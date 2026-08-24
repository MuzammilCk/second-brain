---
title: AssetFlow
type: project
status: shipped
stack: React, Tailwind CSS, Node.js, Express, Supabase, Prisma, Recharts
sources:
  - mirror/project-sync/Odoo-hackthon/README.md
related:
  - "[[wiki/placements/odoo-hackathon]]"
created: 2026-08-03
last-updated: 2026-08-03
---

# AssetFlow

AssetFlow is an enterprise-grade ERP-style workflow system for organizations managing physical resources, departments, and equipment maintenance. Built specifically within a tight 8-hour sprint for the **Odoo Hackathon 2026**, AssetFlow focuses on resolving operational bottlenecks such as booking conflicts, overlap rejections, and equipment maintenance tracking.

The project helped Muzammil CK qualify as a finalist in the Odoo recruitment assessments.

## Key Features
- **Role-Based Workflows**: Tailored dashboard screens and authorization scopes for `Admin`, `Asset Manager`, `Department Head`, and `Employee`.
- **Double-Allocation Prevention**: Algorithms preventing secondary allocations of already booked physical assets.
- **Resource Calendar Booking**: Visual scheduler with built-in query checks to reject overlapping slots.
- **Maintenance Kanban Board**: A 6-stage request tracking flow: `Pending` → `Approved` → `Technician Assigned` → `In Progress` → `Resolved`.
- **Audit Cycles**: Structured schedules for asset inventory review, variance logging, and discrepancy management.
- **Analytics Dashboard**: Aggregates utilization statistics, heatmaps, and system logs using Recharts.

## System Stack & Database Config
- Monorepo containing a React SPA frontend and a Node.js Express API.
- PostgreSQL database hosted on Supabase, managed via Prisma ORM schemas.
- Custom JWT auth session verification.

## Historical Decisions & Pivots
See the complete list of system designs and code changes in [[assetflow-decisions|AssetFlow Decision Log]].

