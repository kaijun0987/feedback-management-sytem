-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('R_SUPER', 'R_ADMIN', 'R_USER_COMMON');

-- CreateEnum
CREATE TYPE "FeedbackFormStatus" AS ENUM ('ENABLED', 'DISABLED');

-- CreateEnum
CREATE TYPE "FeedbackQuestionType" AS ENUM ('TEXT', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'STAR');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "employeeNo" TEXT,
    "userName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'R_USER_COMMON',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_forms" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" "FeedbackFormStatus" NOT NULL DEFAULT 'ENABLED',
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 1,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_questions" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" "FeedbackQuestionType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_question_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_responses" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "submitterId" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_answers" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "textValue" TEXT,
    "numberValue" DOUBLE PRECISION,
    "jsonValue" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeNo_key" ON "users"("employeeNo");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_forms_slug_key" ON "feedback_forms"("slug");

-- CreateIndex
CREATE INDEX "feedback_forms_status_startAt_endAt_idx" ON "feedback_forms"("status", "startAt", "endAt");

-- CreateIndex
CREATE INDEX "feedback_questions_formId_sortOrder_idx" ON "feedback_questions"("formId", "sortOrder");

-- CreateIndex
CREATE INDEX "feedback_question_options_questionId_sortOrder_idx" ON "feedback_question_options"("questionId", "sortOrder");

-- CreateIndex
CREATE INDEX "feedback_responses_formId_submittedAt_idx" ON "feedback_responses"("formId", "submittedAt");

-- CreateIndex
CREATE INDEX "feedback_responses_submitterId_idx" ON "feedback_responses"("submitterId");

-- CreateIndex
CREATE INDEX "feedback_answers_responseId_idx" ON "feedback_answers"("responseId");

-- CreateIndex
CREATE INDEX "feedback_answers_questionId_idx" ON "feedback_answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_answers_responseId_questionId_key" ON "feedback_answers"("responseId", "questionId");

-- AddForeignKey
ALTER TABLE "feedback_forms" ADD CONSTRAINT "feedback_forms_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_questions" ADD CONSTRAINT "feedback_questions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "feedback_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_question_options" ADD CONSTRAINT "feedback_question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "feedback_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_responses" ADD CONSTRAINT "feedback_responses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "feedback_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_responses" ADD CONSTRAINT "feedback_responses_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_answers" ADD CONSTRAINT "feedback_answers_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "feedback_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_answers" ADD CONSTRAINT "feedback_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "feedback_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
