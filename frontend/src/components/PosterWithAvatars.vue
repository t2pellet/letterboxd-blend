<template>
  <div
    ref="poster"
    class="poster flex flex-col">
    <cached-image
      :src="`${env.API_URL}/posters/${film.slug}`"
      :alt="film.name"
      :width="180"
      :height="270" />
    <div
      v-if="!avatarsResult.isLoading"
      class="absolute bottom-0 z-20">
      <div
        class="avatar-container flex gap-1 overflow-y-hidden pt-8 -ml-4 pl-5 w-[180px]"
        :class="{ hovered: hovering }">
        <div
          v-for="(user, idx) in users"
          :key="`avatar-${film.no}-${idx}`"
          class="tooltip"
          :data-tip="user">
          <img
            class="w-7 rounded-full opacity-25"
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
  .poster {
    transition: 0.25s all ease-in-out;
    transform: scale(1);

    &:hover {
      transform: scale(1.05);
    }
  }

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