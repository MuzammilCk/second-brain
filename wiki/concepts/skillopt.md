---
title: SkillOpt — Self-Evolving Agent Skills
type: concept
sources: https://github.com/microsoft/skillopt, https://microsoft.github.io/SkillOpt/docs/guideline.html, arXiv:2605.23904
related: [[wiki/concepts/automl]]
created: 2026-08-12
last-updated: 2026-08-12
---

# SkillOpt — Self-Evolving Agent Skills

**SkillOpt** is a Microsoft Research open-source framework that trains natural-language **skills** for frozen LLM agents the way you'd train a neural network — with epochs, batch sizes, learning rates, and validation gates — but **without touching model weights**. The trainable state is a single Markdown skill document.

## Core Mechanism

- **Treat the skill doc as parameters**: A natural-language skill (`best_skill.md`, typically 300–2,000 tokens) is appended to a frozen agent's system prompt. SkillOpt optimizes that document, not the model.
- **Rollout (forward pass)**: A frozen target model executes tasks using the current skill document.
- **Reflection (backward pass)**: A separate *optimizer model* analyzes the resulting trajectories, categorizes successes/failures, and proposes **bounded edits** — additions, deletions, or replacements.
- **Validation gate**: Candidate edits are evaluated against a held-out validation set. An edit is accepted **only if it strictly improves** performance — this prevents regression and overfitting.
- **Textual learning rate**: An edit budget limits how many edits apply per step.
- **Rejected-edit buffer**: Rejected proposals are stored locally so the optimizer doesn't repeat past mistakes.
- **Zero inference-time cost**: The optimized skill adds no extra model calls during deployment.

## Reported Results

- Best or tied-best on **all 52 evaluated (model, benchmark, harness) cells** across six benchmarks, seven target models, and three execution harnesses (direct chat, Codex CLI, Claude Code CLI).
- On GPT-5.5: average no-skill accuracy lifted **+23.5 points** (direct chat), **+24.8** (Codex agentic loop), **+19.1** (Claude Code).
- Optimized skills transfer across model scales, between Codex and Claude Code harnesses, and to nearby benchmarks.
- Sources: official GitHub README and docs; paper arXiv:2605.23904.

## SkillOpt-Sleep (v0.2.0+)

The **nightly offline self-evolution companion** for local coding agents (Claude Code, Codex, Cursor, Copilot, Devin). Runs a "sleep cycle" while the user is away:

```
harvest → mine recurring tasks → replay (real backend) → consolidate
(reflect → bounded edit → GATE on held-out tasks) → stage proposal → (you) adopt
```

One cycle is called a **night**. It synthesizes SkillOpt (validation-gated bounded text edits), Claude Dreams (offline consolidation, review-then-adopt), and agent-sleep (short-term experience → long-term competence).

### Data boundary (important)

- Harvesting is **local and read-only**; `mock` and `handoff` backends make **no provider calls**.
- A real backend **sends truncated transcript excerpts and derived tasks** to the chosen provider for mining, replay, judging, reflection — outbound prompts are *not guaranteed secret-free*.
- Recommended safe flow: `harvest` to a task file → inspect/redact → mark `"reviewed": true` → replay with `--tasks-file` using a real backend.

## CLI (installed locally)

```
pip install skillopt            # installs engine + `skillopt-sleep` command
skillopt-sleep dry-run          # harvest + mine + replay, report only, stages nothing
skillopt-sleep run              # full nightly cycle; proposal staged for review
skillopt-sleep status           # show state + latest staged proposal
skillopt-sleep adopt            # apply latest staged proposal
skillopt-sleep harvest          # debug: show mined tasks
skillopt-sleep schedule         # install nightly cron/Task Scheduler entry
skillopt-sleep unschedule       # remove it
```

Key flags (verified against local `--help`): `--project`, `--source` (`claude|codex|copilot|copilot_cli|cursor|pi|auto`), `--backend` (`mock|claude|codex|copilot|cursor|pi|handoff|azure_openai`), `--model`, `--lookback-hours`, `--max-sessions`, `--max-tasks`, `--edit-budget`, `--target-skill-path`, `--tasks-file`, `--progress`, `--auto-adopt`, `--preferences`, `--json`.

### Backends

- **`mock` / `handoff`**: no network calls (safe for smoke tests and review workflows).
- **`claude` / `codex` / `cursor` / `pi` / `copilot`**: shell out to the installed, **authenticated** CLI of that agent.
- **`azure_openai` in openai-compatible mode**: drives any OpenAI-compatible Chat Completions endpoint — **DeepSeek, self-hosted vLLM, Ollama** — via env vars (`AZURE_OPENAI_AUTH_MODE=openai_compatible`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`). This is the path for running the cycle on a non-Anthropic/OpenAI model. Requires install from `main` (the current PyPI 0.2.0 does not ship it).

## Local Machine Audit (2026-08-12, hands-on)

### What worked

- `pip install skillopt` → v0.2.0 installed; actually an **editable install from local clone** `C:\Users\THINKPAD L13\SkillOpt` (recent `main` checkout, so the openai-compatible path exists).
- `skillopt-sleep dry-run --backend mock` → ran cleanly: 2 sessions → 0 mined tasks, gate `accepted=False`, **no network calls**.
- `harvest --lookback-hours 0` → confirmed same result (only 2 sessions exist for this vault).
- `run --backend mock` → full pipeline completes end-to-end (night 2), stages nothing.
- `status` / `adopt` → correct behavior with no staged proposal ("nothing to adopt").
- State persisted to `~/.skillopt-sleep/` (`state.json`, evidence logs).

### What blocked a real (LLM-driven) night

1. **Claude CLI not authenticated** — `claude --version` works (2.1.228) but the backend got `Not logged in · Please run /login`; no `~/.claude/.credentials.json`, no `ANTHROPIC_API_KEY`. → Need `claude` → `/login` once.
2. **No `cursor-agent`** — Cursor app not installed on this machine (no `~/.cursor/projects`, no bin dirs). `--backend cursor` is impossible without installing Cursor + the Cursor Agent CLI.
3. **No session volume** — only 4 Claude sessions exist machine-wide (2 vault, 2 SkillOpt clone). The miner found **0 recurring task patterns**, so there was nothing to replay/consolidate even with a working backend.
4. **Local Ollama model too large** — Ollama is running with `llama3.1:8b` at `http://127.0.0.1:11434/v1`, but the model fails to load: `failed to allocate buffer of size 3359637504` (CPU buffer allocation error, ~3.3 GB). Machine RAM insufficient for the 8B model → the self-hosted openai-compatible path can't run until a smaller model is pulled (e.g. `llama3.2:3b` / `qwen2.5:1.5b`) or RAM is freed.

### Bottom line

The **pipeline works end-to-end** on this machine (mock runs cleanly). What's missing for a real self-evolution night is **one authenticated/usable LLM backend** + **enough session history** to mine recurring tasks. Priority fix: log into `claude` (`/login`), or pull a small Ollama model and use `--backend azure_openai` in compat mode.

## Integration Ideas

- Run the sleep cycle nightly against an actively developed project (e.g. [[wiki/projects/ytclfr]]) after a few weeks of sessions accumulate — the miner needs recurring tasks to be useful.
- Use `--target-skill-path` to point adoption at a real project `SKILL.md` instead of the managed skill.
- Wire `--tasks-file` review flow for sensitive projects (inspect/redact before real backend).
