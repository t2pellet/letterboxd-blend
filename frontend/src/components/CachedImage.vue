<template>
  <div class="relative" :style="{ width: `${width}px`, height: `${height}px` }">
    <div
      v-if="isLoading"
      class="skeleton absolute pointer-events-none w-full h-full top-0" />
    <img
      v-else
      :src="`data:image/jpeg;base64,${data}`"
      :alt="alt"
      :width="width"
      :height="height"
      class="relative z-10 rounded-xl" />
  </div>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import { Buffer } from 'buffer';
  import { useQuery } from '@tanstack/vue-query';

  const props = defineProps<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>();

  const { data, isLoading } = useQuery({
    queryKey: ['img', props.src],
    gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    queryFn: async () => {
      const response = await axios.get(props.src, { responseType: 'arraybuffer' });
      return Buffer.from(response.data, 'binary').toString('base64');
    },
  });
</script>
