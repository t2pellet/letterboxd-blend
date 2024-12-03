<script setup lang="ts">
  import { type Session, socket } from '@/api/session';
  import { computed, inject, type Ref } from 'vue';
  import { useRoute } from 'vue-router';
  import Avatar from '@/components/Avatar.vue';
  import { ShareIcon } from '@heroicons/vue/16/solid';
  import { useNotification } from '@kyvg/vue3-notification';
  import { useLocalStorage } from '@vueuse/core';
  import { isMobile } from '@/util/useragent';

  // Setup
  const route = useRoute();
  const { notify } = useNotification();
  const session = inject<Ref<Session>>('session');
  const localUser = useLocalStorage('user', '');
  const code = route.params.code as string;

  // Computed
  const canWebShare = computed(() => !!navigator.share);
  const isSessionOwner = computed(() => {
    return session?.value?.owner === localUser.value;
  });
  const canStartSession = computed(() => isSessionOwner.value && session!.value.users.length > 1);

  function startMatch() {
    socket.emit('start', code);
  }
  function shareInvite() {
    if (isMobile() && canWebShare.value) {
      navigator.share({
        title: "Let's pick tonight's movie with Movie-Mix!",
        url: `${import.meta.env.VITE_BASE_URL}/match/${code}`,
      });
    } else {
      navigator.clipboard.writeText(`${import.meta.env.VITE_BASE_URL}/match/${code}`);
      notify({ text: 'Link copied to clipboard.' });
    }
  }
</script>

<template>
  <template v-if="session">
    <avatar
      :show-tooltip="false"
      :slug="session.owner"
      :size="120" />
    <h1 class="text-center text-secondary mb-4">
      <b>{{ session.owner }}</b
      >'s room
    </h1>
    <div
      v-for="user in session.users"
      :key="user"
      class="text-center">
      <span class="outline-1 text-info">{{ user }}</span>
    </div>
  </template>
  <button
    class="btn btn-primary mt-4 w-40"
    :disabled="!canStartSession"
    @click="startMatch">
    {{ isSessionOwner ? 'Start Session' : 'Waiting for Session...' }}
  </button>
  <button
    class="btn btn-secondary mt-2 w-40"
    @click="shareInvite">
    <share-icon class="w-4" />
    Share
  </button>
</template>
