---
id: "ytclfr"
title: YouTube Content Lifter and Field Recognizer
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/theytclfr
last_verified: 2026-09-21
stack: Python 3.13, FastAPI, Celery, Redis, PostgreSQL, MongoDB, Docker, yt-dlp, faster-whisper, PaddleOCR, Ollama, Groq API, Pydantic v2
sources:
  - raw/claude-exports/ytclfr.md
  - raw/claude-exports/Building-ytclfr-v2-with-staged-signal-analysis.md
  - raw/claude-exports/Ytclfr-v3-audit-and-performance-optimization-plan-review.md
related: []
created: 2026-02-28
last-updated: 2026-09-21
tier: flagship
health: on-track
visibility: public
current_milestone: "Staged video-intelligence pipeline end-to-end extraction"
next_action: "Test Stage A S3 fallback wrapper on sample compilation videos"
---

# YouTube Content Lifter and Field Recognizer (ytclfr)

AI-powered video intelligence pipeline that extracts rich structured data (songs, movies, recipes, products) from YouTube videos. Specializes in text-laden or silent videos with overlays — for example, generating a Spotify playlist from a music compilation video.

## Problem

Extracting structured entities (tracks, titles, ingredients, products) from YouTube videos requires combining multiple AI modalities: speech recognition, OCR for burned-in text, and LLM reasoning to map extracted signals to structured schemas. A naive approach runs all extractors on every video, wasting seconds of CPU time on ASR for silent videos and OCR for speech-only content. V1's early classification also made irreversible extraction decisions before enough signal was available.

## Architecture

A 4-stage evidence-based pipeline (V2 overhaul):

1. **Stage A — Signal Census**: Inspects media file metadata and stream contents, producing a *Signal Manifest*: speech presence, music presence, animation type (live/slideshow), scene count, burned-in text overlay detection, available subtitle tracks.
2. **Stage B — Targeted Extraction**: Runs only the extractors indicated by the Stage A manifest. ASR (`faster-whisper`) only if speech exists. PaddleOCR only if text overlays detected. Subtitle extraction if available tracks found.
3. **Stage C — Evidence Fusion**: Merges all extracted events into a single queryable evidence log with timestamps and confidence scores.
4. **Stage D — Taxonomy & Intent Mapping**: Structured LLM queries (Groq API or Ollama) determine the final categories, user intents, and domain-specific output schemas (e.g., track list, recipe card).

**Infrastructure**: Dockerized stack on a CPU-only ThinkPad L13 Gen 2 (Windows native, no WSL2). FastAPI web server, Celery task queue, Redis as message broker and SSE pub/sub, PostgreSQL for relational logs, MongoDB for document state.

## Constraints & Trade-offs

- **CPU-only constraint**: No GPU. `faster-whisper` runs in `int8` quantized mode for acceptable transcription speed. PaddleOCR is similarly constrained to CPU inference.
- **No WSL2**: All services run natively on Windows or in Docker Desktop. This eliminates certain Linux-only tooling.
- **Local-first LLMs**: Ollama (`qwen3:8b` and smaller models) is used as the default LLM backend. Groq API is a cloud fallback for throughput-sensitive tasks. No OpenAI dependency.
- **Evidence-gated extraction**: Stage B's conditional execution is the core cost control — skipping irrelevant extractors keeps per-video processing time bounded.

## Implementation Evidence

- Signal Census stage producing structured Signal Manifest JSON from ffprobe + header inspection.
- `faster-whisper` ASR integration (CPU, `int8` quantization, 100+ language support).
- PaddleOCR pipeline for burned-in subtitle and text overlay extraction.
- Celery task queue managing concurrent video processing jobs.
- Redis SSE pub/sub for real-time progress streaming to frontend clients.
- Dual LLM backend: Ollama (local) and Groq API (cloud), unified via an adapter interface.

## Current State

Active development. V2 architecture (4-stage pipeline) is implemented and functional. V3 audit underway to optimize per-stage latency and reduce false-positive OCR triggers on decorative overlays.

## Decisions

See the complete list of system designs and code fixes in [[ytclfr-decisions|ytclfr Decision Log]].


