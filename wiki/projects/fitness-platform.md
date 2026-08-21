---
title: Fitness Platform
type: project
status: active
stack: Next.js 15, NestJS, Turborepo, pnpm, Drizzle ORM, PostgreSQL, Zod, Vitest
sources:
  - mirror/project-sync/useMe/context.md
  - mirror/project-sync/useMe/diff.md
related:
  - wiki/people/muzammil-ck.md
created: 2026-06-15
last-updated: 2026-08-03
---

# Fitness Platform (useMe)

The Fitness Platform (useMe) is an enterprise-grade fitness tracking and training coordination system built as a type-safe TypeScript monorepo using Turborepo and pnpm.

End-to-end type safety connects database schemas, backend services, validation pipes, and frontend applications.

## Technical Architecture

### Monorepo Structure
- **apps/web**: Next.js 15 App Router frontend using TailwindCSS and React components.
- **apps/api**: NestJS REST API microservice serving endpoint requests.
- **packages/db**: Drizzle ORM mappings, seeder modules, and database migration templates.
- **packages/types**: Shared API request and response models.
- **packages/config**: Core Zod schema validations for client environments.

### Key Milestones
- **Phase 1 (Schema-Driven Setup)**: Structured all 17 target database tables (governing users, muscle groups, workout templates, progress logs, and macros profiles) in Drizzle. Generated schema validations via `drizzle-zod` and shared them as global `@fitness/types` package bindings.
- **Exception Filters**: Custom NestJS error interceptors mapping all raw Zod validations into unified, structured `ApiResponse<T>` wrappers.

## Historical Decisions & Pivots
See the complete list of system designs and code changes in [[fitness-platform-decisions|Fitness Platform Decision Log]].
