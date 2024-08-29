import { useQueries } from '@tanstack/vue-query';
import { computed, type Ref } from 'vue';
import { useDebounce } from '@vueuse/core';

interface BatchQueryOptions<T, R> {
  debounceMs?: number;
  placeholderData?: (data: T) => R;
}
export function useBatchQuery<T, K, R, C>(
  data: Ref<T[]>,
  keyMapper: (data: T) => K,
  queryFn: (data: T) => Promise<R> | R,
  combineMapper: (total: Record<string | number | symbol, C>, result: R) => Record<string | number | symbol, C>,
  options?: BatchQueryOptions<T, R>,
) {
  const queries = computed(() =>
    data.value.map((r) => {
      return {
        queryKey: keyMapper(r),
        queryFn: async () => await queryFn(r),
        placeholderData: options?.placeholderData ? options.placeholderData(r) : null,
      };
    }),
  );
  const debouncedQueries = options?.debounceMs ? useDebounce(queries, options.debounceMs) : queries;
  return useQueries({
    queries: debouncedQueries as never,
    combine: (results) => ({
      isPending: results.some((r) => r.isPending),
      data: results
        .map((r) => r.data as R | undefined)
        .filter((r) => r !== undefined)
        .reduce(combineMapper, {}) as Record<string | number | symbol, C>,
    }),
  });
}
