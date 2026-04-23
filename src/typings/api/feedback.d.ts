declare namespace Api {
  /**
   * namespace Feedback
   *
   * backend api module: "feedback"
   */
  namespace Feedback {
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

    interface QuestionOption {
      id: string;
      label: string;
    }

    interface QuestionRecord {
      id: string;
      title: string;
      description: string;
      type: QuestionType;
      required: boolean;
      options: QuestionOption[];
    }

    interface FormDetail extends Omit<FormRecord, 'questionCount'> {
      questions: QuestionRecord[];
    }

    interface ResponseAnswer {
      questionId: string;
      value: string | string[] | number;
    }

    interface ResponseRecord {
      id: string;
      formId: string;
      submittedAt: string;
      submitterName: string | null;
      anonymous: boolean;
      answers: ResponseAnswer[];
    }

    interface SubmitPayload {
      formId: string;
      anonymous: boolean;
      answers: ResponseAnswer[];
    }

    interface SubmitResult {
      updated: boolean;
    }

    /** Current user's submission for a form (login required); anonymous rows omit submitter in admin but are keyed by server-side hash) */
    interface MySubmission {
      anonymous: boolean;
      answers: ResponseAnswer[];
    }

    interface SaveFormPayload {
      id?: string;
      title: string;
      description: string;
      status: 'enabled' | 'disabled';
      startAt: string | null;
      endAt: string | null;
      estimatedMinutes: number;
      tags: string[];
      questions: QuestionRecord[];
    }

    interface FormListQuery {
      keyword?: string;
      caseType?: 'normal' | 'special';
      status?: 'enabled' | 'disabled';
      startDate?: string;
      endDate?: string;
    }

    interface ResponseSummary {
      totalResponses: number;
      anonymousResponses: number;
    }
  }
}
