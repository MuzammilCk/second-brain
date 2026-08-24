"""
Automated Export Watcher & Extractor for Codex Vault
Scans raw/ and the user's Downloads directory for new Claude/ChatGPT/Notion export archives.
Automatically copies them to raw/ and runs the universal extractor.
"""

import os
import shutil
import sys
from datetime import datetime
from pathlib import Path

# Configure utf-8 encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

VAULT_ROOT = Path(__file__).resolve().parent.parent.parent
RAW_DIR = VAULT_ROOT / "raw"
USER_DOWNLOADS = Path.home() / "Downloads"

sys.path.insert(0, str(VAULT_ROOT / ".claude" / "scripts"))
from extract_exports import process_file_or_dir

def scan_and_extract_downloads():
    print("[Checking] Scanning Downloads folder for fresh AI exports...")
    if not USER_DOWNLOADS.exists():
        print(f"[Skip] Downloads directory not found at {USER_DOWNLOADS}")
        return

    found_exports = 0

    # 1. Search for conversations.json in Downloads
    for f in USER_DOWNLOADS.glob("conversations*.json"):
        dest = RAW_DIR / "claude-exports" / f.name
        print(f"[Found in Downloads] Copying {f.name} -> {dest}")
        shutil.copy2(f, dest)
        process_file_or_dir(dest, source_type="auto")
        found_exports += 1

    # 2. Search for chatgpt/claude/notion export zips
    for zip_file in USER_DOWNLOADS.glob("*.zip"):
        low_name = zip_file.name.lower()
        if any(k in low_name for k in ["claude", "chatgpt", "notion", "export"]):
            # Determine target folder
            if "notion" in low_name:
                target_sub = "notion-exports"
            elif "chatgpt" in low_name:
                target_sub = "chatgpt-exports"
            else:
                target_sub = "claude-exports"

            dest = RAW_DIR / target_sub / zip_file.name
            if not dest.exists():
                print(f"[Found Export Zip] Copying {zip_file.name} -> {dest}")
                shutil.copy2(zip_file, dest)
                process_file_or_dir(dest, source_type="auto")
                found_exports += 1

    # 3. Always run auto-scan on raw/
    print("[Scanning] Running universal extraction on raw/ folder...")
    process_file_or_dir(RAW_DIR, source_type="auto", overwrite=False)

    print("[Done] Export auto-extractor finished.")

if __name__ == "__main__":
    scan_and_extract_downloads()
