import { feedbackRequest } from '../request';

/** Get public feedback forms */
export function fetchGetFeedbackForms(params?: Api.Feedback.FormListQuery) {
  return feedbackRequest<Api.Feedback.FormRecord[]>({
    url: '/feedback/forms',
    params
  });
}

/** Get feedback form detail */
export function fetchGetFeedbackFormDetail(formId: string) {
  return feedbackRequest<Api.Feedback.FormDetail>({
    url: `/feedback/forms/${formId}`
  });
}

/** Get admin feedback form detail */
export function fetchGetAdminFeedbackFormDetail(formId: string) {
  return feedbackRequest<Api.Feedback.FormDetail>({
    url: `/admin/feedback/forms/${formId}`
  });
}

/** Submit feedback form */
export function fetchSubmitFeedback(payload: Api.Feedback.SubmitPayload) {
  return feedbackRequest<Api.Feedback.SubmitResult>({
    url: `/feedback/forms/${payload.formId}/submit`,
    method: 'post',
    data: payload
  });
}

/** Current user's existing submission for this form (for edit / prefill) */
export function fetchGetMyFeedbackSubmission(formId: string) {
  return feedbackRequest<Api.Feedback.MySubmission | null>({
    url: `/feedback/forms/${formId}/my-submission`
  });
}

/** Get admin feedback forms */
export function fetchGetAdminFeedbackForms(params?: Api.Feedback.FormListQuery) {
  return feedbackRequest<Api.Feedback.FormRecord[]>({
    url: '/admin/feedback/forms',
    params
  });
}

/** Save feedback form */
export function fetchSaveFeedbackForm(payload: Api.Feedback.SaveFormPayload) {
  const hasId = Boolean(payload.id);

  return feedbackRequest<Api.Feedback.FormDetail>({
    url: hasId ? `/admin/feedback/forms/${payload.id}` : '/admin/feedback/forms',
    method: hasId ? 'put' : 'post',
    data: payload
  });
}

/** Toggle feedback form status */
export function fetchToggleFeedbackFormStatus(formId: string, status: Api.Feedback.FormRecord['status']) {
  return feedbackRequest<boolean>({
    url: `/admin/feedback/forms/${formId}/status`,
    method: 'patch',
    data: { status }
  });
}

/** Get feedback responses */
export function fetchGetFeedbackResponses(formId: string) {
  return feedbackRequest<Api.Feedback.ResponseRecord[]>({
    url: `/admin/feedback/forms/${formId}/responses`
  });
}

/** Get feedback response summary */
export function fetchGetFeedbackResponseSummary(formId: string) {
  return feedbackRequest<Api.Feedback.ResponseSummary>({
    url: `/admin/feedback/forms/${formId}/responses/summary`
  });
}
