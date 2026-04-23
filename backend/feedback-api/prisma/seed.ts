import 'dotenv/config';
import { createHmac } from 'node:crypto';
import { hash } from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { FeedbackFormStatus, FeedbackQuestionType, PrismaClient, UserRole } from '@prisma/client';
import { Pool } from 'pg';

function submissionOwnerHash(userId: string, formId: string) {
  const secret =
    process.env.FEEDBACK_SUBMISSION_HMAC_SECRET || process.env.JWT_SECRET || 'replace-with-a-secure-secret';

  return createHmac('sha256', secret).update(`${userId}:${formId}`).digest('hex');
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run the seed script.');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg(
      new Pool({
        connectionString: databaseUrl
      })
    )
  });

  const passwordHash = await hash('123456', 10);

  try {
    await prisma.feedbackAnswer.deleteMany();
    await prisma.feedbackResponse.deleteMany();
    await prisma.feedbackQuestionOption.deleteMany();
    await prisma.feedbackQuestion.deleteMany();
    await prisma.feedbackForm.deleteMany();
    await prisma.user.deleteMany();

    const [superUser, adminUser, normalUser] = await Promise.all([
      prisma.user.create({
        data: {
          id: 'USR_SUPER',
          employeeNo: 'EMP-0001',
          userName: 'Super',
          displayName: 'System Super',
          email: 'super@soybean.local',
          passwordHash,
          role: UserRole.R_SUPER
        }
      }),
      prisma.user.create({
        data: {
          id: 'USR_ADMIN',
          employeeNo: 'EMP-0002',
          userName: 'Admin',
          displayName: 'Feedback Admin',
          email: 'admin@soybean.local',
          passwordHash,
          role: UserRole.R_ADMIN
        }
      }),
      prisma.user.create({
        data: {
          id: 'USR_USER',
          employeeNo: 'EMP-0003',
          userName: 'User',
          displayName: 'Internal User',
          email: 'user@soybean.local',
          passwordHash,
          role: UserRole.R_USER_COMMON
        }
      })
    ]);

    await prisma.feedbackForm.create({
      data: {
        id: 'F-001',
        slug: 'pantry-feedback',
        title: 'Pantry Feedback',
        description: 'Collect always-open suggestions for pantry supplies, snacks, and drink restocking.',
        status: FeedbackFormStatus.ENABLED,
        startAt: new Date('2026-04-01'),
        estimatedMinutes: 2,
        tags: ['Always open', 'Office'],
        createdById: adminUser.id,
        questions: {
          create: [
            {
              id: 'F-001-Q1',
              title: 'What pantry items should we add next month?',
              description: 'List snacks, drinks, or supplies that would be most helpful.',
              type: FeedbackQuestionType.TEXT,
              required: true,
              sortOrder: 0
            }
          ]
        },
        responses: {
          create: [
            {
              id: 'R-001',
              submitterId: normalUser.id,
              submissionOwnerHash: submissionOwnerHash(normalUser.id, 'F-001'),
              isAnonymous: false,
              submittedAt: new Date('2026-04-15T09:20:00Z'),
              answers: {
                create: [
                  {
                    id: 'A-001',
                    questionId: 'F-001-Q1',
                    textValue: 'Add more sugar-free drinks and fresh fruit.'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    await prisma.feedbackForm.create({
      data: {
        id: 'F-002',
        slug: 'team-building-survey',
        title: 'Team Building Survey',
        description: 'Gather activity ideas, food preferences, and transport constraints for next month team building.',
        status: FeedbackFormStatus.ENABLED,
        startAt: new Date('2026-04-10'),
        endAt: new Date('2026-04-30'),
        estimatedMinutes: 4,
        tags: ['Event', 'HR'],
        createdById: superUser.id,
        questions: {
          create: [
            {
              id: 'F-002-Q1',
              title: 'Which activity would you most likely join?',
              description: '',
              type: FeedbackQuestionType.SINGLE_CHOICE,
              required: true,
              sortOrder: 0,
              options: {
                create: [
                  {
                    id: 'F-002-Q1-O1',
                    label: 'Bowling',
                    value: 'Bowling',
                    sortOrder: 0
                  },
                  {
                    id: 'F-002-Q1-O2',
                    label: 'Escape room',
                    value: 'Escape room',
                    sortOrder: 1
                  },
                  {
                    id: 'F-002-Q1-O3',
                    label: 'Cooking class',
                    value: 'Cooking class',
                    sortOrder: 2
                  }
                ]
              }
            }
          ]
        },
        responses: {
          create: [
            {
              id: 'R-101',
              submitterId: normalUser.id,
              submissionOwnerHash: submissionOwnerHash(normalUser.id, 'F-002'),
              isAnonymous: false,
              submittedAt: new Date('2026-04-17T10:00:00Z'),
              answers: {
                create: [
                  {
                    id: 'A-101',
                    questionId: 'F-002-Q1',
                    textValue: 'Cooking class'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('Seed completed successfully.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
