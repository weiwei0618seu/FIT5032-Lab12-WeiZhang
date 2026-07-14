<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loginSucceeded = computed(() => route.query.login === 'success')

const dismissLoginMessage = () => {
  router.replace({ name: 'About' })
}
</script>

<template>
  <main class="container py-5">
    <section class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-7">
        <div class="bg-white border rounded shadow-sm p-4 p-md-5">
          <div
            v-if="loginSucceeded"
            class="alert alert-success alert-dismissible fade show"
            role="status"
          >
            Login successful. You now have access to this protected page.
            <button
              type="button"
              class="btn-close"
              aria-label="Dismiss login message"
              @click="dismissLoginMessage"
            ></button>
          </div>

          <span class="badge text-bg-success mb-3">Protected members area</span>
          <h1 class="mb-3">About Our Library</h1>
          <p class="lead mb-3">
            Welcome to our digital library! We are dedicated to providing a vast collection of
            books and resources to our community.
          </p>
          <p class="mb-0">
            Use the navigation above to return to the Home page and complete the library
            registration form.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
