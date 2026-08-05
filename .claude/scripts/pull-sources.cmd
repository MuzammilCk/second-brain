@echo off
rem ============================================================================
rem  claude-pull-sources — scheduled headless runner for /pull-sources
rem  Task Scheduler: "claude-pull-sources" (daily 08:00, Start in: vault root)
rem
rem  Why this wrapper exists:
rem   - Custom slash commands are NOT expanded in `claude -p` (print) mode, so
rem     the command body from .claude/commands/pull-sources.md is streamed in
rem     as the prompt instead.
rem   - Headless runs need explicit auth + permissions: the OmniRoute gateway
rem     (localhost:20128), a local placeholder token, a fast model, and
rem     allowedTools for Bash + MCP gmail/calendar (acceptEdits alone would
rem     block on prompts and hang the run).
rem   - On exit it commits + pushes, mirroring .claude/hooks/auto-checkpoint.sh
rem     (the Stop hook does not reliably fire for headless -p exits).
rem
rem  The auth token is a LOCAL gateway placeholder, not a real credential.
rem  See implementation_plan.md Step 7a. Built 2026-08-05.
rem ============================================================================
cd /d "%~dp0..\.."
if errorlevel 1 exit /b 1

set "ANTHROPIC_BASE_URL=http://localhost:20128"
set "ANTHROPIC_AUTH_TOKEN=local-omniroute-gateway"
set "ANTHROPIC_MODEL=auto/best-fast"
set "ANTHROPIC_SMALL_FAST_MODEL=auto/best-fast"
set "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$raw = Get-Content -LiteralPath '.claude\commands\pull-sources.md' -Raw; $body = ($raw -replace '(?s)^---.*?\r?\n---\r?\n', '').Trim(); $body | & 'C:\Users\THINKPAD L13\.local\bin\claude.exe' -p --permission-mode acceptEdits --allowedTools 'Bash(*)' 'mcp__gmail__*' 'mcp__google-calendar__*' --add-dir 'C:\Users\THINKPAD L13\.claude\projects' --add-dir 'D:\projects'"
set "EXITCODE=%ERRORLEVEL%"

rem Commit + push any changes (guarded like the Stop hook)
git add -A 2>nul
git commit -q -m "auto-checkpoint: pull-sources %date% %time%" 2>nul
if not errorlevel 1 (
  git remote get-url origin >nul 2>&1
  if not errorlevel 1 git push -q origin HEAD 2>nul
)

exit /b %EXITCODE%
