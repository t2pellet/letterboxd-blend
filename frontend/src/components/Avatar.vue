<template>
  <div
    class="w-fit"
    :class="{ tooltip: showTooltip }"
    :data-tip="slug">
    <div
      class="rounded-full overflow-hidden max-w-full"
      :style="`width: ${size}px; height: ${size}px`">
      <div
        v-if="isPending"
        class="skeleton w-full h-full"></div>
      <img
        v-else
        class="w-full"
        :alt="slug"
        :src="data?.url" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAvatar } from '@/api';

  interface Props {
    slug: string;
    size: number;
    showTooltip?: boolean;
  }
  const props = withDefaults(defineProps<Props>(), { showTooltip: true });
  const { data, isPending } = useAvatar(props.slug);
</script>
