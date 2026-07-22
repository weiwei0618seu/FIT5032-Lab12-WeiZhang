<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LibraryRegistrationForm from '../components/Form.vue'

const route = useRoute()
const firebaseLoginSucceeded = computed(() => route.query.firebaseLogin === 'success')
</script>

<template>
  <div v-if="firebaseLoginSucceeded" class="container pt-4">
    <div class="alert alert-success mb-0" role="status">
      Firebase sign-in successful. The authenticated user is available in the browser console.
    </div>
  </div>
  <LibraryRegistrationForm />
</template>
