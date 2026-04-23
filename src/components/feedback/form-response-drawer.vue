<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import type {
  FeedbackFormDraft,
  FeedbackQuestionDraft,
  FeedbackResponseRecord,
  FeedbackResponseAnswer
} from '@/types/feedback';

interface Props {
  visible: boolean;
  form: FeedbackFormDraft | null;
  totalResponseCount: number;
  responses: FeedbackResponseRecord[];
}

const props = defineProps<Props>();
const { t } = useI18n();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const questionSummaries = computed(() => {
  if (!props.form) {
    return [];
  }

  return props.form.questions.map(question => ({
    question,
    answers: props.responses
      .map(response => response.answers.find(answer => answer.questionId === question.id))
      .filter(Boolean) as FeedbackResponseAnswer[]
  }));
});

const summaryCards = computed(() => {
  const anonymousCount = props.responses.filter(item => item.anonymous).length;
  const completionRate = props.totalResponseCount
    ? Math.round((props.responses.length / props.totalResponseCount) * 100)
    : 0;

  return [
    {
      label: t('page.feedbackManage.summary.totalResponses'),
      value: props.totalResponseCount,
      hint: t('page.feedbackForm.response.summary.totalResponsesHint')
    },
    {
      label: t('page.feedbackForm.response.summary.sampleLoaded'),
      value: props.responses.length,
      hint: t('page.feedbackForm.response.summary.sampleLoadedHint')
    },
    {
      label: t('page.feedbackForm.response.summary.anonymous'),
      value: anonymousCount,
      hint: t('page.feedbackForm.response.summary.anonymousHint')
    },
    {
      label: t('page.feedbackForm.response.summary.sampleCoverage'),
      value: `${completionRate}%`,
      hint: t('page.feedbackForm.response.summary.sampleCoverageHint')
    }
  ];
});

function closeDrawer() {
  emit('update:visible', false);
}

function getQuestionAnswerValue(response: FeedbackResponseRecord, questionId: string) {
  return response.answers.find(answer => answer.questionId === questionId)?.value;
}

function formatQuestionInsight(question: FeedbackQuestionDraft, answers: FeedbackResponseAnswer[]) {
  if (question.type === 'star') {
    const numericAnswers = answers.map(answer => Number(answer.value)).filter(value => value > 0);
    const average = numericAnswers.length
      ? (numericAnswers.reduce((sum, value) => sum + value, 0) / numericAnswers.length).toFixed(1)
      : '0.0';

    return t('page.feedback.shared.units.ratingsCountAverage', { count: numericAnswers.length, average });
  }

  if (question.type === 'singleChoice') {
    const counts = question.options.map(option => ({
      label: option.label,
      count: answers.filter(answer => answer.value === option.label).length
    }));

    const top = counts.sort((a, b) => b.count - a.count)[0];
    return top
      ? t('page.feedbackForm.response.topAnswer', { label: top.label, count: top.count })
      : t('page.feedbackForm.response.noResponsesYet');
  }

  if (question.type === 'multipleChoice') {
    const flattened = answers.flatMap(answer => (Array.isArray(answer.value) ? answer.value : []));
    const topOption = question.options
      .map(option => ({
        label: option.label,
        count: flattened.filter(item => item === option.label).length
      }))
      .sort((a, b) => b.count - a.count)[0];

    return topOption
      ? t('page.feedbackForm.response.mostSelected', { label: topOption.label, count: topOption.count })
      : t('page.feedbackForm.response.noResponsesYet');
  }

  const nonEmpty = answers.map(answer => String(answer.value).trim()).filter(Boolean);

  return t('page.feedback.shared.units.writtenResponses', { count: nonEmpty.length });
}

function getQuestionDetailRows(question: FeedbackQuestionDraft, answers: FeedbackResponseAnswer[]) {
  if (question.type === 'star') {
    return [
      {
        label: t('page.feedbackForm.response.ratings'),
        value: answers.map(answer => `${answer.value}`).join(', ') || t('page.feedbackForm.response.noData')
      }
    ];
  }

  if (question.type === 'singleChoice') {
    return question.options.map(option => ({
      label: option.label,
      value: t('page.feedback.shared.units.responsesCount', {
        count: answers.filter(answer => answer.value === option.label).length
      })
    }));
  }

  if (question.type === 'multipleChoice') {
    return question.options.map(option => ({
      label: option.label,
      value: t('page.feedback.shared.units.selectionsCount', {
        count: answers.filter(answer => Array.isArray(answer.value) && answer.value.includes(option.label)).length
      })
    }));
  }

  return answers.slice(0, 3).map((answer, index) => ({
    label: t('page.feedbackForm.response.sample', { index: index + 1 }),
    value: String(answer.value).trim() || t('page.feedbackForm.response.empty')
  }));
}
</script>

<template>
  <NDrawer :show="visible" width="min(960px, 94vw)" @update:show="emit('update:visible', $event)">
    <NDrawerContent :title="form?.title || t('page.feedbackForm.response.fallbackTitle')" closable>
      <NSpace v-if="form" vertical :size="16">
        <NCard :bordered="false">
          <div class="flex flex-wrap items-start justify-between gap-12">
            <div>
              <h2 class="text-20px font-600 text-#101828">{{ form.title }}</h2>
              <p class="mt-8 text-14px text-#667085">{{ form.description }}</p>
            </div>
            <div class="text-right text-13px text-#98a2b3">
              <div>{{ t('page.feedback.shared.labels.questions') }}: {{ form.questions.length }}</div>
              <div class="mt-4">
                {{ t('page.feedback.shared.labels.estimated') }}: {{ form.estimatedMinutes }}
                {{ t('page.feedback.shared.units.min') }}
              </div>
            </div>
          </div>
        </NCard>

        <NGrid cols="1 s:2 xl:4" responsive="screen" :x-gap="16" :y-gap="16">
          <NGi v-for="item in summaryCards" :key="item.label">
            <NCard :bordered="false" class="h-full">
              <div class="text-14px text-#667085">{{ item.label }}</div>
              <div class="mt-8 text-28px font-700 text-#101828">{{ item.value }}</div>
              <div class="mt-8 text-12px text-#98a2b3">{{ item.hint }}</div>
            </NCard>
          </NGi>
        </NGrid>

        <NTabs type="line" animated>
          <NTabPane name="summary" :tab="t('page.feedbackForm.response.summaryTab')">
            <NSpace vertical :size="16">
              <NCard
                v-for="item in questionSummaries"
                :key="item.question.id"
                :bordered="false"
                :title="item.question.title"
              >
                <div class="text-14px text-#667085">{{ formatQuestionInsight(item.question, item.answers) }}</div>
              </NCard>
            </NSpace>
          </NTabPane>

          <NTabPane name="questions" :tab="t('page.feedbackForm.response.questionTab')">
            <NSpace vertical :size="16">
              <NCard
                v-for="item in questionSummaries"
                :key="item.question.id"
                :bordered="false"
                :title="item.question.title"
              >
                <div class="mb-12 text-13px text-#667085">
                  {{ t(`page.feedbackForm.builder.questionTypes.${item.question.type}`) }} ·
                  {{ t('page.feedback.shared.units.sampleResponses', { count: item.answers.length }) }}
                </div>
                <NSpace vertical :size="8">
                  <div
                    v-for="row in getQuestionDetailRows(item.question, item.answers)"
                    :key="`${item.question.id}-${row.label}`"
                    class="flex flex-wrap items-center justify-between gap-12 rounded-10px bg-#f8fafc px-12 py-10"
                  >
                    <span class="text-13px text-#344054">{{ row.label }}</span>
                    <span class="text-13px font-500 text-#101828">{{ row.value }}</span>
                  </div>
                </NSpace>
              </NCard>
            </NSpace>
          </NTabPane>

          <NTabPane name="individuals" :tab="t('page.feedbackForm.response.individualTab')">
            <NSpace vertical :size="16">
              <NCard
                v-for="response in responses"
                :key="response.id"
                :bordered="false"
                :title="
                  response.anonymous
                    ? t('page.feedbackForm.response.anonymousResponse')
                    : response.submitterName || t('page.feedbackForm.response.unknownUser')
                "
              >
                <template #header-extra>
                  <span class="text-12px text-#98a2b3">
                    {{ dayjs(response.submittedAt).format('YYYY-MM-DD HH:mm') }}
                  </span>
                </template>

                <NSpace vertical :size="10">
                  <div
                    v-for="question in form.questions"
                    :key="`${response.id}-${question.id}`"
                    class="rounded-12px bg-#f8fafc px-12 py-10"
                  >
                    <div class="text-12px text-#98a2b3">{{ question.title }}</div>
                    <div class="mt-6 text-13px text-#101828">
                      {{
                        Array.isArray(getQuestionAnswerValue(response, question.id))
                          ? (getQuestionAnswerValue(response, question.id) as string[]).join(', ') ||
                            t('page.feedbackForm.response.noAnswer')
                          : getQuestionAnswerValue(response, question.id) || t('page.feedbackForm.response.noAnswer')
                      }}
                    </div>
                  </div>
                </NSpace>
              </NCard>

              <NEmpty v-if="!responses.length" :description="t('page.feedbackForm.response.noSampleResponses')" />
            </NSpace>
          </NTabPane>
        </NTabs>

        <div class="flex justify-end">
          <NButton type="primary" @click="closeDrawer">{{ t('common.close') }}</NButton>
        </div>
      </NSpace>
    </NDrawerContent>
  </NDrawer>
</template>
