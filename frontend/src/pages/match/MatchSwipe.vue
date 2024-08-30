<script setup lang="ts">
  import { breakpointsTailwind, useBreakpoints, useLocalStorage, useSwipe } from '@vueuse/core';
  import { useRoute } from 'vue-router';
  import { computed, inject, type Ref, ref, watch } from 'vue';
  import { type Session, socket } from '@/api/session';
  import { useBlend } from '@/util/blend';
  import PosterWithAvatars from '@/components/PosterWithAvatars.vue';
  import { clamp } from 'lodash';

  const route = useRoute();
  const localUser = useLocalStorage('user', '');
  const session = inject<Ref<Session>>('session');
  const room = route.params.code as string;
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isDesktop = breakpoints.isGreaterOrEqual('md');

  // Fetched Data
  const users = computed(() => session?.value?.users ?? []);
  const { data, isPending } = useBlend(users, 50, 50);
  const blendList = ref<typeof data.value>([]);

  // Interaction
  const swipeTarget = ref();
  const { lengthX, isSwiping, direction } = useSwipe(swipeTarget, {
    threshold: 75,
    onSwipeEnd: (_e, direction) => {
      if (direction === 'left' || direction === 'right') {
        rateMovie(direction !== 'left');
      }
    },
  });
  const swipeAmount = computed(() => {
    if (!isSwiping.value) return 0;
    const clamped = clamp(Math.abs(lengthX.value) / 150, 0, 1);
    if (direction.value === 'right') return clamped;
    else if (direction.value === 'left') return -1 * clamped;
    return 0;
  });
  const style = computed(() => {
    if (!isSwiping.value) return 'transition: none !important';
    const isLeft = direction.value === 'left';
    return `
      transition: none !important;
      rotate: ${swipeAmount.value * 20}deg;
      transform: translate(${swipeAmount.value * 8}rem, ${swipeAmount.value * (isLeft ? 8 : -8)}rem);
      opacity: ${1 - Math.abs(swipeAmount.value)}
    `;
  });

  // Functions
  async function rateMovie(like: boolean) {
    const movie = blendList.value.shift();
    if (movie) {
      blendList.value.push(movie);
      setTimeout(() => {
        socket.emit('rate', {
          room,
          user: localUser.value,
          slug: movie.entry.slug,
          like,
        });
      }, 100);
    }
  }

  watch(
    () => data.value,
    (value) => {
      blendList.value = value;
    },
  );
</script>

<template>
  <template v-if="isPending">
    <span class="loading loading-spinner loading-lg" />
  </template>
  <template v-else-if="blendList.length">
    <div class="relative w-[180px] h-[270px] mb-2">
      <poster-with-avatars
        v-if="blendList.length > 1"
        class="absolute"
        :film="blendList[1].entry"
        :users="blendList[1].users" />
      <poster-with-avatars
        ref="swipeTarget"
        class="absolute"
        :style="style"
        :film="blendList[0].entry"
        :users="blendList[0].users" />
    </div>
    <template v-if="isDesktop">
      <button
        class="btn btn-primary w-48"
        @click="() => rateMovie(true)">
        Like
      </button>
      <button
        class="btn btn-warning w-48"
        @click="() => rateMovie(false)">
        Dislike
      </button>
    </template>
  </template>
</template>

<style lang="scss" scoped></style>
