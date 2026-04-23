import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import { FeedbackQuestionType, Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';

interface ResponseRecord {
  id: string;
  formId: string;
  submittedAt: string;
  submitterName: string | null;
  anonymous: boolean;
  answers: Array<{
    questionId: string;
    value: string | string[] | number;
  }>;
}

interface SubmitFeedbackResult {
  updated: boolean;
}

@Injectable()
export class FeedbackResponsesService {
  constructor(private readonly prismaService: PrismaService) {}

  private get prisma() {
    return this.prismaService.client;
  }

  private getSubmissionHmacSecret(): string {
    return (
      process.env.FEEDBACK_SUBMISSION_HMAC_SECRET || process.env.JWT_SECRET || 'dev-insecure-feedback-submission-secret'
    );
  }

  /** Irreversible per-user-per-form key; anonymous rows keep submitterId null but still dedupe and allow edits */
  computeSubmissionOwnerHash(userId: string, formId: string): string {
    return createHmac('sha256', this.getSubmissionHmacSecret()).update(`${userId}:${formId}`).digest('hex');
  }

  async getMySubmission(formId: string, userId: string) {
    const ownerHash = this.computeSubmissionOwnerHash(userId, formId);

    const response = await this.prisma.feedbackResponse.findFirst({
      where: {
        formId,
        OR: [{ submissionOwnerHash: ownerHash }, { submitterId: userId, submissionOwnerHash: null }]
      },
      include: {
        answers: true
      }
    });

    if (!response) {
      return null;
    }

    return {
      anonymous: response.isAnonymous,
      answers: response.answers.map(answer => ({
        questionId: answer.questionId,
        value: this.deserializeAnswerValue(answer)
      }))
    };
  }

  async submitFeedback(payload: SubmitFeedbackDto, submitterId: string | null): Promise<SubmitFeedbackResult> {
    if (!submitterId) {
      throw new BadRequestException('Login required to submit feedback');
    }

    const ownerHash = this.computeSubmissionOwnerHash(submitterId, payload.formId);

    const form = await this.prisma.feedbackForm.findUnique({
      where: { id: payload.formId },
      include: {
        questions: true
      }
    });

    if (!form) {
      throw new NotFoundException('Feedback form not found');
    }

    const questionMap = new Map(form.questions.map(question => [question.id, question]));
    const answerData = payload.answers.map(answer => {
      const question = questionMap.get(answer.questionId);

      if (!question) {
        throw new BadRequestException(`Question ${answer.questionId} does not belong to the form`);
      }

      return {
        question: {
          connect: {
            id: answer.questionId
          }
        },
        ...this.serializeAnswerValue(answer.value, question.type)
      };
    });

    const existing = await this.prisma.feedbackResponse.findFirst({
      where: {
        formId: payload.formId,
        OR: [{ submissionOwnerHash: ownerHash }, { submitterId: submitterId, submissionOwnerHash: null }]
      }
    });

    if (existing) {
      await this.prisma.$transaction(async tx => {
        await tx.feedbackAnswer.deleteMany({
          where: { responseId: existing.id }
        });

        await tx.feedbackResponse.update({
          where: { id: existing.id },
          data: {
            submissionOwnerHash: ownerHash,
            submitterId: payload.anonymous ? null : submitterId,
            isAnonymous: payload.anonymous,
            submittedAt: new Date(),
            answers: {
              create: answerData
            }
          }
        });
      });

      return { updated: true };
    }

    await this.prisma.feedbackResponse.create({
      data: {
        formId: payload.formId,
        submissionOwnerHash: ownerHash,
        submitterId: payload.anonymous ? null : submitterId,
        isAnonymous: payload.anonymous,
        answers: {
          create: answerData
        }
      }
    });

    return { updated: false };
  }

  async getResponses(formId: string): Promise<ResponseRecord[]> {
    const responses = await this.prisma.feedbackResponse.findMany({
      where: { formId },
      include: {
        submitter: true,
        answers: true
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    return responses.map(response => ({
      id: response.id,
      formId: response.formId,
      submittedAt: this.formatDateTime(response.submittedAt),
      submitterName: response.isAnonymous
        ? null
        : response.submitter?.displayName || response.submitter?.userName || null,
      anonymous: response.isAnonymous,
      answers: response.answers.map(answer => ({
        questionId: answer.questionId,
        value: this.deserializeAnswerValue(answer)
      }))
    }));
  }

  async getSummary(formId: string) {
    const [totalResponses, anonymousResponses] = await this.prisma.$transaction([
      this.prisma.feedbackResponse.count({
        where: { formId }
      }),
      this.prisma.feedbackResponse.count({
        where: {
          formId,
          isAnonymous: true
        }
      })
    ]);

    return {
      totalResponses,
      anonymousResponses
    };
  }

  private serializeAnswerValue(value: string | string[] | number, questionType: FeedbackQuestionType) {
    if (questionType === FeedbackQuestionType.MULTIPLE_CHOICE) {
      return {
        textValue: null,
        numberValue: null,
        jsonValue: Array.isArray(value) ? value : []
      };
    }

    if (questionType === FeedbackQuestionType.STAR) {
      return {
        textValue: null,
        numberValue: Number(value) || 0
      };
    }

    return {
      textValue: String(value ?? ''),
      numberValue: null
    };
  }

  private deserializeAnswerValue(answer: {
    textValue: string | null;
    numberValue: number | null;
    jsonValue: Prisma.JsonValue | null;
  }) {
    if (Array.isArray(answer.jsonValue)) {
      return answer.jsonValue.map(item => String(item));
    }

    if (typeof answer.numberValue === 'number') {
      return answer.numberValue;
    }

    return answer.textValue || '';
  }

  private formatDateTime(value: Date) {
    return value.toISOString().slice(0, 16).replace('T', ' ');
  }
}
