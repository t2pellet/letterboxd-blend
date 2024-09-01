<template>
  <poster-with-avatars
    v-if="session"
    class="mt-2"
    :film="matchEntry as WatchlistEntry"
    :users="matchUsers"
    :width="270"
    :clickable="true" />
  <h1 class="text-lg text-primary text-center mt-2"><b class="italic">It's a match!</b> Get the 🍿 !</h1>
</template>
<script setup lang="ts">
  import { computed, inject, type Ref } from 'vue';
  import PosterWithAvatars from '@/components/PosterWithAvatars.vue';
  import type { Session } from '@/api/session';
  import { useWatchlists } from '@/api';
  import { usersForSlug } from '@/util/blend';
  import type { WatchlistEntry } from '@/types/watchlist';

  const session = inject<Ref<Session>>('session');
  const sessionUsers = computed(() => session?.value.users ?? []);
  const watchlistsResult = useWatchlists(sessionUsers);
  const matchUsers = computed(() => {
    return usersForSlug(watchlistsResult.value.data, session?.value.match as string);
  });
  const matchEntry = computed(() => {
    const user = matchUsers.value[0];
    return watchlistsResult.value.data[user].data.find((f) => f.slug === session?.value.match);
  });
</script>
