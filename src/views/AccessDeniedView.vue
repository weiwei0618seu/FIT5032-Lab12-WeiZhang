<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const invalidCredentials = computed(() => route.query.reason === 'invalid-credentials')
</script>

<template>
  <main class="container py-5">
    <section class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="bg-white border border-danger rounded shadow-sm p-4 p-md-5 text-center">
          <div class="display-5 text-danger mb-3" aria-hidden="true">&#9888;</div>
          <h1 class="text-danger mb-3">Access Denied</h1>
          <p v-if="invalidCredentials" class="lead">
            The username or password was incorrect. You are not authorised to access the members
            area.
          </p>
          <p v-else class="lead">You must be authenticated to access this page.</p>

          <div class="d-flex flex-wrap justify-content-center gap-2 mt-4">
            <RouterLink to="/login" class="btn btn-primary">Try Login Again</RouterLink>
            <RouterLink to="/" class="btn btn-outline-secondary">Return Home</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
