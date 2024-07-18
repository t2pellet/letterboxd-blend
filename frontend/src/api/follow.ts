import axios from 'axios';
import { useQueries, useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import { uniq, uniqBy } from 'lodash';
import { computed } from 'vue';
import type { Following } from '@/types/following';
import type { Followers } from '@/types/followers';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/users`,
});

async function getFollowing(name: string): Promise<Following> {
  if (!name) return { name, following: {} };
  const result = await client.get(`${name}/following`);
  return { name, following: result.data };
}

async function getFollowers(name: string): Promise<Followers> {
  if (!name) return { name, followers: {} };
  const result = await client.get(`${name}/followers`);
  return { name, followers: result.data };
}

export function useFollowing(name: Ref<string>) {
  return useQuery({
    queryKey: ['following', name],
    queryFn: async () => getFollowing(name.value),
  });
}

export function useFollowers(name: Ref<string>) {
  return useQuery({
    queryKey: ['followers', name],
    queryFn: async () => getFollowers(name.value),
  });
}

export function useBatchFollowing(names: Ref<string[]>) {
  const queries = computed(() =>
    names.value.map((name) => {
      return {
        queryKey: ['following', name],
        queryFn: async () => getFollowing(name),
      };
    }),
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

export function useBatchFollowers(names: Ref<string[]>) {
  const queries = computed(() =>
    names.value.map((name) => {
      return {
        queryKey: ['follower', name],
        queryFn: async () => getFollowers(name),
      };
    }),
  );
  return useQueries({
    queries,
    combine: (results) => {
      return {
        data: results
          .map((result) => result.data)
          .filter((result) => result)
          .reduce((total: string[], value) => {
            const followers = value?.followers ?? {};
            return uniq([...total, ...Object.keys(followers)]);
          }, []),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
}
