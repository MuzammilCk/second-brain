"""
Fix remaining frontmatter issues after fix_markdown_rendering.py:
1. related: <null/blank> -> related: []
2. sources: <null/blank> -> sources: []  (only if completely empty, not if list exists)
"""
import re, sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

WIKI = Path(__file__).resolve().parent.parent / "wiki"
FM_PAT = re.compile(r'^(---[ \t]*\n)(.*?)(\n---[ \t]*\n)', re.DOTALL)

# Match related or sources that are null/blank (no value, no list items follow before next key)
NULL_FIELD_RE = re.compile(
    r'^((?:related|sources):[ \t]*)(\n(?=[ \t]*[a-z]|\n---))',
    re.MULTILINE
)

fixed = []

for f in WIKI.rglob("*.md"):
    original = f.read_text(encoding="utf-8", errors="replace")
    m = FM_PAT.match(original)
    if not m:
        continue

    fm_open, fm_body, fm_close = m.group(1), m.group(2), m.group(3)
    body = original[m.end():]

    new_fm = NULL_FIELD_RE.sub(lambda mo: mo.group(1) + " []\n", fm_body)

    if new_fm != fm_body:
        new_content = fm_open + new_fm + fm_close + body
        f.write_text(new_content, encoding="utf-8")
        rel = f.relative_to(WIKI).as_posix()
        fixed.append(rel)
        print(f"  Fixed null field: {rel}")

print(f"\nDone. Fixed {len(fixed)} file(s).")
