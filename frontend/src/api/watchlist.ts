import type { UseQueryReturnType } from '@tanstack/vue-query';
import { useQuery } from '@tanstack/vue-query';
import type Watchlist from '@/types/watchlist';
import axios, { type AxiosError } from 'axios';
import { useBatchQuery } from '@/api/api';
import type { Ref } from 'vue';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/users`,
});

async function getWatchlist(name: string): Promise<Watchlist> {
  const result = await client.get(`${name}/watchlist`);
  return { name, ...result.data, data: Object.values(result.data.data) };
}

export function useWatchlist(name: string): UseQueryReturnType<Watchlist, AxiosError> {
  return useQuery({
    queryKey: ['watchlist', name],
    queryFn: async () => await getWatchlist(name),
  });
}

export function useWatchlists(names: Ref<string[]>) {
  return useBatchQuery(
    names,
    (name) => ['watchlist', name],
    async (name) => await getWatchlist(name),
    (total: Record<string, Watchlist>, result) => {
      if (!result) return total;
      total[result.name] = result;
      return total;
    },
  );
}
