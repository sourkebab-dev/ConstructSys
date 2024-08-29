<script setup lang="ts">
import { NButton, NCard, NH2, NInput, NText } from 'naive-ui';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store/auth';
import { key as notifKey } from '@/store/notification';
import { useRouter } from 'vue-router';

const notifyStore = useStore(notifKey)
const store = useStore(key);
const router = useRouter();

const isLoading = ref(false);
const userName = ref('');
const password = ref('');

async function onLogin() {
  isLoading.value = true;
  try {
    await store.dispatch('login', { userName: userName.value, password: password.value });
    router.push({ name: 'home' })
  } catch (e) {
    notifyStore.dispatch('showError', 'Failed to login, please make sure you`ve inputted your credentials correctly')
  }
  isLoading.value = false;
}
</script>

<template>
  <main class="min-h-screen flex items-center">
    <div class="w-[500px] m-auto -translate-y-1/2">
      <NCard>
        <NH2 class="text-center" align-text>
          <NText type="primary">Construction Management System</NText>
        </NH2>
        <div class="flex flex-col gap-2">
          <NInput v-model:value="userName" placeholder="Username" />
          <NInput v-model:value="password" type="password" placeholder="Password" />
          <NButton @click="onLogin" :loading="isLoading">Login</NButton>
        </div>
      </NCard>
    </div>

  </main>
</template>
