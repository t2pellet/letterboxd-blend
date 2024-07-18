<template>
  <div
    ref="input"
    class="relative py-1"
    @focusin="() => (focused = true)">
    <input
      v-model="search"
      type="text"
      class="input input-bordered w-full max-w-lg"
      :class="{ 'input-error': warning, 'input-success': success }"
      :placeholder="placeholder"
      @keyup.enter="selectFirstResult" />
    <ul
      v-if="focused && !isSuggestionSelected && results.length"
      class="menu dropdown-content bg-base-100 z-[1] absolute w-full max-h-40 overflow-y-scroll flex-nowrap">
      <li
        v-for="(result, idx) in results"
        :key="`result-${idx}`">
        <a @click="() => (search = result)">
          {{ result }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { useVueFuse } from 'vue-fuse';
  import { computed, ref, watch } from 'vue';
  import { onClickOutside } from '@vueuse/core';

  // Setup
  const props = defineProps<{
    placeholder: string;
    suggestions: string[];
    showSuggestions: boolean;
    warning?: boolean;
    success?: boolean;
  }>();
  const emit = defineEmits(['change']);
  const { search, results, loadItems } = useVueFuse(props.suggestions);

  // Computed
  const isSuggestionSelected = computed(() => props.suggestions.includes(search.value));

  // Focus
  const input = ref();
  const focused = ref(false);

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
  onClickOutside(input, () => {
    focused.value = false;
  });

  // Functions
  function selectFirstResult() {
    const firstResult = results.value[0];
    if (firstResult) {
      search.value = firstResult;
    }
  }
</script>
