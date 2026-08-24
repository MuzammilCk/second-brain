---
title: RealMe 3D Portfolio
type: project
status: active
stack: React, TypeScript, Vite, Three.js, React Three Fiber, Framer Motion, Tailwind CSS, OKLCH, Vercel Edge Functions, Resend API
sources:
  - raw/claude-exports/Refactoring-a-3D-portfolio-to-enterprise-grade.md
  - raw/claude-exports/conversations-memory.md
related:
  - "[[wiki/concepts/three-physics]]"
created: 2026-07-28
last-updated: 2026-08-03
---

# RealMe (3D Portfolio)

`RealMe` (host repository `MuzammilCk/RealMe`) is a React-based 3D portfolio application designed with a "diary on a desk in the dark" narrative experience. It features procedural materials, custom shader interactions, and physical simulations.

## Project Structure & Aesthetics

- **Core Aesthetic**: A dark room containing a desk, with a physical diary that users can interact with. Uses custom canvas-rendered textures to avoid importing heavy media assets.
- **Design Tokens**: Color configurations mapped using OKLCH system tokens for consistent luminance and chroma gradients.
- **Bypassed polishing pattern**: A recurring development pattern was identified where high-fidelity sub-systems (like Verlet cloth physics, Post-processing configurations, typography grids, and camera controllers) were fully implemented in separate modules but left unmounted, while simplified 2D fallbacks were active.

## Code Refactoring (Enterprise Grade)

The portfolio underwent a systematic refactoring to stabilize its 3D depth and interactivity:
1. **Flicker Fixes**: Removed `Math.random` per-frame calls in custom components like `DustMotes`, replacing them with stable hash or procedural loops to stop canvas-texture flickering.
2. **Mail integration**: Replaced static client-side mailto anchors with a secure Vercel Edge Function linked to the Resend API, incorporating honeypot properties to filter spam.
3. **Draggable Page Turn**: Reactivated Verlet cloth simulation inside the page canvas, allowing users to physically click and drag pages to turn them.
4. **PostProcessingLite**: Enabled optimized post-processing effects (vignettes, bloom filters) tailored for performance on tier-2 devices.
5. **Interactive Cameras**: Mounted camera scripts (`ScrollCamera`, `GyroCamera`) to allow gyro/scroll gestures to dynamically tilt the perspective, overcoming the static 2D representation.

## Historical Decisions & Pivots
See the complete list of portfolio adjustments in [[realme-decisions|RealMe Decision Log]].
