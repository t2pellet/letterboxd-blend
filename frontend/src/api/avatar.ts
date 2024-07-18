import { useQueries, useQuery } from '@tanstack/vue-query';
import axios from 'axios';
import type { Ref } from 'vue';
import { computed } from 'vue';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/users`,
});

async function getAvatar(name: string): Promise<string> {
  const result = await client.get(`${name}/avatar`);
  return result.data.url;
}

export function useAvatar(name: Ref<string>) {
  return useQuery({
    queryKey: ['avatar', name],
    queryFn: async () => await getAvatar(name.value),
  });
}

export function useBatchAvatar(names: Ref<string[]>) {
  const queries = computed(() => {
    return names.value.map((name) => ({
      queryKey: ['avatar', name],
      queryFn: async () => ({ name, url: await getAvatar(name) }),
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
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
}
