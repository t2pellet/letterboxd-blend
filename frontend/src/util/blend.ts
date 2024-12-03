import type { MaybeRef, Ref } from 'vue';
import { useWatchlists } from '@/api';
import { computed, onMounted, ref, unref, watch } from 'vue';
import type Watchlist from '@/types/watchlist';
import type { WatchlistEntry } from '@/types/watchlist';

interface MovieMapValue {
  entry: WatchlistEntry;
  users: string[];
}

function watchlistsToMovieMap(watchlists: Record<string, Watchlist>, minCount = 0) {
  const movieMap: Record<string, MovieMapValue> = {};
  const users = Object.keys(watchlists);
  // Build Map
  for (const user of users) {
    const entries = watchlists[user].data;
    for (const entry of entries) {
      if (!movieMap[entry.slug]) movieMap[entry.slug] = { entry, users: [] };
      movieMap[entry.slug].users.push(user);
    }
  }
  // Remove below minCount
  const movies = Object.keys(movieMap);
  for (const movie of movies) {
    if (movieMap[movie].users.length < minCount) delete movieMap[movie];
  }
  return movieMap;
}

export function usersForSlug(watchlists: Record<string, Watchlist>, slug: string) {
  const watchlistList = Object.entries(watchlists);
  const users = [];
  for (const [user, watchlist] of watchlistList) {
    if (watchlist.data.find((we) => we.slug === slug)) {
      users.push(user);
    }
  }
  return users;
}

export function useBlend(users: Ref<string[]>, threshold: MaybeRef<number>, count: MaybeRef<number>) {
  const watchlistsResult = useWatchlists(users);
  const countNeeded = computed(() => {
    const usersCount = users.value.length;
    const formattedThreshold = unref(threshold) > 1 ? unref(threshold) / 100 : unref(threshold);
    return Math.ceil(usersCount * formattedThreshold);
  });

  // Data
  const isPending = computed(() => watchlistsResult.value.isPending || isPendingInternal.value);
  const isPendingInternal = ref(true);
  const data = ref<MovieMapValue[]>([]);

  function getBlendedList(watchlists: Record<string, Watchlist>, countNeeded: number) {
    const movieMap = watchlistsToMovieMap(watchlists, countNeeded);
    return Object.keys(movieMap)
      .map((slug) => movieMap[slug])
      .sort((m1, m2) => m1.users.length - m2.users.length)
      .slice(0, unref(count));
  }

  watch(
    () => watchlistsResult.value.isPending,
    (value) => {
      if (!value) {
        data.value = getBlendedList(watchlistsResult.value.data, countNeeded.value);
        isPendingInternal.value = false;
      }
    },
  );
  onMounted(() => {
    if (!watchlistsResult.value.isPending) {
      data.value = getBlendedList(watchlistsResult.value.data, countNeeded.value);
      isPendingInternal.value = false;
    }
  });
  return { data, isPending };
}
