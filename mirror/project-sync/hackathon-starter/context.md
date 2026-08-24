---
source: project-sync
project: "hackathon-starter"
original-path: "D:/projects/hackathon-starter/context.md"
synced: 2026-08-24
---

# context.md — Blood donation network

## Problem statement (official)

Build a digital solution which helps admin to register donors, receive requests, reach
donors quickly, and instantly find who is eligible for any request.

Minimum requirements: donor registration, blood requests, eligible donor search,
broadcast requests, donation recording, multiple units, network summary.

## Confirmed requirements (from planning Q&A — do not deviate without updating this file)

- A request needs N units of blood, not just one. Each recorded donation counts toward
  that total. The request stays `OPEN`/broadcastable, still showing remaining eligible
  donors, until every required unit is accounted for — then it's `FULFILLED`.
- Requesters (patients/doctors) can submit a request as a guest (no account) or by
  creating an account — their choice, since requests are often urgent/emergency and
  forcing signup costs time. Donors and admin do not get this choice: donor accounts are
  admin-created only, admin is seeded.
- Broadcasting is admin-initiated and selective: for an open request, admin picks a set
  of donors from the eligible list (all of them, or only those in a given place) and
  broadcasts to all of them in one action.
- "Contact instantly" means the requester sees the eligible donor's full contact info
  (name, phone) directly and calls them — no in-app messaging/chat needed.
- Blood-type eligibility uses the full ABO/Rh compatibility matrix, not exact match only.
- A donor is eligible again 90 days after their last recorded donation (standard
  whole-blood gap).
- Location matching is simple place/city text matching — no geocoordinates, no distance
  radius. Keeps the eligible-donor query buildable in the time available.

## Decided defaults (not in the official requirements — flagged here so they can be
## overridden if the person disagrees, but don't block on them)

- **Donor account creation**: when admin registers a donor, the system creates the
  `User` (role `DONOR`) and `Donor` profile in one step, with a temporary password the
  admin can share with the donor. No self-signup for donors.
- **Address change**: self-service — donor edits their own address directly, no
  approval workflow. Not in the official requirement list; approval flow adds schema
  complexity for no grading benefit.
- **Network summary**: plain counts + an open-requests list, matching exactly the six
  metrics named below. No charts for the MVP.
- **Donation recording**: always tied to a specific request (a donation fulfills that
  request's remaining units) and always recorded by an admin, not self-reported by the
  donor.

## Out of scope for this build (say this explicitly if asked "what would you add")

Real SMS/email broadcast delivery (a provider integration), in-app chat/messaging,
geo-distance eligible-donor search, refresh tokens, email verification, password reset,
donor self-registration, approval workflow for address changes, medical/health
eligibility beyond blood type + cooldown (age, weight, screening status).

---

## Actors & auth model

| Role | Created by | Login |
|---|---|---|
| `ADMIN` | Seeded directly (not registered) | Yes |
| `DONOR` | Admin only, via donor-registration endpoint | Yes |
| `REQUESTER` | Self-registers via public endpoint, OR submits a guest request with no account at all | Optional |

The public `/api/auth/register` endpoint only ever creates `REQUESTER` accounts. There
is no public donor or admin signup.

---

## Entities (this is the ER design — `schema.prisma` below is the authoritative source)

- **User** — auth identity for Admin, Donor, and account-holding Requesters.
- **Donor** — 1:1 extension of `User` (only exists when role = `DONOR`). Holds the
  blood-donation-specific fields: blood group, place, last donation date.
- **Request** — a blood request. `requesterId` is nullable (null for guest requests).
  Carries its own contact fields (name/phone/email) regardless of whether the requester
  has an account, so the eligible-donor / contact flow never depends on auth state.
- **Donation** — one recorded donation event, always tied to exactly one donor and one
  request.
- **Broadcast** — join entity between `Request` and `Donor` recording that a donor was
  notified about a request, and whether they responded.

### Relationships & cardinality

- `User` 1:1 `Donor` (optional — only when role = `DONOR`)
- `User` 1:N `Request` (optional — only when an account-holding requester created it)
- `Donor` 1:N `Donation`
- `Request` 1:N `Donation`
- `Request` M:N `Donor` through `Broadcast` (join table carries `broadcastAt` and
  `responseStatus` — a real attributed many-to-many, not a plain join)

### Prisma schema (authoritative — copy into `backend/prisma/schema.prisma`)

```prisma
enum Role {
  ADMIN
  DONOR
  REQUESTER
}

enum BloodGroup {
  A_POS
  A_NEG
  B_POS
  B_NEG
  AB_POS
  AB_NEG
  O_POS
  O_NEG
}

enum RequestStatus {
  OPEN
  PARTIALLY_FULFILLED
  FULFILLED
  CANCELLED
}

enum BroadcastResponse {
  PENDING
  INTERESTED
  NOT_AVAILABLE
}

model User {
  id                String     @id @default(uuid())
  name              String
  email             String?    @unique
  phone             String     @unique
  password          String
  role              Role
  donor             Donor?
  requests          Request[]
  donationsRecorded Donation[] @relation("RecordedBy")
  createdAt         DateTime   @default(now())

  @@index([role])
}

model Donor {
  id               String      @id @default(uuid())
  user             User        @relation(fields: [userId], references: [id])
  userId           String      @unique
  bloodGroup       BloodGroup
  place            String
  address          String?
  dateOfBirth      DateTime?
  lastDonationDate DateTime?
  isActive         Boolean     @default(true)
  donations        Donation[]
  broadcasts       Broadcast[]
  createdAt        DateTime    @default(now())

  @@index([bloodGroup])
  @@index([place])
  @@index([lastDonationDate])
}

model Request {
  id               String        @id @default(uuid())
  requester        User?         @relation(fields: [requesterId], references: [id])
  requesterId      String?
  patientName      String
  bloodGroupNeeded BloodGroup
  hospital         String
  place            String
  unitsRequired    Int
  unitsReceived    Int           @default(0)
  requiredByDate   DateTime
  status           RequestStatus @default(OPEN)
  contactName      String
  contactPhone     String
  contactEmail     String?
  donations        Donation[]
  broadcasts       Broadcast[]
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@index([status])
  @@index([bloodGroupNeeded])
  @@index([place])
}

model Donation {
  id            String   @id @default(uuid())
  donor         Donor    @relation(fields: [donorId], references: [id])
  donorId       String
  request       Request  @relation(fields: [requestId], references: [id])
  requestId     String
  unitsDonated  Int      @default(1)
  donatedAt     DateTime @default(now())
  recordedBy    User     @relation("RecordedBy", fields: [recordedById], references: [id])
  recordedById  String
  createdAt     DateTime @default(now())

  @@index([donorId])
  @@index([requestId])
}

model Broadcast {
  id             String            @id @default(uuid())
  request        Request           @relation(fields: [requestId], references: [id])
  requestId      String
  donor          Donor             @relation(fields: [donorId], references: [id])
  donorId        String
  broadcastAt    DateTime          @default(now())
  responseStatus BroadcastResponse @default(PENDING)
  respondedAt    DateTime?

  @@unique([requestId, donorId])
  @@index([requestId])
  @@index([donorId])
}
```

Why `BloodGroup` uses `A_POS`/`A_NEG` instead of `A+`/`A-`: Prisma enum values must be
valid identifiers — no `+`/`-` allowed. Map to display strings (`A+`, `A-`, ...) only at
the API/UI boundary, never store the display string.

---

## Eligibility logic — the core algorithm

### Blood-type compatibility matrix

Who can donate to a recipient needing blood group X (donor's blood group must be in
this list):

| Recipient needs | Can receive from |
|---|---|
| O+ | O+, O− |
| O− | O− |
| A+ | A+, A−, O+, O− |
| A− | A−, O− |
| B+ | B+, B−, O+, O− |
| B− | B−, O− |
| AB+ | AB+, AB−, A+, A−, B+, B−, O+, O− (universal recipient) |
| AB− | AB−, A−, B−, O− |

```ts
// backend/src/constants/bloodCompatibility.ts — single source of truth, import
// everywhere this is needed. Never duplicate this matrix inline in a query.
export const RECIPIENT_CAN_RECEIVE_FROM: Record<string, string[]> = {
  O_POS:  ["O_POS", "O_NEG"],
  O_NEG:  ["O_NEG"],
  A_POS:  ["A_POS", "A_NEG", "O_POS", "O_NEG"],
  A_NEG:  ["A_NEG", "O_NEG"],
  B_POS:  ["B_POS", "B_NEG", "O_POS", "O_NEG"],
  B_NEG:  ["B_NEG", "O_NEG"],
  AB_POS: ["AB_POS", "AB_NEG", "A_POS", "A_NEG", "B_POS", "B_NEG", "O_POS", "O_NEG"],
  AB_NEG: ["AB_NEG", "A_NEG", "B_NEG", "O_NEG"],
};
```

### The eligible-donor query (single indexed query, no N+1)

```ts
async function findEligibleDonors(request: { bloodGroupNeeded: string; place: string }) {
  const compatibleGroups = RECIPIENT_CAN_RECEIVE_FROM[request.bloodGroupNeeded];
  const cooldownCutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  return prisma.donor.findMany({
    where: {
      bloodGroup: { in: compatibleGroups },
      place: { equals: request.place, mode: "insensitive" },
      isActive: true,
      OR: [{ lastDonationDate: null }, { lastDonationDate: { lte: cooldownCutoff } }],
    },
    include: { user: { select: { name: true, phone: true, email: true } } },
  });
}
```

This is the single query judges are most likely to ask you to explain and optimize —
walk through it: indexed on `bloodGroup`, `place`, and `lastDonationDate` individually
(composite index isn't obviously better here since each filter has different
selectivity and Postgres can combine single-column indexes via bitmap AND), all
filtering happens in the WHERE clause in one round trip, no fetch-then-filter-in-JS.

---

## Request lifecycle & fulfillment

`OPEN` → (partial donations recorded) → `PARTIALLY_FULFILLED` → (remaining units
recorded) → `FULFILLED`. `CANCELLED` is a manual admin action from any non-fulfilled
state.

### Recording a donation — must be one transaction

```ts
async function recordDonation(donorId: string, requestId: string, unitsDonated: number, recordedById: string) {
  return prisma.$transaction(async (tx) => {
    const donation = await tx.donation.create({
      data: { donorId, requestId, unitsDonated, recordedById },
    });

    await tx.donor.update({
      where: { id: donorId },
      data: { lastDonationDate: donation.donatedAt },
    });

    const request = await tx.request.update({
      where: { id: requestId },
      data: { unitsReceived: { increment: unitsDonated } },
    });

    const nextStatus =
      request.unitsReceived >= request.unitsRequired ? "FULFILLED" :
      request.unitsReceived > 0 ? "PARTIALLY_FULFILLED" : request.status;

    if (nextStatus !== request.status) {
      await tx.request.update({ where: { id: requestId }, data: { status: nextStatus } });
    }

    return donation;
  });
}
```

This must be transactional — donation creation, the donor's cooldown-timer update, and
the request's unit count/status transition all have to succeed or fail together, or
you can end up with a donation recorded but the request's unit count not reflecting it
(exactly the kind of bug that only shows up live, under judges' eyes).

### Broadcasting — handles re-broadcast without erroring

```ts
async function broadcastToRequest(requestId: string, donorIds: string[]) {
  return prisma.broadcast.createMany({
    data: donorIds.map((donorId) => ({ requestId, donorId })),
    skipDuplicates: true, // relies on @@unique([requestId, donorId])
  });
}
```

---

## API surface

**Auth**
- `POST /api/auth/register` — public, always creates role `REQUESTER`
- `POST /api/auth/login` — any role

**Admin** (protected, role `ADMIN`)
- `POST /api/admin/donors` — register a donor (creates `User` + `Donor` in one transaction)
- `GET /api/admin/donors` — list/search donors (filter: bloodGroup, place)
- `PATCH /api/admin/donors/:id` — edit donor profile
- `GET /api/admin/requests` — list all requests (filter: status)
- `PATCH /api/admin/requests/:id` — cancel / edit
- `GET /api/admin/requests/:id/eligible-donors` — run the eligibility query
- `POST /api/admin/requests/:id/broadcast` — body: `{ donorIds: string[] }`
- `POST /api/admin/donations` — record a donation (runs the transaction above)
- `GET /api/admin/summary` — network summary metrics

**Requests** (public, optionally authenticated)
- `POST /api/requests` — create a request (guest or account); response includes the
  immediately-computed eligible donor list, since "instantly find who is eligible" is
  the actual point of this endpoint, not a separate step
- `GET /api/requests/:id/eligible-donors` — recompute/view later (for a saved guest
  link or an account holder returning to the request)
- `GET /api/my/requests` — auth required, role `REQUESTER`, list own requests

**Donor** (protected, role `DONOR`)
- `GET /api/donor/me` — own profile/status
- `PATCH /api/donor/me` — edit own address (self-service, no approval)
- `GET /api/donor/broadcasts` — requests this donor has been broadcasted
- `PATCH /api/donor/broadcasts/:id` — respond: `INTERESTED` / `NOT_AVAILABLE`

---

## Network summary — exact metric definitions

| Metric | Query |
|---|---|
| Donations arranged | `prisma.donation.count()` |
| Requests fulfilled | `prisma.request.count({ where: { status: "FULFILLED" } })` |
| Requests unfulfilled | `prisma.request.count({ where: { status: { in: ["OPEN","PARTIALLY_FULFILLED"] } } })` |
| Donors responded to broadcast | `prisma.broadcast.count({ where: { responseStatus: { not: "PENDING" } } })` |
| Donors currently eligible (general capacity, not tied to one request) | `prisma.donor.count({ where: { isActive: true, OR: [{lastDonationDate: null},{lastDonationDate: {lte: cooldownCutoff}}] } })` |
| Open requests (list, not a count) | `prisma.request.findMany({ where: { status: { in: ["OPEN","PARTIALLY_FULFILLED"] } }, orderBy: { requiredByDate: "asc" } })` |
