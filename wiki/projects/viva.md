---
title: Viva Business Team Website
type: project
status: active
stack: Next.js, Next.js App Router, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Framer Motion, React Hook Form, Zod
sources: mirror/project-sync/viva/README.md, mirror/project-sync/viva/CLAUDE.md
related: [[wiki/people/muzammil-ck]]
created: 2026-08-03
last-updated: 2026-08-03
---

# Viva Business Team Website

The Viva Business Team Website is a custom, service-led marketing platform for a physical audio electronics shop (car/home audio sales, custom enclosure design, sound system calibration, and repair) in Malappuram, Kerala.

The site is built around a custom aesthetic design framework, codenamed **The Signal Chain**, borrowing structure from physical audio equipment console panels.

## Core Concepts
- **The Signal Chain Narrative**: The homepage layout traces the progression of sound: **Source** (Services Hub) → **Amplification** (Hardware selection) → **Tuning** (Sound calibration check) → **Output** (Portfolio Gallery & Bookings).
- **Physical Console UI**: Custom visual controls (Fader/Slider controls for before/after portfolio visuals, Knobs for audio frequency filter visualization).
- **Interactive 3D Speaker**: A custom WebGL hero element (React Three Fiber/drei) rendering a speaker chassis that idles with a breathe pulse and reacts to sound events.

## Architectural Constraints
- **Zero Hallucinated Content**: Strict mandate to prevent placeholder text from showing up as fake statistics or reviews. All unconfirmed content is locked behind explicit `[[PLACEHOLDER]]` blocks.
- **Accessible Overlays**: Any visual/decorative knobs or sliders are built directly on top of native, keyboard-navigable HTML inputs.
- **Conversion focus**: Omits online cart or checkout systems in favor of targeted direct bookings, direct phone, or WhatsApp chat links.
