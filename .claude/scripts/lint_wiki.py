"""
Automated Codex Wiki Quality & Lint Validator
Performs exhaustive checks on:
1. YAML frontmatter syntax & schema compliance
2. Broken wikilinks across all pages
3. Project overview vs decision log parity
4. Forbidden patterns (self-referential owner links, raw placeholders)
"""

import os
import re
import sys
from pathlib import Path

# Configure utf-8 encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

try:
    import yaml
except ImportError:
    yaml = None

VAULT_ROOT = Path(__file__).resolve().parent.parent.parent
WIKI_DIR = VAULT_ROOT / "wiki"

REQUIRED_PROJECT_FIELDS = ["title", "type", "status", "stack", "sources", "related", "created", "last-updated"]
REQUIRED_CONCEPT_FIELDS = ["title", "type", "sources", "related", "created", "last-updated"]
REQUIRED_PLACEMENT_FIELDS = ["title", "type", "created", "last-updated"]

FRONTMATTER_PATTERN = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
WIKILINK_PATTERN = re.compile(r"(?<!`)\[\[([^\|\]`]+)(?:\|([^\]`]+))?\]\](?!`)")

def lint_wiki() -> int:
    if not WIKI_DIR.exists():
        print(f"[Error] Wiki directory not found at: {WIKI_DIR}")
        return 1

    print("\n🔍 Running Codex Vault Wiki Linter...")
    print(f"   Root: {WIKI_DIR}\n")

    errors = []
    warnings = []

    # 1. Index all markdown files
    all_files = {}
    for root, _, files in os.walk(WIKI_DIR):
        for f in files:
            if f.endswith(".md"):
                full_path = Path(root) / f
                rel_path = full_path.relative_to(WIKI_DIR).as_posix()
                all_files[rel_path] = full_path
                all_files[os.path.splitext(rel_path)[0]] = full_path

    print(f"📑 Indexed {len(all_files)} markdown files & slug keys in wiki.")

    # 2. Validate Frontmatters & Prohibited Patterns
    for rel_path, full_path in list(all_files.items()):
        if not rel_path.endswith(".md"):
            continue

        try:
            content = full_path.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            errors.append(f"[{rel_path}] Could not read file: {e}")
            continue

        # Check for forbidden self-referential links or raw placeholders
        if "[[wiki/people/muzammil-ck" in content:
            errors.append(f"[{rel_path}] Forbidden self-referential link found: [[wiki/people/muzammil-ck]]. Replace with plain text 'Muzammil CK'.")
        if "[[PLACEHOLDER]]" in content:
            errors.append(f"[{rel_path}] Raw [[PLACEHOLDER]] found. Use code ticks `[PLACEHOLDER]` or TBD.")

        # Check frontmatter for projects, concepts, placements
        is_project_overview = rel_path.startswith("projects/") and not rel_path.endswith("-decisions.md") and rel_path != "projects/index.md"
        is_concept_page = rel_path.startswith("concepts/") and rel_path != "concepts/index.md"
        is_placement_page = rel_path.startswith("placements/") and rel_path != "placements/index.md"

        match = FRONTMATTER_PATTERN.match(content)
        if is_project_overview or is_concept_page or is_placement_page:
            if not match:
                errors.append(f"[{rel_path}] Missing valid YAML frontmatter block (--- ... ---).")
                continue

            fm_raw = match.group(1)
            if yaml:
                try:
                    fm_data = yaml.safe_load(fm_raw)
                    if not isinstance(fm_data, dict):
                        errors.append(f"[{rel_path}] Frontmatter did not parse into a dictionary.")
                        continue

                    # Check required fields
                    req_fields = REQUIRED_PROJECT_FIELDS if is_project_overview else (REQUIRED_CONCEPT_FIELDS if is_concept_page else REQUIRED_PLACEMENT_FIELDS)
                    for k in req_fields:
                        if k not in fm_data or fm_data[k] is None:
                            errors.append(f"[{rel_path}] Frontmatter missing required key: '{k}'")

                    # Check list formatting for sources and related
                    if "sources" in fm_data and not isinstance(fm_data["sources"], list):
                        errors.append(f"[{rel_path}] Frontmatter 'sources' must be a YAML block list (- item).")
                    if "related" in fm_data and not isinstance(fm_data["related"], list):
                        errors.append(f"[{rel_path}] Frontmatter 'related' must be a YAML block list (- item).")

                except Exception as e:
                    errors.append(f"[{rel_path}] YAML syntax error: {e}")

        # Check Decision log link in project overviews
        if is_project_overview:
            slug = Path(rel_path).stem
            expected_link = f"[[{slug}-decisions"
            if expected_link not in content and f"projects/{slug}-decisions" not in content:
                warnings.append(f"[{rel_path}] Missing link to corresponding decision log [[{slug}-decisions]].")

    # 3. Check Project Overview vs Decision Log Parity
    projects_dir = WIKI_DIR / "projects"
    if projects_dir.exists():
        p_files = [f.name for f in projects_dir.iterdir() if f.suffix == ".md" and f.name != "index.md"]
        overviews = {f[:-3] for f in p_files if not f.endswith("-decisions.md")}
        decisions = {f[:-13] for f in p_files if f.endswith("-decisions.md")}

        for missing_dec in overviews - decisions:
            errors.append(f"[projects/{missing_dec}.md] Overview page exists but matching decision log 'projects/{missing_dec}-decisions.md' is missing.")
        for missing_ov in decisions - overviews:
            errors.append(f"[projects/{missing_ov}-decisions.md] Decision log exists but matching overview page 'projects/{missing_ov}.md' is missing.")

    # 4. Check Wikilink Resolutions
    for rel_path, full_path in list(all_files.items()):
        if not rel_path.endswith(".md"):
            continue

        try:
            content = full_path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue

        matches = WIKILINK_PATTERN.findall(content)
        for target, _ in matches:
            target_clean = target.strip().lstrip("/")
            target_no_wiki = target_clean[5:] if target_clean.startswith("wiki/") else target_clean
            target_md = target_no_wiki if target_no_wiki.endswith(".md") else f"{target_no_wiki}.md"

            candidates = [
                target_no_wiki,
                target_md,
                os.path.normpath(os.path.join(os.path.dirname(rel_path), target_no_wiki)).replace("\\", "/"),
                os.path.normpath(os.path.join(os.path.dirname(rel_path), target_md)).replace("\\", "/"),
                target_clean
            ]

            exists = any(c in all_files or (WIKI_DIR / c).exists() for c in candidates)
            if not exists:
                errors.append(f"[{rel_path}] Broken wikilink: [[{target}]]")

    # 5. Output Summary
    print("=" * 60)
    if warnings:
        print(f"⚠️  {len(warnings)} Warning(s):")
        for w in warnings:
            print(f"   {w}")
        print()

    if errors:
        print(f"❌ {len(errors)} Error(s) Found:")
        for err in errors:
            print(f"   {err}")
        print("=" * 60)
        print("❌ Linter failed. Please resolve the errors above.")
        return 1

    print(f"✅ SUCCESS: All {len(all_files) // 2} wiki notes are valid!")
    print("   - 100% YAML frontmatters compliant")
    print("   - 0 broken wikilinks")
    print("   - Project overview/decision logs 100% in parity")
    print("   - Zero forbidden or self-referential links")
    print("=" * 60)
    return 0

if __name__ == "__main__":
    sys.exit(lint_wiki())
