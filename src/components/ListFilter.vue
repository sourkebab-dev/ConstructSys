<script setup lang="ts">
import { key } from '@/store/list';
import { NButton, NCard, NH2, NInput } from 'naive-ui';
import { reactive } from 'vue';
import { useStore } from 'vuex';

const store = useStore(key);

const filter = reactive({
  projectId: '',
  projectName: '',
});

function onSearch() {
  store.dispatch('loadList', { page: 1, ...filter })
}

</script>

<template>
  <NCard>
    <NH2>Filter</NH2>
    <div class="flex flex-row gap-2">
      <NInput v-model:value="filter.projectId" placeholder="Project Id" />
      <NInput v-model:value="filter.projectName" placeholder="Project Name" />
      <NButton @click="onSearch" :loading="store.state.isLoading">Search</NButton>
    </div>
  </NCard>
</template>