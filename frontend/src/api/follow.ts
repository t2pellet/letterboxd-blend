import axios from 'axios';
import { useQueries, useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import { uniq } from 'lodash';
import { computed } from 'vue';
import type { Following } from '@/types/following';
import { useDebounce } from '@vueuse/core';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/users`,
});

async function getFollowing(name: string): Promise<Following> {
  if (!name) return { name, following: {} };
  const result = await client.get(`${name}/following`);
  return { name, following: result.data };
}

export function useFollowing(name: Ref<string>) {
  return useQuery({
    queryKey: ['following', name],
    queryFn: async () => getFollowing(name.value),
  });
}

export function useBatchFollowing(names: Ref<string[]>, debounceMs: number = 100) {
  const queries = useDebounce(
    computed(() =>
      names.value.map((name) => {
        return {
          queryKey: ['following', name],
          queryFn: async () => getFollowing(name),
        };
      }),
    ),
    debounceMs,
  );
  return useQueries({
    queries,
    combine: (results) => {
      return {
        data: results
          .map((result) => result.data)
          .filter((result) => result)
          .reduce((total: string[], value) => {
            const following = value?.following ?? {};
            return uniq([...total, ...Object.keys(following)]);
          }, []),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
}
