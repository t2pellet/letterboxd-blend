import axios from 'axios';
import type { Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useBatchQuery } from '@/api/api';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/users`,
});

async function getExists(name: string): Promise<{ name: string; exists: boolean }> {
  if (!name) return { name, exists: false };
  const result = await client.get(`${name}/exists`);
  return { name, exists: result.data.exists };
}

export function useExists(name: Ref<string>) {
  return useQuery({
    queryKey: ['exists', name],
    queryFn: async () => getExists(name.value),
  });
}

export function useBatchExists(names: Ref<string[]>, debounceMs = 150) {
  return useBatchQuery(
    names,
    (name) => ['exists', name],
    async (name) => getExists(name),
    (total, result: { name: string; exists?: boolean }) => {
      if (result.exists !== undefined) {
        total[result.name] = result.exists;
      }
      return total;
    },
    {
      debounceMs,
      placeholderData: (name) => ({
        name,
      }),
    },
  );
}
