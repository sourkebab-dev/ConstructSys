<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { NH1, NButton, NInput, NDatePicker, NSelect, NForm, NFormItem, NAutoComplete } from 'naive-ui';
import { key, type ProjectStage } from '@/store/list';
import { key as notifKey } from '@/store/notification';
import { MOCK_LIST, PROJECT_CATEGORY } from '@/constants';
import useValidation from '@/composables/useValidation';
import { generateRandString } from '@/utils/crypto';
import { addMinutes, startOfDay } from 'date-fns';
import { useRoute, useRouter } from 'vue-router';

interface Form {
  projectId: string;
  projectName: string;
  projectLocation: string;
  projectStage: ProjectStage | '';
  projectCategory: string;
  startDate: number | null;
  description: string;
  creatorId: string;
}

const store = useStore(key);
const notifyStore = useStore(notifKey);
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);

const formData = ref<Form>({
  projectId: generateRandString(6),
  projectName: '',
  projectLocation: '',
  projectStage: '',
  projectCategory: '',
  startDate: null,
  description: '',
  creatorId: ''
});

const isRequired = (value: any) => !value ? 'Data must be filled' : '';

const { validations } = useValidation<Form>({
  formData,
  rules: {
    projectName: [isRequired],
    projectLocation: [isRequired],
    projectStage: [isRequired],
    projectCategory: [isRequired],
    startDate: [isRequired, (value) => formData.value.projectStage !== 'CONSTRUCTION' && Number(startOfDay(new Date(value))) <= Number(startOfDay(new Date())) ? 'On status other than construction, date must be after todays date' : ''],
    description: [isRequired],
    creatorId: [isRequired],
  }
});

async function onSubmit() {
  validations.value.formState.trigger();
  if (validations.value.formState.errorMessage) return;

  isLoading.value = true;

  try {
    if (route.query.id) {
      await store.dispatch('updateList', { id: route.query.id, data: formData.value });
    } else {
      await store.dispatch('addList', formData.value);
    }
    notifyStore.dispatch('showSuccess', 'Successfully added a new project');
    router.push({ name: 'home' })
  } catch (e) {
    console.error(e);
  }

  isLoading.value = false;
}

onMounted(() => {
  if (route.query.id) {
    const data = MOCK_LIST.find((val) => val.projectId === route.query.id);
    if (data) {
      formData.value = {
        projectId: data.projectId,
        projectName: data.projectName,
        projectLocation: data.projectLocation,
        projectStage: data.projectStage,
        projectCategory: data.projectCategory,
        startDate: Number(addMinutes(new Date(data.startDate), new Date().getTimezoneOffset())),
        description: data.description,
        creatorId: data.creatorId
      };
    }
  }
});

</script>

<template>
  <div class="w-[768px] mx-auto">
    <NH1>
      Construction Project Form
    </NH1>
    <NForm>
      <NFormItem label="Project ID">
        <NInput placeholder="Project ID" v-model:value="formData.projectId" disabled />
      </NFormItem>

      <NFormItem label="Project Name">
        <NInput v-error-notify="validations.projectName?.errorMessage" placeholder="Project Name"
          v-model:value="formData.projectName" maxlength="200"
          :status="validations.projectName?.errorMessage ? 'error' : undefined"
          @blur="validations.projectName?.trigger()" />
      </NFormItem>

      <NFormItem label="Project Location">
        <NInput v-error-notify="validations.projectLocation?.errorMessage" placeholder="Project Location"
          v-model:value="formData.projectLocation" maxlength="500"
          :status="validations.projectLocation?.errorMessage ? 'error' : undefined"
          @blur="validations.projectLocation?.trigger()" />
      </NFormItem>

      <NFormItem label="Project Category">
        <NAutoComplete v-error-notify="validations.projectCategory?.errorMessage" placeholder="Project Category"
          v-model:value="formData.projectCategory"
          :status="validations.projectCategory?.errorMessage ? 'error' : undefined"
          @blur="validations.projectCategory?.trigger()" />
      </NFormItem>

      <NFormItem label="Project Stage">
        <NSelect v-error-notify="validations.projectStage?.errorMessage" v-model:value="formData.projectStage"
          :options="PROJECT_CATEGORY" :status="validations.projectStage?.errorMessage ? 'error' : undefined"
          @blur="validations.projectStage?.trigger()" />
      </NFormItem>

      <NFormItem label="Project Construction Start Date">
        <NDatePicker v-error-notify="validations.startDate?.errorMessage" class="w-full"
          v-model:value="formData.startDate" placeholder="Project Construction Start Date"
          :status="validations.startDate?.errorMessage ? 'error' : undefined"
          @blur="validations.startDate?.trigger()" />
      </NFormItem>

      <NFormItem label="Project Details/Description">
        <NInput v-error-notify="validations.description?.errorMessage" v-model:value="formData.description"
          type="textarea" placeholder="Project Details/Description" maxlength="2000"
          :status="validations.description?.errorMessage ? 'error' : undefined"
          @blur="validations.description?.trigger()" />
      </NFormItem>

      <NFormItem label="Project Creator ID">
        <NInput v-error-notify="validations.creatorId?.errorMessage" placeholder="Project Creator ID"
          v-model:value="formData.creatorId" :status="validations.creatorId?.errorMessage ? 'error' : undefined"
          @blur="validations.creatorId?.trigger()" />
      </NFormItem>

      <NButton type="success" @click="onSubmit" :loading="isLoading">Submit</NButton>
    </NForm>

  </div>
</template>
