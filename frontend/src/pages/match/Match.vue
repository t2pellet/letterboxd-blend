<script setup lang="ts">
  import { useLocalStorage } from '@vueuse/core';
  import { useRoute, useRouter } from 'vue-router';
  import { computed, onBeforeUnmount, onMounted, provide, watch } from 'vue';
  import { socket, useSessionInfo } from '@/api/session';

  const route = useRoute();
  const router = useRouter();
  const user = useLocalStorage('user', '');
  const room = computed(() => route.params.code as string);

  // Fetched Data
  const { data: session, refetch, isPending, isError, isSuccess, isRefetching } = useSessionInfo(room);
  provide('session', session);

  function onDataLoaded() {
    switch (session.value?.state) {
      case 'match':
        router.replace(`/match/${room.value}/result`);
        break;
      case 'swipe':
        router.replace(`/match/${room.value}/swipe`);
        break;
      case 'wait':
        router.replace(`/match/${room.value}/wait`);
        break;
      default:
        router.replace(`/match`);
    }
  }
  function onDataUpdated() {
    if (isSuccess.value) onDataLoaded();
    else if (isError.value) router.replace('/');
  }

  // Reactive hooks
  onMounted(() => {
    if (!user.value) router.replace(`/match?code=${room.value}`);
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('join', { user: user.value, room: room.value });
    // Socket Listeners
    socket.on('joined', refetch);
    socket.on('left', refetch);
    socket.on('started', refetch);
    socket.on('matched', refetch);
  });
  onBeforeUnmount(() => {
    if (!socket.disconnected) {
      socket.emit('leave', { user: user.value, room: room.value });
      // Socket listeners
      socket.off('joined');
      socket.off('left');
      socket.off('started');
      socket.off('matched');
      socket.disconnect();
    }
  });
  watch(
    () => isError.value,
    (val) => {
      if (val) router.replace('/');
    },
  );
  watch(
    () => isPending.value,
    (val) => {
      if (!val) onDataUpdated();
    },
  );
  watch(
    () => isRefetching.value,
    (val) => {
      if (!val) onDataUpdated();
    },
  );
</script>

<template>
  <div class="flex flex-col gap-2">
    <template v-if="isPending">
      <span class="loading loading-spinner loading-lg" />
    </template>
    <router-view v-else />
  </div>
</template>
