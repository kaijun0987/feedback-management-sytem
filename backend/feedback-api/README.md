# Feedback API

## Goal

Backend service for the internal feedback management system.

This service is designed to match the current frontend prototype and should be implemented as:

- NestJS
- Prisma
- PostgreSQL

## Local Development

1. Start PostgreSQL:

```bash
docker compose up -d
```

2. Create `.env` from `.env.example`, or export the same variables in your shell.

3. Generate client, apply migration, and seed:

```bash
pnpm prisma:generate
pnpm prisma:migrate:dev
pnpm prisma:seed
```

4. Start the API:

```bash
pnpm start:dev
```

Seeded users:

- `Super` / `123456`
- `Admin` / `123456`
- `User` / `123456`

## Folder Structure

```text
backend/feedback-api/
  prisma/
    schema.prisma
  src/
    modules/
      auth/
      users/
      feedback-forms/
      feedback-responses/
      exports/
    common/
      guards/
      dto/
      interceptors/
      utils/
```

## Backend Modules

### `auth`

- Login
- Get current user
- Logout
- Role check

### `users`

- Internal employee records
- Admin flag or role relation
- Change password

### `feedback-forms`

- List public forms
- List admin forms
- Create form
- Update form
- Toggle status
- Get form detail

### `feedback-responses`

- Submit feedback
- Get response list
- Get summary
- Get individual answers

### `exports`

- Export responses to Excel

## Authentication

- All employees log in
- Anonymous submit only hides identity in response presentation
- Actual submitter identity is still stored internally for audit and duplicate checks

## Roles

- `R_SUPER`
- `R_ADMIN`
- `R_USER_COMMON`

## Current Phase 1 Scope

- Auth login and current user endpoint
- Public form listing
- Public form detail
- Feedback submit
- Admin form CRUD
- Admin response list and summary
- Prisma migration + seed
- Admin route guard with role check

## Notes

- Frontend already has feedback API skeleton in `src/service/api/feedback.ts`
- Frontend mock state is now centralized in `src/store/modules/feedback/index.ts`
- Backend response shapes should align with `src/typings/api/feedback.d.ts`
- Prisma migration lives in `prisma/migrations/20260415183000_init/`
- Seed data lives in `prisma/seed.ts`
