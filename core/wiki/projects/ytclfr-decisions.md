# ytclfr Decision Log

Decision journal and architectural audit trail for the YouTube Content Lifter and Field Recognizer project.

## 2026-02-28 — DR-V2-01: Windows Celery Async Event Loop
**Context:** Celery worker tasks executing async pipelines on Windows with Python 3.13 threw event loop errors when using `asyncio.run()`, due to event loop lifetime conflicts in Windows sub-processes.
**Decision:** Replaced `asyncio.run()` calls inside Celery task wrappers with a custom loop management pattern using `asyncio.new_event_loop()` and manual loop attachment.
**Alternatives considered:** Using thread-based workers instead of gevent/solo, which lost concurrency efficiency; running on Linux (avoided to keep development native to Windows ThinkPad).
**Status:** active

## 2026-02-28 — DR-V2-02: amqp 5.2.0 Pinning on Windows
**Context:** Windows builds crashed on startup when importing Celery dependencies, trying to load Kerberos (`gssapi`) bindings which fail to build locally on Windows.
**Decision:** Explicitly pinned `amqp==5.2.0` in `requirements.txt` to prevent pip from resolving dependencies requiring Kerberos modules.
**Alternatives considered:** Installing MS Build tools and attempting custom compiling (complex and breaks runtime portability).
**Status:** active

## 2026-02-28 — DR-V2-03: User Password Pre-Hashing
**Context:** The `bcrypt` authentication service in `auth.py` silently truncates passwords longer than 72 bytes, presenting a security vulnerability for long passphrases and API keys.
**Decision:** Welded a SHA-256 pre-hashing helper `_prehash()` into the token/auth process, passing the hashed output to bcrypt to ensure constant length inputs under the 72-byte ceiling.
**Alternatives considered:** Switching to Argon2 (avoided to prevent database migration overhead at this phase).
**Status:** active

## 2026-05-06 — DR-V2-04: Four-Stage Evidence-Based Pipeline
**Context:** V1 performed early category guessing on URLs, leading to inaccurate extracts and wasting CPU resources executing all extractors (ASR, OCR, etc.) on every video regardless of whether they contained relevant signals.
**Decision:** Overhauled the pipeline to partition processing into four distinct stages: Stage A (Signal Census), Stage B (Targeted Extraction), Stage C (Evidence Fusion), and Stage D (Taxonomy mapping).
**Alternatives considered:** Adding more complex routing regexes in V1 (unscalable and still prone to missing speech or silent slides).
**Status:** active

## 2026-05-06 — DR-V2-05: Stack-Local State in Frame Sampler
**Context:** A thread-safety audit of Stage A's `frame_sampler.py` revealed that use of a module-level global variable `_partial_result` led to cross-job data corruption when multiple concurrent Celery threads processed frames.
**Decision:** Refactored state storage to use stack-local contexts, encapsulating frame collection logic in a nested helper function `_partial` powered by `threading.Event` to sync states.
**Alternatives considered:** Locking thread execution (rejected as it causes a serious bottleneck in frame processing efficiency).
**Status:** active

## 2026-05-06 — DR-V2-06: S3 Temporary Media storage Fallback
**Context:** Stage A crashed during processing when `job.local_media_path` was `None`, which occurs because completed downloads are relocated to S3 storage and cleaned up locally to conserve disk space.
**Decision:** Implemented an S3 download fallback wrapper inside the Stage A manager, utilizing a `TempStorageManager` block to download files into a temporary `video_probe.mp4` location and clean it up in a `finally` block.
**Alternatives considered:** Keeping all media files locally (rejected; disk constraints on ThinkPad L13 development host are too tight).
**Status:** active
