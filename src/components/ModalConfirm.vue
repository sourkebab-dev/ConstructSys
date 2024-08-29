<script setup lang="ts">
import { NButton, NCard, NH3, NModal, NSpace } from 'naive-ui';

const props = defineProps<{
  title: string;
  isOpen: boolean;
  modalWidth: string;
  confirmLabel: string;
  cancelLabel: string;
}>();

const emit = defineEmits<{
  (name: 'close'): void;
  (name: 'confirm'): void;
}>();


</script>

<template>
  <NModal :show="isOpen">
    <NCard :style="{ width: modalWidth }" :title="props.title" :bordered="false" size="huge" role="dialog"
      aria-modal="true">
      <slot></slot>

      <NSpace class="mt-4" justify="space-evenly">
        <NButton @click="emit('close')">{{ cancelLabel }}</NButton>
        <NButton type="info" @click="emit('confirm')">{{ confirmLabel }}</NButton>
      </NSpace>
    </NCard>
  </NModal>
</template>