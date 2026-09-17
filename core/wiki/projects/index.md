# Projects & Repositories Index

Central Map of Content (MOC) tracking all 34 engineering repositories under [@MuzammilCk](https://github.com/MuzammilCk). Synchronized with GitHub telemetry in `core/progress/github-telemetry.json`.

---

## 🚀 Flagship Systems (`Tier 1 — Showcase`)
Production-grade architectures with full 6-part schemas, deep ADR logs, and public portfolio projections.

- **[[ytclfr|YouTube Content Lifter and Field Recognizer (ytclfr)]]** `[active • 🟢 on-track]`
  - *Stack*: Python 3.13, FastAPI, Celery, Redis, PostgreSQL, Faster-Whisper, PaddleOCR, Ollama
  - *Summary*: Staged video-intelligence pipeline extracting structured data from text-laden/silent videos.
  - *Next*: Test Stage A S3 fallback wrapper on sample compilation videos.

- **[[metatune|MetaTune AutoML Platform]]** `[active • 🟢 on-track]`
  - *Stack*: Python, PyTorch, Streamlit, Google Vizier
  - *Summary*: Dataset-aware hyperparameter optimization using neural meta-learning and Pythia policies.
  - *Next*: Benchmark Google Vizier Pythia search space policies.

- **[[invoice-studio|AI Invoice Studio]]** `[active • 🟢 on-track]`
  - *Stack*: React 19, Vite, TailwindCSS v4, Express.js, Decimal.js, Ollama (Qwen 3), Faster-Whisper
  - *Summary*: Enterprise voice billing app migrating from Gemini Flash to local offline-first LLM/ASR inference.
  - *Next*: Verify local Flask STT sidecar with Ollama qwen3:8b.

- **[[esg-audit-system|Zero-Trust Multiagent ESG Audit System]]** `[active • 🟢 on-track]`
  - *Stack*: Python, LangGraph, Presidio PII Masking, Qdrant, AWS Nitro Enclaves
  - *Summary*: Automated enterprise ESG compliance audit pipeline with isolated enclave execution.
  - *Next*: Validate Presidio PII anonymization in isolated enclave.

- **[[realme|RealMe (3D Narrative Portfolio)]]** `[active • 🟢 on-track]`
  - *Stack*: React, Three.js, React Three Fiber, GLSL, Verlet Physics
  - *Summary*: 3D interactive portfolio featuring Verlet cloth page turns and gyro camera interaction.
  - *Next*: Optimize gyro camera interactions and cloth shader render loop.

- **[[masm-studio|MASM Studio (8086 Cloud IDE)]]** `[active • 🟢 on-track]`
  - *Stack*: TypeScript, Monaco Editor, WebAssembly, 8086 Assembly
  - *Summary*: Cloud-based 16-bit 8086 assembly simulator with register trace mapping and AI explanations.
  - *Next*: Expand Monaco syntax autocompletions for register trace mapping.

- **[[repomind|Repo Mind]]** `[active • 🟢 on-track]`
  - *Stack*: Python, CodeQL, Gemini 1.5 Pro, AST Analysis
  - *Summary*: Dual-gear repository security audit and stateful code exploration tool.
  - *Next*: Tune rate compliance cache for large codebase indexing.

- **[[second-brain|Codex Second Brain Vault]]** `[active • 🟢 on-track]`
  - *Stack*: React 19, Vite, TailwindCSS, Python 3.13, PowerShell, Obsidian, MCP
  - *Summary*: Autonomous personal knowledge vault with 4-tier security boundaries and live GitHub telemetry.
  - *Next*: Integrate tracker signals into morning briefing and evening standup.

---

## 🧪 Active R&D & Incubation (`Tier 2 — Lab`)
Experimental systems, autonomous agents, and cross-platform native applications currently under active development.

- **[[pro-to-type|ARIA AI Companion Vision Agent]]** `[active • 🟢 on-track • Pushed Today]`
  - *Stack*: Python, OpenCV 5, AWS Bedrock, Claude, Ollama, YOLOv5s, AWS SNS
  - *Summary*: Full-duplex vision companion that identifies visitors and manages conversations without thread blocking.
  - *Next*: Benchmark local Ollama latency vs AWS Bedrock fallback.

- **[[clavion|Clavion Desktop AI Piano Transcription]]** `[active • 🟢 on-track]`
  - *Stack*: Flutter, Dart, Rust, flutter_rust_bridge, ONNX Runtime, basic-pitch, OxiSynth, SQLite
  - *Summary*: High-performance desktop AI piano transcription and synthesis app with signed ONNX models.
  - *Next*: Start Milestone 3: Note Correction Editor & Bias-Correction.

- **[[browser-agent|Government Browser Agent]]** `[active • 🟢 on-track]`
  - *Stack*: Python, Playwright, FastAPI, OpenRouter API, Uvicorn, Pytest
  - *Summary*: Semantic, closed-loop browser automation agent for government portal form navigation.
  - *Next*: Add captcha detection and escalation flow.

- **[[feynman|Feynman Learning AI Tutor]]** `[active • 🟡 stalled]`
  - *Stack*: React, TypeScript, Vite, Gemini API
  - *Summary*: Interactive tutor diagnosing mental model gaps through Feynman technique explanations.
  - *Next*: Revise prompt harness for student concept gap detection.

- **[[fitness-platform|Fitness Platform (useMe)]]** `[active • 🟡 stalled]`
  - *Stack*: Next.js 15, NestJS, Drizzle ORM, PostgreSQL, Zod
  - *Summary*: End-to-end type-safe FitTech tracking monorepo with strict data contracts.
  - *Next*: Refactor Drizzle ORM queries for workout log aggregation.

- **[[vajra|Vajra System Defense & Automation]]** `[paused • ⚪ dormant]`
  - *Stack*: Python, OS Automation, Security Verification Scripts
  - *Summary*: Host baseline security scanner and administrative endpoint automation tool.
  - *Next*: Review tools for vault maintenance integration.

- **[[mindwell|MindWell Mental Health Platform]]** `[paused • ⚪ dormant]`
  - *Stack*: JavaScript, Node.js, Express, MongoDB
  - *Summary*: Sentiment-aware mental health tracking and student reflection portal.
  - *Next*: Decide on merging insights into CrisisSignal architecture.

- **[[healthsync|HealthSync]]** `[paused • ⚪ dormant]`
  - *Stack*: JavaScript, React, Node.js, Express, MongoDB
  - *Summary*: Multi-role healthcare management portal with real-time notifications.
  - *Next*: Audit httpOnly JWT token rotation across client views.

---

## ⚡ Hackathons & Competition Sprints (`Tier 3`)
Intensive 24–48 hour rapid builds developed under competition constraints.

- **[[odoo-final|DealFlow360 (Odoo Hackathon Grand Finale 2026)]]** `[completed • 🏆 final round]`
  - *Stack*: React 19, Vite, TailwindCSS, Express.js, TypeScript, PostgreSQL, Prisma (25 tables), Zod
  - *Summary*: Enterprise commercial core with CPQ, Blended Risk scoring, greedy warehouse allocation, and customer portal.
  - *Next*: Archive hackathon post-mortem notes.

- **[[prediction-system|PlacementPulse AI (Cognizant Hackathon)]]** `[completed • 🏆 31/31 tests]`
  - *Stack*: Python 3.9+, Streamlit, Scikit-Learn, XGBoost, OpenRouter LLM, Pandas
  - *Summary*: Adaptive multi-domain student placement prediction engine and cohort policy simulator.
  - *Next*: Maintain as reference benchmark for ML placement modeling.

- **[[odoo-hackathon|Odoo Hackathon 2026 Grand Finale Overview]]** `[completed]`
  - *Stack*: Event Dossier, Team 583 (Gandhinagar Finale)
  - *Summary*: 24-hour on-site hackathon documentation and evaluation debrief.
  - *Next*: Cross-reference learnings with DealFlow360 architecture.

- **[[assetflow|AssetFlow Asset Tracker]]** `[completed]`
  - *Stack*: Python, PostgreSQL, Odoo ORM
  - *Summary*: Conflict-prevention equipment reservation and asset scheduling engine.
  - *Next*: Retain as transaction scheduling reference implementation.

- **[[crisissignal|CrisisSignal Crisis Detection System]]** `[active • ⚪ dormant]`
  - *Stack*: Python, TensorFlow, TFLite, Flower (Federated Learning)
  - *Summary*: On-device privacy-preserving crisis signal detection engine.
  - *Next*: Benchmark TFLite model inference on mobile device battery life.

- **[[crisis-android|Crisis Alert Android Client]]** `[active • ⚪ dormant]`
  - *Stack*: Kotlin, Android SDK, TensorFlow Lite, Flower
  - *Summary*: Native Android companion app collecting passive sensors for CrisisSignal federated models.
  - *Next*: Sync sensor event pipeline with Python CrisisSignal backend.

---

## 🏢 Client & Production Web (`Tier 4`)
Commercial e-commerce, fabrication showcases, and production client applications.

- **[[hadi|Hadi Perfumes Backend]]** `[active • 🟢 on-track]`
  - *Stack*: NestJS, TypeScript, PostgreSQL, Stripe API
  - *Summary*: FTC-compliant modular monolithic MLM checkout engine and compensation matrix.
  - *Next*: Enforce strict catalog concurrency guards in checkout pipeline.

- **[[hadi-frontend|Hadi Perfumes Frontend v2]]** `[active • 🟢 on-track]`
  - *Stack*: React, Next.js, TypeScript, TailwindCSS, Zustand
  - *Summary*: Member hierarchy dashboard and retail storefront interfacing with NestJS backend.
  - *Next*: Integrate MLM commission ledger endpoints with NestJS backend.

- **[[viva|Viva Sound System Website]]** `[active • 🟢 on-track]`
  - *Stack*: Python, Next.js, TailwindCSS
  - *Summary*: Custom automotive audio engineering and sound calibration studio showcase.
  - *Next*: Finalize sound calibration portfolio showcase pages.

---

## 🛠️ Foundations, Systems & Algorithms (`Tier 4`)
Core computer science fundamentals, low-level systems programming, and algorithms.

- **[[shell|Custom C Unix Shell Implementation]]** `[completed • 🔒 private]`
  - *Stack*: C, POSIX API, fork/exec, Signals, Pipes
  - *Summary*: Low-level Unix shell from first principles supporting piping, job control, and redirection.
  - *Next*: Core OS interview prep reference for processes and signals.

- **[[game-of-life|Conway's Game of Life Simulation]]** `[completed • 🔒 private]`
  - *Stack*: TypeScript, HTML5 Canvas
  - *Summary*: Deterministic cellular automaton grid evolution engine with toroidal wrapping.
  - *Next*: Maintain as algorithm reference.

- **[[zenith|Zenith Dojo CRUD Engine]]** `[completed]`
  - *Stack*: TypeScript, React, Node.js, Express
  - *Summary*: Full-stack type-safe CRUD pattern with strict lifecycle validations.
  - *Next*: Archive as standard TypeScript scaffold pattern.

- **[[voice-recorder|VoiceRecorder Audio Utility]]** `[active • 🟡 stalled]`
  - *Stack*: TypeScript, Web Audio API, React
  - *Summary*: Browser audio stream chunking and WAV encoding module.
  - *Next*: Evaluate integration into AI Invoice Studio STT pipeline.

- **[[neo-creation|Neo Creation Creative Canvas]]** `[completed]`
  - *Stack*: TypeScript, CSS3 Animation, Three.js
  - *Summary*: Interactive canvas and shader physics interaction playground.
  - *Next*: Reference for RealMe 3D portfolio animation components.

- **[[blood-donation-network|Blood Donation Network Portal]]** `[completed]`
  - *Stack*: JavaScript, Node.js, Express, MongoDB
  - *Summary*: Real-time community blood bank donation matching platform.
  - *Next*: Archive as web portal reference.

- **[[game-2048|2048 Web Game Engine]]** `[completed • 🔒 private]`
  - *Stack*: JavaScript, HTML5, CSS Grid
  - *Summary*: Classic 2048 recursive tile merge and sliding matrix engine.
  - *Next*: Archive as standard game loop reference.

---

## 📦 Archived & Reference Repositories (`Tier 4`)
Historical utilities, exploratory study notes, and superseded prototypes.

- **[[generative-ai-for-beginners|Generative AI 21-Lesson Study Notes]]** `[completed • reference]`
  - *Stack*: Jupyter Notebook, Python, LangChain, OpenAI API
  - *Summary*: 21 structured lessons covering RAG, vector embeddings, and agent orchestration.
  - *Next*: Reference notes for LLM prompt engineering.

- **[[track-intern-old|TrackIntern Legacy Internship Tracker]]** `[completed • 🔒 private]`
  - *Stack*: TypeScript, Next.js, TailwindCSS
  - *Summary*: Early job application kanban tracker (superseded by Codex vault).
  - *Next*: Replaced by Codex placement tracking.

- **[[echo-mind|EchoMind Private Mental Health Notes]]** `[completed • 🔒 private]`
  - *Stack*: TypeScript, React, LocalStorage
  - *Summary*: Client-side encrypted reflective journaling prototype (superseded by Obsidian second brain).
  - *Next*: Archived in favor of Obsidian second-brain vault.

---

## Project Structure Guidelines
Every project is documented under two companion files:
1. `core/wiki/projects/<slug>.md` — Project Overview, stack, current milestone, and next action.
2. `core/wiki/projects/<slug>-decisions.md` — Append-only Architectural Decision Log.
