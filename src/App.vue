<script setup lang="ts">
import { RouterView } from 'vue-router'
import Snackbar from './components/SnackBar.vue';
</script>

<template>
  <Snackbar class="fixed w-[90%] left-1/2 -translate-x-1/2 top-4" />
  <RouterView />
</template>
