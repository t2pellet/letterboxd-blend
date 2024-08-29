import { useQueries, useQuery } from '@tanstack/vue-query';
import axios from 'axios';
import type { MaybeRef, Ref } from 'vue';
import { computed } from 'vue';
import { deboxMaybeRef } from '@/util/debox';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/users`,
});

async function getAvatar(name: string): Promise<{ name: string; url: string }> {
  const result = await client.get(`${name}/avatar`);
  return { name, url: result.data.url };
}

export function useAvatar(name: MaybeRef<string>) {
  return useQuery({
    queryKey: ['avatar', name],
    queryFn: async () => await getAvatar(deboxMaybeRef(name)),
  });
}

export function useBatchAvatar(names: Ref<string[]>) {
  const queries = computed(() => {
    return names.value.map((name) => ({
      queryKey: ['avatar', name],
      queryFn: async () => await getAvatar(name),
    }));
  });
  return useQueries({
    queries,
    combine: (results) => {
      return {
        data: results
          .map((result) => result.data)
          .filter((result) => !!result)
          .reduce((total: Record<string, string>, value) => {
            total[value.name] = value.url;
            return total;
          }, {}),
        isPending: results.some((result) => result.isPending),
      };
    },
  });
}
