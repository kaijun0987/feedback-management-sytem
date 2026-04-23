<script setup lang="ts">
import { computed } from 'vue';
import type { PopoverPlacement } from 'naive-ui';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';

defineOptions({
  name: 'LangToggleButton'
});

const props = withDefaults(
  defineProps<{
    showTooltip?: boolean;
    tooltipPlacement?: PopoverPlacement;
  }>(),
  {
    showTooltip: true,
    tooltipPlacement: 'bottom'
  }
);

const appStore = useAppStore();

const icon = computed(() => (appStore.locale === 'zh-CN' ? 'circle-flags:cn' : 'circle-flags:us'));

const tooltipContent = computed(() => {
  if (!props.showTooltip) {
    return '';
  }

  return $t('icon.lang');
});
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="appStore.toggleLocale()"
  />
</template>

<style scoped></style>
