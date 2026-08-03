---
source: project-sync
project: viva
original-path: D:\projects\viva\CLAUDE.md
synced: 2026-08-03
---

# CLAUDE.md — Agent Operating Brief

**Project:** Viva Business Team Website (codename: **The Signal Chain**)
**Read this file first, before touching any code, content, or config.**

---

## What this project is

A service-led marketing website for an audio electronics business (car/home audio sales, custom enclosure fabrication, on-site installation, repair) in Chettiyamkinar, Malappuram, Kerala. Not e-commerce — every page exists to build enough trust and clarity that a visitor calls, WhatsApps, or visits in person.

## Reading order

1. This file
2. `context.md` — check current state before assuming this is a fresh start
3. `docs/00-project-overview.md` through `docs/11-content-collection-checklist.md`, in number order
4. `docs/pages/*.md` for whichever page you're currently building
5. `decisions.md` — why things are the way they are, and which calls are still open
6. `roadmap.md` — build order

## Non-negotiable rules

1. **Never invent business facts.** Every `[[PLACEHOLDER: ...]]` marker found in these docs must remain a literal, visible placeholder in code/content — real content collection is tracked in `docs/11-content-collection-checklist.md`. Never fill a placeholder with a plausible-sounding guess: not a phone number, not a price, not a testimonial quote, not a stat. This applies with extra weight to testimonials and review ratings (see ADR-008 in `decisions.md`) — a visible placeholder is honest; an invented quote is not.
2. **Use `docs/02-design-system.md` tokens exactly.** No ad hoc hex colors, no arbitrary spacing values. If a needed value doesn't exist there, add it to that file first (and verify contrast if it's a color used with text), then use it.
3. **Mobile-first, always.** Build and verify at 375px before 1280px.
4. **Every animation respects `prefers-reduced-motion`.** No exceptions, including the 3D hero (see `docs/06-3d-motion-interaction-spec.md` §5).
5. **Dark theme only.** No light-mode toggle in v1 (ADR-003).
6. **No cart, checkout, or payment integration in v1.** Every conversion path ends at WhatsApp, a phone call, or the booking form (ADR-001).
7. **Custom controls need a real accessible control underneath the fancy visual.** `KnobFilter`, `ConsoleToggle`, `BeforeAfterSlider` — the decorative layer sits on top of a genuinely keyboard/screen-reader operable native control, not instead of one. See `docs/05-component-library.md`.
8. **The stack is locked:** Next.js (App Router) + TypeScript + Tailwind + React Three Fiber/drei + Framer Motion + React Hook Form/Zod. Don't swap frameworks mid-build because a different one seems easier for one feature.

## Definition of done — every page must clear this before being called complete

- [ ] Matches its spec in `docs/pages/`
- [ ] Uses only tokens from `docs/02-design-system.md` — no one-off values
- [ ] Verified responsive at 375px / 768px / 1280px
- [ ] Meta tags + relevant schema.org markup per `docs/08-seo-and-local-discovery.md`
- [ ] Every piece of content is either real or clearly `[[PLACEHOLDER]]` — nothing invented in between
- [ ] Fully keyboard-navigable, contrast checked against the verified pairs in `docs/02-design-system.md` §1.5
- [ ] `prefers-reduced-motion` fallback verified by actually testing it, not assumed to work

## Ongoing workflow files

`context.md` (current build state + phase checklist) and `diff.md` (append-only change log) live at the repo root, already seeded with the pre-build state. **At the start of every session, check `context.md` first** to see what's actually done before re-reading the full spec set. **At the end of every session:** update `context.md`'s status block and checklist, and append a new entry to the top of `diff.md`. Neither file gets used as a scratchpad for guesses — if something's genuinely unresolved, it goes under "Open questions / blockers" in `context.md`, not silently decided.

## If something in these docs seems wrong or incomplete

Flag it rather than silently deviating — add a note to `decisions.md` rather than making a new undocumented call. The whole point of this doc set is that nobody downstream has to guess.
