import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { SetupStoreId } from '@/enum';
import {
  fetchGetAdminFeedbackFormDetail,
  fetchGetAdminFeedbackForms,
  fetchGetFeedbackFormDetail,
  fetchGetFeedbackForms,
  fetchGetFeedbackResponses,
  fetchSaveFeedbackForm,
  fetchSubmitFeedback,
  fetchToggleFeedbackFormStatus
} from '@/service/api';
import type {
  FeedbackFormDraft,
  FeedbackFormRecord,
  FeedbackResponseRecord,
  FeedbackSubmitPayload
} from '@/types/feedback';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const useFeedbackStore = defineStore(SetupStoreId.Feedback, () => {
  const forms = ref<FeedbackFormRecord[]>([]);
  const formDraftMap = reactive<Record<string, FeedbackFormDraft>>({});
  const responseMap = reactive<Record<string, FeedbackResponseRecord[]>>({});
  const isFormsLoading = ref(false);
  const isFormDetailLoading = ref(false);
  const isResponsesLoading = ref(false);
  const isSaving = ref(false);
  const formsError = ref<string | null>(null);
  const formDetailError = ref<string | null>(null);
  const responsesError = ref<string | null>(null);
  const saveError = ref<string | null>(null);
  const submitError = ref<string | null>(null);

  const totalForms = computed(() => forms.value.length);

  function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (typeof error === 'string' && error) {
      return error;
    }

    return fallback;
  }

  function toFormRecord(form: Api.Feedback.FormRecord | Api.Feedback.FormDetail): FeedbackFormRecord {
    return {
      id: form.id,
      title: form.title,
      description: form.description,
      status: form.status,
      caseType: form.caseType,
      startAt: form.startAt,
      endAt: form.endAt,
      questionCount: 'questionCount' in form ? form.questionCount : form.questions.length,
      estimatedMinutes: form.estimatedMinutes,
      responseCount: form.responseCount,
      tags: clone(form.tags)
    };
  }

  function toFormDraft(detail: Api.Feedback.FormDetail): FeedbackFormDraft {
    return {
      id: detail.id,
      title: detail.title,
      description: detail.description,
      status: detail.status,
      startAt: detail.startAt ? dayjs(detail.startAt).valueOf() : null,
      endAt: detail.endAt ? dayjs(detail.endAt).valueOf() : null,
      tags: clone(detail.tags),
      estimatedMinutes: detail.estimatedMinutes,
      questions: detail.questions.map(question => ({
        id: question.id,
        title: question.title,
        description: question.description,
        type: question.type,
        required: question.required,
        options: question.options.map(option => ({
          id: option.id,
          label: option.label
        }))
      }))
    };
  }

  function toSavePayload(draft: FeedbackFormDraft): Api.Feedback.SaveFormPayload {
    return {
      id: draft.id,
      title: draft.title.trim(),
      description: draft.description.trim(),
      status: draft.status,
      startAt: draft.startAt ? dayjs(draft.startAt).format('YYYY-MM-DD') : null,
      endAt: draft.endAt ? dayjs(draft.endAt).format('YYYY-MM-DD') : null,
      estimatedMinutes: draft.estimatedMinutes,
      tags: draft.tags.map(item => item.trim()).filter(Boolean),
      questions: draft.questions.map(question => ({
        id: question.id,
        title: question.title.trim(),
        description: question.description.trim(),
        type: question.type,
        required: question.required,
        options: question.options.map(option => ({
          id: option.id,
          label: option.label.trim()
        }))
      }))
    };
  }

  function upsertFormRecord(record: FeedbackFormRecord) {
    const targetIndex = forms.value.findIndex(item => item.id === record.id);

    if (targetIndex >= 0) {
      forms.value.splice(targetIndex, 1, record);
      return;
    }

    forms.value = [record, ...forms.value];
  }

  function getFormById(id: string) {
    return forms.value.find(item => item.id === id) || null;
  }

  function getFormDraftById(id: string) {
    const draft = formDraftMap[id];
    return draft ? clone(draft) : null;
  }

  function getResponsesByFormId(formId: string) {
    return clone(responseMap[formId] || []);
  }

  async function loadPublicForms(params?: Api.Feedback.FormListQuery) {
    isFormsLoading.value = true;
    formsError.value = null;

    try {
      const { data, error } = await fetchGetFeedbackForms(params);

      if (error) {
        formsError.value = getErrorMessage(error, 'Failed to load feedback forms.');
        return [];
      }

      forms.value = data.map(item => toFormRecord(item));
      return forms.value;
    } finally {
      isFormsLoading.value = false;
    }
  }

  async function loadAdminForms(params?: Api.Feedback.FormListQuery) {
    isFormsLoading.value = true;
    formsError.value = null;

    try {
      const { data, error } = await fetchGetAdminFeedbackForms(params);

      if (error) {
        formsError.value = getErrorMessage(error, 'Failed to load admin feedback forms.');
        return [];
      }

      forms.value = data.map(item => toFormRecord(item));
      return forms.value;
    } finally {
      isFormsLoading.value = false;
    }
  }

  async function loadFormDraft(id: string, force = false, source: 'public' | 'admin' = 'public') {
    if (!force && formDraftMap[id]) {
      formDetailError.value = null;
      return clone(formDraftMap[id]);
    }

    isFormDetailLoading.value = true;
    formDetailError.value = null;

    try {
      const fetchDetail = source === 'admin' ? fetchGetAdminFeedbackFormDetail : fetchGetFeedbackFormDetail;
      const { data: detail, error } = await fetchDetail(id);

      if (error) {
        formDetailError.value = getErrorMessage(error, 'Failed to load form detail.');
        return null;
      }

      const draft = toFormDraft(detail);
      formDraftMap[id] = draft;
      upsertFormRecord(toFormRecord(detail));
      return clone(draft);
    } finally {
      isFormDetailLoading.value = false;
    }
  }

  async function loadResponses(formId: string) {
    isResponsesLoading.value = true;
    responsesError.value = null;

    try {
      const { data, error } = await fetchGetFeedbackResponses(formId);

      if (error) {
        responsesError.value = getErrorMessage(error, 'Failed to load feedback responses.');
        return [];
      }

      responseMap[formId] = data.map(item => ({
        id: item.id,
        formId: item.formId,
        submittedAt: item.submittedAt,
        submitterName: item.submitterName,
        anonymous: item.anonymous,
        answers: clone(item.answers)
      }));
      return clone(responseMap[formId]);
    } finally {
      isResponsesLoading.value = false;
    }
  }

  async function toggleFormStatus(id: string, nextStatus?: FeedbackFormRecord['status']) {
    const target = getFormById(id);

    if (!target) {
      return false;
    }

    const status = nextStatus || (target.status === 'enabled' ? 'disabled' : 'enabled');
    const { error } = await fetchToggleFeedbackFormStatus(id, status);

    if (error) {
      return false;
    }

    upsertFormRecord({
      ...target,
      status
    });

    if (formDraftMap[id]) {
      formDraftMap[id] = {
        ...formDraftMap[id],
        status
      };
    }

    return true;
  }

  async function saveFormDraft(draft: FeedbackFormDraft) {
    isSaving.value = true;
    saveError.value = null;

    try {
      const { data: detail, error } = await fetchSaveFeedbackForm(toSavePayload(draft));

      if (error) {
        saveError.value = getErrorMessage(error, 'Failed to save feedback form.');
        throw new Error(saveError.value);
      }

      const nextDraft = toFormDraft(detail);
      formDraftMap[detail.id] = nextDraft;
      if (!responseMap[detail.id]) {
        responseMap[detail.id] = [];
      }

      const record = toFormRecord(detail);
      upsertFormRecord(record);

      return record;
    } finally {
      isSaving.value = false;
    }
  }

  async function submitFeedback(payload: FeedbackSubmitPayload) {
    submitError.value = null;
    const { data, error } = await fetchSubmitFeedback({
      formId: payload.formId,
      anonymous: payload.anonymous,
      answers: clone(payload.answers)
    });

    if (error) {
      submitError.value = getErrorMessage(error, 'Failed to submit feedback.');
      throw new Error(submitError.value);
    }

    const updated = Boolean(
      data && typeof data === 'object' && 'updated' in data && (data as Api.Feedback.SubmitResult).updated
    );

    const target = getFormById(payload.formId);

    if (target && !updated) {
      upsertFormRecord({
        ...target,
        responseCount: target.responseCount + 1
      });
    }

    if (responseMap[payload.formId]) {
      await loadResponses(payload.formId);
    }

    return { updated };
  }

  return {
    forms,
    formDraftMap,
    responseMap,
    isFormsLoading,
    isFormDetailLoading,
    isResponsesLoading,
    isSaving,
    formsError,
    formDetailError,
    responsesError,
    saveError,
    submitError,
    totalForms,
    getFormById,
    getFormDraftById,
    getResponsesByFormId,
    loadPublicForms,
    loadAdminForms,
    loadFormDraft,
    loadResponses,
    toggleFormStatus,
    saveFormDraft,
    submitFeedback
  };
});
