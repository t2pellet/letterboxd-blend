import type { MaybeRef, Ref } from 'vue';
import { useWatchlists } from '@/api';
import { computed } from 'vue';
import type Watchlist from '@/types/watchlist';
import type { WatchlistEntry } from '@/types/watchlist';
import { uniqBy } from 'lodash';
import { deboxMaybeRef } from '@/util/debox';

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
    const formattedThreshold = deboxMaybeRef(threshold) > 1 ? deboxMaybeRef(threshold) / 100 : deboxMaybeRef(threshold);
    return Math.ceil(usersCount * formattedThreshold);
  });
  const data = computed(() => {
    if (watchlistsResult.value.isPending) return undefined;
    const values = Object.values(watchlistsResult.value.data).reduce((total: WatchlistEntry[], current: Watchlist) => {
      return [...total, ...current.data];
    }, []);
    const uniqValues = uniqBy(values, 'slug');
    const userMap: Record<string, string[]> = {};
    for (const we of uniqValues) {
      userMap[we.slug] = usersForSlug(watchlistsResult.value.data, we.slug);
    }
    return uniqValues
      .filter((v) => userMap[v.slug].length >= countNeeded.value)
      .sort((we1, we2) => {
        return (userMap[we1.slug]?.length ?? 0) - (userMap[we2.slug]?.length ?? 0);
      })
      .slice(0, deboxMaybeRef(count))
      .map((entry) => ({ users: userMap[entry.slug], entry }));
  });
  return computed(() => ({ data: data.value, isPending: watchlistsResult.value.isPending }));
}
