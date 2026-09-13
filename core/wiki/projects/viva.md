---
title: Viva Business Team Website
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/viva
last_verified: 2026-08-03
stack: Next.js, Next.js App Router, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Framer Motion, React Hook Form, Zod
sources:
  - mirror/project-sync/viva/README.md
  - mirror/project-sync/viva/CLAUDE.md
related: []
created: 2026-08-03
last-updated: 2026-08-03
---

# Viva Business Team Website

Custom service-led marketing platform for a physical audio electronics shop (Malappuram, Kerala) specializing in car/home audio sales, custom enclosure design, sound system calibration, and repair. Built around a custom design framework called **The Signal Chain**, which borrows visual structure from physical audio console panels.

## Problem

A brick-and-mortar audio shop with no web presence loses customers to national retail chains with stronger online discoverability. A generic website template fails to communicate the shop's specialist expertise (custom enclosures, sound calibration) and technical credibility. The site must convert visitors to direct bookings or calls — not distract them with a cart/checkout flow the shop doesn't need.

## Architecture

- **Framework**: Next.js App Router (TypeScript). Static generation for SEO-critical pages; dynamic routes for booking form submissions.
- **The Signal Chain Design Framework**: Homepage sections trace the audio signal path — Source (Services Hub) → Amplification (Hardware selection) → Tuning (Sound calibration check) → Output (Portfolio Gallery & Bookings). Each section uses visual metaphors from audio console hardware.
- **3D Hero Element**: React Three Fiber/drei WebGL component rendering a speaker chassis. Idles with a "breathe" pulse animation and reacts to audio playback events on the page.
- **Physical Console UI**: Custom controls built on accessible native HTML inputs (`<input type="range">` for faders, rotary inputs for knobs). Before/after portfolio comparisons use a fader control for visual transition.
- **Forms**: React Hook Form + Zod for booking and contact forms. Validated client-side; submitted to a Next.js API route.

## Constraints & Trade-offs

- **Zero hallucinated content mandate**: No placeholder statistics, fake reviews, or invented testimonials. All unconfirmed content is locked behind explicit `[PLACEHOLDER]` blocks and never shown in production until real content is supplied by the client.
- **Accessible decorative controls**: All knob/fader UI controls are layered on top of native, keyboard-navigable HTML inputs. Screen readers and keyboard users can operate every interactive element.
- **Conversion focus over e-commerce**: The site explicitly omits online cart, checkout, and payment flows. Conversion points are direct bookings, phone links, and WhatsApp chat. This eliminates payment processing complexity and keeps the site focused.
- **3D performance budget**: The speaker WebGL element targets 60 fps on mid-range mobile devices. Complex shaders and post-processing are excluded.

## Implementation Evidence

- Next.js App Router with static generation for all service and portfolio pages.
- The Signal Chain four-section homepage layout with audio console visual metaphors.
- React Three Fiber speaker chassis with idle breathe animation and audio event reactivity.
- Fader/slider before-after portfolio comparison built on `<input type="range">`.
- React Hook Form + Zod booking form with API route submission.
- `[PLACEHOLDER]` content blocks preventing unverified content from rendering.

## Current State

Active development. Homepage, services, and about sections built. Portfolio gallery and booking form functional. Awaiting real photography and client-supplied pricing/testimonial content before launch.

## Decisions

See the complete list of system designs and code changes in [[viva-decisions|Viva Decision Log]].


