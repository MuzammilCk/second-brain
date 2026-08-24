@echo off
rem ============================================================================
rem  claude-pull-sources — scheduled headless runner for /pull-sources
rem  Task Scheduler: "claude-pull-sources" (daily 08:00, Start in: vault root)
rem
rem  Why this wrapper exists:
rem   - Custom slash commands are NOT expanded in `claude -p` (print) mode, so
rem     the command body from .claude/commands/pull-sources.md is streamed in
rem     as the prompt instead.
rem   - Headless runs need explicit auth + permissions. The gateway base URL,
rem     token and model are read from .claude/settings.local.json (or settings.json)
rem     at run time.
rem   - OmniRoute rate-limits via a request queue (resilienceSettings.requestQueue
rem     .maxWaitMs = 15s) and drops requests with HTTP 503 when saturated, so the
rem     run retries (max 2 attempts, 60s apart — the queue resets after ~1m6s).
rem   - git is NOT on PATH in Task Scheduler's cmd context, so "C:\Program Files\
rem     Git\cmd" is prepended before the commit + push leg.
rem   - On exit it commits + pushes, mirroring .claude/hooks/auto-checkpoint.sh
rem     (the Stop hook does not reliably fire for headless -p exits).
rem
rem  Fixed 2026-08-06: was localhost:20128 + placeholder token + auto/best-fast
rem  model — unreachable (gateway listens on the LAN IP) and untested. Now mirrors
rem  the working interactive config from .claude/settings.local.json
rem  (172.18.101.8:20128/v1 + real token + nvidia/z-ai/glm-5.2).
rem ============================================================================
cd /d "%~dp0..\.."
if errorlevel 1 exit /b 1

set "PATH=C:\Program Files\Git\cmd;%PATH%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$cfgLocal = if (Test-Path '.claude\settings.local.json') { Get-Content -LiteralPath '.claude\settings.local.json' -Raw | ConvertFrom-Json } else { $null }; " ^
  "$cfg = if (Test-Path '.claude\settings.json') { Get-Content -LiteralPath '.claude\settings.json' -Raw | ConvertFrom-Json } else { $null }; " ^
  "$env:ANTHROPIC_BASE_URL = if ($cfgLocal.env.ANTHROPIC_BASE_URL) { $cfgLocal.env.ANTHROPIC_BASE_URL } elseif ($cfg.env.ANTHROPIC_BASE_URL) { $cfg.env.ANTHROPIC_BASE_URL } else { $env:ANTHROPIC_BASE_URL }; " ^
  "$env:ANTHROPIC_AUTH_TOKEN = if ($cfgLocal.env.ANTHROPIC_AUTH_TOKEN) { $cfgLocal.env.ANTHROPIC_AUTH_TOKEN } elseif ($cfg.env.ANTHROPIC_AUTH_TOKEN) { $cfg.env.ANTHROPIC_AUTH_TOKEN } else { $env:ANTHROPIC_AUTH_TOKEN }; " ^
  "$env:ANTHROPIC_MODEL = if ($cfgLocal.env.ANTHROPIC_MODEL) { $cfgLocal.env.ANTHROPIC_MODEL } elseif ($cfg.env.ANTHROPIC_MODEL) { $cfg.env.ANTHROPIC_MODEL } else { $env:ANTHROPIC_MODEL }; " ^
  "$raw = Get-Content -LiteralPath '.claude\commands\pull-sources.md' -Raw; " ^
  "$body = ($raw -replace '(?s)^---.*?\r?\n---\r?\n', '').Trim(); " ^
  "if (-not $body) { Write-Host '[pull-sources] command body is empty'; exit 3 }; " ^
  "$attempt = 0; $code = 1; " ^
  "while ($attempt -lt 2 -and $code -ne 0) { " ^
  "  $attempt++; " ^
  "  $env:CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT = '1'; " ^
  "  $body | & 'C:\Users\THINKPAD L13\.local\bin\claude.exe' -p --permission-mode acceptEdits --allowedTools 'Bash(*)' 'mcp__gmail__*' 'mcp__google-calendar__*' --add-dir 'C:\Users\THINKPAD L13\.claude\projects' --add-dir 'D:\projects'; " ^
  "  $code = $LASTEXITCODE; " ^
  "  if ($code -ne 0 -and $attempt -lt 2) { Write-Host ('[pull-sources] attempt ' + $attempt + ' failed (exit ' + $code + ') — gateway queue saturated? retrying in 60s'); Start-Sleep -Seconds 60 } " ^
  "}; exit $code"
set "EXITCODE=%ERRORLEVEL%"

rem Commit + push any changes (guarded like the Stop hook)
git add -A 2>nul
git commit -q -m "auto-checkpoint: pull-sources %date% %time%" 2>nul
if not errorlevel 1 (
  git remote get-url origin >nul 2>&1
  if not errorlevel 1 git push -q origin HEAD 2>nul
)

exit /b %EXITCODE%
