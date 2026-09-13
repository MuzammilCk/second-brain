# Design Contract: The Living Studio & Connected World of Muzammil CK

> **Status**: Architectural Specification & Design Contract (Post-Compaction Phase 3)  
> **Source of Truth**: `site/DESIGN.md`  
> **Enforcement**: Respects all `AGENTS.md` directional flow invariants. All data consumed is strictly from `site/src/data/generated/*.json`.

---

## 1. Core Design Concept

The portfolio is **NOT** a conventional developer showcase, a catalog of project cards, an enterprise software dashboard, or a sterile architectural monograph.

It is a **Public Window Into a Personal Engineering World**.

Underneath this public window sits Muzammil’s Second Brain — a living knowledge repository of systems architecture, machine learning research, distributed runtime experiments, failures, and personal reflections. 

The portfolio communicates:
> *"I am a computer science student and systems builder who builds things from first principles to understand how they work. I work with AI not to write generic wrappers, but to build futuristic edge systems, optimize latency, model physical constraints, learn from real failures, and evolve through what I create."*

### The Atmospheric Pillars
- **Blade Runner 2049**: Visual scale, deep contrast, atmospheric lighting, moody twilight backdrops, deliberate silhouettes.
- **Dune (2021)**: Monumental negative space, quiet restraint, disciplined earth-toned color hierarchy, mathematical proportions.
- **Teenage Engineering**: Tactile industrial controls, deliberate toggles, exposed mechanics, precision typography, hardware-like materiality.
- **Playdate**: Idiosyncratic charm, human playfulness, handwritten marginalia (`Caveat`), unexpected interactive delight.

### Style Boundaries (Anti-Patterns to Reject)
- **NO Cyberpunk / Neon Tropes**: No gratuitous glitch effects, no neon purple/cyan glowing text, no matrix rain.
- **NO SaaS / Corporate Telemetry**: No simulated CPU monitors, fake ping times, GPS coordinates, or vanity counters (`14 projects`, `X lines of code`) masquerading as personality.
- **NO Generic AI Boilerplate**: No purple gradient blobs, no generic chatbot icons, no "Built with AI" marketing hype.
- **NO Uncomposed Visual Clutter**: Complexity is welcome, but it must be meticulously composed with breathing room and clear visual hierarchy.

---

## 2. The Visitor Journey

The visitor should experience the portfolio as one seamless narrative journey rather than disjointed marketing blocks:

```
[ ARRIVAL: ME ] ──────────► [ THE MIND: CONNECTIONS ] ──► [ WORLDS: PROJECTS AS DOORS ]
Who is this person?          How does he think?            What has he built?
Curiosity & Philosophy       Interconnected Constellation   4 Idiosyncratic Portals
        │                                                           │
        ▼                                                           ▼
[ THE FORGE: EVOLUTION ] ◄── [ THE LAB: EXPERIMENTS ]   ◄── [ TURNING POINTS & FAILURES ]
Engineering pivots & ADRs     Garden notes & Playgrounds     What went wrong? What changed?
        │
        ▼
[ THE ARCHIVE: LIBRARY ] ──► Deep technical ledger for peers & hiring engineers
```

1. **Arrival**: The visitor meets Muzammil — an authentic human, curious builder, and systems developer.
2. **The Mind**: The visitor sees that ideas, tools, and projects are not isolated checkboxes; they form a living ecosystem of thought.
3. **The Worlds**: The visitor crosses thresholds into projects where the visual and structural metaphor mirrors the actual engineering challenge.
4. **The Forge**: The visitor discovers what broke, why naive solutions failed, and how real architectural constraints forced pivotal redesigns.
5. **The Lab**: The visitor peeks at active curiosities, unfinished experiments, and the current sprint focus.
6. **The Archive**: The visitor can dive into the exhaustive, filterable technical catalog.

---

## 3. Information Architecture: The 4-Layer Mental Model

| Layer | Semantic Meaning | Core Question | Primary Experience Component | Data Source |
| :--- | :--- | :--- | :--- | :--- |
| **Layer 1: Person** | Identity, philosophy, human craft | *Who is Muzammil?* | `HeroStudio` | Narrative copy, handwritten annotations |
| **Layer 2: Mind** | Semantic graph, cognitive links | *How does he connect ideas?* | `ConnectedMind` (Constellation) | `concepts.json`, cross-wiki links in `portfolio.json` |
| **Layer 3: Worlds** | Deep systems, domain environments | *What worlds has he forged?* | `ProjectWorlds` & `ProjectDetail` | `projects.json`, `portfolio.json` markdown |
| **Layer 4: Evolution** | Failures, pivots, ADRs, growth | *How does he overcome failure?* | `ArchitecturalPivots`, Decision Timelines | `*-decisions.md` in `portfolio.json` |

---

## 4. Page Hierarchy & Routing

- `/` **The Living Studio (Home)**: The full narrative experience across all four layers.
- `/projects` **The Atlas & Archive**: Full directory of all 14 engineered systems with instant search, domain filters, status tags, and quick-inspection drawer.
- `/projects/:slug` **The Narrative Case Study**: An immersive, 10-act engineering story replacing flat markdown dumps.
- `/garden` **The Digital Arboretum**: Evolving concepts, mental models, and knowledge notes (`AutoML`, `Video Intelligence`, `3D Physics`, `SkillOpt`).
- `/garden/:slug` **Concept Note**: Technical deep dive into specific systems and algorithms.
- `/now` **The Living Pulse**: What Muzammil is currently building, learning, and reading (derived from `priorities.json` and recent logs).
- `/playground` **The Sandbox**: Interactive 3D web physics experiments, audio toys, and prototypes.

---

## 5. Homepage Composition

The homepage is composed as an unbroken spatial canvas with consistent lighting and material texture:
1. **Header Wayfinding**: Minimalist studio header (`CODEX // Muzammil Ck`, status pill, wayfinding links, and repository access).
2. **Section 01: Hero Studio (`#me`)**:
   - Tripartite composition: Studio index navigation, human-centered manifesto headline with hand-drawn annotations, dusk studio desk visual.
   - Live status strip ("Building in public from Kerala · ThinkPad L13 local lab").
3. **Section 02: Connected Mind (`#mind`)**:
   - Celestial radial ecosystem with an interactive origin node.
   - Dynamic cross-highlighting between concept stars, active project planets, and decision turning points.
4. **Section 03: Project Worlds (`#projects`)**:
   - Four distinct architectural doors, each customized with unique layout cues, typography, and domain-authentic atmospheric visuals.
5. **Section 04: Engineering Evolution (`#evolution`)**:
   - "Failure as a Feature" — 4-stage turning point progression (Initial Approach $\rightarrow$ Constraint $\rightarrow$ Pivot $\rightarrow$ Invariant).
6. **Section 05: The Thinking Lab (`#lab`)**:
   - Split studio workshop showcasing live Garden essays and interactive Playground experiments.
7. **Section 06: The Systems Ledger (`#archive`)**:
   - High-density data table preview linking directly to the full `/projects` atlas.

---

## 6. Mind-World Interaction Model

The Connected Mind is **not** a generic force-directed graph or an enterprise network topology. It is an **interactive cognitive constellation**:

- **Central Sun**: `Me (Muzammil)` — The root integrator.
- **Orbital Clusters**:
  1. *Production Systems* (`AssetFlow`, `MetaTune`, `CrisisSignal`, `ytclfr`)
  2. *Deep Concepts* (`AutoML`, `Video Intelligence`, `3D Physics`, `SkillOpt`)
  3. *Turning Points & ADRs* (PostgreSQL GiST, UDP WebRTC, On-Device LSTM)
  4. *Active Sprints* (Priorities from `priorities.json`)
- **Interaction Rules**:
  - Hovering a *Project Planet* pulses connection filaments to its underlying *Concepts* and *ADRs*.
  - Hovering a *Concept Star* highlights all projects utilizing that concept.
  - Clicking a node opens an inspect preview with a direct doorway to the full page.
- **Accessibility Fallback**: Keyboard-accessible interactive index list for screen readers and reduced-motion users.

---

## 7. Project-World Model: Projects as Doors

Featured projects are not repetitive card templates; they are **doors into distinct engineering domains**:

### 1. AssetFlow: "The Wall of Invariants"
- **Domain**: Enterprise ERP & Distributed Concurrency.
- **Visual & Structural Language**: Heavy architectural grid, stone/sand texture, structural framing.
- **Core Narrative**: High-concurrency booking collisions during an 8-hour sprint solved by PostgreSQL GiST exclusion locks (`tsrange && tsrange`).

### 2. MetaTune: "The Sub-400ms Sound Chamber"
- **Domain**: Real-time Generative Audio & Bayesian Optimization.
- **Visual & Structural Language**: Deep acoustic darks, amber frequency waves, audio buffer telemetry.
- **Core Narrative**: Overcoming WebSocket packet loss and jitter over cellular networks by moving to UDP WebRTC tracks with sub-14ms barge-in.

### 3. CrisisSignal: "The Offline Fortress"
- **Domain**: Privacy-Preserving Edge Intelligence.
- **Visual & Structural Language**: Tactical monochrome, high-contrast coastline, edge hardware constraints.
- **Core Narrative**: Zero raw behavioral telemetry leaving the device. Quantized 8.4MB LSTM autoencoders running locally with Flower federated model aggregation.

### 4. MASM Studio / ytclfr: "The Silicon Monolith / The Multimodal Pipeline"
- **Domain**: Low-level 8086 Assembly or Staged Multimodal Video Extraction.
- **Visual & Structural Language**: Monospaced memory addresses, segmented registers, or progressive signal census gates.
- **Core Narrative**: Staged sensory execution preventing compute waste.

---

## 8. Project-Detail Storytelling: The 10-Act Narrative Framework

`ProjectDetail.jsx` replaces static markdown dumps with a structured, cinematic case study:

1. **Act I — The Problem**: What broke in the real world? Why did existing software fail?
2. **Act II — The Human Stake**: Why did Muzammil care to build this?
3. **Act III — The Naive Attempt**: What was the intuitive first implementation?
4. **Act IV — What Broke**: The moment of truth. What crashed under load or scrutiny?
5. **Act V — The Hard Constraint**: What physical, hardware, or temporal wall was hit?
6. **Act VI — The Turning Point**: The intellectual breakthrough and architectural pivot.
7. **Act VII — The Evolved Architecture**: Interactive or structured DAG/flow of the working system.
8. **Act VIII — Implementation Evidence**: Concrete files, benchmarks, and invariant proofs.
9. **Act IX — The Architectural Decisions (ADRs)**: Exact trade-offs made, alternatives rejected.
10. **Act X — Current State & Lessons**: Shipped status, competition accolades, what Muzammil learned.

---

## 9. Evolution / Decision Model: "Failure as a Feature"

The portfolio openly celebrates engineering mistakes and post-mortems:
- **Tone**: Honest, analytical, humble, and uncompromisingly rigorous.
- **Visual Representation**: An interactive timeline of turning points where the user toggles between the *Broken Assumption* and the *Hard Invariant*.
- **Direct Data Extraction**: Automatically consumes the `-decisions.md` logs exported in `portfolio.json`.

---

## 10. Navigation & Wayfinding Model

- **Desktop Header**:
  - `CODEX // Muzammil Ck` brand anchor.
  - Wayfinding coordinates: `ME`, `MIND`, `WORLDS`, `EVOLUTION`, `LAB`, `ARCHIVE`.
  - Tactile action button: `Get in Touch` / `GitHub ↗`.
- **In-Page Studio Directory**: Sticky/floating lateral index providing contextual awareness of the visitor’s current position.
- **Mobile Wayfinding**: Tactile full-screen drawer triggered by an industrial menu toggle, keeping clear spatial hierarchy rather than cramped collapsed pills.

---

## 11. Visual Language & Materiality

### Color Semantics
| Token | Hex | Semantic Role |
| :--- | :--- | :--- |
| `--color-void` | `#0B0B0C` | Studio canvas background (warm obsidian) |
| `--color-graphite` | `#1A1A1B` | Surface modules, project frames |
| `--color-graphite-light` | `#242426` | Elevated cards, interactive hover states |
| `--color-stone` | `#2E2A25` | Earthy borders, structural grid lines |
| `--color-stone-dim` | `#1F1C18` | Inset backgrounds, subtle wells |
| `--color-sand` | `#C9B8A0` | Primary human typography, editorial accents |
| `--color-sand-dim` | `#8F8271` | Secondary descriptions, inactive wayfinding |
| `--color-amber` | `#D4A373` | Core signature accent, highlights, active nodes |
| `--color-amber-glow` | `#E6BA8E` | Luminous glow, handwritten notes, selection |
| `--color-sage` | `#7A9E7E` | Live status dots, shipped invariants, growth |
| `--color-deep-blue` | `#2A4B6B` | Network filaments, deep contrast backdrops |

### Typography
- **Editorial Headlines**: `Sora` (700/800) — Bold, geometric, humanistic.
- **Prose & Narrative**: `Inter` (400/500) — Neutral, highly legible editorial reading.
- **Engineering Specs & Monospace**: `JetBrains Mono` (500/600) — Precision technical tags, file paths, and ADR keys.
- **Handwritten Human Voice**: `Caveat` (500) — Spontaneous marginalia, studio notes, personal reflections.

### Materiality & Tactility
- **Grain Overlay**: Subtle SVG noise overlay generating organic analog film texture over digital darkness.
- **Hairline Borders**: `1px solid var(--color-stone)` or `rgba(201, 184, 160, 0.12)`.
- **Soft Ambient Vignettes**: Deep radial gradients warming card perimeters without garish drop shadows.

---

## 12. Motion Language

Motion is an editorial punctuation mark, never a circus trick:
- **Enter**: Soft upward drift with opacity reveal ($350\text{ms}$, cubic-bezier(0.16, 1, 0.3, 1)).
- **Connect**: Subtle glowing line stroke animation across constellation paths.
- **Cross Threshold (Enter World)**: Smooth lateral zoom or slide-over drawer transition.
- **Reduced Motion**: All animations strictly respect `@media (prefers-reduced-motion: reduce)`.

---

## 13. Mobile Strategy

Mobile is not a shrunken desktop; it is an intentional vertical field journal:
- **Hero**: Stacks cleanly; studio index converts into a horizontal swipeable pill rail.
- **Connected Mind**: Collapses into a vertical constellation with tap-to-expand relationship cards.
- **Project Worlds**: Full-width stacked environmental thresholds with deep vertical tap targets.
- **Touch Targets**: Minimum $48\text{px}\times48\text{px}$ for all interactive controls.

---

## 14. Component Evolution Strategy

Existing components already encode foundational logic. We evolve them systematically:

1. **`HeroStudio.jsx`**:
   - *Remove*: Sterile vanity metric pills (`● 14 Distributed Systems`) and repetitive technical buzzwords.
   - *Enhance*: Human voice, philosophy of building to understand, atmospheric studio photography, personal manifesto.
2. **`ConnectedMind.jsx`**:
   - *Remove*: Hardcoded mock array.
   - *Enhance*: Real data-driven constellation connecting items from `concepts.json` and `projects.json`.
3. **`ProjectWorlds.jsx`**:
   - *Remove*: Repetitive generic cards with identical layouts.
   - *Enhance*: Idiosyncratic project doors with rich domain cues and direct triggers to the 10-act case study.
4. **`ArchitecturalPivots.jsx`**:
   - *Remove*: Static mock stories.
   - *Enhance*: Real ADRs from `portfolio.json` illustrating genuine engineering failure-to-pivot arcs.
5. **`ProjectDetail.jsx`**:
   - *Remove*: Flat markdown dump + sidebar.
   - *Enhance*: 10-Act Narrative case study structure parsing sections from markdown.
6. **`ArchitectureDrawer.jsx`**:
   - *Preserve & Polish*: Fast slide-over technical reader for instant access on any page.

---

## 15. Data Mapping Strategy

```
core/wiki/projects/*.md & *-decisions.md
             │
             ▼ (scripts/compile_portfolio.py)
site/src/data/generated/portfolio.json & projects.json
             │
             ├──► HeroStudio: Flagship intro & philosophy
             ├──► ConnectedMind: Concepts <-> Projects <-> ADR graph
             ├──► ProjectWorlds: Featured doors & domain metadata
             ├──► ArchitecturalPivots: Real turning points & invariants
             └──► ProjectDetail: 10-act parsed narrative sections
```

- **Strict Boundaries**: Zero direct file system access from browser.
- **Generated Integrity**: Verified by `scripts/verify_boundaries.py`.
- **Zero Hallucinations**: Every story, metric, and decision maps to active code or wiki documentation.
