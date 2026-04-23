<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui';
import { NButton, NSpace, NTag } from 'naive-ui';
import { fetchCreateUser, fetchGetUsers, fetchUpdateUser } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';

type UserRole = Api.User.UserRole;
type UserRecord = Api.User.UserRecord;

interface FilterModel {
  keyword: string;
  role: UserRole | null;
}

interface UserFormModel {
  userName: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  password: string;
}

const authStore = useAuthStore();
const { t } = useI18n();

const formRef = ref<FormInst | null>(null);
const modalVisible = ref(false);
const modalMode = ref<'add' | 'edit'>('add');
const editingUserId = ref<string | null>(null);
const users = ref<UserRecord[]>([]);
const isUsersLoading = ref(false);
const isSaving = ref(false);
const loadError = ref<string | null>(null);

const filter = reactive<FilterModel>({
  keyword: '',
  role: null
});

const formModel = reactive<UserFormModel>({
  userName: '',
  displayName: '',
  role: 'R_USER_COMMON',
  isActive: true,
  password: ''
});

const isSuper = computed(() => authStore.userInfo.roles.includes('R_SUPER'));
const canCreateAdmin = computed(() => isSuper.value);

const roleOptions = computed(() => [
  { label: t('page.userManage.roles.super'), value: 'R_SUPER' },
  { label: t('page.userManage.roles.admin'), value: 'R_ADMIN' },
  { label: t('page.userManage.roles.user'), value: 'R_USER_COMMON' }
]);

const formRoleOptions = computed(() => {
  if (isSuper.value) {
    return roleOptions.value;
  }

  return roleOptions.value.filter(option => option.value === 'R_USER_COMMON');
});

const summaryCards = computed(() => {
  const adminCount = users.value.filter(item => item.role === 'R_ADMIN').length;
  const userCount = users.value.filter(item => item.role === 'R_USER_COMMON').length;
  const activeCount = users.value.filter(item => item.isActive).length;

  return [
    {
      label: t('page.userManage.summary.totalAccounts'),
      value: users.value.length,
      hint: t('page.userManage.summary.totalAccountsHint')
    },
    {
      label: t('page.userManage.summary.adminAccounts'),
      value: adminCount,
      hint: t('page.userManage.summary.adminAccountsHint')
    },
    {
      label: t('page.userManage.summary.commonUsers'),
      value: userCount,
      hint: t('page.userManage.summary.commonUsersHint')
    },
    {
      label: t('page.userManage.summary.activeAccounts'),
      value: activeCount,
      hint: t('page.userManage.summary.activeAccountsHint')
    }
  ];
});

const filteredUsers = computed(() => {
  const keyword = filter.keyword.trim().toLowerCase();

  return users.value.filter(item => {
    const matchesKeyword =
      !keyword || item.userName.toLowerCase().includes(keyword) || item.displayName.toLowerCase().includes(keyword);

    const matchesRole = !filter.role || item.role === filter.role;

    return matchesKeyword && matchesRole;
  });
});

const rules = computed<FormRules>(() => ({
  userName: [
    {
      required: true,
      message: t('page.userManage.validation.userNameRequired'),
      trigger: ['input', 'blur']
    }
  ],
  displayName: [
    {
      required: true,
      message: t('page.userManage.validation.displayNameRequired'),
      trigger: ['input', 'blur']
    }
  ],
  role: [
    {
      required: true,
      message: t('page.userManage.validation.roleRequired'),
      trigger: ['change', 'blur']
    }
  ],
  password: [
    {
      validator: (_rule, value: string) => {
        const password = value?.trim() || '';

        if (modalMode.value === 'add' && !password) {
          return new Error(t('page.userManage.validation.passwordRequired'));
        }

        if (password && password.length < 6) {
          return new Error(t('page.userManage.validation.passwordInvalid'));
        }

        return true;
      },
      trigger: ['input', 'blur']
    }
  ]
}));

function getRoleLabel(role: UserRole) {
  return {
    R_SUPER: t('page.userManage.roles.super'),
    R_ADMIN: t('page.userManage.roles.admin'),
    R_USER_COMMON: t('page.userManage.roles.user')
  }[role];
}

function getRoleTagType(role: UserRole): 'error' | 'warning' | 'info' {
  switch (role) {
    case 'R_SUPER':
      return 'error';
    case 'R_ADMIN':
      return 'warning';
    default:
      return 'info';
  }
}

function canEditUser(record: UserRecord) {
  if (isSuper.value) {
    return true;
  }

  return record.role === 'R_USER_COMMON';
}

function resetForm() {
  formModel.userName = '';
  formModel.displayName = '';
  formModel.role = 'R_USER_COMMON';
  formModel.isActive = true;
  formModel.password = '';
  editingUserId.value = null;
}

async function loadUsers() {
  isUsersLoading.value = true;
  loadError.value = null;

  const { data, error } = await fetchGetUsers();

  if (error) {
    loadError.value = t('page.userManage.loadFailed');
  } else {
    users.value = data || [];
  }

  isUsersLoading.value = false;
}

function openCreateModal() {
  resetForm();
  modalMode.value = 'add';
  modalVisible.value = true;
}

function openEditModal(record: UserRecord) {
  if (!canEditUser(record)) {
    window.$message?.warning(t('page.userManage.onlySuperEditAdmin'));
    return;
  }

  modalMode.value = 'edit';
  editingUserId.value = record.id;
  formModel.userName = record.userName;
  formModel.displayName = record.displayName;
  formModel.role = record.role;
  formModel.isActive = record.isActive;
  formModel.password = '';
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
  resetForm();
}

async function handleSave() {
  await formRef.value?.validate();

  if (!isSuper.value && formModel.role !== 'R_USER_COMMON') {
    window.$message?.error(t('page.userManage.adminOnlyCommonUsers'));
    return;
  }

  isSaving.value = true;

  const basePayload = {
    userName: formModel.userName.trim(),
    displayName: formModel.displayName.trim(),
    role: formModel.role,
    isActive: formModel.isActive
  };

  if (modalMode.value === 'add') {
    const { error } = await fetchCreateUser({
      ...basePayload,
      password: formModel.password.trim()
    });

    isSaving.value = false;

    if (error) {
      window.$message?.error(t('page.userManage.saveFailed'));
      return;
    }

    window.$message?.success(
      t('page.userManage.createSuccess', { role: getRoleLabel(formModel.role), userName: formModel.userName })
    );
    await loadUsers();
    closeModal();
    return;
  }

  if (!editingUserId.value) {
    isSaving.value = false;
    window.$message?.error(t('page.userManage.targetMissing'));
    return;
  }

  const { error } = await fetchUpdateUser(editingUserId.value, {
    ...basePayload,
    ...(formModel.password.trim() ? { password: formModel.password.trim() } : {})
  });

  isSaving.value = false;

  if (error) {
    window.$message?.error(t('page.userManage.saveFailed'));
    return;
  }

  window.$message?.success(t('page.userManage.updateSuccess', { userName: formModel.userName.trim() }));
  await loadUsers();
  closeModal();
}

onMounted(async () => {
  await loadUsers();
});

const columns = computed<DataTableColumns<UserRecord>>(() => [
  {
    title: t('page.userManage.columns.user'),
    key: 'userName',
    minWidth: 220,
    render: row =>
      h('div', { class: 'py-8px' }, [
        h('div', { class: 'text-15px font-600 text-#101828' }, row.userName),
        h('div', { class: 'mt-6px text-13px text-#667085' }, row.displayName)
      ])
  },
  {
    title: t('page.userManage.columns.role'),
    key: 'role',
    width: 120,
    render: row =>
      h(
        NTag,
        {
          round: true,
          type: getRoleTagType(row.role)
        },
        { default: () => getRoleLabel(row.role) }
      )
  },
  {
    title: t('page.userManage.columns.status'),
    key: 'isActive',
    width: 120,
    render: row =>
      h(
        NTag,
        {
          round: true,
          type: row.isActive ? 'success' : 'default'
        },
        {
          default: () =>
            row.isActive ? t('page.feedback.shared.state.active') : t('page.feedback.shared.state.disabled')
        }
      )
  },
  {
    title: t('page.userManage.columns.created'),
    key: 'createdAt',
    minWidth: 180,
    render: row => row.createdAt
  },
  {
    title: t('page.userManage.columns.action'),
    key: 'action',
    width: 140,
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
                disabled: !canEditUser(row),
                onClick: () => openEditModal(row)
              },
              { default: () => t('common.edit') }
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
          <h1 class="text-24px font-600 text-#101828">{{ t('page.userManage.title') }}</h1>
          <p class="mt-8 text-14px text-#667085">
            {{ t('page.userManage.description') }}
          </p>
        </div>

        <NButton type="primary" @click="openCreateModal">
          {{ canCreateAdmin ? t('page.userManage.addAccount') : t('page.userManage.addUser') }}
        </NButton>
      </div>
    </NCard>

    <NAlert type="info" :bordered="false">
      {{ t('page.userManage.permissionNotice') }}
    </NAlert>

    <NAlert v-if="loadError" type="error" :bordered="false">
      <div class="flex flex-wrap items-center justify-between gap-12">
        <span>{{ loadError }}</span>
        <NButton size="small" type="error" ghost @click="loadUsers">{{ t('page.feedbackManage.retry') }}</NButton>
      </div>
    </NAlert>

    <NGrid cols="1 s:2 xl:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in summaryCards" :key="item.label">
        <NCard :bordered="false" class="h-full">
          <div class="text-14px text-#667085">{{ item.label }}</div>
          <div class="mt-8 text-28px font-600 text-#101828">{{ item.value }}</div>
          <div class="mt-8 text-12px text-#98a2b3">{{ item.hint }}</div>
        </NCard>
      </NGi>
    </NGrid>

    <NCard :bordered="false" :title="t('page.userManage.userList')">
      <NGrid cols="1 s:2" responsive="screen" :x-gap="16" :y-gap="12">
        <NGi>
          <NInput v-model:value="filter.keyword" :placeholder="t('page.userManage.searchPlaceholder')" clearable />
        </NGi>
        <NGi>
          <NSelect
            v-model:value="filter.role"
            :options="roleOptions"
            :placeholder="t('page.userManage.filterByRole')"
            clearable
          />
        </NGi>
      </NGrid>

      <div class="mt-16">
        <NDataTable
          :columns="columns"
          :data="filteredUsers"
          :loading="isUsersLoading"
          :bordered="false"
          :single-line="false"
          :pagination="{ pageSize: 6 }"
          :row-key="row => row.id"
        />
      </div>
    </NCard>

    <NModal
      v-model:show="modalVisible"
      preset="card"
      :title="modalMode === 'add' ? t('page.userManage.modalAddTitle') : t('page.userManage.modalEditTitle')"
      class="w-520px"
    >
      <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="top">
        <NFormItem :label="t('page.userManage.fields.userName')" path="userName">
          <NInput v-model:value="formModel.userName" :placeholder="t('page.userManage.placeholders.userName')" />
        </NFormItem>
        <NFormItem :label="t('page.userManage.fields.displayName')" path="displayName">
          <NInput v-model:value="formModel.displayName" :placeholder="t('page.userManage.placeholders.displayName')" />
        </NFormItem>
        <NFormItem :label="t('page.userManage.fields.role')" path="role">
          <NSelect
            v-model:value="formModel.role"
            :options="formRoleOptions"
            :placeholder="t('page.userManage.placeholders.role')"
          />
        </NFormItem>
        <NFormItem :label="t('page.userManage.fields.password')" path="password">
          <NInput
            v-model:value="formModel.password"
            type="password"
            show-password-on="click"
            :placeholder="
              modalMode === 'add'
                ? t('page.userManage.placeholders.password')
                : t('page.userManage.placeholders.passwordOptional')
            "
          />
        </NFormItem>
        <NFormItem :label="t('page.userManage.fields.status')">
          <NSwitch v-model:value="formModel.isActive" />
        </NFormItem>
      </NForm>

      <template #footer>
        <div class="flex justify-end gap-12">
          <NButton @click="closeModal">{{ t('common.cancel') }}</NButton>
          <NButton type="primary" :loading="isSaving" @click="handleSave">{{ t('common.confirm') }}</NButton>
        </div>
      </template>
    </NModal>
  </NSpace>
</template>
