---
source: project-sync
project: viva
original-path: D:\projects\viva\context.md
synced: 2026-08-03
---

# context.md — Current Build State

**Project:** Viva Business Team Website ("Signal Chain")
**Purpose:** A live snapshot of where this project actually stands — phase, what's built, what's blocked. This describes the CURRENT state only. A history of what changed and when belongs in `diff.md`, not here — don't duplicate.

**How to use this file:**
- Update the "Current status" block at the end of every work session — don't let it go stale, the next session (yours or a human's) relies on this instead of re-deriving state from scratch
- Check an item here only when it clears the actual Definition of Done in `CLAUDE.md` (responsive + accessible + SEO-tagged + real-or-placeholder content correctly marked) — not just "code exists for it"
- Log anything blocking progress under "Open questions / blockers" rather than silently working around it or guessing
- If a blocker resolves into a real architectural decision, record the decision in `decisions.md` and just link to it from here

---

## Current status

- **Phase:** Not started — Phase 0 (Foundation) is next, see `roadmap.md`
- **Last updated:** `[[update on every session — date + one-line note on what happened]]`
- **Currently being worked on:** —

## Build checklist

### Phase 0 — Foundation
- [ ] Next.js (App Router) + TypeScript scaffold
- [ ] Design tokens implemented (Tailwind theme extension + CSS custom properties, from `docs/02-design-system.md`)
- [ ] `Header` / `Footer` / `FloatingWhatsAppButton`
- [ ] `/content` YAML structure seeded with placeholder data (`docs/07-content-model-and-schema.md`)

### Phase 1 — Core pages (`Hero2DFallback` in place of 3D for now)
- [ ] Home
- [ ] Services hub
- [ ] Service detail template (6 instances — see per-service matrix)
- [ ] Catalog
- [ ] Product detail template
- [ ] Gallery / portfolio
- [ ] About
- [ ] Testimonials
- [ ] Contact & booking (`BookingFormStepper` wired, WhatsApp deep link working)
- [ ] FAQ

### Phase 2 — Signature interactions
- [ ] `Speaker3DHero` built + `Hero2DFallback` path actually tested, not assumed
- [ ] `BeforeAfterSlider`
- [ ] `KnobFilter` / `ConsoleToggle` — accessible native control underneath, verified with keyboard alone
- [ ] `VUMeterLoader`
- [ ] `AudioWaveformDivider`
- [ ] Motion/microinteraction pass (button press, card tilt, page transitions)
- [ ] Full `prefers-reduced-motion` re-test across all of the above

### Phase 3 — Real content integration
- [ ] **Blocked** on `docs/11-content-collection-checklist.md` being filled in — do not start early, do not fill gaps with invented content in the meantime

### Phase 4 — SEO & analytics
- [ ] Schema.org JSON-LD (LocalBusiness, Service, Product, FAQPage, BreadcrumbList)
- [ ] Meta tags finalized per page
- [ ] GA4 + Google Search Console verified
- [ ] `sitemap.xml` / `robots.txt`

### Phase 5 — QA & launch
- [ ] Cross-browser/device pass (mobile Chrome/Safari, desktop Chrome minimum)
- [ ] Performance audit against `docs/09-responsive-performance-accessibility.md` budgets
- [ ] Full accessibility pass, reduced-motion and WebGL-fallback paths specifically included
- [ ] Soft launch, Google Business Profile connected

## Environment notes

`[[fill in as setup happens — Node version used, any local env quirks, anything a fresh session would need to know to get the dev server running without rediscovering it]]`

## Open questions / blockers

`[[none yet — populate as they come up. If something here turns into a real decision, move it to decisions.md and just reference it here]]`
