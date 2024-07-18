import axios from 'axios';
import type { Ref } from 'vue';
import { useQueries, useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/users`,
});

async function getExists(name: string): Promise<boolean> {
  if (!name) return false;
  const result = await client.get(`${name}/exists`);
  return result.data.exists;
}

export function useExists(name: Ref<string>) {
  return useQuery({
    queryKey: ['exists', name],
    queryFn: async () => await getExists(name.value),
  });
}

export function useBatchExists(names: Ref<string[]>) {
  const queries = computed(() => {
    return names.value.map((name) => ({
      queryKey: ['exists', name],
      queryFn: async () => ({ name, exists: await getExists(name) }),
    }));
  });
  return useQueries({
    queries,
    combine: (results) => {
      return {
        data: results
          .map((result) => result.data)
          .filter((result) => !!result)
          .reduce((total: Record<string, boolean>, result) => {
            total[result.name] = result.exists;
            return total;
          }, {}),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
}
