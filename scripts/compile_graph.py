#!/usr/bin/env python3
"""
scripts/compile_graph.py
Parses markdown files to extract graph topology (Nodes & Edges).
Run with --scope public (core/wiki/ -> site/src/data/generated/public_graph.json)
or --scope private (core/private/ -> a local-only cache OUTSIDE site/).

Why the private output doesn't live under site/: the original version wrote
private_graph.json into site/src/data/generated/ — the exact directory this
whole architecture defines as PUBLIC/DEPLOYED. Node titles are pulled
straight from each file's first H1 or filename, so a private note titled
e.g. "Comp negotiation notes" becomes a node label verbatim. The only thing
stopping that from reaching the deployed site was a sentence of prose
("never bundled into the public deployment") and a promise that CI would
only ever pass --scope public. That's an instruction an agent or a future
you could get wrong; the destination path below makes it structurally
impossible instead, regardless of what flag gets passed.
"""

import os
import re
import json
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_DIR = (ROOT / "site").resolve()

WIKILINK_RE = re.compile(r"\[\[(.*?)\]\]")
TAG_RE = re.compile(r"(?:^|\s)#([a-zA-Z0-9_\-]+)")


def parse_markdown_file(file_path: Path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    title = file_path.stem
    h1_match = re.search(r"^#\s+(.+)$", content, re.M)
    if h1_match:
        title = h1_match.group(1).strip()

    tags = list(set(TAG_RE.findall(content)))

    raw_links = WIKILINK_RE.findall(content)
    links = []
    for link in raw_links:
        target = link.split("|")[0].split("#")[0].strip()
        if target:
            links.append(target.lower().replace(" ", "-"))

    return {
        "id": file_path.stem.lower().replace(" ", "-"),
        "title": title,
        "path": str(file_path.relative_to(ROOT)),
        "tags": tags,
        "word_count": len(content.split()),
        "outbound": links,
    }


def compile_graph(target_dir: Path, output_file: Path, scope: str):
    nodes = []
    node_ids = set()
    raw_nodes = []

    if not target_dir.exists():
        print(f"[{scope.upper()} GRAPH] {target_dir} does not exist, skipping.")
        return

    for path in target_dir.rglob("*.md"):
        data = parse_markdown_file(path)
        raw_nodes.append(data)
        node_ids.add(data["id"])

    edges = []
    for item in raw_nodes:
        nodes.append({
            "id": item["id"],
            "name": item["title"],
            "val": max(2, min(item["word_count"] // 50, 15)),
            "tags": item["tags"],
            "scope": scope,
        })
        for target in item["outbound"]:
            # Only create an edge if target exists in THIS scope's graph —
            # a wikilink from a public note to a private one silently drops
            # here rather than pulling the private node in, since node_ids
            # only ever contains files actually found under target_dir.
            if target in node_ids:
                edges.append({"source": item["id"], "target": target})

    graph_payload = {"nodes": nodes, "links": edges}

    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(graph_payload, f, indent=2)

    print(f"[{scope.upper()} GRAPH] Compiled {len(nodes)} nodes, {len(edges)} links -> {output_file}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--scope", choices=["private", "public"], default="public")
    args = parser.parse_args()

    if args.scope == "private":
        target = ROOT / "core" / "private"
        # Deliberately NOT under site/ — see module docstring. This directory
        # should also be in .gitignore.
        dest = ROOT / ".local" / "private_graph.json"
    else:
        target = ROOT / "core" / "wiki"
        dest = ROOT / "site" / "src" / "data" / "generated" / "public_graph.json"

    dest = dest.resolve() if dest.parent.exists() else dest
    # Hard guard: no matter what gets passed above, refuse to write a
    # private-scope graph anywhere under site/.
    if args.scope == "private" and str(dest.resolve()).startswith(str(SITE_DIR)):
        raise SystemExit(
            "Refusing to write a private-scope graph under site/ — "
            "this destination must stay outside the deployed directory."
        )

    compile_graph(target, dest, args.scope)
