<template>
  <div
    ref="poster"
    class="poster flex flex-col"
    @click="onClick">
    <cached-image
      :class="{ 'cursor-pointer': clickable }"
      :src="`${env.API_URL}/posters/${film.slug}`"
      :alt="film.name"
      :width="width"
      :height="height" />
    <div
      v-if="!avatarsResult.isPending"
      class="absolute bottom-0 z-20">
      <div :class="avatarsClass">
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

  interface Props {
    users: string[];
    film: WatchlistEntry;
    width?: number;
    clickable?: boolean;
  }
  const props = withDefaults(defineProps<Props>(), {
    width: 180,
    clickable: false,
  });

  // Data
  const users = computed(() => props.users);
  const avatarsResult = useBatchAvatar(users);

  // Computed
  const avatarsClass = computed(() => {
    let str = `avatar-container flex gap-1 overflow-y-hidden pt-8 -ml-4 pl-5 w-[${props.width}px]`;
    if (hovering.value) str = str + ' hovered';
    return str;
  });
  const height = computed(() => Math.round(props.width * 1.5));

  // Interaction
  const poster = ref();
  const hovering = useElementHover(poster);

  function onClick() {
    if (props.clickable) {
      window.open(`https://letterboxd.com/film/${props.film.slug}`);
    }
  }
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
