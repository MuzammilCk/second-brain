---
title: HealthSync
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/healthsync
last_verified: 2026-08-03
stack: React, Vite, Tailwind CSS, Express, Node.js, MongoDB, Socket.IO, Stripe, OpenRouter
sources:
  - mirror/project-sync/HealthCare-main/README.md
related: []
created: 2026-08-03
last-updated: 2026-08-03
---

# HealthSync

Full-stack healthcare management platform connecting patients, doctors, pharmacists, and administrators on a unified system. Automates patient care from AI-assisted symptom triage and appointment scheduling through to digital e-prescriptions, pharmacy inventory management, and billing. Includes a seeded database of 140 real doctors across five specialties spanning all 14 districts of Kerala, India.

## Problem

Healthcare workflows across patients, doctors, and pharmacists are typically siloed into separate systems: one for booking, one for prescriptions, one for inventory. Patients must navigate fragmented portals. Doctors lack visibility into pharmacy fulfillment. Administrators have no unified audit view. Building a single platform with role-scoped access and real-time queue updates eliminates these coordination gaps.

## Architecture

A React SPA frontend communicating with a Node.js/Express backend:

- **Patient Portal**: Specialty-based doctor lookup, live calendar slot booking, Stripe payment checkout, diagnostic history timeline.
- **Doctor Portal**: Queue management dashboard (accept, reject, reschedule, mark-missed), digital prescription pad, patient history viewer, KYC onboarding file uploader.
- **Pharmacist Portal**: Low-stock medicine alert queue, prescription fulfillment workflow, inventory level adjustments.
- **Admin Console**: Doctor KYC verification, platform-wide metrics dashboard, AI triage event audit log.
- **Real-Time Layer**: Socket.IO broadcasts calendar updates, reschedule notifications, and queue state changes to connected clients instantly.
- **AI Symptom Checker**: Pre-consultation triage via OpenRouter-hosted LLMs. Results are logged safely and surfaced to doctors in the patient history.
- **Auth**: JWT-secured sessions stored in `httpOnly` cookies with individual resource-ownership verification per route.

## Constraints & Trade-offs

- **Dual payment mode**: Stripe test checkout coexists with a local mock payment gateway for offline-first testing. Production requires a live Stripe merchant account.
- **OpenRouter dependency**: The AI triage uses OpenRouter-hosted LLMs (no local model). This adds network latency to the triage step but requires zero GPU hardware.
- **No prescription digital signature**: E-prescriptions are digital but not cryptographically signed. A PKI-backed prescription signing system would be required for regulatory compliance in production.
- **Kerala-specific seed data**: The 140-doctor seed dataset is Kerala-specific. Expanding geographically requires re-seeding.

## Implementation Evidence

- Four role-scoped portal layouts with JWT-secured, resource-ownership-verified API routes.
- Socket.IO real-time broadcasting for appointment queue state changes.
- Stripe checkout integration (test mode) + local mock payment gateway.
- OpenRouter LLM integration for pre-consultation symptom triage with structured output logging.
- Digital prescription pad with patient-history association.
- KYC file uploader with admin review queue.
- Seeded MongoDB with 140 doctors across 5 specialties, 14 Kerala districts.

## Current State

Active development. All four portals functional. Real-time queue updates, Stripe checkout, and AI triage operational. Production deployment pending Stripe live-mode activation and KYC workflow sign-off.

## Decisions

See the complete list of system designs and code changes in [[healthsync-decisions|HealthSync Decision Log]].


