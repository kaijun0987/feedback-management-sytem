# Feedback System Design

## Goal

Build a small internal feedback management system for company use on top of the current Soybean frontend template.

The first phase should stay small, easy to maintain, and suitable for a single developer.

## Product Scope

### Public feedback side

- Employee login entry
- Anonymous submit toggle
- Feedback form list
- Form detail and submission flow
- Submit success and failure feedback

### Admin side

- Dashboard
- Feedback form list
- Create and edit feedback forms
- Response summary
- Response details by question and by individual
- Export responses to Excel

## Recommended Architecture

### Repository mode

- Keep the current frontend at the repository root
- Add a backend service later under `backend/feedback-api`
- Keep frontend and backend in one repository for easier solo maintenance

### Frontend mode

- Public feedback pages use `blank` layout
- Admin pages use `base` layout
- Use static routes first
- Use simple role control with `admin` and `employee`

### Backend mode

- `NestJS + Prisma + PostgreSQL`
- Keep auth, form management, submission, statistics, and export in one service

## Information Architecture

### Public routes

- `/feedback`
- `/feedback/forms/:slug`

### Admin routes

- `/admin/dashboard`
- `/admin/feedback/forms`
- `/admin/feedback/forms/create`
- `/admin/feedback/forms/:id`
- `/admin/feedback/forms/:id/responses`

## Core Domain Model

### Users

- Internal employee account
- Roles: `admin`, `employee`

### FeedbackForm

- title
- description
- slug
- status
- startAt
- endAt
- createdBy

### FeedbackQuestion

- formId
- type
- title
- description
- required
- sort

### FeedbackQuestionOption

- questionId
- label
- value
- sort

### FeedbackResponse

- formId
- userId
- isAnonymous
- submittedAt

### FeedbackAnswer

- responseId
- questionId
- answerText
- answerJson

## Status Rules

- `status` is the manual admin switch: `enabled` or `disabled`
- `case` is derived:
- no `endAt` means `normal`
- has `endAt` means `special`
- display state is derived from date and status:
- draft or disabled
- upcoming
- ongoing
- ending soon
- expired

## Phase 1 Delivery

- Basic login integration
- Public feedback list page
- Public feedback detail page
- Admin dashboard placeholder
- Admin feedback form list
- Admin form editor shell
- Admin response shell
- Route structure
- API module placeholders

## Next Implementation Steps

1. Finish route and page scaffolding
2. Add typed API modules for feedback
3. Design backend schema with Prisma
4. Connect admin CRUD flow
5. Connect public submission flow
6. Add statistics and export
