---
title: YouTube Content Lifter and Field Recognizer
type: project
status: active
stack: Python 3.13, FastAPI, Celery, Redis, PostgreSQL, MongoDB, Docker, yt-dlp, faster-whisper, PaddleOCR, Ollama, Groq API, Pydantic v2
sources:
  - raw/claude-exports/ytclfr.md
  - raw/claude-exports/Building-ytclfr-v2-with-staged-signal-analysis.md
  - raw/claude-exports/Ytclfr-v3-audit-and-performance-optimization-plan-review.md
related:
  - "[[wiki/concepts/video-intelligence]]"
created: 2026-02-28
last-updated: 2026-08-03
---

# YouTube Content Lifter and Field Recognizer (ytclfr)

`ytclfr` is an AI-powered video intelligence pipeline designed to extract rich structured data (such as songs, movies, recipes, and products) from YouTube videos. Its main focus is text-laden or silent videos with overlays, enabling use-cases like generating Spotify playlists from music compilation videos.

## Architecture Overhaul (V2)

The system transitioned from a naive V1 architecture—which made early classification decisions and ran all loaders indiscriminately—to an evidence-based 4-stage pipeline in V2:

1. **Stage A — Signal Census**: Inspects the media file's metadata and stream contents to output a *Signal Manifest* (e.g., detecting if it contains speech-only, music-only, live action/animation, slideshows, scene counts, burned-in text overlays, or available subtitles).
2. **Stage B — Targeted Extraction**: Selectively runs expensive extractors based on the Stage A manifest (e.g., ASR is only run if speech exists, PaddleOCR only if text overlays are detected).
3. **Stage C — Evidence Fusion**: Merges all extracted events and data into a single queryable evidence log.
4. **Stage D — Taxonomy & Intent Mapping**: Triggers structured LLM queries to determine the final categories, user intents, and domain-specific schemas.

## Tech Stack & Runtime Environment

- **Infrastructure**: Run locally on a CPU-only environment (ThinkPad L13 Gen 2, Windows native, no WSL2).
- **Services**: Dockerized stack including a FastAPI web server, Celery task queue, Redis (message broker and SSE pub/sub), PostgreSQL (relational logs), and MongoDB (document state).
- **Core Libraries**: `faster-whisper` for local ASR, `PaddleOCR` for graphic text extraction, `yt-dlp` for downloads, `Groq API`/`Ollama` for local & cloud model optimization.

## Historical Decisions & Pivots
See the complete list of system designs and code fixes in [[ytclfr-decisions|ytclfr Decision Log]].
