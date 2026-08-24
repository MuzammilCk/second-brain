---
source: project-sync
project: "hackathon-starter"
original-path: "D:/projects/hackathon-starter/diff.md"
synced: 2026-08-24
---

# diff.md — build log

One entry per logical unit of work (roughly: one module, or one meaningful decision).
Update this as you go, not in a batch at the end — accuracy matters more than tidiness.

## Format

```
## YYYY-MM-DD HH:MM — <short task title>
### Changed
- `path/to/file` — one-line description of what changed
### Why
One or two sentences of reasoning — required whenever this deviates from context.md or
CLAUDE.md, optional otherwise.
### Open question (if any)
Anything context.md didn't cover that you had to decide on the spot — flag it here so
it's visible on review instead of silently baked in.
```

---

## 2026-08-07 11:21 — Phase 1: Schema + Migration + Seed

### Changed
- `prisma/schema.prisma` — Full domain schema (User, Donor, Request, Donation, Broadcast) with all enums, indexes, and constraints from context.md. Prisma 7.x: `provider = "prisma-client"`, explicit `output = "../src/generated/prisma"`, no url in datasource block.
- `prisma.config.ts` — [NEW] Prisma 7.x config file; datasource URL from env.
- `prisma/seed.ts` — Seeds one ADMIN user (admin@bloodnet.com / 9999999999 / admin123). Uses Prisma 7 driver adapter pattern.
- `src/lib/db.ts` — Prisma 7 driver adapter: PrismaPg wrapping a pg Pool, singleton pattern preserved.
- `src/generated/prisma/` — [NEW] Generated Prisma client output (gitignored).
- `.env.example` — Single `DATABASE_URL` (Supavisor session pooler, port 5432). No `DIRECT_URL` needed for non-serverless.
- `package.json` — Upgraded prisma/prisma-client to 7.x, added @prisma/adapter-pg, pg, dotenv, @types/pg.
- `prisma/migrations/20260807055134_blood_donation_init/` — [NEW] Initial migration.

### Why
Prisma 7.x requires driver adapter pattern and prisma.config.ts — can't use bare `new PrismaClient()` or `url` in datasource block anymore. Session pooler (port 5432) used because the direct DB host is IPv6-only and unreachable from this machine.

### Open question
Login identifier: schema has `email String? @unique` (optional) and `phone String @unique` (required). Proceeding with phone-based login since phone is the only guaranteed-present unique field. Email kept optional for contact purposes only.

## 2026-08-07 11:25 — Phase 2: Auth adaptation

### Changed
- `src/lib/auth.ts` — Updated `AuthPayload` to `{userId, role, phone}`. Added `requireRole()` helper returning auth or 403 Response.
- `src/lib/validations/auth.ts` — Register: name+phone+password required, email optional. Login: phone+password.
- `src/app/api/auth/register/route.ts` — Always creates `REQUESTER`. Phone uniqueness check.
- `src/app/api/auth/login/route.ts` — Login by phone, not email.
- `src/app/api/auth/me/route.ts` — Returns role, includes donor profile if DONOR. Strips password.

## 2026-08-07 11:26 — Phase 3: Blood compatibility + Admin donor management

### Changed
- `src/constants/bloodCompatibility.ts` — [NEW] `RECIPIENT_CAN_RECEIVE_FROM` matrix copied verbatim from context.md. Added `BLOOD_GROUP_DISPLAY` map for UI boundary.
- `src/lib/validations/donor.ts` — [NEW] Register and update donor Zod schemas.
- `src/services/donor.service.ts` — [NEW] `registerDonor` (User+Donor in one `$transaction`), `listDonors` (paginated, filterable), `updateDonor`, `getDonorByUserId`, `updateDonorByUserId`.
- `src/app/api/admin/donors/route.ts` — [NEW] POST (register) + GET (list/search). ADMIN only.
- `src/app/api/admin/donors/[id]/route.ts` — [NEW] GET + PATCH. ADMIN only.

## 2026-08-07 11:27 — Phases 4–5: Requests + eligible donors + broadcast

### Changed
- `src/lib/validations/request.ts` — [NEW] Create/update request Zod schemas.
- `src/services/request.service.ts` — [NEW] `createRequest` (returns eligible donors immediately), `findEligibleDonors` (single indexed query from context.md), `listAllRequests`, `listMyRequests`, `updateRequest`.
- `src/services/broadcast.service.ts` — [NEW] `broadcastToRequest` (`createMany` + `skipDuplicates`), `listBroadcastsForDonor`, `respondToBroadcast`.
- `src/app/api/requests/route.ts` — [NEW] POST, public, optionally auth.
- `src/app/api/requests/[id]/eligible-donors/route.ts` — [NEW] GET, public.
- `src/app/api/my/requests/route.ts` — [NEW] GET, REQUESTER only.
- `src/app/api/admin/requests/route.ts` — [NEW] GET with status filter. ADMIN only.
- `src/app/api/admin/requests/[id]/route.ts` — [NEW] GET + PATCH. ADMIN only.
- `src/app/api/admin/requests/[id]/eligible-donors/route.ts` — [NEW] Reuses `findEligibleDonors`.
- `src/app/api/admin/requests/[id]/broadcast/route.ts` — [NEW] POST with `{ donorIds }`.

## 2026-08-07 11:28 — Phases 6–8: Donor self-service + donation recording + summary

### Changed
- `src/app/api/donor/me/route.ts` — [NEW] GET + PATCH (address/place only). DONOR only.
- `src/app/api/donor/broadcasts/route.ts` — [NEW] GET broadcasts for donor. Paginated.
- `src/app/api/donor/broadcasts/[id]/route.ts` — [NEW] PATCH to respond INTERESTED/NOT_AVAILABLE.
- `src/services/donation.service.ts` — [NEW] `recordDonation` — exact transaction from context.md.
- `src/lib/validations/donation.ts` — [NEW] Zod schema for recording.
- `src/app/api/admin/donations/route.ts` — [NEW] POST. ADMIN only.
- `src/services/summary.service.ts` — [NEW] Six metrics from context.md, all in `Promise.all`.
- `src/app/api/admin/summary/route.ts` — [NEW] GET. ADMIN only.

### Why
All backend endpoints verified end-to-end: admin login → register donor → create request → eligible donors returned → broadcast → donor login → respond → record 1 unit (PARTIALLY_FULFILLED) → record 1 more (FULFILLED) → summary reflects all.

## 2026-08-07 11:40 — Phase 9: Frontend (all pages)

### Changed
- `src/lib/api-client.ts` — [NEW] Centralized fetch wrapper with Bearer token injection, 401 interceptor (auto-redirect to login).
- `src/components/Navbar.tsx` — [NEW] Role-aware nav: public links (Request Blood, Login, Register) + role-gated links (Admin Dashboard/Donors/Requests, Donor Dashboard, My Requests).
- `src/components/ProtectedRoute.tsx` — [NEW] Client guard with optional role check.
- `src/components/ErrorBoundary.tsx` — [NEW] Class-based error boundary with retry.
- `src/app/layout.tsx` — Root layout wrapping all pages with Navbar + ErrorBoundary.
- `src/app/page.tsx` — Landing page with CTA.
- `src/app/login/page.tsx` — Phone + password login, role-based redirect.
- `src/app/register/page.tsx` — Requester registration.
- `src/app/requests/new/page.tsx` — [NEW] Public blood request form. Shows eligible donors immediately after submit.
- `src/app/admin/page.tsx` — [NEW] Admin dashboard with 6 summary metrics + open requests list.
- `src/app/admin/donors/page.tsx` — [NEW] Donor list + inline registration form.
- `src/app/admin/requests/page.tsx` — [NEW] Request list + eligible donors panel + broadcast + record donation.
- `src/app/donor/page.tsx` — [NEW] Donor dashboard with profile + broadcast requests + INTERESTED/NOT_AVAILABLE responses.
- `src/app/my/requests/page.tsx` — [NEW] Requester's request history.

### Why
All 9 pages compile and serve (200 OK). Design uses existing Tailwind tokens (base/surface/border/accent).

## 2026-08-07 12:10 — Admin broadcast responses + donor backout

### Changed
- `src/app/admin/requests/page.tsx` — Added "Broadcast Responses" section showing each donor's status (⏳ Pending / ✓ Interested / ✗ Not Available) with response timestamps and summary badges. Now fetches request detail (with broadcasts) alongside eligible donors when a request is selected. Broadcasts refresh after sending.
- `src/app/donor/page.tsx` — Response buttons now stay visible after responding (not just when PENDING), with the active response highlighted. Donors can switch from INTERESTED → NOT_AVAILABLE with a confirmation prompt. Buttons hidden only for FULFILLED/CANCELLED requests.
- Removed leftover starter-template files: `src/services/item.service.ts`, `src/lib/validations/item.ts`, `src/app/items/`, `src/app/api/items/` — these referenced a non-existent `Item` model and broke the build.

## 2026-08-07 12:20 — Phase 10: UI & Modern Web guidance upgrades

### Changed
- `tailwind.config.ts` — Added rich dark surface themes (`base: #090d12`, `surface: #111722`), glowing box shadows (`shadow-glow`, `shadow-glass`), keyframe floating animations, and brand red theme extensions.
- `src/app/globals.css` — Imported Google Font ('Plus Jakarta Sans'), added backdrop blur glassmorphism utility classes (`.glass-panel`, `.glass-panel-hover`), gradient text utilities, and dark scrollbar styling.
- `src/components/Navbar.tsx` — Upgraded to backdrop-blur glassmorphic header with animated glowing brand blood drop logo, active link pill highlights, and user role badges.
- `src/app/page.tsx` — Enhanced Hero section with glowing pill badge, gradient text, CTAs, and a 3-column feature card grid (Instant Compatibility, Targeted Broadcasts, Multi-Unit Fulfillment).
- `src/app/login/page.tsx` & `src/app/register/page.tsx` — Upgraded to centered glassmorphic cards, clear form labels, modern web autofill attributes (`tel`, `email`, `current-password`, `new-password`, `name`), loading spinners, and error alerts.
- `src/app/requests/new/page.tsx` — Glassmorphic multi-field request form with blood group selector, autocomplete attributes, and high-impact eligible donor cards with direct `tel:` call actions upon submission.
- `src/app/admin/page.tsx` — Admin Dashboard with 5 KPI stat cards featuring icon indicators, live progress bars for open request fulfillment, and clean open request items.
- `src/app/admin/donors/page.tsx` — Donors management panel with toggleable registration card, blood group pills, location indicators, and status badges.
- `src/app/admin/requests/page.tsx` — Requests workspace with card selection highlights, broadcast response status tags (Pending/Interested/Not Available), broadcast-to-all action button, and record donation controls.
- `src/app/donor/page.tsx` — Donor portal with profile header card, cooldown status indicators, and interactive broadcast response buttons.
- `src/app/my/requests/page.tsx` — Requester history view with status badges and request fulfillment progress bars.

### Why
Upgraded visual aesthetics using modern web standards (glassmorphism, vibrant red/amber dark modes, clean typography, autofill compliance) while preserving 100% of underlying API contracts, authentication flows, and business logic.

## 2026-08-07 — Google-grade refactor: unified HTTP layer + engineering hardening

### Changed
- `src/lib/http/errors.ts` — [NEW] `ApiError` class + factories, typed `ErrorCode`, `toErrorResponse()`: ApiError → its envelope; known Prisma codes (P2000/P2002/P2003/P2014/P2025) → safe HTTP errors; anything unknown → generic 500 (internals logged server-side, never leaked).
- `src/lib/http/handler.ts` — [NEW] `withHandler()` wrapper: `x-request-id` correlation header on every response, structured request logging (method/path/status/duration), centralized error→response conversion.
- `src/lib/http/request.ts` — [NEW] `parseJsonBody` / `parseQueryParams` / `parseId`: uniform 400 `VALIDATION_ERROR` with field-level details (replaces the `req.json().catch(() => null)` + `safeParse` boilerplate duplicated in ~12 routes).
- `src/lib/http/response.ts` — [NEW] `ok`/`created`/`fail` envelope. Error body now also carries machine-readable `code` — additive; `error` stays a plain string, so the frontend contract is unchanged.
- `src/lib/http/rate-limit.ts` — [NEW] in-memory sliding-window limiter; applied to `auth/register` (10/15min) and `auth/login` (20/15min).
- `src/lib/http/index.ts` — [NEW] barrel export.
- `src/lib/env.ts` — [NEW] zod-validated env: `DATABASE_URL` always required; `JWT_SECRET` required in production (fail-fast), dev fallback logs a warning. Kills the silent `'dev-secret-change-me'` default.
- `src/lib/logger.ts` — [NEW] structured logger (JSON lines in prod, readable in dev), every request tagged with `requestId`.
- `src/lib/eligibility.ts` — [NEW] `DONATION_COOLDOWN_DAYS`, `getCooldownCutoff()`, `buildEligibilityWhere()` — single source of truth for the 90-day rule and the eligibility WHERE shape; request.service and summary.service now both build on it (was duplicated inline in 3 places).
- `src/constants/bloodCompatibility.ts` — added `BLOOD_GROUPS` + `displayBloodGroup()`; matrix keyed by a literal-union type.
- `src/lib/auth.ts` — `requireRole()` now throws `ApiError` (401/403) instead of returning `AuthPayload | Response`; every route drops its `instanceof Response` check. Secret comes from env config.
- `src/lib/db.ts` — connection string from validated env config.
- `src/services/auth.service.ts` — [NEW] register/login/profile logic moved out of route handlers; explicit 409 conflict + 401 errors.
- Services (donor/request/broadcast/donation/summary) — domain failures now throw typed `ApiError`; the two near-duplicate eligibility queries merged to share `buildEligibilityWhere` (`isLocal` computed in the service, not the route); typed `Prisma.*WhereInput`/`*UpdateInput` instead of `Record<string, unknown>`.
- `src/services/donation.service.ts` — transaction now guards inside itself: missing donor/request → 404, already-FULFILLED/CANCELLED request → 409 (see Open question).
- All 18 API route handlers — rewritten to `withHandler` pattern: parse → auth → service → respond. Per-route try/catch and string-matching on Prisma messages are gone.
- `src/types/api.ts` — [NEW] shared wire contract; `src/lib/api-client.ts` now uses it (behavior unchanged: Bearer injection + 401 interceptor kept).
- Validations — `bloodGroupEnum`/`uuidSchema`/`paginationSchema` centralized in `validations/common.ts`; broadcast schemas moved to `validations/broadcast.ts`; `updateDonorMeSchema` added so donor self-edit is zod-validated instead of hand-rolled.
- Frontend — 6 pages now import `displayBloodGroup`/`BLOOD_GROUPS` from the shared constant; 5 duplicated `DISPLAY` maps deleted.
- `next.config.js` — `poweredByHeader: false` + baseline security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- Tests — [NEW] vitest suite (32 tests: eligibility where-builder, urgency classification/formatting, error mapping, validation schemas). `npm test`; `vitest.config.ts` + devDependency added.

### Why
Google engineering practices applied without changing the product contract: one error contract with machine codes, zero route boilerplate, single source of truth for domain rules, tests shipped with the code, fail-fast env validation, abuse protection on auth, and a stable API surface (envelope gains only the additive `code` field). Verified end-to-end: build green, 32/32 tests green, live smoke test of health/login/401/403/400/summary against the real DB.

### Open question
`recordDonation` now rejects requests whose status is already `FULFILLED` or `CANCELLED` with 409 — previously a donation could be recorded against an over-filled request. This closes the over-collection hole but is a behavior tightening; flag for review.
