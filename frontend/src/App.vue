<template>
  <header class="sticky">
    <div class="navbar sticky flex-row-reverse px-4 sm:px-8 py-1 sm:py-4">
      <theme-switch />
    </div>
  </header>
  <main class="flex flex-col flex-grow items-center px-8 sm:px-24 py-4 sm:py-12">
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
<script setup lang="ts">
  import ThemeSwitch from '@/components/ThemeSwitch.vue';
</script>
