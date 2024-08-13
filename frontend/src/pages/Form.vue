<script setup lang="ts">
  import { computed, ref } from 'vue';
  import router from '@/router';
  import AutoComplete from '@/components/AutoComplete.vue';
  import { useBatchFollowing } from '@/api';
  import { useBatchExists } from '@/api/exists';
  import { uniq } from 'lodash';

  // Data Fetching
  const users = ref<string[]>(['', '']);
  const existsResult = useBatchExists(
    computed(() => {
      return users.value.filter((user) => user);
    }),
    100,
  );
  const existingUsers = computed(() => users.value.filter((user) => existsResult.value.data[user]));
  const followingResult = useBatchFollowing(existingUsers, 200);

  const blendPercentage = ref<number>(75);
  const blendCount = ref<number>(10);
  const suggestions = computed(() => {
    return uniq(Object.values(followingResult.value.data).reduce((t, v) => [...t, ...v], []));
  });
  const canDeleteUser = computed(() => users.value.length > 2);
  const allUsersExist = computed(() => existingUsers.value.length === users.value.length);
  const isValidBlend = computed(() => blendPercentage.value >= 0 && blendPercentage.value <= 100);
  const focused = ref(true);

  // Methods
  function updateUser(idx: number, user: string) {
    users.value = [...users.value.slice(0, idx), user, ...users.value.slice(idx + 1)];
  }
  function addUser() {
    users.value = [...users.value, ''];
  }
  function removeUser() {
    users.value = users.value.slice(0, users.value.length - 1);
  }
  function isMissingUser(user: string) {
    return existsResult.value.data[user] === false;
  }
  function isExistingUser(user: string) {
    return existsResult.value.data[user] === true;
  }
  function isLoadingUser(user: string) {
    return !!user?.length && existsResult.value.data[user] === undefined;
  }
  function viewResult() {
    if (!allUsersExist.value) return;
    const queryStr = users.value.join(',');
    router.push(`/result?names=${queryStr}&blend=${blendPercentage.value}&count=${blendCount.value}`);
  }
</script>

<template>
  <div class="flex flex-col gap-2">
    <auto-complete
      v-for="(user, idx) in users"
      :key="idx"
      class="w-full"
      placeholder="Letterboxd Username"
      :suggestions="suggestions"
      :warning="isMissingUser(user)"
      :success="isExistingUser(user)"
      :loading="isLoadingUser(user)"
      @change="(value: string) => updateUser(idx, value)" />
    <div class="flex gap-2">
      <button
        class="btn btn-neutral w-40"
        @click="addUser">
        Add User
      </button>
      <button
        class="btn btn-warning w-40"
        :disabled="!canDeleteUser"
        @click="removeUser">
        Remove User
      </button>
    </div>
    <div
      class="collapse collapse-arrow"
      :class="{ 'bg-base-100': !focused, 'bg-base-200': focused }">
      <input
        type="checkbox"
        @click="() => (focused = !focused)" />
      <div class="collapse-title flex-grow-0">Detailed Settings</div>
      <div class="collapse-content">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Blend Threshold</span>
          </label>
          <label class="flex input-group items-center w-full">
            <input
              v-model="blendPercentage"
              type="number"
              :min="0"
              :max="100"
              placeholder="75"
              :class="{ 'input-error': !isValidBlend }"
              class="input input-bordered flex-grow" />
            <span class="pl-2 pr-2">%</span>
          </label>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Blend Size</span>
          </label>
          <input
            v-model="blendCount"
            type="text"
            class="input input-bordered flex-grow" />
        </div>
      </div>
    </div>
    <button
      class="btn btn-primary w-full mt-4"
      :disabled="!allUsersExist || !isValidBlend"
      @click="viewResult">
      Get Blend
    </button>
  </div>
</template>
