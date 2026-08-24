"""
Automated Morning Briefing Generator for Codex Vault
Reads priorities.md, active project decisions, and generates daily brief.
Updates wiki/log.md and stores brief in journal/briefings/
"""

import os
import re
import sys
from datetime import datetime
from pathlib import Path

# Configure utf-8 encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

VAULT_ROOT = Path(__file__).resolve().parent.parent
if not (VAULT_ROOT / "wiki").exists() and (Path(__file__).resolve().parent / "wiki").exists():
    VAULT_ROOT = Path(__file__).resolve().parent

def parse_frontmatter(content: str) -> dict:
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not match:
        return {}
    try:
        import yaml
        data = yaml.safe_load(match.group(1))
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    fm = {}
    for line in match.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip('"').strip("'")
    return fm

def get_latest_decision(decisions_file: Path) -> str:
    if not decisions_file.exists():
        return "No decision entries recorded yet"
    text = decisions_file.read_text(encoding="utf-8", errors="replace")
    entries = re.findall(r"(##\s+\d{4}-\d{2}-\d{2}\s+—\s+[^\n]+)", text)
    if entries:
        return entries[-1].replace("## ", "").strip()
    return "No structured decision entries found"

def generate_morning_briefing() -> str:
    today_str = datetime.now().strftime("%Y-%m-%d")
    priorities_file = VAULT_ROOT / "priorities.md"
    wiki_projects_dir = VAULT_ROOT / "wiki" / "projects"
    log_file = VAULT_ROOT / "wiki" / "log.md"
    journal_dir = VAULT_ROOT / "journal" / "briefings"
    journal_dir.mkdir(parents=True, exist_ok=True)

    # 1. Read priorities
    priorities_text = ""
    active_projects = []
    if priorities_file.exists():
        priorities_text = priorities_file.read_text(encoding="utf-8", errors="replace")
        # Extract Projects section
        proj_match = re.search(r"## Projects\s*\n(.*?)(?=\n## |\Z)", priorities_text, re.DOTALL)
        if proj_match:
            for line in proj_match.group(1).strip().splitlines():
                line = line.strip()
                if line.startswith("-"):
                    name_match = re.search(r"\*\*(.*?)\*\*", line)
                    if name_match:
                        active_projects.append((name_match.group(1), line))

    # 2. Inspect active project files & decision logs
    project_threads = []
    for proj_name, _ in active_projects:
        # Match slug
        slug = proj_name.lower().replace(" ", "-").replace("ai-", "").replace("platform", "").strip("-")
        if slug == "invoice-studio" or "invoice" in slug:
            slug = "invoice-studio"
        elif "ytclfr" in slug:
            slug = "ytclfr"
        elif "metatune" in slug:
            slug = "metatune"

        overview_file = wiki_projects_dir / f"{slug}.md"
        decisions_file = wiki_projects_dir / f"{slug}-decisions.md"

        status = "active"
        if overview_file.exists():
            fm = parse_frontmatter(overview_file.read_text(encoding="utf-8", errors="replace"))
            status = fm.get("status", "active")
        
        latest_dec = get_latest_decision(decisions_file)
        project_threads.append(f"- **{proj_name}** (`{status}`): {latest_dec}")

    threads_md = "\n".join(project_threads) if project_threads else "- No active projects configured in priorities.md"

    # 3. Assemble Full Briefing
    briefing_md = f"""# ☀️ Morning Briefing — {today_str}

---

### 1. 📅 Today's Schedule
- **Calendar**: 0 events scheduled on primary calendar.

---

### 2. 🧵 Active Project Threads
{threads_md}

---

### 3. 🎯 Priority Reminders
- **Placement & DSA Prep**: Check `wiki/placements/dsa-tracker.md` confidence scores.
- **Project Work**: Continue active pipeline implementation.
- **Second Brain Upkeep**: Ingest new notes & commit vault updates.

---

### 4. ⚡ Suggested Actions for Today
1. 🧩 **DSA**: Solve 2–3 algorithmic problems in weak topics and log progress.
2. 💻 **Project Development**: Advance primary sprint deliverables.
3. 🧠 **Active Recall**: Run `/review` on one engineering concept page.
"""

    # 4. Append Marker to wiki/log.md
    if log_file.exists():
        log_content = log_file.read_text(encoding="utf-8", errors="replace")
        marker_line = f"- **{today_str} - briefing ran**: 0 events; {len(active_projects)} active projects; placement prep & DSA active"
        if marker_line not in log_content:
            lines = log_content.splitlines()
            insert_idx = 3
            for idx, l in enumerate(lines[:10]):
                if l.startswith("- **"):
                    insert_idx = idx
                    break
            lines.insert(insert_idx, marker_line)
            log_file.write_text("\n".join(lines) + "\n", encoding="utf-8")

    # 5. Save to journal
    journal_file = journal_dir / f"{today_str}.md"
    journal_file.write_text(briefing_md, encoding="utf-8")

    print(f"[Done] Morning briefing generated for {today_str}")
    print(f"[Saved] {journal_file}")
    return briefing_md

if __name__ == "__main__":
    briefing = generate_morning_briefing()
    print("\n" + briefing)
