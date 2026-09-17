#!/usr/bin/env python3
"""
scripts/enrich_existing_projects.py
Safely injects agile tracker frontmatter fields into existing Tier 1/2 project files.
Preserves all existing frontmatter keys, body text, and the 6-part schema.
"""

import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECTS_DIR = os.path.join(ROOT, "core", "wiki", "projects")

ENRICHMENTS = {
    "ytclfr": {
        "tier": "flagship",
        "health": "on-track",
        "visibility": "public",
        "current_milestone": "Staged video-intelligence pipeline end-to-end extraction",
        "next_action": "Test Stage A S3 fallback wrapper on sample compilation videos",
    },
    "metatune": {
        "tier": "flagship",
        "health": "on-track",
        "visibility": "public",
        "current_milestone": "Dataset-aware AutoML hyperparameter optimization",
        "next_action": "Benchmark Google Vizier Pythia search space policies",
    },
    "invoice-studio": {
        "tier": "flagship",
        "health": "on-track",
        "visibility": "public",
        "current_milestone": "Local offline-first voice billing app migration",
        "next_action": "Verify local Flask STT sidecar with Ollama qwen3:8b",
    },
    "esg-audit-system": {
        "tier": "flagship",
        "health": "on-track",
        "visibility": "public",
        "current_milestone": "LangGraph multi-agent ESG audit coordination",
        "next_action": "Validate Presidio PII anonymization in isolated enclave",
    },
    "realme": {
        "tier": "flagship",
        "health": "on-track",
        "visibility": "public",
        "current_milestone": "Narrative 3D web experience with Verlet physics",
        "next_action": "Optimize gyro camera interactions and cloth shader render loop",
    },
    "masm-studio": {
        "tier": "flagship",
        "health": "on-track",
        "visibility": "public",
        "current_milestone": "Deterministic 16-bit 8086 Assembly cloud IDE",
        "next_action": "Expand Monaco syntax autocompletions for register trace mapping",
    },
    "repomind": {
        "tier": "flagship",
        "health": "on-track",
        "visibility": "public",
        "current_milestone": "Dual-gear CodeQL & Gemini repository security analyzer",
        "next_action": "Tune rate compliance cache for large codebase indexing",
    },
    "fitness-platform": {
        "tier": "incubation",
        "health": "stalled",
        "visibility": "public",
        "current_milestone": "Type-safe FitTech tracking monorepo (useMe)",
        "next_action": "Refactor Drizzle ORM queries for workout log aggregation",
    },
    "healthsync": {
        "tier": "incubation",
        "health": "dormant",
        "visibility": "public",
        "current_milestone": "Multi-role healthcare portal with real-time triage",
        "next_action": "Audit httpOnly JWT token rotation across client views",
    },
    "hadi": {
        "tier": "client",
        "health": "on-track",
        "visibility": "public",
        "current_milestone": "Modular monolithic MLM checkout engine",
        "next_action": "Enforce strict catalog concurrency guards in checkout pipeline",
    },
    "viva": {
        "tier": "client",
        "health": "on-track",
        "visibility": "public",
        "current_milestone": "Custom Next.js visual and mechanical overlay design",
        "next_action": "Finalize sound calibration portfolio showcase pages",
    },
    "crisissignal": {
        "tier": "hackathon",
        "health": "dormant",
        "visibility": "public",
        "current_milestone": "Federated on-device AI early crisis warning model",
        "next_action": "Benchmark TFLite model inference on mobile device battery life",
    },
    "assetflow": {
        "tier": "hackathon",
        "health": "completed",
        "visibility": "public",
        "current_milestone": "Odoo Hackathon 2026 Asset Tracker Monorepo",
        "next_action": "Retain as transaction scheduling reference implementation",
    },
    "odoo-hackathon": {
        "tier": "hackathon",
        "health": "completed",
        "visibility": "public",
        "current_milestone": "24-hour in-person hackathon finale (Team 583)",
        "next_action": "Cross-reference learnings with DealFlow360 architecture",
    },
}


def main():
    updated = 0
    for slug, meta in ENRICHMENTS.items():
        filepath = os.path.join(PROJECTS_DIR, f"{slug}.md")
        if not os.path.exists(filepath):
            continue
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
        if not fm_match:
            continue
        fm_text = fm_match.group(1)
        body = content[fm_match.end():]

        # Only inject if tier is not already present
        if "tier:" not in fm_text:
            injected_fields = (
                f"tier: {meta['tier']}\n"
                f"health: {meta['health']}\n"
                f"visibility: {meta['visibility']}\n"
                f"current_milestone: \"{meta['current_milestone']}\"\n"
                f"next_action: \"{meta['next_action']}\"\n"
            )
            new_fm = fm_text.strip() + "\n" + injected_fields
            new_content = f"---\n{new_fm}---\n\n{body}"
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            updated += 1

    print(f"[Done] Enriched {updated} project files with agile tracker metadata.")


if __name__ == "__main__":
    main()
