<script setup lang="ts">
  import ThemeSwitch from '@/components/ThemeSwitch.vue';
  import { Notifications } from '@kyvg/vue3-notification';
</script>

<template>
  <header class="h-10">
    <div class="navbar absolute flex-row-reverse px-4 sm:px-8 py-1 sm:py-4">
      <theme-switch />
    </div>
  </header>
  <notifications classes="notifications alert alert-info" />
  <main class="flex flex-col items-center px-8 sm:px-24 py-4 sm:py-12">
    <RouterLink to="/">
      <img
        class="mb-4 rounded-xl"
        src="https://a.ltrbxd.com/logos/letterboxd-logo-alt-v-neg-rgb-1000px.png"
        width="192"
        height="192"
        alt="Letterboxd Logo" />
    </RouterLink>
    <h1 class="text-primary text-xl font-bold italic">Movie-Mix</h1>
    <div class="divider my-2 sm:my-4" />
    <RouterView />
  </main>
</template>

<style lang="scss">
  .vue-notification-group {
    right: 1rem !important;
  }

  .notifications {
    margin-top: 1rem;
    display: flex !important;
    flex-wrap: nowrap;

    &::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z' /%3E%3C/svg%3E%0A");
      width: 1.5rem;
      height: 1.5rem;
    }
  }
</style>
