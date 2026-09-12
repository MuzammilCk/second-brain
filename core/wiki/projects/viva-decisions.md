# Viva Business Team Website - Decision Log

Chronological track of design system, UX, and framework decisions.

## 2026-06-12 — The Signal Chain Visual & Layout Paradigm
**Context:** Creating a generic marketing outline makes local services look identical to template designs. The user requested a layout that references physical sound engineering.
**Decision:** Standardized the structure around **The Signal Chain** concept (Source -> Amplification -> Tuning -> Output). The homepage elements are grouped and named after this progression, using custom faders and VU-meters as active interface decorations.
**Status:** active

## 2026-06-15 — Native Overlay for Interactive UI Knobs and Faders
**Context:** Custom Knobs and Sliders built purely in Canvas or SVGs fail WCAG/screen-reader compliance and break keyboard navigation.
**Decision:** Mandated that all decorative components (e.g. `KnobFilter`, `BeforeAfterSlider`) must overlay a natively keyboard-navigable and screen-reader operable native control (`<input type="range">`), visually masking it while utilizing its key bindings and attributes.
**Status:** active

## 2026-06-18 — Dark Theme Only for Industrial Aesthetics
**Context:** The visual console theme relies heavily on dark backgrounds to simulate industrial rack-mount units. Developing light/dark theme toggles complicates color contrast compliance.
**Decision:** Restrict the site theme to dark mode only for v1, utilizing WCAG-validated contrast color pairs (e.g. deep grey backgrounds with high contrast amber indicator lights).
**Status:** active

## 2026-06-20 — Conversion Pathways Restricted to Phone/WhatsApp
**Context:** The client shop specializes in highly custom enclosure fabrication and parts repair, which cannot be priced statically.
**Decision:** Excluded e-commerce shopping carts or billing checkouts from the Next.js stack, routing all product and quote enquiries through direct phone, WhatsApp links, and a booking form.
**Status:** active
