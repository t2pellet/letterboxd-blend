<template>
  <div
    ref="poster"
    class="flex flex-col">
    <cached-image
      :src="`${env.API_URL}/posters/${film.slug}`"
      :alt="film.name"
      :width="180"
      :height="270" />
    <div
      v-if="!avatarsResult.isLoading"
      class="absolute bottom-0 z-20">
      <div
        class="avatar-container flex gap-1 overflow-y-hidden pt-8 pl-1 w-32"
        :class="{ hovered: hovering }">
        <div
          v-for="(user, idx) in users"
          :key="`avatar-${film.no}-${idx}`"
          class="tooltip"
          :data-tip="user">
          <img
            class="w-8 rounded-full opacity-25"
            :src="avatarsResult.data[user]"
            :alt="user" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import env from '@/env';
  import CachedImage from '@/components/CachedImage.vue';
  import { computed, ref } from 'vue';
  import { useBatchAvatar } from '@/api';
  import type { WatchlistEntry } from '@/types/watchlist';
  import { useElementHover } from '@vueuse/core';

  const props = defineProps<{
    users: string[];
    film: WatchlistEntry;
  }>();

  // Data
  const users = computed(() => props.users);
  const avatarsResult = useBatchAvatar(users);

  // Interaction
  const poster = ref();
  const hovering = useElementHover(poster);
</script>

<style lang="scss" scoped>
  .avatar-container img {
    transition-duration: 0.5s;
    transition-property: all;
    transition-timing-function: ease-in-out;
    transform: translateY(100%);
  }
  .avatar-container.hovered img {
    opacity: 1;
    transform: translateY(-5%);
  }
</style>
