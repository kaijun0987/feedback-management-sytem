export type FeedbackFormStatus = 'enabled' | 'disabled';

export type FeedbackFormCase = 'normal' | 'special';

export type FeedbackQuestionType = 'text' | 'singleChoice' | 'multipleChoice' | 'star';

export interface FeedbackFormRecord {
  id: string;
  title: string;
  description: string;
  status: FeedbackFormStatus;
  caseType: FeedbackFormCase;
  startAt: string;
  endAt: string | null;
  questionCount: number;
  estimatedMinutes: number;
  responseCount: number;
  tags: string[];
}

export interface FeedbackQuestionOption {
  id: string;
  label: string;
}

export interface FeedbackQuestionDraft {
  id: string;
  title: string;
  description: string;
  type: FeedbackQuestionType;
  required: boolean;
  options: FeedbackQuestionOption[];
}

export interface FeedbackFormDraft {
  id?: string;
  title: string;
  description: string;
  status: FeedbackFormStatus;
  startAt: number | null;
  endAt: number | null;
  tags: string[];
  estimatedMinutes: number;
  questions: FeedbackQuestionDraft[];
}

export interface FeedbackResponseAnswer {
  questionId: string;
  value: string | string[] | number;
}

export interface FeedbackResponseRecord {
  id: string;
  formId: string;
  submittedAt: string;
  submitterName: string | null;
  anonymous: boolean;
  answers: FeedbackResponseAnswer[];
}

export interface FeedbackSubmitPayload {
  formId: string;
  anonymous: boolean;
  submitterName: string | null;
  answers: FeedbackResponseAnswer[];
}
