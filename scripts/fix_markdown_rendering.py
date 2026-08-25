"""
Fix vault-wide markdown rendering issues:
1. `sources: raw/...` as inline string -> convert to proper YAML block list
2. `sources` list items that are [[wikilinks]] -> remove them (wikilinks belong in `related`)
3. Body wikilinks [[wiki/section/slug|display]] -> [[slug|display]] (Obsidian resolves by slug)
4. `related: []` as inline flow -> keep as-is (it's valid YAML); leave `related` block lists alone
"""
import re, sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

VAULT = Path(__file__).resolve().parent.parent
WIKI = VAULT / "wiki"

FM_PAT = re.compile(r'^(---[ \t]*\n)(.*?)(\n---[ \t]*\n)', re.DOTALL)

# Match sources as SINGLE inline value (not already a block list and not null/[])
# e.g.  sources: raw/claude-exports/foo.md
SOURCES_INLINE_RE = re.compile(
    r'^(sources:[ \t]+)(?!\[)(?!none)(?!null)([^\n]+)$',
    re.MULTILINE
)

# Match a sources block list item that is a wikilink
# e.g.   - "[[wiki/placements/odoo-hackathon]]"
#        -  [[wiki/...]]
SOURCES_WIKILINK_ITEM_RE = re.compile(
    r'\n[ \t]+-[ \t]+"?\[\[wiki/[^\]]+\]\]"?[ \t]*',
)

# Double-dashed items introduced by a previous bad run: `  - - item` -> `  - item`
DOUBLE_DASH_RE = re.compile(r'^([ \t]+-[ \t]+)-[ \t]+', re.MULTILINE)

# Body wikilinks with full wiki/ path [[wiki/section/slug|display]] or [[wiki/section/slug]]
BODY_FULL_WIKILINK_RE = re.compile(r'\[\[wiki/[^/\]]+/([^|\]]+)(?:\|([^\]]+))?\]\]')


def fix_frontmatter(fm: str) -> str:
    # Fix double-dashes from a previous bad run first
    fm = DOUBLE_DASH_RE.sub(r'\1', fm)

    # Fix inline sources
    def inline_replacer(m):
        val = m.group(2).strip()
        return f"sources:\n  - {val}"
    fm = SOURCES_INLINE_RE.sub(inline_replacer, fm)

    # Remove sources list items that are wikilinks
    fm = SOURCES_WIKILINK_ITEM_RE.sub('', fm)

    return fm


def fix_body_wikilinks(text: str) -> str:
    def replacer(m):
        slug = m.group(1)      # e.g. "ytclfr" or "odoo-hackathon"
        display = m.group(2)   # e.g. "ytclfr" or None
        if display:
            return f"[[{slug}|{display}]]"
        return f"[[{slug}]]"
    return BODY_FULL_WIKILINK_RE.sub(replacer, text)


fixed = []

for f in WIKI.rglob("*.md"):
    original = f.read_text(encoding="utf-8", errors="replace")
    content = original

    m = FM_PAT.match(content)
    if m:
        fm_open, fm_body, fm_close = m.group(1), m.group(2), m.group(3)
        body = content[m.end():]

        new_fm = fix_frontmatter(fm_body)
        new_body = fix_body_wikilinks(body)
        new_content = fm_open + new_fm + fm_close + new_body
    else:
        new_content = fix_body_wikilinks(content)

    if new_content != original:
        f.write_text(new_content, encoding="utf-8")
        rel = f.relative_to(WIKI).as_posix()
        fixed.append(rel)
        print(f"  Fixed: {rel}")

print(f"\nDone. Fixed {len(fixed)} file(s).")
