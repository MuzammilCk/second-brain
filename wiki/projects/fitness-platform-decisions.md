# Fitness Platform Decision Log

Decision journal and architectural audit trail for the Fitness Platform (useMe) project.

## 2026-06-20 — DR-FIT-01: Shared Schema-Driven Type Safety
**Context:** Duplicating type validation structures across database queries, Express controllers, and frontend widgets results in syntax fragmentation, interface schema lag, and constant deployment friction.
**Decision:** Configured a Turborepo library system sharing schema rules. Database definitions are managed in Drizzle (`packages/db`), which generates Zod schema validators (`drizzle-zod`) shared directly via the package `@fitness/types` to NestJS and Next.js layers.
**Alternatives considered:** Manual type generation/duplication (rejected; error-prone); generating schemas from TypeScript types (lacked run-time assertion properties).
**Status:** active

## 2026-06-25 — DR-FIT-02: global-exception.filter exception mapping
**Context:** NestJS native validation pipelines emit varied validation payloads, while frontend consumers require a standardized, structured API contract (`ApiResponse<T>`).
**Decision:** Wrote a unified global exception filter in `apps/api` mapping standard HTTP errors, raw `ZodError` payloads, and `nestjs-zod` wrapped exceptions into a consistent container layout containing `success`, `data`, and `error` parameters.
**Alternatives considered:** Handling exceptions individually inside each controller endpoint (rejected; violates DRY principles and creates audit/conformity issues).
**Status:** active
