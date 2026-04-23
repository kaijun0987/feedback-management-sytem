import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackFormStatus, FeedbackQuestionType, Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { FormListQueryDto } from './dto/form-list-query.dto';
import { SaveFeedbackFormDto } from './dto/save-feedback-form.dto';

type QuestionType = 'text' | 'singleChoice' | 'multipleChoice' | 'star';

interface FormRecord {
  id: string;
  title: string;
  description: string;
  status: 'enabled' | 'disabled';
  caseType: 'normal' | 'special';
  startAt: string;
  endAt: string | null;
  questionCount: number;
  estimatedMinutes: number;
  responseCount: number;
  tags: string[];
}

interface FormDetail extends FormRecord {
  questions: Array<{
    id: string;
    title: string;
    description: string;
    type: QuestionType;
    required: boolean;
    options: Array<{ id: string; label: string }>;
  }>;
}

@Injectable()
export class FeedbackFormsService {
  constructor(private readonly prismaService: PrismaService) {}

  private get prisma() {
    return this.prismaService.client;
  }

  private toFormRecord(
    form: Prisma.FeedbackFormGetPayload<{
      include: {
        questions: true;
        _count: {
          select: {
            responses: true;
          };
        };
      };
    }>
  ): FormRecord {
    return {
      id: form.id,
      title: form.title,
      description: form.description,
      status: this.serializeStatus(form.status),
      caseType: form.endAt ? 'special' : 'normal',
      startAt: this.formatDate(form.startAt),
      endAt: form.endAt ? this.formatDate(form.endAt) : null,
      questionCount: form.questions.length,
      estimatedMinutes: form.estimatedMinutes,
      responseCount: form._count.responses,
      tags: [...form.tags]
    };
  }

  private toFormDetail(
    form: Prisma.FeedbackFormGetPayload<{
      include: {
        questions: {
          include: {
            options: true;
          };
        };
        _count: {
          select: {
            responses: true;
          };
        };
      };
    }>
  ): FormDetail {
    return {
      ...this.toFormRecord(form),
      questions: form.questions.map(question => ({
        id: question.id,
        title: question.title,
        description: question.description,
        type: this.serializeQuestionType(question.type),
        required: question.required,
        options: question.options
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(option => ({
            id: option.id,
            label: option.label
          }))
      }))
    };
  }

  async listPublicForms(query: FormListQueryDto) {
    const forms = await this.prisma.feedbackForm.findMany({
      where: this.buildWhere(query, true),
      include: {
        questions: true,
        _count: {
          select: {
            responses: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return forms.map(form => this.toFormRecord(form));
  }

  async listAdminForms(query: FormListQueryDto) {
    const forms = await this.prisma.feedbackForm.findMany({
      where: this.buildWhere(query, false),
      include: {
        questions: true,
        _count: {
          select: {
            responses: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return forms.map(form => this.toFormRecord(form));
  }

  async getPublicFormDetail(formId: string) {
    const form = await this.findFormDetailById(formId);

    if (!form) {
      throw new NotFoundException('Feedback form not found');
    }

    if (form.status !== 'enabled') {
      throw new NotFoundException('Feedback form not found');
    }

    return form;
  }

  async getAdminFormDetail(formId: string) {
    const form = await this.findFormDetailById(formId);

    if (!form) {
      throw new NotFoundException('Feedback form not found');
    }

    return form;
  }

  async saveForm(payload: SaveFeedbackFormDto, userId: string) {
    if (!payload.id) {
      const created = await this.prisma.feedbackForm.create({
        data: {
          id: `F-${Date.now()}`,
          slug: this.generateSlug(payload.title),
          title: payload.title.trim(),
          description: payload.description.trim(),
          status: this.deserializeStatus(payload.status),
          startAt: this.parseDate(payload.startAt),
          endAt: this.parseNullableDate(payload.endAt),
          estimatedMinutes: payload.estimatedMinutes,
          tags: payload.tags,
          createdById: userId,
          questions: {
            create: payload.questions.map((question, index) => ({
              id: question.id || `Q-${randomUUID()}`,
              title: question.title.trim(),
              description: question.description.trim(),
              type: this.deserializeQuestionType(question.type),
              required: question.required,
              sortOrder: index,
              options: {
                create: question.options.map((option, optionIndex) => ({
                  id: option.id || `O-${randomUUID()}`,
                  label: option.label.trim(),
                  value: option.label.trim(),
                  sortOrder: optionIndex
                }))
              }
            }))
          }
        },
        include: {
          questions: {
            include: {
              options: true
            }
          },
          _count: {
            select: {
              responses: true
            }
          }
        }
      });

      return this.toFormDetail(created);
    }

    return this.prisma.$transaction(async tx => {
      const existing = await tx.feedbackForm.findUnique({
        where: { id: payload.id },
        include: {
          questions: {
            include: {
              options: true,
              _count: {
                select: {
                  answers: true
                }
              }
            }
          }
        }
      });

      if (!existing) {
        throw new NotFoundException('Feedback form not found');
      }

      const incomingQuestionIds = new Set(payload.questions.map(question => question.id).filter(Boolean));
      const removableQuestions = existing.questions.filter(question => !incomingQuestionIds.has(question.id));

      if (removableQuestions.some(question => question._count.answers > 0)) {
        throw new BadRequestException('Cannot remove questions that already have submitted answers');
      }

      if (removableQuestions.length) {
        await tx.feedbackQuestion.deleteMany({
          where: {
            id: {
              in: removableQuestions.map(question => question.id)
            }
          }
        });
      }

      await tx.feedbackForm.update({
        where: { id: payload.id },
        data: {
          title: payload.title.trim(),
          description: payload.description.trim(),
          status: this.deserializeStatus(payload.status),
          startAt: this.parseDate(payload.startAt),
          endAt: this.parseNullableDate(payload.endAt),
          estimatedMinutes: payload.estimatedMinutes,
          tags: payload.tags
        }
      });

      for (const [index, question] of payload.questions.entries()) {
        if (question.id && existing.questions.some(item => item.id === question.id)) {
          await tx.feedbackQuestion.update({
            where: { id: question.id },
            data: {
              title: question.title.trim(),
              description: question.description.trim(),
              type: this.deserializeQuestionType(question.type),
              required: question.required,
              sortOrder: index
            }
          });

          await tx.feedbackQuestionOption.deleteMany({
            where: { questionId: question.id }
          });

          if (question.options.length) {
            await tx.feedbackQuestionOption.createMany({
              data: question.options.map((option, optionIndex) => ({
                id: option.id || `O-${randomUUID()}`,
                questionId: question.id!,
                label: option.label.trim(),
                value: option.label.trim(),
                sortOrder: optionIndex
              }))
            });
          }

          continue;
        }

        await tx.feedbackQuestion.create({
          data: {
            id: question.id || `Q-${randomUUID()}`,
            form: {
              connect: {
                id: payload.id
              }
            },
            title: question.title.trim(),
            description: question.description.trim(),
            type: this.deserializeQuestionType(question.type),
            required: question.required,
            sortOrder: index,
            options: {
              create: question.options.map((option, optionIndex) => ({
                id: option.id || `O-${randomUUID()}`,
                label: option.label.trim(),
                value: option.label.trim(),
                sortOrder: optionIndex
              }))
            }
          }
        });
      }

      const updated = await this.findFormDetailById(payload.id!, tx);

      if (!updated) {
        throw new NotFoundException('Feedback form not found');
      }

      return updated;
    });
  }

  async toggleStatus(formId: string, status: 'enabled' | 'disabled') {
    const form = await this.prisma.feedbackForm.findUnique({
      where: { id: formId }
    });

    if (!form) {
      throw new NotFoundException('Feedback form not found');
    }

    await this.prisma.feedbackForm.update({
      where: { id: formId },
      data: {
        status: this.deserializeStatus(status)
      }
    });

    return true;
  }

  private buildWhere(query: FormListQueryDto, publicOnly: boolean): Prisma.FeedbackFormWhereInput {
    const and: Prisma.FeedbackFormWhereInput[] = [];

    if (publicOnly) {
      and.push({ status: FeedbackFormStatus.ENABLED });
    } else if (query.status) {
      and.push({ status: this.deserializeStatus(query.status) });
    }

    if (query.keyword?.trim()) {
      const keyword = query.keyword.trim();
      and.push({
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
          { tags: { hasSome: [keyword] } }
        ]
      });
    }

    if (query.caseType === 'normal') {
      and.push({ endAt: null });
    } else if (query.caseType === 'special') {
      and.push({ endAt: { not: null } });
    }

    if (query.startDate) {
      and.push({
        OR: [{ endAt: null }, { endAt: { gte: new Date(query.startDate) } }]
      });
    }

    if (query.endDate) {
      and.push({
        startAt: {
          lte: new Date(query.endDate)
        }
      });
    }

    return and.length ? { AND: and } : {};
  }

  private async findFormDetailById(
    formId: string,
    prisma: Pick<Prisma.TransactionClient, 'feedbackForm'> = this.prisma
  ) {
    const form = await prisma.feedbackForm.findUnique({
      where: { id: formId },
      include: {
        questions: {
          include: {
            options: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        },
        _count: {
          select: {
            responses: true
          }
        }
      }
    });

    return form ? this.toFormDetail(form) : null;
  }

  private serializeStatus(status: FeedbackFormStatus): 'enabled' | 'disabled' {
    return status === FeedbackFormStatus.ENABLED ? 'enabled' : 'disabled';
  }

  private deserializeStatus(status: 'enabled' | 'disabled') {
    return status === 'enabled' ? FeedbackFormStatus.ENABLED : FeedbackFormStatus.DISABLED;
  }

  private serializeQuestionType(type: FeedbackQuestionType): QuestionType {
    if (type === FeedbackQuestionType.SINGLE_CHOICE) {
      return 'singleChoice';
    }

    if (type === FeedbackQuestionType.MULTIPLE_CHOICE) {
      return 'multipleChoice';
    }

    if (type === FeedbackQuestionType.STAR) {
      return 'star';
    }

    return 'text';
  }

  private deserializeQuestionType(type: QuestionType) {
    if (type === 'singleChoice') {
      return FeedbackQuestionType.SINGLE_CHOICE;
    }

    if (type === 'multipleChoice') {
      return FeedbackQuestionType.MULTIPLE_CHOICE;
    }

    if (type === 'star') {
      return FeedbackQuestionType.STAR;
    }

    return FeedbackQuestionType.TEXT;
  }

  private parseDate(value: string | null) {
    return value ? new Date(value) : new Date();
  }

  private parseNullableDate(value: string | null) {
    return value ? new Date(value) : null;
  }

  private formatDate(value: Date) {
    return value.toISOString().slice(0, 10);
  }

  private generateSlug(title: string) {
    const base = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return `${base || 'feedback-form'}-${randomUUID().slice(0, 8)}`;
  }
}
