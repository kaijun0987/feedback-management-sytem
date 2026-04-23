<script setup lang="ts">
import { computed } from 'vue';
import type { PopoverPlacement } from 'naive-ui';
import { $t } from '@/locales';

defineOptions({ name: 'ThemeSchemaSwitch' });

interface Props {
  /** Theme schema */
  themeSchema: UnionKey.ThemeScheme;
  /** Whether current theme is dark */
  isDark?: boolean;
  /** Show tooltip */
  showTooltip?: boolean;
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: 'bottom'
});

interface Emits {
  (e: 'switch'): void;
}

const emit = defineEmits<Emits>();

function handleSwitch() {
  emit('switch');
}

const icons: Record<'light' | 'dark', string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded'
};

const displayThemeSchema = computed<'light' | 'dark'>(() => {
  if (props.themeSchema === 'auto') {
    return props.isDark ? 'dark' : 'light';
  }

  return props.themeSchema;
});

const icon = computed(() => icons[displayThemeSchema.value]);

const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.themeSchema');
});
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleSwitch"
  />
</template>

<style scoped></style>
