---
title: HealthSync
type: project
status: active
stack: React, Vite, Tailwind CSS, Express, Node.js, MongoDB, Socket.IO, Stripe, OpenRouter
sources:
  - mirror/project-sync/HealthCare-main/README.md
related: []
created: 2026-08-03
last-updated: 2026-08-03
---

# HealthSync

HealthSync is a full-stack healthcare management platform connecting patients, doctors, pharmacists, and administrators on a unified system. It automates patient care from initial scheduling and AI-assisted symptom triage to digital e-prescriptions, pharmacy inventory monitoring, and billing.

The project includes a seeded database containing 140 real doctors spanning five specialties across all 14 districts of Kerala, India.

## Key Modules
- **Patient Portal**: Specialization-based doctor lookup, live booking calendar slot generation, payment checkout, and diagnostic history timeline.
- **Doctor Portal**: Queue management dashboard (accept, reject, reschedule, mark-missed), digital prescription pad, patient history portal, and KYC onboarding file uploader.
- **Pharmacist Portal**: Low-stock medicine alerts, prescription fulfillment queue, and inventory level adjustments.
- **Admin Console**: Dashboard to verify doctor KYC submissions, oversee platform metrics, and audit system-wide AI triage events.

## Key Technical Integrations
- **AI Symptom Checker**: Integrates OpenRouter-hosted LLMs to perform pre-consultation symptom triage and log data safely.
- **Payments Gateway**: Integrated Stripe test checkout alongside a simulated local mock payment gateway for offline-first testing.
- **Real-Time Client Updates**: Uses Socket.IO to broadcast calendar updates, reschedule notifications, and queue shifts.
- **Structured Access Control**: Implements JWT-secured express sessions stored in httpOnly cookies, paired with individual resource-ownership verification.

## Historical Decisions & Pivots
See the complete list of system designs and code changes in [[healthsync-decisions|HealthSync Decision Log]].

