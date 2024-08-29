<script setup lang="ts">
import { key } from '@/store/notification';
import { NAlert } from 'naive-ui';
import { useStore } from 'vuex';

const store = useStore(key);

</script>

<template>
  <Transition name="fade">
    <NAlert class="z-20" v-if="store.state.isShown" :type="store.state.type === 'SUCCESS' ? 'success' : 'error'">
      {{ store.state.message }}
    </NAlert>
  </Transition>
</template>