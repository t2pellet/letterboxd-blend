<script setup lang="ts">
  import { useLocalStorage } from '@vueuse/core';
  import { useRoute } from 'vue-router';
  import { computed, inject, type Ref, ref } from 'vue';
  import { type Session, socket } from '@/api/session';
  import { useBlend } from '@/util/blend';
  import PosterWithAvatars from '@/components/PosterWithAvatars.vue';

  const route = useRoute();
  const localUser = useLocalStorage('user', '');
  const session = inject<Ref<Session>>('session');
  const room = route.params.code as string;

  // Fetched Data
  const users = computed(() => session?.value?.users ?? []);
  const blendResult = useBlend(users, 50, 50);
  const blendList = computed(() => blendResult.value.data ?? []);

  // Reactive data
  const idx = ref(0);

  function rateMovie(slug: string, like: boolean) {
    socket.emit('rate', {
      room,
      user: localUser.value,
      slug,
      like,
    });
    if (idx.value + 1 < blendList.value.length) {
      idx.value = idx.value + 1;
    }
  }
</script>

<template>
  <template v-if="blendResult.isPending">
    <span class="loading loading-spinner loading-lg" />
  </template>
  <template v-else>
    <poster-with-avatars
      :film="blendList[idx].entry"
      :users="blendList[idx].users" />
    <button
      class="btn btn-primary"
      @click="() => rateMovie(blendList[idx].entry.slug, true)">
      Like
    </button>
    <button
      class="btn btn-warning"
      @click="() => rateMovie(blendList[idx].entry.slug, false)">
      Dislike
    </button>
  </template>
</template>
