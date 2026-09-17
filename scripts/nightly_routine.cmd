@echo off
cd /d "D:\projects\codex"
python scripts\lint_wiki.py
python scripts\verify_boundaries.py
python scripts\compile_portfolio.py
python scripts\compile_concepts.py
python scripts\compile_progress.py
python scripts\compile_telemetry.py
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\auto_checkpoint.ps1
