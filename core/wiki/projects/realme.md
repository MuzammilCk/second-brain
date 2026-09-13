---
id: "realme"
title: RealMe 3D Portfolio
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/RealMe
last_verified: 2026-08-03
stack: React, TypeScript, Vite, Three.js, React Three Fiber, Framer Motion, Tailwind CSS, OKLCH, Vercel Edge Functions, Resend API
sources:
  - raw/claude-exports/Refactoring-a-3D-portfolio-to-enterprise-grade.md
  - raw/claude-exports/conversations-memory.md
related: []
created: 2026-07-28
last-updated: 2026-08-03
---

# RealMe (3D Portfolio)

React-based 3D personal portfolio with a "diary on a desk in the dark" narrative experience. Features procedural materials, Verlet cloth page-turning physics, custom WebGL post-processing, and a gyro/scroll-reactive camera — all without importing heavy media assets.

## Problem

Standard portfolio sites are flat, static, and instantly forgettable. A 3D narrative experience creates a memorable first impression and demonstrates advanced Three.js and React Three Fiber skills in a way a resume cannot. The challenge is achieving high visual fidelity on mid-tier devices (no GPU budget) without resorting to pre-baked assets that bloat bundle size.

## Architecture

- **Core Aesthetic**: Dark room + desk + physical diary. Canvas-rendered textures replace bitmap images throughout.
- **Design System**: OKLCH color tokens for consistent luminance and chroma gradients across all materials and UI elements.
- **3D Stack**: React Three Fiber (Three.js bindings) + `@react-three/drei` for helpers. Custom shader materials for desk surface, book cover, and dust mote particles.
- **Verlet Cloth Physics**: Page-turn interaction implemented with a Verlet cloth simulation. Users click and drag pages to turn them; physics constraints maintain realistic paper behavior.
- **Camera System**: `ScrollCamera` and `GyroCamera` scripts respond to scroll position and device gyroscope respectively, dynamically tilting the 3D perspective.
- **Post-Processing**: `PostProcessingLite` — optimized vignette + bloom configured for tier-2 device budgets.
- **Mail API**: Vercel Edge Function connected to Resend API with honeypot spam filtering, replacing static `mailto:` links.

## Constraints & Trade-offs

- **Canvas-rendered textures**: Heavy image assets are replaced with canvas-rendered textures generated at runtime. This keeps the bundle small but adds JS initialization cost on first load.
- **Bypassed polishing pattern**: A recurring issue during development — high-fidelity subsystems (cloth physics, post-processing, gyro camera) were fully implemented but left unmounted while simpler 2D fallbacks remained active. Systematic refactoring was required to activate them.
- **Per-frame `Math.random` bug**: `DustMotes` and similar components used `Math.random()` per render frame, causing canvas texture flickering. Fixed by replacing with stable procedural hash loops.
- **Tier-2 device targeting**: Post-processing effects are limited to vignette and low-intensity bloom. Ray-marching, SSR, and heavy SSAO effects are excluded.

## Implementation Evidence

- Verlet cloth simulation driving interactive page-turn on the diary canvas.
- `ScrollCamera` and `GyroCamera` scripts mounting and controlling perspective tilt.
- `PostProcessingLite` with vignette + bloom using `@react-three/postprocessing`.
- Canvas-rendered procedural textures eliminating bitmap asset imports.
- Vercel Edge Function (`/api/contact`) integrating Resend API with honeypot field validation.
- OKLCH design token system for all color decisions.

## Current State

Active development. Core 3D scene, cloth physics, camera controllers, and mail endpoint functional post-refactor. Additional scenes (projects page, about section) in progress.

## Decisions

See the complete list of portfolio adjustments in [[realme-decisions|RealMe Decision Log]].

