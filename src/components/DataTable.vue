<script setup lang="ts" generic="T extends {dataTableId: string}">
import { NTable, NPagination } from 'naive-ui';

type Fields = Array<{ fieldName: string; fieldKey: keyof T }>

const props = defineProps<{
  fields: Fields;
  data: T[];
  totalPage: number;
  currentPage: number;
  hasActions?: boolean;
}>();

const emit = defineEmits<{
  (name: 'change-page', payload: number): void;
}>();

</script>

<template>
  <div class="flex flex-col gap-4">
    <NTable striped>
      <thead>
        <tr>
          <th v-for="field in props.fields" :key="field.fieldKey">
            {{ field.fieldName }}
          </th>

          <th v-if="hasActions">Actions</th>
        </tr>
      </thead>
      <tbody v-if="data.length">
        <tr v-for="data in props.data" :key="data.dataTableId">
          <td v-for="field in props.fields" :key="field.fieldKey">
            <slot :name="field.fieldKey" :value="data[field.fieldKey]">
              {{ data[field.fieldKey] }}
            </slot>
          </td>
          <td v-if="props.hasActions">
            <slot name="actions" :value="data.dataTableId"></slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="fields.length">
            No Data
          </td>
        </tr>
      </tbody>
    </NTable>
    <NPagination :page="currentPage" :page-count="totalPage" @update:page="(page) => emit('change-page', page)" />
  </div>

</template>