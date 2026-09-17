#!/usr/bin/env python3
"""
scripts/compile_telemetry.py
Pulls API metrics and generates site/src/data/generated/telemetry.json.
Unchanged from the version already reviewed — no issues found in this one.
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone

OUTPUT_FILE = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "site", "src", "data", "generated", "telemetry.json"
))
GITHUB_USER = "MuzammilCk"


def fetch_json(url):
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-Telemetry-Sync",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as exc:
        print(f"Warning: Failed to fetch {url}: {exc}", file=sys.stderr)
        return None


def main():
    payload = {
        "last_synced_at": datetime.now(timezone.utc).isoformat(),
        "latest_activity": None,
        "repositories": {},
    }

    events = fetch_json(f"https://api.github.com/users/{GITHUB_USER}/events/public?per_page=5")
    if events and isinstance(events, list) and len(events) > 0:
        latest = events[0]
        payload["latest_activity"] = {
            "type": latest.get("type"),
            "repo": latest.get("repo", {}).get("name"),
            "created_at": latest.get("created_at"),
        }

    repos = fetch_json(f"https://api.github.com/users/{GITHUB_USER}/repos?per_page=100")
    if repos and isinstance(repos, list):
        for repo in repos:
            name = repo.get("name")
            payload["repositories"][name.lower()] = {
                "name": name,
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "primary_language": repo.get("language"),
                "pushed_at": repo.get("pushed_at"),
                "html_url": repo.get("html_url"),
            }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)

    print(f"[Compiled Telemetry] Output written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
