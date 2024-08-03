<script setup lang="ts">
  import { useWatchlists } from '@/api';
  import { useRoute } from 'vue-router';
  import { computed, ref } from 'vue';
  import type { WatchlistEntry } from '@/types/watchlist';
  import env from '@/env';
  import InfiniteCarousel from '@/components/Carousel.vue';
  import CachedImage from '@/components/CachedImage.vue';
  import PosterWithAvatars from '@/components/PosterWithAvatars.vue';

  // Data fetching
  const route = useRoute();
  const users = computed(() => {
    const usersStr = route.query.names as string;
    return usersStr?.split(',') ?? [];
  });
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
  const watchlistsResult = useWatchlists(...users.value);

  // Computed data
  type WatchlistMap = { [slug: string]: { entry: WatchlistEntry; users: string[] } };
  const blendedList = computed<WatchlistMap[string][]>(() => {
    const watchlistMap: WatchlistMap = {};
    Object.values(watchlistsResult.value.data).forEach((watchlist) => {
      const data = watchlist.data;
      data.forEach((entry) => {
        if (watchlistMap[entry.slug]) {
          watchlistMap[entry.slug].users.push(watchlist.name);
        } else {
          watchlistMap[entry.slug] = { entry, users: [watchlist.name] };
        }
      });
    });
    return Object.values(watchlistMap)
      .filter((wme) => {
        const userCount = wme.users.length;
        const userRatio = userCount / users.value.length;
        return userRatio >= blend.value;
      })
      .sort((wme1, wme2) => wme2.users.length - wme1.users.length)
      .slice(0, count.value);
  });

  const selectedIndex = ref<number | undefined>(undefined);
  const selectedEntry = computed<WatchlistEntry | null>(() =>
    selectedIndex.value ? blendedList.value[selectedIndex.value].entry : null,
  );

  // Selecting stuff
  const isSelecting = ref(false);
  const selectedModalRef = ref<HTMLDialogElement>();
  function chooseRandomIndex() {
    selectedIndex.value = Math.floor(Math.random() * blendedList.value.length);
    isSelecting.value = true;
    setTimeout(() => {
      selectedModalRef.value?.showModal();
      isSelecting.value = false;
    }, 1500);
  }
  function closeModal() {
    selectedModalRef.value?.close();
    selectedIndex.value = undefined;
  }
</script>

<template>
  <template v-if="watchlistsResult.isLoading">
    <span class="loading loading-spinner loading-lg"></span>
  </template>
  <template v-else-if="blendedList?.length">
    <infinite-carousel
      :list="blendedList"
      :infinite="false"
      :selected-index="selectedIndex"
      :item-key="(item: WatchlistMap[string]) => item.entry.slug">
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
      :disabled="isSelecting"
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
