<script setup lang="ts">
  import { useVueFuse } from 'vue-fuse';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useFocusWithin } from '@vueuse/core';

  // Setup
  const props = withDefaults(
    defineProps<{
      placeholder: string;
      initialValue?: string;
      suggestions?: string[];
      warning?: boolean;
      success?: boolean;
      loading?: boolean;
    }>(),
    { suggestions: () => [], initialValue: '', warning: false, success: false, loading: false },
  );
  const emit = defineEmits(['change']);

  const { search, results, loadItems } = useVueFuse(props.suggestions, {});

  // Computed
  const isSuggestionSelected = computed(() => props.suggestions.includes(search.value));
  const isExpanded = computed(() => focused.value && !isSuggestionSelected.value && !!results.value.length);

  // Focus
  const input = ref();
  const inputBox = ref();
  const { focused } = useFocusWithin(input);

  // Watchers
  watch(search, (current) => {
    emit('change', current);
  });
  watch(
    () => props.suggestions,
    (current) => {
      loadItems(current);
    },
  );
  onMounted(() => (search.value = props.initialValue));

  // Functions
  function selectFirstResult() {
    const firstResult = results.value[0];
    if (firstResult) {
      search.value = firstResult;
    }
  }
  function selectResult(result: string) {
    search.value = result;
    inputBox.value.focus();
  }
</script>

<template>
  <div
    ref="input"
    class="relative">
    <div class="flex items-center">
      <input
        ref="inputBox"
        v-model="search"
        type="text"
        class="input input-bordered w-full max-w-lg"
        :class="{ 'input-error': warning, 'input-success': success }"
        :placeholder="placeholder"
        :aria-expanded="isExpanded"
        aria-autocomplete="list"
        @keyup.enter="selectFirstResult" />
      <span
        v-if="loading"
        inert
        class="absolute right-4 loading loading-spinner loading-xs"></span>
    </div>
    <ul
      v-show="isExpanded"
      role="listbox"
      class="menu dropdown-content bg-base-100 z-[1] absolute w-full max-h-40 overflow-y-scroll flex-nowrap">
      <li
        v-for="(result, idx) in results"
        :key="`result-${idx}`"
        :tabindex="0"
        @keyup.space="() => selectResult(result)"
        @keyup.enter="selectResult(result)">
        <a @click="() => selectResult(result)">
          {{ result }}
        </a>
      </li>
    </ul>
  </div>
</template>
