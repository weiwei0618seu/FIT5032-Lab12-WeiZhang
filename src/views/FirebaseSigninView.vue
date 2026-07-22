<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const registrationSucceeded = computed(() => route.query.registered === 'true')
const registeredEmail = computed(() =>
  typeof route.query.email === 'string' ? route.query.email : '',
)
</script>

<template>
  <main class="container py-5">
    <section class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="bg-white border rounded shadow-sm p-4">
          <p class="text-primary fw-semibold mb-2">Firebase Authentication</p>
          <h1 class="mb-3">Sign In</h1>
          <div v-if="registrationSucceeded" class="alert alert-success" role="status">
            Firebase registration successful<span v-if="registeredEmail">
              for <strong>{{ registeredEmail }}</strong></span
            >. You can now sign in.
          </div>
          <p class="text-secondary mb-4">
            The Firebase sign-in form will be implemented after the registration workflow.
          </p>
          <RouterLink to="/FireRegister" class="btn btn-outline-primary">
            Create a Firebase Account
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
