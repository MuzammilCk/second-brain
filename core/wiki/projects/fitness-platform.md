---
id: "fitness-platform"
title: Fitness Platform
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/useMe
last_verified: 2026-09-21
stack: Next.js 15, NestJS, Turborepo, pnpm, Drizzle ORM, PostgreSQL, Zod, Vitest
sources:
  - mirror/project-sync/useMe/context.md
  - mirror/project-sync/useMe/diff.md
related: []
created: 2026-06-15
last-updated: 2026-08-03
tier: incubation
health: stalled
visibility: public
current_milestone: "Type-safe FitTech tracking monorepo (useMe)"
next_action: "Refactor Drizzle ORM queries for workout log aggregation"
---

# Fitness Platform (useMe)

Enterprise-grade fitness tracking and training coordination system built as a type-safe TypeScript monorepo. End-to-end type safety connects database schemas, backend services, validation pipes, and the frontend application using shared packages across the monorepo boundary.

## Problem

Fitness tracking applications typically have a type mismatch between database schemas, API contracts, and frontend data models. Schema drift between these layers creates subtle runtime bugs. Building a monorepo with a shared types package and schema-generated validators eliminates this class of error entirely — database columns, API request/response shapes, and frontend form validation are all derived from a single source of truth.

## Architecture

Turborepo + pnpm workspace monorepo:

- **`apps/web`**: Next.js 15 App Router frontend. TailwindCSS and React Server Components. Consumes `@fitness/types` and `@fitness/config` packages.
- **`apps/api`**: NestJS REST API. Validates all requests through shared Zod schemas exposed as `@fitness/types`. Custom exception filter maps raw Zod errors into unified `ApiResponse<T>` wrappers.
- **`packages/db`**: Drizzle ORM schema definitions, seeder modules, and migration templates. Source of truth for all 17 database tables.
- **`packages/types`**: Drizzle-Zod generated validators + TypeScript interfaces shared across both apps. API request/response shapes are generated from the DB schema.
- **`packages/config`**: Zod environment variable validation for all apps. Missing or malformed env vars fail at startup, not at runtime.

## Constraints & Trade-offs

- **Drizzle-Zod coupling**: Schema changes in `packages/db` cascade to `packages/types` automatically. This is a feature — but it means any breaking DB change requires coordinated version bumps across both apps. A migration strategy is required.
- **NestJS + Next.js in one monorepo**: Two different server runtimes with different conventions. Turborepo build pipeline manages dependency ordering. Shared packages must avoid runtime-specific imports.
- **Vitest for testing**: Chosen over Jest for native ESM and faster cold-start. NestJS testing utilities work with Vitest but require adapter setup.

## Implementation Evidence

- 17 Drizzle ORM table definitions (users, muscle groups, workout templates, exercise sets, progress logs, macro profiles, and more).
- `drizzle-zod` integration generating Zod validators directly from Drizzle schema.
- `@fitness/types` package exporting all shared interfaces and validators consumed by both `apps/web` and `apps/api`.
- Custom NestJS exception filter mapping Zod `ZodError` instances into `ApiResponse<null>` with structured field-level error messages.
- Zod environment schema in `@fitness/config` validating all app environment variables at startup.

## Current State

Active development. Phase 1 (schema-driven setup: all 17 tables defined, Drizzle migrations generated, shared types package wired to both apps) complete. Phase 2 (API endpoint implementation and frontend views) in progress.

## Decisions

See the complete list of system designs and code changes in [[fitness-platform-decisions|Fitness Platform Decision Log]].

