<script setup lang="ts" generic="T">
  import { nextTick, onBeforeUnmount, onMounted, type Ref, ref } from 'vue';
  import { useInfiniteScroll } from '@vueuse/core';

  const props = defineProps<{
    list: T[];
    itemKey: string | ((item: T) => string);
    infinite?: boolean;
  }>();

  const target = ref();
  const innerList = ref([]) as Ref<T[]>;
  const initialized = ref(false);
  const teleporting = ref(false);
  const selecting = ref(false);

  // Methods
  function getKey(entry: T) {
    if (typeof props.itemKey === 'function') {
      const key = props.itemKey(entry);
      return entry[key as keyof typeof entry] as string;
    }
    return entry[props.itemKey as keyof typeof entry] as string;
  }
  function initialize() {
    initialized.value = true;
    target.value.removeEventListener('scrollend', initialize);
  }
  async function teleport(left: boolean) {
    if (!initialized.value || teleporting.value) return;
    const scrollBy = target.value.children[props.list.length].offsetLeft - target.value.children[0].offsetLeft;
    teleporting.value = true;
    target.value.scrollTo({
      left: target.value.scrollLeft + scrollBy * (left ? 1 : -1),
      behavior: 'instant',
    });
    await nextTick();
    teleporting.value = false;
  }

  // Hooks
  onMounted(async () => {
    initialized.value = false;
    innerList.value = [...props.list];
    if (props.infinite) {
      innerList.value.push(...props.list, ...props.list);
      await nextTick();
      target.value.children[props.list.length].scrollIntoView({ inline: 'center', behavior: 'smooth' });
      target.value.addEventListener('scrollend', initialize);
    }
  });
  onBeforeUnmount(() => target.value.removeEventListener('scrollend', initialize));
  useInfiniteScroll(target, () => teleport(true), { direction: 'left', canLoadMore: () => props.infinite });
  useInfiniteScroll(target, () => teleport(false), { direction: 'right', canLoadMore: () => props.infinite });

  // Expose
  async function select() {
    selecting.value = true;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        selecting.value = false;
        resolve();
      }, 1500);
    });
  }
  defineExpose({ select, selecting });
</script>

<template>
  <div
    ref="target"
    class="carousel carousel-center bg-neutral rounded-box space-x-4 p-4 max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl"
    :class="{ 'snap-none': teleporting }">
    <div
      v-for="item in innerList"
      :key="getKey(item)"
      :class="{ selected: selecting }"
      class="carousel-item flex flex-col text-center relative">
      <slot
        name="item"
        v-bind="{ item }" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .carousel-item.selected {
    animation: shake 0.5s;
    animation-iteration-count: 3;
  }

  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
</style>
