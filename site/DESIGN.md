# Design System: Builder's Studio

A design system for an engineering portfolio structured as a **warm, cinematic, personal living studio of how a systems developer thinks, experiments, makes decisions, and builds software**.

Validated and scaffolded via **Stitch MCP** based on the Builder's Studio design direction.

---

## 1. Core Principles

1. **Warm Cinematic Atmosphere Over Cold Zinc Monolith**
   Earthy tones (Void `#0B0B0C`, Graphite `#1A1A1B`, Stone `#2E2A25`, Sand `#C9B8A0`, Amber `#D4A373`) replace sterile cold grays. Ambient lighting, studio desk photography, and subtle micro-grid grain bring human presence and warmth.

2. **Handwritten Human Touch**
   Curiosity and craft are expressed through organic handwritten annotations (`Caveat` font) and hand-drawn SVG underlines ("Curiosity Compounds Everything", "Better Systems Brighter People", "understand").

3. **Connected Mind Over Isolated Cards**
   Ideas, projects, concepts, decisions, and experiments are unified in an interactive radial node graph centered on the developer's core anchor.

4. **Project Worlds Over Flat Lists**
   Featured builds are presented as tall, immersive "worlds" with atmospheric photography backgrounds, clear architectural problem statements, and one-click slide-over technical drawers.

5. **Substance Over Metric Theater**
   Real numbers, real measured latencies, real GiST index invariants, and explicit Architectural Decision Records (ADRs).

---

## 2. Color Semantics & Surfaces

### Palette & Tokens

| Token | Hex | Semantic Role |
| :--- | :--- | :--- |
| `--color-void` | `#0B0B0C` | Deep warm black canvas |
| `--color-graphite` | `#1A1A1B` | Primary card & module surface |
| `--color-graphite-light`| `#242426` | Hovered and elevated surface |
| `--color-stone` | `#2E2A25` | Warm earthy border and structural grid |
| `--color-stone-dim` | `#1F1C18` | Inset badge backgrounds & subtle panels |
| `--color-sand` | `#C9B8A0` | Secondary text, subtle links, card content |
| `--color-sand-dim` | `#8F8271` | Monospace tags, metadata, inactive links |
| `--color-amber` | `#D4A373` | Signature amber accent, selection, active states |
| `--color-amber-glow` | `#E6BA8E` | Handwritten callouts, warm radiant highlights |
| `--color-sage` | `#7A9E7E` | Live indicators, production systems, growth |
| `--color-deep-blue` | `#2A4B6B` | Network graph cables, deep contrast |

---

## 3. Typography Hierarchy

| Role | Font Family | Size | Weight | Line Height | Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Headline** | Sora | 3.5rem - 4.5rem | 700 / 800 | 1.08 | Sentence |
| **Section Title** | Sora | 2.5rem - 3.2rem | 700 | 1.15 | Sentence |
| **Card Title** | Sora | 1.5rem - 1.8rem | 700 | 1.2 | Sentence |
| **Body Narrative** | Inter | 1rem - 1.125rem | 400 | 1.65 | Sentence |
| **Handwritten Note**| Caveat | 1.4rem - 2rem | 500 | 1.0 | Organic |
| **Status / Eyebrow**| JetBrains Mono | 10px - 12px | 600 | 1.2 | Tabular / Upper |
| **Metadata Tag** | JetBrains Mono | 9px - 11px | 500 | 1.3 | Tabular / Upper |

---

## 4. Key Components

### 1. Hero Studio (`HeroStudio.jsx`)
- Tripartite desktop grid:
  - **Left**: 01-06 Directory Index with active state.
  - **Center**: Role pill, bold Sora headline with hand-drawn underline on "understand", narrative lead, and primary CTAs.
  - **Right**: Dusk studio photographic card with mountain vista, warm ambient lighting, and handwritten Caveat sticky notes.
  - **Far Right**: Vertical `REPEAT • LEARN • BUILD • THINK` ribbon.
- **Bottom**: Full-width manifesto ribbon with pulsing green live status indicator.

### 2. Connected Mind (`ConnectedMind.jsx`)
- Radial SVG network graph centered on `ORIGIN / Me (Muzammil)` with amber radial glow.
- 7 orbiting satellite nodes: Projects, Concepts, AI/ML, Interests, Decisions, Experiments, Growth.
- Links directly into the Digital Garden and interactive concept taxonomy.

### 3. Project Worlds (`ProjectWorlds.jsx`)
- 4 tall cinematic cards (AssetFlow, MetaTune, ESG Audit System, CrisisSignal) with photographic backgrounds, system codes (`SYS.01` to `SYS.04`), live badges, and domain tags.
- Clicking any card opens the detailed **ArchitectureDrawer** with full markdown case study and ADRs.
- Horizontal scroll with arrow controls and progress indicator.

### 4. Technical Architecture Drawer (`ArchitectureDrawer.jsx`)
- Slide-over reader for deep architectural investigation.
- Full markdown rendering of problem statement, architecture DAG, trade-offs, and ADRs.

---

## 5. Verification & Standards

- Zero git mirroring (`AGENTS.md` directive).
- Build compilation: `node scripts/build-content.js && vite build`.
- Boundary verification: `python scripts/verify_boundaries.py`.
