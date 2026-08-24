"""
Universal Data Export Extractor for Codex Vault
Supports: Claude (.json, .zip), ChatGPT (.json, .zip), Notion (.zip, folders)
Extracts and normalizes external archives into clean, structured Markdown files
under raw/claude-exports/, raw/chatgpt-exports/, or raw/notion-exports/.
"""

import argparse
import json
import os
import re
import sys
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# Configure utf-8 encoding for Windows terminal stdout
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def sanitize_filename(name: str) -> str:
    """Create a safe, clean filename for Windows/Linux filesystems."""
    clean = re.sub(r'[\\/*?:"<>|]', '', name)
    clean = re.sub(r'[\s_]+', '-', clean)
    clean = re.sub(r'-+', '-', clean).strip('-')
    if not clean:
        clean = "untitled"
    return clean[:80]


def clean_notion_title(filename: str) -> str:
    """Remove 32-character Notion export hex hashes from page names."""
    # e.g., 'Project Roadmap 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d.md' -> 'Project Roadmap.md'
    name = Path(filename).stem
    ext = Path(filename).suffix
    cleaned = re.sub(r'\s+[0-9a-fA-F]{32}$', '', name)
    return f"{cleaned}{ext}"


# ==============================================================================
# CLAUDE EXPORT EXTRACTOR
# ==============================================================================

def is_claude_json(data: Any) -> bool:
    """Check if JSON data matches Claude export format."""
    if isinstance(data, list) and len(data) > 0:
        item = data[0]
        if isinstance(item, dict) and "chat_messages" in item:
            return True
    return False


def extract_claude_data(
    conversations: List[Dict[str, Any]],
    output_dir: Path,
    overwrite: bool = False
) -> Tuple[int, int]:
    output_dir.mkdir(parents=True, exist_ok=True)
    extracted = 0
    skipped = 0

    for convo in conversations:
        uuid = convo.get("uuid", "")
        name = convo.get("name", "Untitled") or "Untitled"
        created_at = convo.get("created_at", "")

        date_str = ""
        if created_at:
            try:
                date_str = datetime.fromisoformat(created_at.replace("Z", "+00:00")).strftime("%Y-%m-%d")
            except Exception:
                date_str = str(created_at)[:10]

        safe_title = sanitize_filename(name)
        file_path = output_dir / f"{safe_title}.md"

        if file_path.exists() and not overwrite:
            try:
                with open(file_path, "r", encoding="utf-8") as existing_file:
                    content_start = existing_file.read(500)
                    if uuid and uuid in content_start:
                        skipped += 1
                        continue
            except Exception:
                pass
            file_path = output_dir / f"{safe_title}-{uuid[:8]}.md"

        messages = convo.get("chat_messages", [])
        body_lines = []

        for msg in messages:
            sender = msg.get("sender", "unknown")
            text = msg.get("text", "")

            if not text and "content" in msg and isinstance(msg["content"], list):
                parts = []
                for item in msg["content"]:
                    if isinstance(item, dict) and item.get("type") == "text":
                        parts.append(item.get("text", ""))
                text = "\n\n".join(parts)

            role_header = "### Human" if sender == "human" else "### Claude"
            body_lines.append(f"{role_header}\n\n{text.strip()}\n\n---")

        topic_escaped = name.replace('"', '\\"')
        md_content = f"""---
source: claude-exports
date: {date_str}
topic: "{topic_escaped}"
uuid: {uuid}
---

# {name}

---

""" + "\n\n".join(body_lines) + "\n"

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(md_content)

        extracted += 1

    return extracted, skipped


# ==============================================================================
# CHATGPT EXPORT EXTRACTOR
# ==============================================================================

def is_chatgpt_json(data: Any) -> bool:
    """Check if JSON data matches ChatGPT export format."""
    if isinstance(data, list) and len(data) > 0:
        item = data[0]
        if isinstance(item, dict) and ("mapping" in item or "conversation_id" in item):
            return True
    return False


def extract_chatgpt_messages(convo: Dict[str, Any]) -> List[Tuple[str, str]]:
    """Traverse ChatGPT mapping tree from current_node backwards to root."""
    mapping = convo.get("mapping", {})
    if not mapping:
        return []

    current_node = convo.get("current_node")
    ordered_nodes = []

    # If current_node is provided, backtrack to find the active conversation branch
    if current_node and current_node in mapping:
        curr = current_node
        while curr:
            node = mapping.get(curr)
            if not node:
                break
            ordered_nodes.append(node)
            curr = node.get("parent")
        ordered_nodes.reverse()
    else:
        # Fallback: topological or insertion order
        ordered_nodes = list(mapping.values())

    turns = []
    for node in ordered_nodes:
        msg = node.get("message")
        if not msg:
            continue

        author = msg.get("author", {})
        role = author.get("role", "")
        if role == "system":
            # Skip empty or default system prompts
            continue

        content = msg.get("content", {})
        parts = content.get("parts", [])
        text_pieces = []
        for p in parts:
            if isinstance(p, str):
                text_pieces.append(p)
            elif isinstance(p, dict) and "text" in p:
                text_pieces.append(p["text"])

        full_text = "\n\n".join(text_pieces).strip()
        if not full_text:
            continue

        header_role = "### Human" if role == "user" else "### ChatGPT"
        turns.append((header_role, full_text))

    return turns


def extract_chatgpt_data(
    conversations: List[Dict[str, Any]],
    output_dir: Path,
    overwrite: bool = False
) -> Tuple[int, int]:
    output_dir.mkdir(parents=True, exist_ok=True)
    extracted = 0
    skipped = 0

    for convo in conversations:
        convo_id = convo.get("id", convo.get("conversation_id", ""))
        title = convo.get("title", "Untitled") or "Untitled"
        create_time = convo.get("create_time")

        date_str = ""
        if create_time:
            try:
                date_str = datetime.fromtimestamp(create_time).strftime("%Y-%m-%d")
            except Exception:
                date_str = ""

        safe_title = sanitize_filename(title)
        file_path = output_dir / f"{safe_title}.md"

        if file_path.exists() and not overwrite:
            try:
                with open(file_path, "r", encoding="utf-8") as existing_file:
                    content_start = existing_file.read(500)
                    if convo_id and convo_id in content_start:
                        skipped += 1
                        continue
            except Exception:
                pass
            file_path = output_dir / f"{safe_title}-{convo_id[:8]}.md"

        turns = extract_chatgpt_messages(convo)
        if not turns:
            continue

        body_lines = [f"{role}\n\n{text}\n\n---" for role, text in turns]
        title_escaped = title.replace('"', '\\"')

        md_content = f"""---
source: chatgpt-exports
date: {date_str}
topic: "{title_escaped}"
uuid: {convo_id}
---

# {title}

---

""" + "\n\n".join(body_lines) + "\n"

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(md_content)

        extracted += 1

    return extracted, skipped


# ==============================================================================
# NOTION EXPORT EXTRACTOR
# ==============================================================================

def extract_notion_zip(
    zip_path: Path,
    output_dir: Path,
    overwrite: bool = False
) -> Tuple[int, int]:
    """Unpack a Notion export zip, clean titles, and add standardized frontmatter."""
    output_dir.mkdir(parents=True, exist_ok=True)
    extracted = 0
    skipped = 0

    with zipfile.ZipFile(zip_path, 'r') as zf:
        for zip_info in zf.infolist():
            if zip_info.is_dir():
                continue

            orig_filename = zip_info.filename
            if orig_filename.endswith(".md") or orig_filename.endswith(".csv"):
                # Clean Notion's 32-char UUID suffixes
                cleaned_name = clean_notion_title(Path(orig_filename).name)
                safe_name = sanitize_filename(Path(cleaned_name).stem) + Path(cleaned_name).suffix
                dest_path = output_dir / safe_name

                if dest_path.exists() and not overwrite:
                    skipped += 1
                    continue

                raw_bytes = zf.read(zip_info)
                try:
                    text_content = raw_bytes.decode("utf-8")
                except UnicodeDecodeError:
                    text_content = raw_bytes.decode("latin-1", errors="replace")

                # If markdown, attach standardized frontmatter if missing
                if safe_name.endswith(".md"):
                    topic_name = Path(cleaned_name).stem
                    if not text_content.startswith("---"):
                        frontmatter = f"""---
source: notion-exports
date: {datetime.now().strftime('%Y-%m-%d')}
topic: "{topic_name}"
---

"""
                        text_content = frontmatter + text_content

                with open(dest_path, "w", encoding="utf-8") as out_f:
                    out_f.write(text_content)

                extracted += 1

    return extracted, skipped


# ==============================================================================
# MAIN DISPATCHER & AUTO SCANNER
# ==============================================================================

def process_file_or_dir(
    target_path: Path,
    source_type: str = "auto",
    output_dir: Optional[Path] = None,
    overwrite: bool = False
):
    if not target_path.exists():
        print(f"[Error] Path not found: {target_path}")
        return

    # Handle Zip Archives
    if target_path.is_file() and target_path.suffix.lower() == ".zip":
        print(f"[Unpacking Zip] {target_path} ...")
        # Check zip contents
        with zipfile.ZipFile(target_path, 'r') as zf:
            names = zf.namelist()
            if "conversations.json" in names:
                # ChatGPT or Claude zip containing conversations.json
                data_bytes = zf.read("conversations.json")
                data = json.loads(data_bytes.decode("utf-8"))
                if is_chatgpt_json(data):
                    out = output_dir or Path("raw/chatgpt-exports")
                    ext, skip = extract_chatgpt_data(data, out, overwrite)
                    print(f"[ChatGPT] Extracted: {ext}, Skipped: {skip} to {out}")
                elif is_claude_json(data):
                    out = output_dir or Path("raw/claude-exports")
                    ext, skip = extract_claude_data(data, out, overwrite)
                    print(f"[Claude] Extracted: {ext}, Skipped: {skip} to {out}")
            else:
                # Likely Notion or general archive
                out = output_dir or Path("raw/notion-exports")
                ext, skip = extract_notion_zip(target_path, out, overwrite)
                print(f"[Notion/Archive] Extracted: {ext}, Skipped: {skip} to {out}")
        return

    # Handle JSON Files
    if target_path.is_file() and target_path.suffix.lower() == ".json":
        print(f"[Reading JSON] {target_path} ...")
        with open(target_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if source_type == "claude" or (source_type == "auto" and is_claude_json(data)):
            out = output_dir or Path("raw/claude-exports")
            ext, skip = extract_claude_data(data, out, overwrite)
            print(f"[Claude] Extracted: {ext} conversations, Skipped: {skip} into {out}")
        elif source_type == "chatgpt" or (source_type == "auto" and is_chatgpt_json(data)):
            out = output_dir or Path("raw/chatgpt-exports")
            ext, skip = extract_chatgpt_data(data, out, overwrite)
            print(f"[ChatGPT] Extracted: {ext} conversations, Skipped: {skip} into {out}")
        else:
            print(f"[Warning] Unknown JSON format in {target_path}.")
        return

    # Handle Directory Scanning
    if target_path.is_dir():
        print(f"[Scanning Directory] {target_path} ...")
        # 1. Check for Claude conversations.json
        claude_json = target_path / "claude-exports" / "conversations.json"
        if not claude_json.exists() and (target_path / "conversations.json").exists():
            # Check if root has conversations.json
            with open(target_path / "conversations.json", "r", encoding="utf-8") as f:
                d = json.load(f)
            if is_claude_json(d):
                claude_json = target_path / "conversations.json"
            elif is_chatgpt_json(d):
                cg_json = target_path / "conversations.json"
                ext, skip = extract_chatgpt_data(d, Path("raw/chatgpt-exports"), overwrite)
                print(f"[ChatGPT] Extracted: {ext}, Skipped: {skip}")

        if claude_json.exists():
            with open(claude_json, "r", encoding="utf-8") as f:
                d = json.load(f)
            if is_claude_json(d):
                ext, skip = extract_claude_data(d, Path("raw/claude-exports"), overwrite)
                print(f"[Claude] Extracted: {ext}, Skipped: {skip} into raw/claude-exports")

        # 2. Check for ChatGPT exports
        cg_dir = target_path / "chatgpt-exports"
        if cg_dir.exists():
            for jf in cg_dir.glob("*.json"):
                if jf.name == "conversations.json":
                    with open(jf, "r", encoding="utf-8") as f:
                        d = json.load(f)
                    if is_chatgpt_json(d):
                        ext, skip = extract_chatgpt_data(d, cg_dir, overwrite)
                        print(f"[ChatGPT] Extracted: {ext}, Skipped: {skip} into {cg_dir}")
            for zf in cg_dir.glob("*.zip"):
                process_file_or_dir(zf, source_type="chatgpt", output_dir=cg_dir, overwrite=overwrite)

        # 3. Check for Notion exports
        notion_dir = target_path / "notion-exports"
        if notion_dir.exists():
            for zf in notion_dir.glob("*.zip"):
                ext, skip = extract_notion_zip(zf, notion_dir, overwrite)
                print(f"[Notion] Extracted: {ext}, Skipped: {skip} into {notion_dir}")


def main():
    parser = argparse.ArgumentParser(
        description="Universal Export Extractor for Codex (Claude, ChatGPT, Notion)"
    )
    parser.add_argument(
        "input",
        nargs="?",
        default="raw",
        help="Input JSON file, ZIP file, or directory (default: 'raw')"
    )
    parser.add_argument(
        "--source",
        choices=["auto", "claude", "chatgpt", "notion"],
        default="auto",
        help="Source format type (default: auto)"
    )
    parser.add_argument(
        "--output",
        "-o",
        help="Custom output directory"
    )
    parser.add_argument(
        "--overwrite",
        "-f",
        action="store_true",
        help="Overwrite existing markdown files"
    )

    args = parser.parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output) if args.output else None

    process_file_or_dir(
        target_path=input_path,
        source_type=args.source,
        output_dir=output_path,
        overwrite=args.overwrite
    )


if __name__ == "__main__":
    main()
