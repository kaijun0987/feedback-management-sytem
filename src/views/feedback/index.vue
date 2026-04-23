<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FormRules } from 'naive-ui';
import { fetchChangePassword, fetchGetMyFeedbackSubmission } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import FormSubmitDrawer from '@/components/feedback/form-submit-drawer.vue';
import { useRouterPush } from '@/hooks/common/router';
import { useAuthStore } from '@/store/modules/auth';
import { useFeedbackStore } from '@/store/modules/feedback';
import { useThemeStore } from '@/store/modules/theme';
import LangToggleButton from '@/components/common/lang-toggle-button.vue';
import ThemeSchemaSwitch from '@/components/common/theme-schema-switch.vue';
import type {
  FeedbackFormCase,
  FeedbackFormDraft,
  FeedbackFormRecord,
  FeedbackResponseAnswer,
  FeedbackSubmitPayload
} from '@/types/feedback';
import {
  formatFeedbackDateRange,
  getFeedbackCountDownText,
  getFeedbackDisplayState,
  getFeedbackDisplayStateMeta
} from '@/utils/feedback';
import heroBanner from '@/assets/imgs/feedback-hero-banner.png';

interface FilterModel {
  keyword: string;
  caseType: 'all' | FeedbackFormCase;
}

interface ChangePasswordFormModel {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const authStore = useAuthStore();
const themeStore = useThemeStore();
const feedbackStore = useFeedbackStore();
const { toLogin, routerPushByKey } = useRouterPush();
const { t } = useI18n();
const { formRef: changePasswordFormRef, validate: validateChangePassword, restoreValidation } = useNaiveForm();
const { formRules, createConfirmPwdRule } = useFormRules();
/** Per-form preference: whether to submit that form anonymously */
const anonymousByForm = reactive<Record<string, boolean>>({});
const submitDrawerVisible = ref(false);
const activeRecord = ref<FeedbackFormRecord | null>(null);
const activeDraft = ref<FeedbackFormDraft | null>(null);
const openingFormId = ref<string | null>(null);
const activeInitialAnswers = ref<FeedbackResponseAnswer[] | null>(null);

watch(submitDrawerVisible, visible => {
  if (!visible) {
    activeInitialAnswers.value = null;
  }
});
const isSubmitting = ref(false);
const changePasswordVisible = ref(false);
const isChangingPassword = ref(false);
const filter = reactive<FilterModel>({
  keyword: '',
  caseType: 'all'
});
const changePasswordModel = reactive<ChangePasswordFormModel>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const userName = computed(() => authStore.userInfo.userName || 'Guest');
const heroBackgroundStyle = computed(() => ({
  backgroundImage: `url(${heroBanner})`
}));
const newPasswordValue = computed(() => changePasswordModel.newPassword);
const drawerAnonymous = computed({
  get() {
    if (!activeRecord.value) {
      return false;
    }
    return Boolean(anonymousByForm[activeRecord.value.id]);
  },
  set(v: boolean) {
    if (activeRecord.value) {
      anonymousByForm[activeRecord.value.id] = v;
    }
  }
});
const changePasswordRules = computed<FormRules>(() => ({
  currentPassword: formRules.pwd,
  newPassword: formRules.pwd,
  confirmPassword: createConfirmPwdRule(newPasswordValue)
}));

const summaryCards = computed(() => {
  const activeForms = feedbackStore.forms.filter(form => {
    const state = getFeedbackDisplayState(form);
    return form.status === 'enabled' && state !== 'expired' && state !== 'upcoming';
  });

  const specialForms = activeForms.filter(form => form.caseType === 'special').length;
  const totalResponses = activeForms.reduce((sum, form) => sum + form.responseCount, 0);

  return [
    {
      label: t('page.feedback.summary.openForms'),
      value: activeForms.length,
      hint: t('page.feedback.summary.openFormsHint')
    },
    {
      label: t('page.feedback.summary.specialCases'),
      value: specialForms,
      hint: t('page.feedback.summary.specialCasesHint')
    },
    {
      label: t('page.feedback.summary.totalResponses'),
      value: totalResponses,
      hint: t('page.feedback.summary.totalResponsesHint')
    }
  ];
});

const filteredForms = computed(() => {
  const keyword = filter.keyword.trim().toLowerCase();

  return feedbackStore.forms.filter(record => {
    const state = getFeedbackDisplayState(record);
    const isVisible = record.status === 'enabled' && state !== 'expired' && state !== 'upcoming';

    const matchesKeyword =
      !keyword ||
      record.title.toLowerCase().includes(keyword) ||
      record.description.toLowerCase().includes(keyword) ||
      record.tags.some(tag => tag.toLowerCase().includes(keyword));

    const matchesCase = filter.caseType === 'all' || record.caseType === filter.caseType;

    return isVisible && matchesKeyword && matchesCase;
  });
});

const emptyDescription = computed(() => {
  if (feedbackStore.formsError) {
    return t('page.feedback.loadFormsError');
  }

  if (filter.keyword || filter.caseType !== 'all') {
    return t('page.feedback.filteredEmpty');
  }

  return t('page.feedback.empty');
});

function getCaseTypeLabel(caseType: FeedbackFormCase) {
  return t(`page.feedback.shared.caseType.${caseType}`);
}

async function loadForms() {
  await feedbackStore.loadPublicForms();
}

async function handleAuthAction() {
  if (authStore.isLogin) {
    await authStore.logout();
    return;
  }

  await toLogin('pwd-login', null);
}

function resetChangePasswordForm() {
  changePasswordModel.currentPassword = '';
  changePasswordModel.newPassword = '';
  changePasswordModel.confirmPassword = '';
  restoreValidation();
}

function handleChangePassword() {
  resetChangePasswordForm();
  changePasswordVisible.value = true;
}

function closeChangePasswordModal() {
  changePasswordVisible.value = false;
  resetChangePasswordForm();
}

async function handleSubmitChangePassword() {
  await validateChangePassword();

  isChangingPassword.value = true;

  const { error } = await fetchChangePassword({
    currentPassword: changePasswordModel.currentPassword,
    newPassword: changePasswordModel.newPassword
  });

  isChangingPassword.value = false;

  if (error) {
    return;
  }

  closeChangePasswordModal();
  window.$notification?.success({
    title: t('page.feedback.changePasswordSuccessTitle'),
    content: t('page.feedback.changePasswordSuccessContent'),
    duration: 4000
  });
}

async function handleWriteFeedback(record: FeedbackFormRecord) {
  if (!authStore.isLogin) {
    await toLogin('pwd-login', null);
    return;
  }

  openingFormId.value = record.id;

  const draft = await feedbackStore.loadFormDraft(record.id);
  const { data: mySubmission } = await fetchGetMyFeedbackSubmission(record.id);
  openingFormId.value = null;

  if (!draft) {
    window.$message?.error(feedbackStore.formDetailError || t('page.feedback.formDetailNotReady'));
    return;
  }

  activeRecord.value = record;
  activeDraft.value = draft;
  activeInitialAnswers.value = mySubmission?.answers ?? null;
  if (mySubmission) {
    anonymousByForm[record.id] = mySubmission.anonymous;
  }
  submitDrawerVisible.value = true;
}

async function handleSubmitFeedback(payload: FeedbackSubmitPayload) {
  isSubmitting.value = true;

  try {
    const { updated } = await feedbackStore.submitFeedback({
      ...payload,
      submitterName: authStore.userInfo.userName || null
    });

    if (updated) {
      window.$notification?.success({
        title: t('page.feedback.submitUpdatedTitle'),
        content: payload.anonymous ? t('page.feedback.submitUpdatedAnonymous') : t('page.feedback.submitUpdatedNamed'),
        duration: 3500
      });
    } else {
      window.$notification?.success({
        title: t('page.feedback.submitSuccessTitle'),
        content: payload.anonymous ? t('page.feedback.submitSuccessAnonymous') : t('page.feedback.submitSuccessNamed'),
        duration: 3500
      });
    }
  } catch {
    window.$message?.error(feedbackStore.submitError || t('page.feedback.submitFailed'));
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  await loadForms();
});
</script>

<template>
  <div
    class="feedback-user-page min-h-screen w-full min-w-[350px] box-border overflow-x-auto bg-#f5f7fb text-#0f172a dark:bg-#0b0f1a dark:text-#e2e8f0"
  >
    <div class="mx-auto box-border w-full max-w-1280px px-3 py-5 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
      <NSpace vertical :size="16">
        <NCard
          :bordered="false"
          class="feedback-hero overflow-hidden"
          :content-style="{ padding: '0' }"
          :style="heroBackgroundStyle"
        >
          <div class="feedback-hero__veil" />
          <div
            class="feedback-hero__content flex flex-col items-stretch gap-12 p-3 min-[874px]:flex-row min-[874px]:flex-wrap min-[874px]:items-end min-[874px]:justify-between min-[874px]:gap-6 sm:p-4 md:gap-8 md:p-5 lg:gap-10 lg:p-6"
          >
            <div
              class="feedback-hero__panel feedback-hero__panel--copy w-full min-w-0 min-[874px]:max-w-520px min-[874px]:flex-1"
            >
              <NTag round borderless class="feedback-hero__tag">{{ t('page.feedback.heroTag') }}</NTag>
              <h1
                class="mt-10 text-20px min-[400px]:text-22px min-[475px]:mt-14 min-[475px]:text-24px font-700 text-#123a7a dark:text-#c7d2fe"
              >
                {{ t('page.feedback.heroTitle') }}
              </h1>
              <p
                class="mt-8 min-[475px]:mt-10 text-13px min-[400px]:text-14px leading-6 text-#37507f dark:text-#a8b7e8"
              >
                {{ t('page.feedback.heroDescription') }}
              </p>
              <div
                class="mt-12 max-[474px]:flex max-[474px]:w-full max-[474px]:max-w-full max-[474px]:flex-col max-[474px]:gap-8 min-[475px]:mt-18 min-[475px]:flex min-[475px]:flex-wrap min-[475px]:gap-10"
              >
                <NButton
                  class="feedback-hero-btn max-[474px]:!w-full"
                  :class="[filter.caseType === 'all' ? 'feedback-hero-btn--primary' : 'feedback-hero-btn--soft']"
                  @click="filter.caseType = 'all'"
                >
                  {{ t('page.feedback.filterAllForms') }}
                </NButton>
                <NButton
                  class="feedback-hero-btn max-[474px]:!w-full"
                  :class="[filter.caseType === 'normal' ? 'feedback-hero-btn--primary' : 'feedback-hero-btn--soft']"
                  @click="filter.caseType = 'normal'"
                >
                  {{ t('page.feedback.filterNormalCase') }}
                </NButton>
                <NButton
                  class="feedback-hero-btn max-[474px]:!w-full"
                  :class="[filter.caseType === 'special' ? 'feedback-hero-btn--primary' : 'feedback-hero-btn--soft']"
                  @click="filter.caseType = 'special'"
                >
                  {{ t('page.feedback.filterSpecialCase') }}
                </NButton>
              </div>
            </div>

            <div
              class="flex w-full min-w-0 max-w-full flex-col items-stretch gap-10 min-[874px]:max-w-360px min-[874px]:shrink-0"
            >
              <div class="feedback-hero__panel feedback-hero__panel--actions">
                <div class="flex flex-wrap items-center justify-end gap-4px max-[474px]:justify-between">
                  <LangToggleButton tooltip-placement="left" />
                  <ThemeSchemaSwitch
                    :theme-schema="themeStore.themeScheme"
                    :is-dark="themeStore.darkMode"
                    tooltip-placement="left"
                    @switch="themeStore.toggleThemeScheme"
                  />
                </div>
                <div class="mt-10 flex flex-wrap items-center justify-end gap-8 max-[474px]:justify-start">
                  <NTag
                    v-if="authStore.isLogin"
                    round
                    borderless
                    class="feedback-hero__user-tag max-w-full of-hidden text-ellipsis"
                  >
                    {{ userName }}
                  </NTag>
                  <NButton
                    v-if="authStore.hasAdminRole"
                    class="feedback-hero-btn feedback-hero-btn--soft max-[474px]:flex-1"
                    @click="routerPushByKey('home')"
                  >
                    {{ t('page.feedback.adminPortal') }}
                  </NButton>
                </div>

                <div
                  class="mt-10 flex max-[474px]:w-full max-[474px]:flex-col max-[474px]:gap-8 min-[475px]:flex-wrap min-[475px]:justify-end min-[475px]:gap-8"
                >
                  <NButton
                    v-if="authStore.isLogin"
                    class="feedback-hero-btn feedback-hero-btn--soft max-[474px]:!w-full"
                    @click="handleChangePassword"
                  >
                    {{ t('page.feedback.changePassword') }}
                  </NButton>
                  <NButton
                    class="feedback-hero-btn feedback-hero-btn--primary max-[474px]:!w-full"
                    @click="handleAuthAction"
                  >
                    {{ authStore.isLogin ? t('page.feedback.logout') : t('page.feedback.login') }}
                  </NButton>
                </div>
              </div>
            </div>
          </div>
        </NCard>

        <NGrid cols="1 s:3" responsive="screen" :x-gap="16" :y-gap="16">
          <NGi v-for="item in summaryCards" :key="item.label">
            <NCard :bordered="false">
              <div class="text-14px text-#64748b dark:text-#a1a1aa">{{ item.label }}</div>
              <div class="mt-8 text-28px font-700 text-#101828 dark:text-#f1f5f9">{{ item.value }}</div>
              <div class="mt-8 text-12px text-#98a2b3 dark:text-#8b93a1">{{ item.hint }}</div>
            </NCard>
          </NGi>
        </NGrid>

        <NCard :bordered="false" :title="t('page.feedback.browseForms')">
          <NGrid cols="1 l:3" responsive="screen" :x-gap="12" :y-gap="10">
            <NGi span="1 l:2">
              <NInput
                v-model:value="filter.keyword"
                :placeholder="t('page.feedback.searchPlaceholder')"
                class="w-full"
                clearable
              />
            </NGi>
            <NGi>
              <div class="flex w-full min-w-0 max-w-full flex-wrap justify-start gap-6 l:justify-end min-[360px]:gap-8">
                <NButton :type="filter.caseType === 'all' ? 'primary' : 'default'" @click="filter.caseType = 'all'">
                  {{ t('page.feedback.shared.caseType.all') }}
                </NButton>
                <NButton
                  :type="filter.caseType === 'normal' ? 'primary' : 'default'"
                  @click="filter.caseType = 'normal'"
                >
                  {{ t('page.feedback.shared.caseType.normal') }}
                </NButton>
                <NButton
                  :type="filter.caseType === 'special' ? 'primary' : 'default'"
                  @click="filter.caseType = 'special'"
                >
                  {{ t('page.feedback.shared.caseType.special') }}
                </NButton>
              </div>
            </NGi>
          </NGrid>
        </NCard>

        <NAlert v-if="feedbackStore.formsError" type="error" :bordered="false">
          <div class="flex flex-wrap items-center justify-between gap-12">
            <span>{{ feedbackStore.formsError }}</span>
            <NButton size="small" type="error" ghost @click="loadForms">{{ t('page.feedback.retry') }}</NButton>
          </div>
        </NAlert>

        <NSpin :show="feedbackStore.isFormsLoading">
          <NGrid v-if="filteredForms.length" cols="1 s:2 xl:3" responsive="screen" :x-gap="16" :y-gap="16">
            <NGi v-for="record in filteredForms" :key="record.id">
              <NCard :bordered="false" class="h-full w-full min-w-0 max-w-full">
                <NSpace vertical :size="12" class="h-full w-full min-w-0 max-w-full">
                  <div class="flex min-w-0 items-start justify-between gap-8 max-[474px]:flex-col max-[474px]:gap-10">
                    <div class="min-w-0 max-w-full flex-1 of-hidden max-[474px]:w-full">
                      <h2 class="text-18px min-[400px]:text-20px font-600 break-words text-#101828 dark:text-#f1f5f9">
                        {{ record.title }}
                      </h2>
                      <div class="mt-8 flex flex-wrap gap-8">
                        <NTag round :type="getFeedbackDisplayStateMeta(getFeedbackDisplayState(record)).type">
                          {{ getFeedbackDisplayStateMeta(getFeedbackDisplayState(record)).label }}
                        </NTag>
                        <NTag round :type="record.caseType === 'normal' ? 'info' : 'warning'">
                          {{ getCaseTypeLabel(record.caseType) }}
                        </NTag>
                        <NTag v-for="tag in record.tags" :key="tag" size="small" round>{{ tag }}</NTag>
                      </div>
                    </div>
                    <div
                      class="max-[474px]:w-full max-[474px]:text-left shrink-0 self-start rounded-12px bg-#eef4ff px-12 py-8 text-right dark:border dark:border-#334155/80 dark:bg-#1a2744"
                    >
                      <div class="text-12px text-#64748b dark:text-#a1a1aa">
                        {{ t('page.feedback.shared.labels.responses') }}
                      </div>
                      <div class="text-20px font-700 text-#1d4ed8 dark:text-#7cb2ff">
                        {{ record.responseCount }}
                      </div>
                    </div>
                  </div>

                  <p class="text-14px leading-6 text-#64748b dark:text-#b4bcc8">{{ record.description }}</p>

                  <div
                    class="grid grid-cols-2 gap-12 rounded-12px bg-#f8fafc p-14 lt-sm:grid-cols-1 dark:border dark:border-#334155/60 dark:bg-#0f172a/50"
                  >
                    <div>
                      <div class="text-12px text-#98a2b3 dark:text-#8b93a1">
                        {{ t('page.feedback.shared.labels.dateRange') }}
                      </div>
                      <div class="mt-4 text-13px font-500 text-#344054 dark:text-#e2e8f0">
                        {{ formatFeedbackDateRange(record) }}
                      </div>
                    </div>
                    <div>
                      <div class="text-12px text-#98a2b3 dark:text-#8b93a1">
                        {{ t('page.feedback.shared.labels.availability') }}
                      </div>
                      <div class="mt-4 text-13px font-500 text-#344054 dark:text-#e2e8f0">
                        {{ getFeedbackCountDownText(record) }}
                      </div>
                    </div>
                    <div class="lt-sm:col-span-1 col-span-2">
                      <div class="text-12px text-#98a2b3 dark:text-#8b93a1">
                        {{ t('page.feedback.shared.labels.estimatedTime') }}
                      </div>
                      <div class="mt-4 text-13px font-500 text-#344054 dark:text-#e2e8f0">
                        {{ record.estimatedMinutes }} {{ t('page.feedback.shared.units.min') }} ·
                        {{ t('page.feedback.shared.units.questions', { count: record.questionCount }) }}
                      </div>
                    </div>
                  </div>

                  <div class="mt-auto flex justify-end pt-8">
                    <NButton
                      type="primary"
                      :loading="openingFormId === record.id"
                      :disabled="isSubmitting"
                      @click="handleWriteFeedback(record)"
                    >
                      {{ authStore.isLogin ? t('page.feedback.writeFeedback') : t('page.feedback.loginToSubmit') }}
                    </NButton>
                  </div>
                </NSpace>
              </NCard>
            </NGi>
          </NGrid>

          <NCard v-else :bordered="false">
            <NEmpty :description="emptyDescription">
              <template #extra>
                <NButton
                  v-if="filter.keyword || filter.caseType !== 'all'"
                  @click="
                    filter.keyword = '';
                    filter.caseType = 'all';
                  "
                >
                  {{ t('page.feedback.clearFilters') }}
                </NButton>
                <NButton v-else-if="feedbackStore.formsError" type="primary" @click="loadForms">
                  {{ t('page.feedback.retry') }}
                </NButton>
              </template>
            </NEmpty>
          </NCard>
        </NSpin>

        <FormSubmitDrawer
          v-model:visible="submitDrawerVisible"
          v-model:anonymous-mode="drawerAnonymous"
          :record="activeRecord"
          :form="activeDraft"
          :submitter-name="authStore.userInfo.userName || null"
          :initial-answers="activeInitialAnswers"
          @submit="handleSubmitFeedback"
        />

        <NModal
          v-model:show="changePasswordVisible"
          preset="card"
          class="w-[min(100vw-1.5rem,520px)] !max-w-[min(calc(100vw-1.5rem),520px)]"
          :title="t('page.feedback.changePasswordModal.title')"
          @after-leave="resetChangePasswordForm"
        >
          <NForm
            ref="changePasswordFormRef"
            :model="changePasswordModel"
            :rules="changePasswordRules"
            label-placement="top"
          >
            <NFormItem :label="t('page.feedback.changePasswordModal.currentPassword')" path="currentPassword">
              <NInput
                v-model:value="changePasswordModel.currentPassword"
                type="password"
                show-password-on="click"
                :placeholder="t('page.feedback.changePasswordModal.currentPasswordPlaceholder')"
              />
            </NFormItem>
            <NFormItem :label="t('page.feedback.changePasswordModal.newPassword')" path="newPassword">
              <NInput
                v-model:value="changePasswordModel.newPassword"
                type="password"
                show-password-on="click"
                :placeholder="t('page.feedback.changePasswordModal.newPasswordPlaceholder')"
              />
            </NFormItem>
            <NFormItem :label="t('page.feedback.changePasswordModal.confirmPassword')" path="confirmPassword">
              <NInput
                v-model:value="changePasswordModel.confirmPassword"
                type="password"
                show-password-on="click"
                :placeholder="t('page.feedback.changePasswordModal.confirmPasswordPlaceholder')"
              />
            </NFormItem>
          </NForm>

          <template #footer>
            <div class="flex justify-end gap-12">
              <NButton @click="closeChangePasswordModal">{{ t('common.cancel') }}</NButton>
              <NButton type="primary" :loading="isChangingPassword" @click="handleSubmitChangePassword">
                {{ t('page.feedback.changePasswordModal.submit') }}
              </NButton>
            </div>
          </template>
        </NModal>
      </NSpace>
    </div>
  </div>
</template>

<style scoped>
.feedback-hero {
  position: relative;
  min-height: 360px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border: 1px solid rgba(191, 219, 254, 0.65);
  box-shadow: 0 20px 50px rgba(37, 99, 235, 0.14);
}

.feedback-hero__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 38%, rgba(15, 23, 42, 0.1) 100%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
}

.feedback-hero__content {
  position: relative;
  z-index: 1;
  min-height: 360px;
}

.feedback-hero__panel {
  border: 1px solid rgba(191, 219, 254, 0.7);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
}

.feedback-hero__panel--copy {
  border-radius: 24px;
  padding: 22px 24px;
}

.feedback-hero__panel--actions {
  border-radius: 20px;
  padding: 16px 18px;
}

.feedback-hero__tag {
  background: rgba(224, 242, 254, 0.92);
  color: #1d4ed8;
  border: 1px solid rgba(147, 197, 253, 0.9);
}

.feedback-hero__user-tag {
  background: rgba(239, 246, 255, 0.94);
  color: #1e3a8a;
  border: 1px solid rgba(147, 197, 253, 0.8);
}

.feedback-hero :deep(.feedback-hero-btn) {
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.feedback-hero :deep(.feedback-hero-btn .n-button__border),
.feedback-hero :deep(.feedback-hero-btn .n-button__state-border) {
  border: none !important;
}

.feedback-hero :deep(.feedback-hero-btn--soft) {
  color: #1d4ed8 !important;
  background: rgba(248, 250, 252, 0.9) !important;
  border: 1px solid rgba(191, 219, 254, 0.9) !important;
}

.feedback-hero :deep(.feedback-hero-btn--soft:hover) {
  background: rgba(239, 246, 255, 0.98) !important;
  border-color: rgba(96, 165, 250, 0.95) !important;
}

.feedback-hero :deep(.feedback-hero-btn--primary) {
  color: #123a7a !important;
  background: rgba(255, 255, 255, 0.98) !important;
  border: 1px solid rgba(147, 197, 253, 0.95) !important;
  box-shadow: 0 12px 28px rgba(59, 130, 246, 0.18);
}

.feedback-hero :deep(.feedback-hero-btn--primary:hover) {
  background: rgba(239, 246, 255, 1) !important;
  border-color: rgba(59, 130, 246, 1) !important;
}

:global(.dark) .feedback-hero {
  border-color: rgba(51, 65, 85, 0.55);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
}

:global(.dark) .feedback-hero__veil {
  background:
    linear-gradient(90deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.72) 50%, rgba(2, 6, 23, 0.88) 100%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(2, 6, 23, 0.55) 100%);
}

:global(.dark) .feedback-hero__panel {
  background: rgba(15, 23, 42, 0.88) !important;
  border-color: rgba(100, 116, 139, 0.45) !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.38) !important;
}

:global(.dark) .feedback-hero__tag {
  background: rgba(30, 58, 138, 0.5) !important;
  color: #c4d0ff !important;
  border-color: rgba(99, 102, 241, 0.45) !important;
}

:global(.dark) .feedback-hero__user-tag {
  background: rgba(30, 41, 59, 0.88) !important;
  color: #e2e8f0 !important;
  border-color: rgba(148, 163, 184, 0.4) !important;
}

:global(.dark) .feedback-hero :deep(.feedback-hero-btn--soft) {
  color: #93c5fd !important;
  background: rgba(15, 23, 42, 0.65) !important;
  border: 1px solid rgba(59, 130, 246, 0.4) !important;
}

:global(.dark) .feedback-hero :deep(.feedback-hero-btn--soft:hover) {
  background: rgba(30, 41, 59, 0.9) !important;
  border-color: rgba(96, 165, 250, 0.5) !important;
}

:global(.dark) .feedback-hero :deep(.feedback-hero-btn--primary) {
  color: #e0e7ff !important;
  background: rgba(30, 58, 138, 0.55) !important;
  border: 1px solid rgba(99, 102, 241, 0.5) !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35) !important;
}

:global(.dark) .feedback-hero :deep(.feedback-hero-btn--primary:hover) {
  background: rgba(49, 46, 129, 0.7) !important;
  border-color: rgba(129, 140, 248, 0.6) !important;
}

@media (max-width: 474px) {
  .feedback-hero {
    min-height: 200px;
  }

  .feedback-hero__content {
    min-height: 0;
  }

  .feedback-hero__panel--copy {
    padding: 16px 14px;
  }

  .feedback-hero__panel--actions {
    padding: 12px 14px;
  }
}
</style>
