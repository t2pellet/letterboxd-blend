<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { computed, ref } from 'vue';
  import type { WatchlistEntry } from '@/types/watchlist';
  import env from '@/env';
  import InfiniteCarousel from '@/components/Carousel.vue';
  import CachedImage from '@/components/CachedImage.vue';
  import PosterWithAvatars from '@/components/PosterWithAvatars.vue';
  import { useBlend } from '@/util/blend';

  // Setup
  type WatchlistItem = { users: string[]; entry: WatchlistEntry };
  const route = useRoute();
  const users = computed(() => {
    const usersStr = route.query.names as string;
    return usersStr?.split(',') ?? [];
  });

  // Data
  const carousel = ref();

  // Computed

  const blend = computed(() => {
    const number = Number(route.query.blend ?? 75);
    if (Number.isNaN(number)) return 1;
    return number / 100;
  });
  const count = computed(() => {
    const number = Number(route.query.count ?? 10);
    if (Number.isNaN(number)) return 10;
    return number;
  });
  const { data: blendedList, isPending } = useBlend(users, blend, count);

  const selectedIndex = ref<number | undefined>(undefined);
  const selectedEntry = computed<WatchlistEntry | null>(() =>
    selectedIndex.value ? blendedList.value[selectedIndex.value].entry : null,
  );

  // Selecting stuff
  const selectedModalRef = ref<HTMLDialogElement>();
  async function chooseRandomIndex() {
    selectedIndex.value = Math.floor(Math.random() * blendedList.value.length);
    await carousel.value.select();
    selectedModalRef.value?.showModal();
  }
  function closeModal() {
    selectedModalRef.value?.close();
    selectedIndex.value = undefined;
  }
</script>

<template>
  <template v-if="isPending">
    <span class="loading loading-spinner loading-lg"></span>
  </template>
  <template v-else-if="blendedList.length">
    <infinite-carousel
      ref="carousel"
      :list="blendedList"
      :infinite="false"
      :item-key="({ entry }: WatchlistItem) => entry.slug">
      <!-- @ts-ignore -->
      <template #item="{ item }">
        <a
          class="relative"
          :href="`https://letterboxd.com/film/${item.entry.slug}`">
          <poster-with-avatars
            :film="item.entry"
            :users="item.users" />
        </a>
      </template>
    </infinite-carousel>
    <button
      class="btn btn-primary w-72 mt-4"
      :disabled="carousel?.selecting"
      @click="chooseRandomIndex">
      Pick for me
    </button>
  </template>
  <template v-else>
    <img
      :width="280"
      src="/img/nothing.jpg"
      class="border-4 rounded-sm"
      alt="Nothing" />
  </template>
  <RouterLink to="/">
    <button class="btn btn-secondary btn-outline w-72 mt-4">Go Back</button>
  </RouterLink>
  <dialog
    v-if="selectedEntry"
    id="random_pick_modal"
    ref="selectedModalRef"
    class="modal modal-bottom sm:modal-middle"
    @click="closeModal">
    <div class="modal-box w-full sm:w-fit">
      <a
        class="flex justify-center"
        :href="`https://letterboxd.com/film/${selectedEntry.slug}`"
        @click="(e) => e.stopPropagation()">
        <cached-image
          class="max-w-fit sm:max-w-none"
          :src="`${env.API_URL}/posters/${selectedEntry.slug}`"
          :alt="selectedEntry.name"
          :width="400"
          :height="600" />
      </a>
    </div>
  </dialog>
</template>

<style lang="scss" scoped></style>
