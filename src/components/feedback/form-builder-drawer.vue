<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FeedbackFormDraft, FeedbackQuestionDraft, FeedbackQuestionType } from '@/types/feedback';

interface Props {
  visible: boolean;
  mode: 'add' | 'edit';
  initialValue: FeedbackFormDraft | null;
}

const props = defineProps<Props>();
const { t } = useI18n();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  save: [value: FeedbackFormDraft];
}>();

const questionTypeOptions = computed<Array<{ label: string; value: FeedbackQuestionType }>>(() => [
  { label: t('page.feedbackForm.builder.questionTypes.text'), value: 'text' },
  { label: t('page.feedbackForm.builder.questionTypes.singleChoice'), value: 'singleChoice' },
  { label: t('page.feedbackForm.builder.questionTypes.multipleChoice'), value: 'multipleChoice' },
  { label: t('page.feedbackForm.builder.questionTypes.star'), value: 'star' }
]);

const statusOptions = computed(() => [
  { label: t('page.feedback.shared.state.enabled'), value: 'enabled' },
  { label: t('page.feedback.shared.state.disabled'), value: 'disabled' }
]);

const draft = ref<FeedbackFormDraft>(createEmptyDraft());
const initialSnapshot = ref('');

const drawerTitle = computed(() =>
  props.mode === 'add' ? t('page.feedbackForm.builder.createTitle') : t('page.feedbackForm.builder.editTitle')
);

watch(
  () => [props.visible, props.initialValue] as const,
  ([visible]) => {
    if (!visible) {
      return;
    }

    const value = props.initialValue ? cloneDraft(props.initialValue) : createEmptyDraft();
    draft.value = value;
    initialSnapshot.value = JSON.stringify(value);
  },
  { immediate: true }
);

function createEmptyDraft(): FeedbackFormDraft {
  return {
    title: '',
    description: '',
    status: 'enabled',
    startAt: Date.now(),
    endAt: null,
    tags: [],
    estimatedMinutes: 2,
    questions: [createQuestion()]
  };
}

function createQuestion(): FeedbackQuestionDraft {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    type: 'text',
    required: true,
    options: []
  };
}

function cloneDraft(value: FeedbackFormDraft) {
  return JSON.parse(JSON.stringify(value)) as FeedbackFormDraft;
}

function closeDrawer() {
  emit('update:visible', false);
}

function resetDraft() {
  draft.value = initialSnapshot.value ? (JSON.parse(initialSnapshot.value) as FeedbackFormDraft) : createEmptyDraft();
}

function addQuestion() {
  draft.value.questions.push(createQuestion());
}

function removeQuestion(index: number) {
  if (draft.value.questions.length === 1) {
    window.$message?.warning(t('page.feedbackForm.builder.atLeastOneQuestion'));
    return;
  }

  draft.value.questions.splice(index, 1);
}

function updateQuestionType(question: FeedbackQuestionDraft, type: FeedbackQuestionType | null) {
  if (!type) {
    return;
  }

  question.type = type;

  if (type === 'singleChoice' || type === 'multipleChoice') {
    if (!question.options.length) {
      question.options = [createOption(), createOption()];
    }
    return;
  }

  question.options = [];
}

function createOption() {
  return {
    id: crypto.randomUUID(),
    label: ''
  };
}

function addOption(question: FeedbackQuestionDraft) {
  question.options.push(createOption());
}

function removeOption(question: FeedbackQuestionDraft, optionIndex: number) {
  question.options.splice(optionIndex, 1);
}

function normalizeTags(input: string[]) {
  return input
    .map(item => item.trim())
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index);
}

function handleSave() {
  draft.value.tags = normalizeTags(draft.value.tags);

  if (!draft.value.title.trim()) {
    window.$message?.warning(t('page.feedbackForm.builder.formTitleRequired'));
    return;
  }

  const hasEmptyQuestionTitle = draft.value.questions.some(question => !question.title.trim());
  if (hasEmptyQuestionTitle) {
    window.$message?.warning(t('page.feedbackForm.builder.questionTitleRequired'));
    return;
  }

  const hasInvalidOptions = draft.value.questions.some(question => {
    if (question.type !== 'singleChoice' && question.type !== 'multipleChoice') {
      return false;
    }

    return question.options.length < 2 || question.options.some(option => !option.label.trim());
  });

  if (hasInvalidOptions) {
    window.$message?.warning(t('page.feedbackForm.builder.choiceOptionsRequired'));
    return;
  }

  emit('save', cloneDraft(draft.value));
  closeDrawer();
}
</script>

<template>
  <NDrawer :show="visible" width="min(920px, 92vw)" @update:show="emit('update:visible', $event)">
    <NDrawerContent :title="drawerTitle" closable>
      <NSpace vertical :size="16">
        <NCard :bordered="false" :title="t('page.feedbackForm.builder.formSettings')">
          <NForm label-placement="top">
            <NGrid cols="1 m:2" responsive="screen" :x-gap="16">
              <NGi>
                <NFormItem :label="t('page.feedbackForm.builder.formTitle')" required>
                  <NInput
                    v-model:value="draft.title"
                    :placeholder="t('page.feedbackForm.builder.placeholders.formTitle')"
                  />
                </NFormItem>
              </NGi>
              <NGi>
                <NFormItem :label="t('page.feedbackForm.builder.status')">
                  <NSelect v-model:value="draft.status" :options="statusOptions" />
                </NFormItem>
              </NGi>
            </NGrid>

            <NFormItem :label="t('page.feedbackForm.builder.description')">
              <NInput
                v-model:value="draft.description"
                type="textarea"
                :placeholder="t('page.feedbackForm.builder.placeholders.description')"
              />
            </NFormItem>

            <NGrid cols="1 m:3" responsive="screen" :x-gap="16">
              <NGi>
                <NFormItem :label="t('page.feedbackForm.builder.startDate')">
                  <NDatePicker v-model:value="draft.startAt" type="date" class="w-full" clearable />
                </NFormItem>
              </NGi>
              <NGi>
                <NFormItem :label="t('page.feedbackForm.builder.endDate')">
                  <NDatePicker v-model:value="draft.endAt" type="date" class="w-full" clearable />
                </NFormItem>
              </NGi>
              <NGi>
                <NFormItem :label="t('page.feedbackForm.builder.estimatedMinutes')">
                  <NInputNumber v-model:value="draft.estimatedMinutes" :min="1" class="w-full" />
                </NFormItem>
              </NGi>
            </NGrid>

            <NFormItem :label="t('page.feedbackForm.builder.tags')">
              <NDynamicTags v-model:value="draft.tags" />
            </NFormItem>
          </NForm>
        </NCard>

        <NCard :bordered="false" :title="t('page.feedbackForm.builder.questions')">
          <template #header-extra>
            <NButton type="primary" secondary @click="addQuestion">
              {{ t('page.feedbackForm.builder.addQuestion') }}
            </NButton>
          </template>

          <NSpace vertical :size="16">
            <NCard
              v-for="(question, index) in draft.questions"
              :key="question.id"
              size="small"
              embedded
              :title="t('page.feedbackForm.builder.questionPrefix', { index: index + 1 })"
            >
              <NSpace vertical :size="12">
                <NGrid cols="1 m:2" responsive="screen" :x-gap="16">
                  <NGi>
                    <NFormItem :label="t('page.feedbackForm.builder.questionTitle')" required>
                      <NInput
                        v-model:value="question.title"
                        :placeholder="t('page.feedbackForm.builder.placeholders.questionTitle')"
                      />
                    </NFormItem>
                  </NGi>
                  <NGi>
                    <NFormItem :label="t('page.feedbackForm.builder.questionType')">
                      <NSelect
                        :value="question.type"
                        :options="questionTypeOptions"
                        @update:value="updateQuestionType(question, $event)"
                      />
                    </NFormItem>
                  </NGi>
                </NGrid>

                <NFormItem :label="t('page.feedbackForm.builder.questionDescription')">
                  <NInput
                    v-model:value="question.description"
                    :placeholder="t('page.feedbackForm.builder.optionalHelperText')"
                  />
                </NFormItem>

                <div class="flex items-center justify-between gap-12">
                  <NCheckbox v-model:checked="question.required">
                    {{ t('page.feedbackForm.builder.required') }}
                  </NCheckbox>
                  <NButton quaternary type="error" @click="removeQuestion(index)">
                    {{ t('page.feedbackForm.builder.deleteQuestion') }}
                  </NButton>
                </div>

                <template v-if="question.type === 'singleChoice' || question.type === 'multipleChoice'">
                  <div class="rounded-12px bg-#f8fafc p-12">
                    <div class="mb-12 flex items-center justify-between">
                      <span class="text-13px font-500 text-#344054">{{ t('page.feedbackForm.builder.options') }}</span>
                      <NButton size="small" secondary @click="addOption(question)">
                        {{ t('page.feedbackForm.builder.addOption') }}
                      </NButton>
                    </div>

                    <NSpace vertical :size="8">
                      <div v-for="(option, optionIndex) in question.options" :key="option.id" class="flex gap-8">
                        <NInput
                          v-model:value="option.label"
                          :placeholder="t('page.feedbackForm.builder.optionLabel')"
                        />
                        <NButton quaternary type="error" @click="removeOption(question, optionIndex)">
                          {{ t('page.feedbackForm.builder.remove') }}
                        </NButton>
                      </div>
                    </NSpace>
                  </div>
                </template>

                <NAlert v-else-if="question.type === 'star'" type="info" :bordered="false">
                  {{ t('page.feedbackForm.builder.starHint') }}
                </NAlert>
              </NSpace>
            </NCard>
          </NSpace>
        </NCard>

        <div class="flex justify-end gap-12">
          <NButton @click="resetDraft">{{ t('common.reset') }}</NButton>
          <NButton @click="closeDrawer">{{ t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSave">{{ t('page.feedbackForm.builder.saveForm') }}</NButton>
        </div>
      </NSpace>
    </NDrawerContent>
  </NDrawer>
</template>
