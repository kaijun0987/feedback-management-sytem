# AWS Deployment Blueprint

This repository is ready to deploy with:

- `Amazon RDS for PostgreSQL` for the database
- `AWS Elastic Beanstalk` for the NestJS API
- `AWS Amplify Hosting` for the Vue frontend

The current codebase fits that split well because the backend is a single NestJS HTTP API and the frontend is a Vite static site.

## Repository Files Added For Deployment

- `backend/feedback-api/Dockerfile`
- `backend/feedback-api/.dockerignore`
- `backend/feedback-api/.ebignore`
- `backend/feedback-api/.env.production.example`
- `amplify.yml`
- `.env.prod.example`

## Target Architecture

1. Amplify hosts the frontend and serves the built `dist/` assets.
2. Elastic Beanstalk runs the backend container from `backend/feedback-api`.
3. The backend connects to PostgreSQL on RDS using `DATABASE_URL`.
4. RDS should stay private inside the VPC. Do not expose the database publicly unless you have a strong reason.

## Backend Deployment On Elastic Beanstalk

Use the `backend/feedback-api` directory as the application source bundle for Elastic Beanstalk. The added `Dockerfile` builds and runs the API on port `8080`, and the container health check hits `GET /api/health`.

If you deploy to the Elastic Beanstalk `Node.js` platform instead of the `Docker` platform, upload the contents of `backend/feedback-api` as the source bundle root and keep the `Procfile` in that root so EB starts the service with `node dist/main.js`.

Recommended environment variables for Elastic Beanstalk:

- `DATABASE_URL`
- `JWT_SECRET`
- `FEEDBACK_SUBMISSION_HMAC_SECRET`
- `PORT=8080`
- `NODE_ENV=production`

Example `DATABASE_URL`:

```text
postgresql://<user>:<password>@<rds-endpoint>:5432/soybean_feedback?schema=public
```

Important:

- Put the Elastic Beanstalk environment in the same VPC as RDS.
- Allow inbound PostgreSQL traffic to RDS only from the Elastic Beanstalk application security group.
- Point the Elastic Beanstalk health check path to `/api/health`.

## Frontend Deployment On Amplify

Amplify can build from the repository root with the added `amplify.yml`.
Because this repository uses `pnpm workspace`, treat it as a monorepo in Amplify and set the app root to `.`.

Set these environment variables in Amplify instead of committing production values:

- `VITE_SERVICE_BASE_URL`
- `VITE_OTHER_SERVICE_BASE_URL`
- any other `VITE_*` variables you want to override for production

For this project, the important value is:

```text
VITE_OTHER_SERVICE_BASE_URL={"feedback":"https://<your-eb-domain-or-api-domain>/api"}
```

Because the app uses Vue Router history mode, add a rewrite rule in Amplify so unmatched routes return `/index.html`.

## Database Migration Strategy

This is the main deployment gap you still need to choose.

The application already has Prisma migrations, but AWS will not run them automatically for you. Pick one of these approaches:

1. Manual for the first release:
   run `pnpm prisma:migrate deploy` from a trusted machine that can reach RDS.
2. CI/CD step:
   run Prisma migrate before or during backend deployment.
3. Automated instance hook:
   possible, but avoid this until you understand the failure mode because repeated instance launches can rerun deployment logic.

For your current stage, option 1 is the safest and easiest.

## Missing AWS Console Work

These are still manual tasks outside the repo:

1. Create the RDS PostgreSQL instance and database.
2. Create the Elastic Beanstalk application and environment.
3. Configure Elastic Beanstalk environment variables.
4. Connect Elastic Beanstalk networking to the RDS VPC and security groups.
5. Create the Amplify app and set production `VITE_*` variables.
6. Add the Amplify SPA rewrite rule.
7. Run Prisma migration against RDS before first production traffic.
8. Point domains and HTTPS certificates if you want custom domains.

## What Was Missing In The Codebase

Before these changes, the repository was missing:

- a backend container definition for Elastic Beanstalk
- an Amplify build spec
- a production frontend env example
- a deployment note describing the EB source bundle boundary

The business code itself is already close to deployable. The main remaining work is infrastructure setup and migration execution, not backend feature refactoring.
