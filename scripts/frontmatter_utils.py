"""
scripts/frontmatter_utils.py
Shared frontmatter/body parser used by verify_boundaries.py and compile_portfolio.py.
Keeping this in one place means the two scripts can't quietly drift apart on how
frontmatter is parsed.
"""

import re

_PRIVATE_BLOCK_RE = re.compile(r"<!--\s*PRIVATE\s*-->.*?<!--\s*END_PRIVATE\s*-->", re.DOTALL)


def parse_frontmatter_and_body(text):
    """Split a markdown file into (frontmatter_dict, body_text).

    Also strips <!-- PRIVATE --> ... <!-- END_PRIVATE --> blocks from the body.
    Note: this stripping is a defense-in-depth backstop, not the primary control.
    The primary control is that compile_portfolio.py only ever reads from
    core/wiki/, never from core/private/ — a mismatched/missing END_PRIVATE
    marker means this regex silently strips nothing, so don't rely on it alone.
    """
    frontmatter = {}
    body = text

    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            for line in parts[1].strip().split("\n"):
                if ":" in line:
                    k, v = line.split(":", 1)
                    frontmatter[k.strip()] = v.strip().strip("\"'")
            body = parts[2]

    body = _PRIVATE_BLOCK_RE.sub("", body)
    return frontmatter, body.strip()
