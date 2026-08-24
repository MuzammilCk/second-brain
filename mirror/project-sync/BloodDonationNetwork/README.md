---
source: github-api
project: "BloodDonationNetwork"
language: "JavaScript"
updated: 2026-08-07
synced: 2026-08-24
url: "https://github.com/MuzammilCk/BloodDonationNetwork"
---

# Hackathon Starter

A generic full-stack scaffold — **not** a solution to any specific problem
statement. It exists so hour 2 of the hackathon starts with "add my actual
entities" instead of "set up auth and a DB connection from zero."

Stack: **Next.js 16 (App Router, TypeScript) + Prisma + PostgreSQL + Tailwind**.
One full vertical slice is already wired end to end: `User` → `Item`, with
register/login, JWT auth, ownership-scoped CRUD, pagination, and soft delete.

## 0. Before the hackathon (tonight)

```bash
npm install          # also runs `prisma generate` via postinstall
cp .env.example .env # edit JWT_SECRET to any random string
docker compose up -d # starts local Postgres on :5432
npx prisma migrate dev --name init
npm run db:seed      # creates demo@example.com / password123
npm run dev          # http://localhost:3000
```

Confirm all of this works **tonight**, not tomorrow morning. If Docker isn't
available at the venue, see the SQLite fallback below.

## 1. Adapt it to the real problem statement (the 5-step loop)

Once you have the actual entities from your ER diagram, repeat this per entity
— it's exactly the `Item` pattern, copied:

1. **`prisma/schema.prisma`** — add the model (PK, FK with `onDelete`, indexes
   on every FK and every column you'll sort/filter by).
2. **`src/lib/validations/<entity>.ts`** — copy `item.ts`, rename the zod fields.
3. **`src/services/<entity>.service.ts`** — copy `item.service.ts`: list
   (paginated), create, get-for-owner, update, soft-delete.
4. **`src/app/api/<entity>/route.ts` + `[id]/route.ts`** — copy the two `items`
   route files, swap the service import.
5. **`src/app/<entity>/page.tsx`** — copy `items/page.tsx`, adjust the fields
   rendered.

Then: `npx prisma migrate dev --name add_<entity>` and keep building.

## 2. Tech-stack fallback, already built in

- **DB fallback (SQLite):** if Postgres/Docker gives you trouble on the venue
  network, change two lines and keep every line of Prisma code you wrote:
  ```prisma
  datasource db {
    provider = "sqlite"
    url      = "file:./dev.db"
  }
  ```
  (Drop any Postgres-only types if you added them — this base schema has none.)
- **Auth fallback:** if a reviewer wants social login, swap `lib/auth.ts` for
  NextAuth — the rest of the app only depends on `getAuthFromRequest` returning
  `{ userId, email, role }`, so nothing downstream changes.

## 3. Query optimization / scaling — say these out loud when asked

- **Indexes**: PK is auto-indexed; every FK (`ownerId`) and every
  sort/filter column (`createdAt`) is indexed explicitly in the schema —
  don't rely on the FK alone being indexed, Postgres doesn't do that for you.
- **N+1**: use Prisma's `include`/`select` to fetch relations in one query
  instead of looping and querying per row.
- **Parallel independent queries**: see `listItems` in `item.service.ts` —
  the page of rows and the total count run via `Promise.all`, not sequentially.
- **Pagination everywhere**: never `findMany` without `take`/`skip` (or
  cursor-based pagination for very large tables) on anything user-facing.
- **Denormalize deliberately, and say why**: e.g. a running total stored on
  a parent row to avoid re-aggregating children on every read — name the
  read/write tradeoff you're making.
- **At scale**: connection pooling (PgBouncer) once you have many serverless
  function instances each opening a connection; a read replica for
  read-heavy endpoints; Redis for hot read paths or rate limiting; partition
  large, time-ordered tables by `createdAt` range.
- **Soft delete** (`deletedAt`) instead of hard `DELETE`, so nothing user-facing
  ever does an unrecoverable destructive query and you keep an audit trail.

## 4. What's deliberately not here

No tests, no CI, no deployment config — cut for a 4-hour build. If they extend
you to 8 hours, this is exactly the list to reach for: add a couple of
integration tests around the service layer, containerize with a `Dockerfile`,
and add rate limiting on `/api/auth/*`.

## 5. Security note

Pinned to current major versions (Next 16, React 19) specifically because
older Next 14 patch levels have known CVEs — check `npm audit` again before
you build on this, since new advisories land often.
# BloodDonationNetwork
