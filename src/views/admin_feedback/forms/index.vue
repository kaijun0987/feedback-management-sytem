<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NEllipsis, NSpace, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import FormBuilderDrawer from '@/components/feedback/form-builder-drawer.vue';
import FormResponseDrawer from '@/components/feedback/form-response-drawer.vue';
import { useFeedbackStore } from '@/store/modules/feedback';
import type {
  FeedbackFormCase,
  FeedbackFormDraft,
  FeedbackFormRecord,
  FeedbackFormStatus,
  FeedbackResponseRecord
} from '@/types/feedback';
import { formatFeedbackDateRange, getFeedbackDisplayState, getFeedbackDisplayStateMeta } from '@/utils/feedback';

interface FilterModel {
  keyword: string;
  caseType: FeedbackFormCase | null;
  status: FeedbackFormStatus | null;
  dateRange: [number, number] | null;
}

const feedbackStore = useFeedbackStore();
const { t } = useI18n();

const builderVisible = ref(false);
const builderMode = ref<'add' | 'edit'>('add');
const editingDraft = ref<FeedbackFormDraft | null>(null);
const responseDrawerVisible = ref(false);
const activeResponseRecord = ref<FeedbackFormRecord | null>(null);
const activeResponseDraft = ref<FeedbackFormDraft | null>(null);
const activeResponses = ref<FeedbackResponseRecord[]>([]);
const editingFormId = ref<string | null>(null);
const togglingFormId = ref<string | null>(null);
const viewingResponsesFormId = ref<string | null>(null);

const filter = reactive<FilterModel>({
  keyword: '',
  caseType: null,
  status: null,
  dateRange: null
});

const caseOptions = computed(() => [
  { label: t('page.feedback.shared.caseType.normal'), value: 'normal' },
  { label: t('page.feedback.shared.caseType.special'), value: 'special' }
]);

const statusOptions = computed(() => [
  { label: t('page.feedback.shared.state.enabled'), value: 'enabled' },
  { label: t('page.feedback.shared.state.disabled'), value: 'disabled' }
]);

function resetFilters() {
  filter.keyword = '';
  filter.caseType = null;
  filter.status = null;
  filter.dateRange = null;
}

function isInSelectedRange(record: FeedbackFormRecord) {
  if (!filter.dateRange) {
    return true;
  }

  const [start, end] = filter.dateRange;
  const recordStart = dayjs(record.startAt).valueOf();
  const recordEnd = dayjs(record.endAt || record.startAt).valueOf();

  return recordEnd >= start && recordStart <= end;
}

const filteredForms = computed(() => {
  const keyword = filter.keyword.trim().toLowerCase();

  return feedbackStore.forms.filter(record => {
    const matchesKeyword =
      !keyword ||
      record.title.toLowerCase().includes(keyword) ||
      record.description.toLowerCase().includes(keyword) ||
      record.tags.some(tag => tag.toLowerCase().includes(keyword));

    const matchesCase = !filter.caseType || record.caseType === filter.caseType;
    const matchesStatus = !filter.status || record.status === filter.status;

    return matchesKeyword && matchesCase && matchesStatus && isInSelectedRange(record);
  });
});

const summaryCards = computed(() => {
  const endingSoonCount = feedbackStore.forms.filter(form => getFeedbackDisplayState(form) === 'endingSoon').length;
  const enabledCount = feedbackStore.forms.filter(form => form.status === 'enabled').length;
  const totalResponses = feedbackStore.forms.reduce((sum, form) => sum + form.responseCount, 0);

  return [
    {
      label: t('page.feedbackManage.summary.totalForms'),
      value: feedbackStore.forms.length,
      hint: t('page.feedbackManage.summary.totalFormsHint')
    },
    {
      label: t('page.feedbackManage.summary.enabledForms'),
      value: enabledCount,
      hint: t('page.feedbackManage.summary.enabledFormsHint')
    },
    {
      label: t('page.feedbackManage.summary.endingSoon'),
      value: endingSoonCount,
      hint: t('page.feedbackManage.summary.endingSoonHint')
    },
    {
      label: t('page.feedbackManage.summary.totalResponses'),
      value: totalResponses,
      hint: t('page.feedbackManage.summary.totalResponsesHint')
    }
  ];
});

const emptyDescription = computed(() => {
  if (feedbackStore.formsError) {
    return t('page.feedbackManage.loadError');
  }

  if (filter.keyword || filter.caseType || filter.status || filter.dateRange) {
    return t('page.feedbackManage.filteredEmpty');
  }

  return t('page.feedbackManage.empty');
});

async function loadAdminForms() {
  await feedbackStore.loadAdminForms();
}

function getCaseTypeLabel(caseType: FeedbackFormCase) {
  return t(`page.feedback.shared.caseType.${caseType}`);
}

function showComingSoon(message: string) {
  window.$message?.info(message);
}

function handleCreate() {
  builderMode.value = 'add';
  editingDraft.value = null;
  builderVisible.value = true;
}

async function handleEdit(record: FeedbackFormRecord) {
  editingFormId.value = record.id;

  try {
    builderMode.value = 'edit';
    editingDraft.value = await feedbackStore.loadFormDraft(record.id, false, 'admin');

    if (!editingDraft.value) {
      window.$message?.error(feedbackStore.formDetailError || t('page.feedbackManage.loadFormDetailFailed'));
      return;
    }

    builderVisible.value = true;
  } finally {
    editingFormId.value = null;
  }
}

async function handleToggle(record: FeedbackFormRecord) {
  togglingFormId.value = record.id;

  try {
    const success = await feedbackStore.toggleFormStatus(record.id);

    if (!success) {
      window.$message?.error(t('page.feedbackManage.updateStatusFailed'));
      return;
    }

    window.$message?.success(
      t('page.feedbackManage.toggleSuccess', {
        title: record.title,
        status:
          record.status === 'enabled'
            ? t('page.feedback.shared.state.disabled')
            : t('page.feedback.shared.state.enabled')
      })
    );
  } finally {
    togglingFormId.value = null;
  }
}

async function handleViewResponses(record: FeedbackFormRecord) {
  viewingResponsesFormId.value = record.id;

  try {
    activeResponseRecord.value = record;
    activeResponseDraft.value = await feedbackStore.loadFormDraft(record.id, false, 'admin');

    if (!activeResponseDraft.value) {
      window.$message?.error(feedbackStore.formDetailError || t('page.feedbackManage.loadFormDetailFailed'));
      return;
    }

    activeResponses.value = await feedbackStore.loadResponses(record.id);

    if (feedbackStore.responsesError) {
      window.$message?.error(feedbackStore.responsesError);
      return;
    }

    responseDrawerVisible.value = true;
  } finally {
    viewingResponsesFormId.value = null;
  }
}

function handleExport(record: FeedbackFormRecord) {
  showComingSoon(t('page.feedbackManage.exportComingSoon', { title: record.title }));
}

async function handleSaveDraft(draft: FeedbackFormDraft) {
  try {
    const saved = await feedbackStore.saveFormDraft(draft);
    window.$message?.success(
      draft.id
        ? t('page.feedbackManage.saveUpdated', { title: saved.title })
        : t('page.feedbackManage.saveCreated', { title: saved.title })
    );
  } catch {
    window.$message?.error(feedbackStore.saveError || t('page.feedbackManage.saveFailed'));
  }
}

onMounted(async () => {
  await loadAdminForms();
});

const columns = computed<DataTableColumns<FeedbackFormRecord>>(() => [
  {
    title: t('page.feedbackManage.columns.no'),
    key: 'index',
    width: 72,
    render: (_row, index) => index + 1
  },
  {
    title: t('page.feedbackManage.columns.form'),
    key: 'title',
    minWidth: 320,
    render: row =>
      h('div', { class: 'py-8px' }, [
        h('div', { class: 'flex items-center gap-8px' }, [
          h('span', { class: 'text-15px font-600 text-#101828' }, row.title),
          ...row.tags.map(tag =>
            h(
              NTag,
              {
                size: 'small',
                round: true
              },
              { default: () => tag }
            )
          )
        ]),
        h(
          NEllipsis,
          {
            style: 'max-width: 100%; margin-top: 8px; color: #667085;'
          },
          { default: () => row.description }
        ),
        h(
          'div',
          { class: 'mt-8px text-12px text-#98a2b3' },
          `${t('page.feedback.shared.units.questions', { count: row.questionCount })} · ${row.estimatedMinutes} ${t('page.feedback.shared.units.min')}`
        )
      ])
  },
  {
    title: t('page.feedbackManage.columns.case'),
    key: 'caseType',
    width: 110,
    render: row =>
      h(
        NTag,
        {
          round: true,
          type: row.caseType === 'normal' ? 'info' : 'warning'
        },
        { default: () => getCaseTypeLabel(row.caseType) }
      )
  },
  {
    title: t('page.feedbackManage.columns.status'),
    key: 'displayState',
    width: 130,
    render: row => {
      const state = getFeedbackDisplayState(row);
      const meta = getFeedbackDisplayStateMeta(state);

      return h(
        NTag,
        {
          round: true,
          type: meta.type
        },
        { default: () => meta.label }
      );
    }
  },
  {
    title: t('page.feedbackManage.columns.dateRange'),
    key: 'dateRange',
    minWidth: 200,
    render: row => formatFeedbackDateRange(row)
  },
  {
    title: t('page.feedbackManage.columns.responses'),
    key: 'responseCount',
    width: 120,
    render: row => t('page.feedback.shared.units.responsesSubmitted', { count: row.responseCount })
  },
  {
    title: t('page.feedbackManage.columns.action'),
    key: 'actions',
    width: 320,
    fixed: 'right',
    render: row =>
      h(
        NSpace,
        { size: 8, wrapItem: false },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                tertiary: true,
                type: 'primary',
                loading: editingFormId.value === row.id,
                onClick: () => handleEdit(row)
              },
              { default: () => t('page.feedbackManage.actions.edit') }
            ),
            h(
              NButton,
              {
                size: 'small',
                tertiary: true,
                type: 'info',
                loading: viewingResponsesFormId.value === row.id,
                onClick: () => handleViewResponses(row)
              },
              { default: () => t('page.feedbackManage.actions.responses') }
            ),
            h(
              NButton,
              {
                size: 'small',
                tertiary: true,
                loading: togglingFormId.value === row.id,
                onClick: () => handleToggle(row)
              },
              {
                default: () =>
                  row.status === 'enabled'
                    ? t('page.feedbackManage.actions.disable')
                    : t('page.feedbackManage.actions.enable')
              }
            ),
            h(
              NButton,
              {
                size: 'small',
                tertiary: true,
                onClick: () => handleExport(row)
              },
              { default: () => t('page.feedbackManage.actions.export') }
            )
          ]
        }
      )
  }
]);
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :bordered="false">
      <div class="flex flex-wrap items-center justify-between gap-12">
        <div>
          <h1 class="text-24px font-600 text-#101828">{{ t('page.feedbackManage.title') }}</h1>
          <p class="mt-8 text-14px text-#667085">
            {{ t('page.feedbackManage.description') }}
          </p>
        </div>

        <NSpace>
          <NButton secondary @click="showComingSoon(t('page.feedbackManage.viewDashboardComingSoon'))">
            {{ t('page.feedbackManage.viewDashboard') }}
          </NButton>
          <NButton type="primary" @click="handleCreate">{{ t('page.feedbackManage.createForm') }}</NButton>
        </NSpace>
      </div>
    </NCard>

    <NGrid cols="1 s:2 xl:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in summaryCards" :key="item.label">
        <NCard :bordered="false" class="h-full">
          <div class="text-14px text-#667085">{{ item.label }}</div>
          <div class="mt-8 text-28px font-600 text-#101828">{{ item.value }}</div>
          <div class="mt-8 text-12px text-#98a2b3">{{ item.hint }}</div>
        </NCard>
      </NGi>
    </NGrid>

    <NCard :bordered="false" :title="t('page.feedbackManage.filters')">
      <NGrid cols="1 s:2 l:4" responsive="screen" :x-gap="16" :y-gap="12">
        <NGi>
          <NInput v-model:value="filter.keyword" :placeholder="t('page.feedbackManage.searchPlaceholder')" clearable />
        </NGi>
        <NGi>
          <NSelect
            v-model:value="filter.caseType"
            :options="caseOptions"
            :placeholder="t('page.feedbackManage.selectCase')"
            clearable
          />
        </NGi>
        <NGi>
          <NSelect
            v-model:value="filter.status"
            :options="statusOptions"
            :placeholder="t('page.feedbackManage.selectStatus')"
            clearable
          />
        </NGi>
        <NGi>
          <NDatePicker
            v-model:value="filter.dateRange"
            type="daterange"
            clearable
            class="w-full"
            :placeholder="t('page.feedbackManage.selectDateRange')"
          />
        </NGi>
      </NGrid>

      <div class="mt-16 flex justify-end">
        <NSpace>
          <NButton @click="resetFilters">{{ t('common.reset') }}</NButton>
          <NButton type="primary">{{ t('page.feedbackManage.applyFilters') }}</NButton>
        </NSpace>
      </div>
    </NCard>

    <NAlert v-if="feedbackStore.formsError" type="error" :bordered="false">
      <div class="flex flex-wrap items-center justify-between gap-12">
        <span>{{ feedbackStore.formsError }}</span>
        <NButton size="small" type="error" ghost @click="loadAdminForms">{{ t('page.feedbackManage.retry') }}</NButton>
      </div>
    </NAlert>

    <NCard :bordered="false" :title="t('page.feedbackManage.feedbackList')">
      <template #header-extra>
        <span class="text-13px text-#667085">
          {{ t('page.feedback.shared.units.itemsMatched', { count: filteredForms.length }) }}
        </span>
      </template>

      <NDataTable
        v-if="filteredForms.length || feedbackStore.isFormsLoading"
        :columns="columns"
        :data="filteredForms"
        :loading="feedbackStore.isFormsLoading"
        :bordered="false"
        :single-line="false"
        :pagination="{ pageSize: 5 }"
        :row-key="row => row.id"
      />
      <NEmpty v-else :description="emptyDescription">
        <template #extra>
          <NButton v-if="filter.keyword || filter.caseType || filter.status || filter.dateRange" @click="resetFilters">
            {{ t('page.feedbackManage.clearFilters') }}
          </NButton>
          <NButton v-else-if="feedbackStore.formsError" type="primary" @click="loadAdminForms">
            {{ t('page.feedbackManage.retry') }}
          </NButton>
        </template>
      </NEmpty>
    </NCard>

    <FormBuilderDrawer
      v-model:visible="builderVisible"
      :mode="builderMode"
      :initial-value="editingDraft"
      @save="handleSaveDraft"
    />

    <FormResponseDrawer
      v-model:visible="responseDrawerVisible"
      :form="activeResponseDraft"
      :responses="activeResponses"
      :total-response-count="activeResponseRecord?.responseCount || 0"
    />
  </NSpace>
</template>
