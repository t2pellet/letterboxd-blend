<script setup lang="ts">
  import { useLocalStorage } from '@vueuse/core';
  import { useRoute, useRouter } from 'vue-router';
  import { useExists } from '@/api';
  import AutoComplete from '@/components/AutoComplete.vue';
  import { usePostSession } from '@/api/session';

  // Setup
  const route = useRoute();
  const router = useRouter();
  const user = useLocalStorage('user', '');
  const code = route.query.code as string;

  // Data Fetch
  const { data: exists, isPending } = useExists(user);
  const { mutateAsync: createSession } = usePostSession();

  // Functions
  function submit() {
    if (code) {
      joinRoom();
    } else {
      createRoom();
    }
  }
  async function joinRoom() {
    await router.push(`/match/${code}`);
  }
  async function createRoom() {
    const result = await createSession(user.value);
    await router.push(`/match/${result}`);
  }
  function updateUser(value: string) {
    user.value = value;
  }
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="form-control">
      <label class="label">
        <span class="label-text">Your Letterboxd User</span>
      </label>
      <auto-complete
        type="text"
        placeholder="Letterboxd Username"
        :initial-value="user"
        :warning="user.length && exists && !exists.exists"
        :success="user.length && exists && exists.exists"
        :loading="user.length && isPending"
        @change="updateUser" />
    </div>
    <button
      class="btn btn-primary w-full mt-4"
      :disabled="!user?.length || !exists?.exists"
      @click="submit">
      {{ !!code ? 'Join Room' : 'Create Room' }}
    </button>
  </div>
</template>
