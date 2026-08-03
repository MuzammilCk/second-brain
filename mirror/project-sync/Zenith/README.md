---
source: project-sync
project: Zenith
original-path: D:\projects\Zenith\README.md
synced: 2026-08-03
---

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ai-513315318.png" />
</div>

# Zenith — Karate Dojo Management System

An enterprise-grade RBAC CRUD system for a karate institution. Admins have full
authority (students, instructors, classes, promotions, audit logs); instructors
are scoped to only the classes the admin assigns them.

## Tech stack

- **Frontend:** TypeScript + React 19 (Vite 6) SPA
- **Backend:** Express 4 served from `server.ts` (run via `tsx`)
- **Database:** file-based JSON store at `data/db.json` (`src/db/database.ts`)
- **Auth:** signed HMAC session tokens (`src/services/authService.ts`)
- **Tests:** `node:test` suites (`src/test/*`), run via `npm test`

## Run locally

**Prerequisites:** Node.js 18+

1. Install dependencies: `npm install`
2. Create a local env file with a real random secret:
   ```
   cp .env.example .env.local
   # then edit .env.local and set JWT_SECRET to a long random string
   ```
   ⚠️ `JWT_SECRET` is **required** for the server to start. A placeholder in
   `.env.example` will not work — set a real value in `.env.local`.
3. Run the app: `npm run dev`

The server boots on the port in `APP_URL` (default `3000`) and serves the API
under `/api` plus the SPA.

## Database note

`data/db.json` is **gitignored** — it holds real runtime data and is seeded
automatically from the `DEFAULT_*` arrays in `src/db/database.ts` on first run
(if the file is absent). Do not commit it. A schema migration runs automatically
on startup when `schemaVersion` is below the current version (see
`MIGRATION_LOG.md` for the rollout of the RBAC / class-allocation split).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server (frontend + API via `tsx`) |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm test` | Run unit + integration `node:test` suites |
| `npm run build` | Production build (Vite + esbuild server bundle) |

## Roles

- **admin** — full authority: manage students, instructors, classes, promotions,
  audit logs; sees all data.
- **instructor** — scoped to only the batches (classes) the admin assigns;
  marks attendance and requests belt upgrades for their own students.

See `project_context.md` and `crud-checklist-for-ai-agent.md` for the full
specification and self-audit protocol.
