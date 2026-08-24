---
title: Video Intelligence Pipelines
type: concept
sources:
  - raw/claude-exports/ytclfr.md
  - raw/claude-exports/Building-ytclfr-v2-with-staged-signal-analysis.md
  - raw/claude-exports/Ytclfr-v3-audit-and-performance-optimization-plan-review.md
related:
  - "[[wiki/projects/ytclfr]]"
created: 2026-02-28
last-updated: 2026-08-03
---

# Video Intelligence Pipelines

Video intelligence pipelines process raw video files to extract structured semantics, objects, speech, and overlays. Standard processing flows suffer from high compute cost and latency due to running heavy spatial/temporal networks (e.g. YOLO, OCR, Whisper) concurrently.

## Staged Signal Analysis Architecture

A modern optimized pipeline mitigates compute waste by structuring analysis into chronological progressive gates. This was a core architectural change from V1 to V2 in the [[wiki/projects/ytclfr|ytclfr]] project.

```
Raw Media URL
     │
     ▼
[Ingestion & Cheap Metadata Probe]
     │
     ▼
[Stage A: Signal Census Gate] ──(Detect Silence/ASR tracks/OCR overlays)
     │
     ├── Speech? ──► [Stage B: Speech-to-Text Processing] ──┐
     ├── Text?   ──► [Stage B: Graphic Text OCR Parser]    ──┼──► [Stage C: Fusion Log]
     └── Motion? ──► [Stage B: Temporal Scene Segmentor]  ──┘          │
                                                                        ▼
                                                         [Stage D: Schema & Map Solver]
```

### 1. Ingestion Gate
- Downloads media file wrappers and runs fast metadata extractors (e.g. using `ffprobe` or `yt-dlp` output objects). Captures basic features: aspect ratios, container types, length, captions, titles, tags.

### 2. Signal Census (Stage A)
- Executes cheap analysis to map out what heavy models need to run:
  - **Audio Check**: Splits signals to detect if a track is speech-only, music-only, vocal/melody blend, or completely silent.
  - **OCR Check**: Checks for graphic content layout distributions (slide formatting vs movie vs screen recording) to determine if OCR is required.
  - **Temporal Cuts check**: Counts cuts per minute and motion density.

### 3. Targeted Extraction (Stage B)
- Instantiates child jobs under a worker queue (e.g. Celery) using lazy-loading triggers to conserve memory. Only runs models matching detected signals:
  - `faster-whisper` for localized speech.
  - `PaddleOCR` for graphic overlay texts.
  - Frame sampling processors.

### 4. Evidence Fusion & Mapping (Stage C & D)
- Aggregates multi-sensor timeline files into a unified JSON structure, solving overlaps (e.g., matching spoken terms with visual product overlays).
- Maps structured timelines to user intents and parent-child taxonomy trees via LLMs (e.g. Groq, Ollama).
