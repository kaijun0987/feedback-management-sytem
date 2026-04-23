<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  FeedbackFormDraft,
  FeedbackFormRecord,
  FeedbackResponseAnswer,
  FeedbackSubmitPayload
} from '@/types/feedback';

interface Props {
  visible: boolean;
  record: FeedbackFormRecord | null;
  form: FeedbackFormDraft | null;
  submitterName: string | null;
  /** Prefill when the user already submitted once (same form) */
  initialAnswers?: FeedbackResponseAnswer[] | null;
}

type AnswerValue = string | string[] | number;

const props = defineProps<Props>();
const anonymousMode = defineModel<boolean>('anonymousMode', { default: false });
const { t } = useI18n();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  submit: [payload: FeedbackSubmitPayload];
}>();

const answers = ref<Record<string, AnswerValue>>({});

const canSubmit = computed(() => Boolean(props.record && props.form));

const isEditMode = computed(() => Boolean(props.initialAnswers?.length));

watch(
  () => [props.visible, props.form, props.initialAnswers] as const,
  ([visible]) => {
    if (!visible || !props.form) {
      return;
    }

    const next: Record<string, AnswerValue> = {};

    props.form.questions.forEach(question => {
      if (question.type === 'multipleChoice') {
        next[question.id] = [];
        return;
      }

      if (question.type === 'star') {
        next[question.id] = 0;
        return;
      }

      next[question.id] = '';
    });

    if (props.initialAnswers?.length) {
      for (const item of props.initialAnswers) {
        if (!(item.questionId in next)) {
          continue;
        }

        if (Array.isArray(item.value)) {
          next[item.questionId] = [...item.value];
        } else {
          next[item.questionId] = item.value;
        }
      }
    }

    answers.value = next;
  },
  { immediate: true }
);

function closeDrawer() {
  emit('update:visible', false);
}

function getTextAnswer(id: string) {
  return typeof answers.value[id] === 'string' ? answers.value[id] : '';
}

function getSingleChoiceAnswer(id: string) {
  return typeof answers.value[id] === 'string' ? answers.value[id] : '';
}

function getMultipleChoiceAnswer(id: string) {
  return Array.isArray(answers.value[id]) ? answers.value[id] : [];
}

function getRateAnswer(id: string) {
  return typeof answers.value[id] === 'number' ? answers.value[id] : 0;
}

function setTextAnswer(id: string, value: string) {
  answers.value[id] = value;
}

function setSingleChoiceAnswer(id: string, value: string) {
  answers.value[id] = value;
}

function setMultipleChoiceAnswer(id: string, value: string[]) {
  answers.value[id] = value;
}

function setRateAnswer(id: string, value: number) {
  answers.value[id] = value;
}

function getCaseTypeLabel(caseType: FeedbackFormRecord['caseType']) {
  return t(`page.feedback.shared.caseType.${caseType}`);
}

function validateRequired() {
  if (!props.form) {
    return false;
  }

  const invalidQuestion = props.form.questions.find(question => {
    if (!question.required) {
      return false;
    }

    const value = answers.value[question.id];

    if (question.type === 'multipleChoice') {
      return !Array.isArray(value) || value.length === 0;
    }

    if (question.type === 'star') {
      return typeof value !== 'number' || value <= 0;
    }

    return typeof value !== 'string' || !value.trim();
  });

  if (invalidQuestion) {
    window.$message?.warning(t('page.feedbackForm.submit.completeQuestion', { title: invalidQuestion.title }));
    return false;
  }

  return true;
}

function handleSubmit() {
  if (!props.record || !validateRequired()) {
    return;
  }

  emit('submit', {
    formId: props.record.id,
    anonymous: anonymousMode.value,
    submitterName: props.submitterName,
    answers: Object.entries(answers.value).map(([questionId, value]) => ({
      questionId,
      value: Array.isArray(value) ? [...value] : value
    }))
  });
  closeDrawer();
}
</script>

<template>
  <NDrawer :show="visible" width="min(840px, 92vw)" @update:show="emit('update:visible', $event)">
    <NDrawerContent :title="record?.title || t('page.feedbackForm.submit.fallbackTitle')" closable>
      <NSpace v-if="record && form" vertical :size="16">
        <NCard :bordered="false">
          <NSpace vertical :size="8">
            <div class="flex flex-wrap items-center gap-8">
              <NTag round :type="record.caseType === 'normal' ? 'info' : 'warning'">
                {{ getCaseTypeLabel(record.caseType) }}
              </NTag>
              <NTag round :type="anonymousMode ? 'success' : 'default'">
                {{
                  anonymousMode
                    ? t('page.feedback.shared.mode.anonymousEnabled')
                    : t('page.feedback.shared.mode.standardSubmit')
                }}
              </NTag>
              <NTag v-for="tag in record.tags" :key="tag" size="small" round>{{ tag }}</NTag>
            </div>
            <p class="text-14px leading-6 text-#64748b dark:text-#b4bcc8">
              {{ record.description }}
            </p>
            <div
              class="grid grid-cols-2 gap-12 rounded-12px bg-#f8fafc p-12 lt-sm:grid-cols-1 dark:border dark:border-#334155/60 dark:bg-#0f172a/50"
            >
              <div>
                <div class="text-12px text-#98a2b3 dark:text-#8b93a1">
                  {{ t('page.feedback.shared.labels.questions') }}
                </div>
                <div class="mt-4 text-13px font-500 text-#344054 dark:text-#e2e8f0">
                  {{ form.questions.length }}
                </div>
              </div>
              <div>
                <div class="text-12px text-#98a2b3 dark:text-#8b93a1">
                  {{ t('page.feedback.shared.labels.estimatedTime') }}
                </div>
                <div class="mt-4 text-13px font-500 text-#344054 dark:text-#e2e8f0">
                  {{ record.estimatedMinutes }} {{ t('page.feedback.shared.units.min') }}
                </div>
              </div>
            </div>
            <div
              class="flex items-center justify-between gap-12 border border-#e4e7ec rounded-12px p-12 dark:border-#334155/70 dark:bg-#0f172a/40"
            >
              <div>
                <div class="text-13px font-600 text-#101828 dark:text-#f1f5f9">
                  {{ t('page.feedback.anonymousSubmit') }}
                </div>
                <div class="mt-2 text-12px text-#98a2b3 dark:text-#8b93a1">
                  {{ t('page.feedback.perFormAnonymousHint') }}
                </div>
              </div>
              <NSwitch v-model:value="anonymousMode" />
            </div>
          </NSpace>
        </NCard>

        <NCard :bordered="false" :title="t('page.feedbackForm.submit.title')">
          <NSpace vertical :size="16">
            <NCard
              v-for="(question, index) in form.questions"
              :key="question.id"
              size="small"
              embedded
              :title="t('page.feedbackForm.builder.questionPrefix', { index: index + 1 })"
            >
              <NSpace vertical :size="12">
                <div class="flex flex-wrap items-center gap-8">
                  <span class="text-15px font-600 text-#101828 dark:text-#f1f5f9">{{ question.title }}</span>
                  <NTag v-if="question.required" size="small" round type="error">
                    {{ t('page.feedbackForm.submit.required') }}
                  </NTag>
                </div>
                <p v-if="question.description" class="text-13px text-#64748b dark:text-#a8b0ba">
                  {{ question.description }}
                </p>

                <NInput
                  v-if="question.type === 'text'"
                  :value="getTextAnswer(question.id)"
                  type="textarea"
                  :placeholder="t('page.feedbackForm.submit.writeAnswer')"
                  @update:value="setTextAnswer(question.id, $event)"
                />

                <NRadioGroup
                  v-else-if="question.type === 'singleChoice'"
                  :value="getSingleChoiceAnswer(question.id)"
                  @update:value="setSingleChoiceAnswer(question.id, String($event))"
                >
                  <NSpace vertical :size="8">
                    <NRadio v-for="option in question.options" :key="option.id" :value="option.label">
                      {{ option.label }}
                    </NRadio>
                  </NSpace>
                </NRadioGroup>

                <NCheckboxGroup
                  v-else-if="question.type === 'multipleChoice'"
                  :value="getMultipleChoiceAnswer(question.id)"
                  @update:value="setMultipleChoiceAnswer(question.id, $event as string[])"
                >
                  <NSpace vertical :size="8">
                    <NCheckbox v-for="option in question.options" :key="option.id" :value="option.label">
                      {{ option.label }}
                    </NCheckbox>
                  </NSpace>
                </NCheckboxGroup>

                <NRate
                  v-else-if="question.type === 'star'"
                  :value="getRateAnswer(question.id)"
                  @update:value="setRateAnswer(question.id, $event || 0)"
                />
              </NSpace>
            </NCard>
          </NSpace>
        </NCard>

        <div class="flex justify-end gap-12">
          <NButton @click="closeDrawer">{{ t('common.cancel') }}</NButton>
          <NButton type="primary" :disabled="!canSubmit" @click="handleSubmit">
            {{ isEditMode ? t('page.feedbackForm.submit.updateButton') : t('page.feedbackForm.submit.submitButton') }}
          </NButton>
        </div>
      </NSpace>
    </NDrawerContent>
  </NDrawer>
</template>
