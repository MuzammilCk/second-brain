---
source: project-sync
project: "hackathon-starter"
original-path: "D:/projects/hackathon-starter/CLAUDE.md"
synced: 2026-08-24
---

# CLAUDE.md — operating rules for this build

Read `context.md` in full before writing any code — it's the requirements source of
truth, including things that are deliberately *not* in scope. Don't add scope back in.

## Stack (fixed, don't substitute)

- Backend: Express + TypeScript + Prisma + Supabase (Postgres), JWT auth
- Frontend: React + Vite + TypeScript + Tailwind
- Base codebase: the existing hackathon-template repo. Adapt it — repository →
  service → controller → routes pattern, middleware (`auth.ts`, `validate.ts`,
  `errorHandler.ts`), and utils (`jwt.ts`, `password.ts`, `apiResponse.ts`) — do not
  rewrite these, they're already built and tested.

## Non-negotiable implementation rules

1. **Compatibility matrix lives in exactly one file**: `backend/src/constants/bloodCompatibility.ts`.
   Import it everywhere eligibility is checked. Never re-derive or duplicate the matrix
   inline in a query or component.
2. **Donation recording is always one Prisma transaction** — donation create, donor's
   `lastDonationDate` update, request's `unitsReceived` increment, and status
   transition all happen inside `prisma.$transaction`. Never split these into separate
   sequential calls — a partial failure leaves the data inconsistent in a way that's
   very hard to notice during a demo.
3. **Broadcast creation uses `createMany` with `skipDuplicates: true`**, relying on the
   `@@unique([requestId, donorId])` constraint. Never loop individual `create` calls —
   re-broadcasting to an already-broadcasted donor must not throw.
4. **The eligible-donor query is one indexed Prisma query.** No fetching all donors and
   filtering in JS. No N+1 (e.g. don't loop per donor to check something separately —
   express every filter in the `where` clause).
5. **Auth role boundaries are fixed**: `/api/auth/register` only ever creates
   `REQUESTER`. Donor accounts are created only through the admin donor-registration
   endpoint (`User` + `Donor` in one transaction). Admin is seeded, never registered
   through any endpoint.
6. **Every list endpoint supports pagination** (`page`, `pageSize`), matching the base
   template's existing `Item` list endpoint pattern.
7. **Reuse the frontend's existing `ProtectedRoute`, `ErrorBoundary`, and the 401
   interceptor in `api/client.ts` as-is.** Add a role check on top of `ProtectedRoute`
   for admin/donor-only pages — don't rewrite the auth-redirect logic.

## Scope discipline

If a feature isn't in `context.md`'s requirements or "decided defaults" sections,
don't build it — check the "out of scope" list first. If something genuinely needs a
decision `context.md` doesn't cover, stop and flag it rather than guessing; log the
question and the assumption you're proceeding with in `diff.md` so it's visible on
review, not silently decided.

## Working style

- Small, labeled commits per logical unit (one module's repository+service+controller+
  routes, one frontend page) — not one giant commit at the end.
- After finishing a module, update `diff.md` per its format before moving to the next
  one — don't batch diff entries at the end of a session, they lose accuracy.
- If you deviate from anything in `context.md` (a field name, an endpoint shape, a
  status value), update `context.md` in the same commit so it stays the source of
  truth — don't let the code and the doc drift apart.

## Build order (suggested, not mandatory — reorder if a dependency makes more sense)

1. Prisma schema + migration (the full schema in `context.md`, in one migration)
2. Auth module (register/login, role-scoped)
3. Admin: donor registration + list/search
4. Requests: create (guest + auth) with immediate eligible-donor response
5. Admin: eligible-donor search endpoint (reuses the same query as step 4) + broadcast
6. Donor: view broadcasts, respond
7. Admin: record donation (the transaction)
8. Admin: network summary
9. Frontend, page by page, in the same order as the backend modules above
10. Last 30–45 min: end-to-end walkthrough of the full flow — register donor → create
    request → see eligible donors → broadcast → donor responds → record donation →
    request transitions to fulfilled → summary numbers update. If this walkthrough
    doesn't work cleanly, fix it before anything else.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
