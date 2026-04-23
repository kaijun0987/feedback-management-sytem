-- AlterTable (Prisma uses camelCase column names in this project)
ALTER TABLE "feedback_responses" ADD COLUMN IF NOT EXISTS "submissionOwnerHash" TEXT;

-- Drop legacy wrong column name if a failed attempt created it
ALTER TABLE "feedback_responses" DROP COLUMN IF EXISTS "submission_owner_hash";

-- CreateIndex: one submission per user per form (hash is null for legacy rows only)
CREATE UNIQUE INDEX "feedback_responses_form_submission_owner_hash_key" ON "feedback_responses"("formId", "submissionOwnerHash") WHERE "submissionOwnerHash" IS NOT NULL;
