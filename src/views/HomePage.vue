<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { NH1, NSpin, NSpace, NButton } from 'naive-ui';
import { useRouter } from 'vue-router';
import format from 'date-fns/format';
import addMinutes from 'date-fns/addMinutes';
import ListFilter from '@/components/ListFilter.vue';
import DataTable from '@/components/DataTable.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';
import { key } from '@/store/list';
import { FIELDS } from '@/constants';

const store = useStore(key);
const router = useRouter();

const currentPage = ref(1);
const isDeleteModalOpen = ref(false);
let deleteId = '';

const list = computed(() => store.state.list.map((val) => ({ ...val, dataTableId: val.projectId })));
const tzOffset = computed(() => new Date().getTimezoneOffset());

function onChangePage(page: number) {
  currentPage.value = page;
  store.dispatch('loadList', { page, ...store.state.appliedFilters })
}

function onOpenDeleteModal(id: string) {
  deleteId = id;
  isDeleteModalOpen.value = true;
}

async function onDelete() {
  isDeleteModalOpen.value = false;

  try {
    await store.dispatch('deleteList', deleteId);
    await store.dispatch('loadList', { page: 1 });
  } catch (e) {
    console.error(e);
  }

}

onMounted(() => {
  store.dispatch('loadList', { page: 1 })
});


</script>

<template>
  <div className="w-[1366px] py-8 mx-auto">
    <NH1>
      Construction List
    </NH1>
    <div class="mb-2 text-right">
      <NButton type="warning" size="large" @click="router.push({ name: 'form' })">Add Data</NButton>
    </div>
    <ListFilter />
    <div class="mt-4">
      <NSpace v-if="store.state.isLoading" justify="center" align="center" class="min-h-[650px]">
        <NSpin size="large" />
      </NSpace>

      <DataTable v-else :fields="FIELDS" :data="list" :current-page="currentPage" :total-page="store.state.totalData"
        @change-page="onChangePage" has-actions>
        <template #startDate="{ value }">
          {{ format(addMinutes(new Date(value), tzOffset), 'dd MMM yyyy') }}
        </template>

        <template #actions="{ value }">
          <div class="flex flex-col gap-2">
            <NButton @click="() => router.push({ name: 'form', query: { id: value } })">Edit</NButton>
            <NButton type="error" @click="() => onOpenDeleteModal(value)">Delete</NButton>
          </div>
        </template>

      </DataTable>
    </div>
  </div>

  <ModalConfirm cancel-label="Close" confirm-label="Confirm" modal-width="300px" title="Delete Data"
    :is-open="isDeleteModalOpen" @close="isDeleteModalOpen = false" @confirm="onDelete">
    Are you sure you want to delete this data?
  </ModalConfirm>
</template>
