#!/usr/bin/env python3
"""
scripts/scaffold_tracker_projects.py
Creates markdown overview and companion decision files for previously untracked
GitHub repositories in core/wiki/projects/.
"""

import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECTS_DIR = os.path.join(ROOT, "core", "wiki", "projects")

PROJECTS = [
    {
        "slug": "pro-to-type",
        "id": "pro-to-type",
        "title": "ARIA AI Companion Vision Agent",
        "tier": "incubation",
        "status": "active",
        "health": "on-track",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/pro-to-type",
        "stack": "Python, OpenCV 5, AWS Bedrock, Claude, Ollama, YOLOv5s, AWS SNS",
        "created": "2026-09-17",
        "current_milestone": "Full-Duplex Multi-threaded Vision & Conv Loop",
        "next_action": "Benchmark local Ollama latency vs AWS Bedrock fallback",
        "desc": "OpenCV 5 + AWS + LLM companion that sees visitors, converses with them, and decides whether to enroll or alert via non-blocking multi-threaded architecture (VisionThread, ConvThread, MainThread, Alerter SNS)."
    },
    {
        "slug": "odoo-final",
        "id": "odoo-final",
        "title": "DealFlow360 (Odoo Hackathon Final Round)",
        "tier": "hackathon",
        "status": "completed",
        "health": "on-track",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/odoo_final",
        "stack": "React 19, Vite, TailwindCSS, Express.js, TypeScript, PostgreSQL, Prisma, Zod",
        "created": "2026-09-06",
        "current_milestone": "Final Hackathon Deliverable Shipped",
        "next_action": "Archive hackathon post-mortem notes",
        "desc": "25-table PostgreSQL enterprise commercial core built for the Odoo Hackathon Grand Finale 2026. Features CPQ & pricing, Blended Risk governance, greedy warehouse split, hybrid billing, backorders, and customer portal negotiation."
    },
    {
        "slug": "clavion",
        "id": "clavion",
        "title": "Clavion Desktop AI Piano Transcription",
        "tier": "incubation",
        "status": "active",
        "health": "on-track",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/clavion",
        "stack": "Flutter, Dart, Rust, flutter_rust_bridge, ONNX Runtime, basic-pitch, OxiSynth, SQLite",
        "created": "2026-09-01",
        "current_milestone": "Milestone 2: Import MVP Closed",
        "next_action": "Start Milestone 3: Note Correction Editor & Bias-Correction",
        "desc": "High-performance desktop AI piano transcription and synthesis app built with Flutter and Rust via flutter_rust_bridge. Powered by Spotify's basic-pitch model, ONNX Runtime with Ed25519-signed manifests, and OxiSynth playback."
    },
    {
        "slug": "hadi-frontend",
        "id": "hadi-frontend",
        "title": "Hadi Perfumes Frontend v2",
        "tier": "client",
        "status": "active",
        "health": "on-track",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/hadi-frontend",
        "stack": "React, Next.js, TypeScript, TailwindCSS, Zustand",
        "created": "2026-08-29",
        "current_milestone": "Storefront & Member Hierarchy UI",
        "next_action": "Integrate MLM commission ledger endpoints with NestJS backend",
        "desc": "Frontend web client for Hadi Perfumes e-commerce and member hierarchy platform, interfacing with the FTC-compliant NestJS modular backend."
    },
    {
        "slug": "browser-agent",
        "id": "browser-agent",
        "title": "Government Browser Agent",
        "tier": "incubation",
        "status": "active",
        "health": "on-track",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/browser-agent",
        "stack": "Python, Playwright, FastAPI, OpenRouter API, Uvicorn, Pytest",
        "created": "2026-08-27",
        "current_milestone": "Semantic form filling closed-loop agent",
        "next_action": "Add captcha detection and escalation flow",
        "desc": "Semantic, closed-loop browser agent designed for autonomous navigation and government portal form filling using Playwright automation and OpenRouter reasoning models."
    },
    {
        "slug": "prediction-system",
        "id": "prediction-system",
        "title": "PlacementPulse AI (Cognizant Hackathon)",
        "tier": "hackathon",
        "status": "completed",
        "health": "on-track",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/prediction_system",
        "stack": "Python 3.9+, Streamlit, Scikit-Learn, XGBoost, OpenRouter LLM, Pandas",
        "created": "2026-08-19",
        "current_milestone": "31/31 passing unit tests and multi-domain simulation suite",
        "next_action": "Maintain as reference benchmark for ML placement modeling",
        "desc": "Adaptive multi-domain student placement prediction engine and cohort policy simulator pairing LLM semantic schema profiling with high-performance deterministic AutoML (Random Forest ROC-AUC 1.00)."
    },
    {
        "slug": "feynman",
        "id": "feynman",
        "title": "Feynman Learning AI Tutor",
        "tier": "incubation",
        "status": "active",
        "health": "stalled",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/feynman",
        "stack": "React, TypeScript, Vite, Gemini API",
        "created": "2026-08-04",
        "current_milestone": "Concept explanation breakdown engine",
        "next_action": "Revise prompt harness for student concept gap detection",
        "desc": "Interactive web application implementing the Feynman learning technique with AI, requiring students to explain complex concepts in plain English and diagnosing mental model gaps."
    },
    {
        "slug": "voice-recorder",
        "id": "voice-recorder",
        "title": "VoiceRecorder Audio Utility",
        "tier": "foundation",
        "status": "active",
        "health": "stalled",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/VoiceRecorder",
        "stack": "TypeScript, Web Audio API, React",
        "created": "2026-07-25",
        "current_milestone": "Audio stream capture & WAV encoder",
        "next_action": "Evaluate integration into AI Invoice Studio STT pipeline",
        "desc": "Low-latency browser audio recording and encoding utility supporting clean audio chunking and speech streaming for downstream transcription engines."
    },
    {
        "slug": "mindwell",
        "id": "mindwell",
        "title": "MindWell Mental Health Platform",
        "tier": "incubation",
        "status": "paused",
        "health": "dormant",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/mindwell",
        "stack": "JavaScript, Node.js, Express, MongoDB",
        "created": "2026-07-22",
        "current_milestone": "Journaling and mood tracking prototype",
        "next_action": "Decide on merging insights into CrisisSignal architecture",
        "desc": "Student mental health wellness and journal platform providing sentiment-aware tracking and emotional wellness resources."
    },
    {
        "slug": "zenith",
        "id": "zenith",
        "title": "Zenith Dojo CRUD Engine",
        "tier": "foundation",
        "status": "completed",
        "health": "dormant",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/Zenith",
        "stack": "TypeScript, React, Node.js, Express",
        "created": "2026-07-19",
        "current_milestone": "Type-safe CRUD architecture demo",
        "next_action": "Archive as standard TypeScript scaffold pattern",
        "desc": "Clean Dojo-style full-stack CRUD application demonstrating strictly typed entity lifecycles and modern state management patterns."
    },
    {
        "slug": "crisis-android",
        "id": "crisis-android",
        "title": "Crisis Alert Android Client (CrisisSignal Companion)",
        "tier": "hackathon",
        "status": "active",
        "health": "dormant",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/Crisis",
        "stack": "Kotlin, Android SDK, TensorFlow Lite, Flower",
        "created": "2026-02-28",
        "current_milestone": "On-device crisis sensor data collector",
        "next_action": "Sync sensor event pipeline with Python CrisisSignal backend",
        "desc": "Native Android mobile client built in Kotlin for the CrisisSignal early warning system, using on-device TFLite models and Flower federated learning for privacy-preserving crisis alerts."
    },
    {
        "slug": "game-of-life",
        "id": "game-of-life",
        "title": "Conway's Game of Life Simulation",
        "tier": "foundation",
        "status": "completed",
        "health": "dormant",
        "visibility": "private",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/game_of_life",
        "stack": "TypeScript, HTML5 Canvas",
        "created": "2026-02-23",
        "current_milestone": "Grid evolution engine with toroidal wrapping",
        "next_action": "Maintain as algorithm reference",
        "desc": "Deterministic implementation of Conway's Game of Life cellular automaton in TypeScript with real-time canvas rendering and custom pattern presets."
    },
    {
        "slug": "vajra",
        "id": "vajra",
        "title": "Vajra System Defense & Automation",
        "tier": "incubation",
        "status": "paused",
        "health": "dormant",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/vajra",
        "stack": "Python, OS Automation, Security Scripts",
        "created": "2026-02-22",
        "current_milestone": "Host baseline security scanner",
        "next_action": "Review tools for vault maintenance integration",
        "desc": "Python-based host defense and automated administration toolkit providing security verification and endpoint management routines."
    },
    {
        "slug": "neo-creation",
        "id": "neo-creation",
        "title": "Neo Creation Creative Canvas",
        "tier": "foundation",
        "status": "completed",
        "health": "dormant",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/neo_creation",
        "stack": "TypeScript, CSS3 Animation, Three.js",
        "created": "2026-01-31",
        "current_milestone": "Experimental interactive UI canvas",
        "next_action": "Reference for RealMe 3D portfolio animation components",
        "desc": "Creative frontend interaction and animation sandbox exploring shaders, canvas geometry, and dynamic physics micro-interactions."
    },
    {
        "slug": "shell",
        "id": "shell",
        "title": "Custom C Unix Shell Implementation",
        "tier": "foundation",
        "status": "completed",
        "health": "dormant",
        "visibility": "private",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/Shell",
        "stack": "C, POSIX API, fork/exec, Signals, Pipes",
        "created": "2025-12-09",
        "current_milestone": "Deterministic command parser and piping architecture",
        "next_action": "Core OS interview prep reference for processes and signals",
        "desc": "Low-level custom Unix shell implemented in C from first principles, supporting argument parsing, process forking, background jobs, signal traps, and multi-stage I/O redirection pipelines."
    },
    {
        "slug": "game-2048",
        "id": "game-2048",
        "title": "2048 Web Game Engine",
        "tier": "foundation",
        "status": "completed",
        "health": "dormant",
        "visibility": "private",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/2048",
        "stack": "JavaScript, HTML5, CSS Grid",
        "created": "2025-10-10",
        "current_milestone": "Matrix movement and merge mechanics",
        "next_action": "Archive as standard game loop reference",
        "desc": "Classic sliding puzzle 2048 implementation in pure JavaScript featuring smooth CSS transitions, score persistence, and recursive tile merge matrices."
    },
    {
        "slug": "generative-ai-for-beginners",
        "id": "generative-ai-for-beginners",
        "title": "Generative AI 21-Lesson Study Notes",
        "tier": "archive",
        "status": "completed",
        "health": "dormant",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/generative-ai-for-beginners",
        "stack": "Jupyter Notebook, Python, LangChain, OpenAI API",
        "created": "2025-10-06",
        "current_milestone": "21 core generative AI architectural patterns explored",
        "next_action": "Reference notes for LLM prompt engineering",
        "desc": "Comprehensive workbook and notebook implementations covering 21 foundational lessons in Generative AI: prompt engineering, RAG, embeddings, vector databases, and agent orchestration."
    },
    {
        "slug": "blood-donation-network",
        "id": "blood-donation-network",
        "title": "Blood Donation Network Portal",
        "tier": "foundation",
        "status": "completed",
        "health": "dormant",
        "visibility": "public",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/BloodDonationNetwork",
        "stack": "JavaScript, Node.js, Express, MongoDB",
        "created": "2026-08-07",
        "current_milestone": "Donor matching and emergency notification portal",
        "next_action": "Archive as web portal reference",
        "desc": "Community emergency blood donation matching system connecting donors with critical hospital blood bank requests in real time."
    },
    {
        "slug": "track-intern-old",
        "id": "track-intern-old",
        "title": "TrackIntern Legacy Internship Tracker",
        "tier": "archive",
        "status": "completed",
        "health": "dormant",
        "visibility": "private",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/TrackInternOld",
        "stack": "TypeScript, Next.js, TailwindCSS",
        "created": "2025-10-02",
        "current_milestone": "Job application kanban board",
        "next_action": "Replaced by Codex placement tracking",
        "desc": "Early personal internship application pipeline tracker built with Next.js and TailwindCSS to log company application stages."
    },
    {
        "slug": "echo-mind",
        "id": "echo-mind",
        "title": "EchoMind Private Mental Health Notes",
        "tier": "archive",
        "status": "completed",
        "health": "dormant",
        "visibility": "private",
        "export": "false",
        "repo_reference": "https://github.com/MuzammilCk/echoMind",
        "stack": "TypeScript, React, LocalStorage",
        "created": "2025-09-12",
        "current_milestone": "Local-first voice and thought log capture",
        "next_action": "Archived in favor of Obsidian second-brain vault",
        "desc": "Private client-side emotional reflection and daily mental capture notebook storing encrypted reflections in browser localStorage."
    },
]


def main():
    os.makedirs(PROJECTS_DIR, exist_ok=True)
    created_count = 0

    for p in PROJECTS:
        overview_path = os.path.join(PROJECTS_DIR, f"{p['slug']}.md")
        decisions_path = os.path.join(PROJECTS_DIR, f"{p['slug']}-decisions.md")

        # Create overview file if not exists
        if not os.path.exists(overview_path):
            content = f"""---
id: "{p['id']}"
title: "{p['title']}"
type: project
tier: {p['tier']}
status: {p['status']}
health: {p['health']}
visibility: {p['visibility']}
export: "{p['export']}"
repo_reference: {p['repo_reference']}
stack: {p['stack']}
current_milestone: "{p['current_milestone']}"
next_action: "{p['next_action']}"
created: {p['created']}
last-updated: 2026-09-17
---

# {p['title']}

{p['desc']}

## Problem & Overview

{p['desc']}

## Tech Stack & Architecture

- **Primary Technologies**: {p['stack']}
- **Repository**: [{p['title']}]({p['repo_reference']})
- **Visibility**: {p['visibility'].capitalize()}

## Current State & Next Steps

- **Milestone**: {p['current_milestone']}
- **Next Action**: {p['next_action']}
- **Health**: {p['health']} (`status: {p['status']}`)

## Repository Reference

Source repository tracked at [{p['repo_reference']}]({p['repo_reference']}).
"""
            with open(overview_path, "w", encoding="utf-8") as f:
                f.write(content)
            created_count += 1

        # Create companion decisions log if not exists
        if not os.path.exists(decisions_path):
            decisions_content = f"""# {p['title']} Decision Log

Decision journal and architectural audit trail for the {p['title']} project.

## {p['created']} — DR-01: Initial Architecture & Scaffolding
**Context:** Initial project setup and core tech stack selection.
**Decision:** Selected {p['stack']} for core implementation.
**Alternatives considered:** Standard off-the-shelf alternatives evaluated during initial design spike.
**Status:** active
"""
            with open(decisions_path, "w", encoding="utf-8") as f:
                f.write(decisions_content)

    print(f"[Done] Created {created_count} project overview & decision documents in {PROJECTS_DIR}")


if __name__ == "__main__":
    main()
