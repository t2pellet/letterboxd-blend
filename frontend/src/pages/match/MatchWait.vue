<script setup lang="ts">
  import { type Session, socket } from '@/api/session';
  import { computed, inject, type Ref } from 'vue';
  import { useLocalStorage } from '@vueuse/core';
  import { useRoute } from 'vue-router';

  // Setup
  const route = useRoute();
  const session = inject<Ref<Session>>('session');
  const localUser = useLocalStorage('user', '');
  const code = route.params.code as string;

  // Computed
  const users = computed(() => {
    return session?.value?.users?.filter((u) => u !== session.value?.owner) ?? [];
  });
  const isSessionOwner = computed(() => {
    return session?.value?.owner === localUser.value;
  });

  function startMatch() {
    socket.emit('start', code);
  }
</script>

<template>
  <template v-if="session">
    <span class="btn btn-outline mb-2">{{ session.owner }}</span>
    <div
      v-for="user in users"
      :key="user">
      <span class="btn btn-outline btn-secondary">
        {{ user }}
      </span>
    </div>
  </template>
  <button
    class="btn btn-primary"
    :disabled="!isSessionOwner"
    @click="startMatch">
    {{ isSessionOwner ? 'Start Session' : 'Waiting for Session...' }}
  </button>
</template>
