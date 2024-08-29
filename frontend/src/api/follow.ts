import axios from 'axios';
import { useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import type { Following } from '@/types/following';
import { useBatchQuery } from '@/api/api';

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
  return useBatchQuery(
    names,
    (name) => ['following', name],
    async (name) => {
      return getFollowing(name);
    },
    (total: Record<string, string[]>, result: Following) => {
      if (result?.following) {
        total[result.name] = Object.keys(result.following);
      }
      return total;
    },
    {
      debounceMs,
    },
  );
}
