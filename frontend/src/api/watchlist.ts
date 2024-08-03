import type { UseQueryReturnType } from '@tanstack/vue-query';
import { useQueries, useQuery } from '@tanstack/vue-query';
import type Watchlist from '@/types/watchlist';
import axios, { type AxiosError } from 'axios';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/users`,
});

async function getWatchlist(name: string) {
  const result = await client.get(`${name}/watchlist`);
  return { name, ...result.data, data: Object.values(result.data.data) };
}

export function useWatchlist(name: string): UseQueryReturnType<Watchlist, AxiosError> {
  return useQuery({
    queryKey: ['watchlist', name],
    queryFn: async () => await getWatchlist(name),
  });
}

export function useWatchlists(...names: string[]) {
  const queries = names.map((name) => ({
    queryKey: ['watchlist', name],
    queryFn: async () => await getWatchlist(name),
  }));
  return useQueries({
    queries,
    combine: (results) => {
      return {
        data: results
          .map((result) => result.data)
          .reduce((total: Record<string, Watchlist>, result: Watchlist) => {
            if (!result) return total;
            total[result.name] = result;
            return total;
          }, {}) as Record<string, Watchlist>,
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
}
