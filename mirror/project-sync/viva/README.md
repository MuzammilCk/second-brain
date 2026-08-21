---
source: project-sync
project: viva
original-path: D:\projects\viva\README.md
synced: 2026-08-03
---

# Viva Business Team — Website Architecture

This is the full architecture package for your dad's business site — everything Antigravity (or any AI coding agent) needs to build it without guessing at facts, colors, or structure. Nothing in here is code yet, by design — this is the "no hallucination" foundation you asked for.

## The concept, in one paragraph

The site is built around **The Signal Chain** — the idea that a website for an audio business should structurally borrow from how sound actually moves through real equipment (source → amplification → tuning → output), instead of looking like a generic template with 3D decoration bolted on. That shows up as a homepage narrative in that exact order, a UI language ("The Console") made of knobs/faders/VU-meters as real functional controls, and a 3D speaker in the hero that idles with a subtle breathing pulse and can be clicked to preview a sound. Full reasoning in `docs/01-brand-and-design-philosophy.md`.

## How to hand this off

Give Antigravity this entire `viva-website/` folder and point it at `CLAUDE.md` first — that's the operating brief with the non-negotiable rules (design tokens, no invented content, accessibility requirements, locked stack). Everything else is referenced from there in the right reading order.

## What's in here

```
viva-website/
├── README.md                  ← you are here
├── CLAUDE.md                  ← agent reads this FIRST
├── AGENTS.md                  ← thin redirect to CLAUDE.md, for tools (e.g. Kimi Code) that look for this filename by convention
├── context.md                 ← live build-state tracker + phase checklist, seeded and ready
├── diff.md                    ← append-only change log, one entry per session
├── decisions.md               ← every architecture/creative call + rationale, ADR-style
├── roadmap.md                 ← phased build order
└── docs/
    ├── 00-project-overview.md
    ├── 01-brand-and-design-philosophy.md
    ├── 02-design-system.md              ← colors are WCAG-verified via script, not eyeballed
    ├── 03-tech-stack-and-architecture.md
    ├── 04-sitemap-and-user-journeys.md
    ├── 05-component-library.md
    ├── 06-3d-motion-interaction-spec.md ← how the 3D hero actually gets built, from primitives
    ├── 07-content-model-and-schema.md
    ├── 08-seo-and-local-discovery.md
    ├── 09-responsive-performance-accessibility.md
    ├── 10-deployment-content-workflow.md
    ├── 11-content-collection-checklist.md  ← the actual to-do list for you and dad
    └── pages/
        ├── 01-home.md
        ├── 02-services-hub.md
        ├── 03-service-detail-template.md
        ├── 04-catalog.md
        ├── 05-product-detail-template.md
        ├── 06-gallery-portfolio.md
        ├── 07-about.md
        ├── 08-testimonials-reviews.md
        ├── 09-contact-and-booking.md
        └── 10-faq.md
```

## What still needs your (and dad's) input

This is the honest part — the architecture is complete, but a website for a real business needs real facts, and I don't have them:

- **Photos.** This is the highest-leverage item on the whole list — `docs/11-content-collection-checklist.md` has the full shot list, but the short version: workshop/fabrication-in-progress shots and finished install photos are what actually sell this business. Aim for 12–15 real project photos before launch.
- **Business facts** — phone, WhatsApp number, exact address, hours, confirmed service list (I assumed 6 services based on your message; two of them — event/PA rental and sound tuning/calibration — need a yes/no from dad).
- **Real testimonials, with permission** — the site is deliberately built to never fabricate these (see ADR-008 in `decisions.md`). A few real ones beat a padded fake-looking set.
- **Tagline and naming call** — three tagline directions are proposed in `01-brand-and-design-philosophy.md`, but that's genuinely dad's decision, not mine.

None of this blocks starting the build — Phase 1 in `roadmap.md` builds every page with clearly marked placeholders, and Phase 3 swaps in the real content once it's gathered. Content collection and development can run in parallel.

## Next step

Start Phase 0 in `roadmap.md` with Antigravity, and begin working through `docs/11-content-collection-checklist.md` alongside it.
