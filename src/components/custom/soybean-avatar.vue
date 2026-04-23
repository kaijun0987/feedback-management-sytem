<script setup lang="ts">
interface Props {
  size?: number;
}

withDefaults(defineProps<Props>(), {
  size: 72
});

defineOptions({
  name: 'SoybeanAvatar'
});
</script>

<template>
  <div
    class="avatar flex-center overflow-hidden rd-1/2 text-white shadow-sm"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <SvgIcon icon="lucide:circle-user-round" :style="{ fontSize: `${Math.round(size * 0.58)}px` }" />
  </div>
</template>

<style scoped>
.avatar {
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%);
}
</style>
