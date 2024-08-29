<script setup lang="ts">
  import { type Session, socket } from '@/api/session';
  import { computed, inject, type Ref } from 'vue';
  import { useLocalStorage } from '@vueuse/core';
  import { useRoute } from 'vue-router';
  import Avatar from '@/components/Avatar.vue';

  // Setup
  const route = useRoute();
  const session = inject<Ref<Session>>('session');
  const localUser = useLocalStorage('user', '');
  const code = route.params.code as string;

  // Computed
  const isSessionOwner = computed(() => {
    return session?.value?.owner === localUser.value;
  });

  function startMatch() {
    socket.emit('start', code);
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
    class="btn btn-primary mt-4"
    :disabled="!isSessionOwner"
    @click="startMatch">
    {{ isSessionOwner ? 'Start Session' : 'Waiting for Session...' }}
  </button>
</template>
