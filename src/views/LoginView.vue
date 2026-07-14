<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../services/auth'

const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')

const authenticationRequired = computed(() => route.query.redirect === '/about')
const loggedOut = computed(() => route.query.loggedOut === 'true')

const handleLogin = () => {
  if (!login(username.value, password.value)) {
    router.push({
      name: 'AccessDenied',
      query: { reason: 'invalid-credentials' },
    })
    return
  }

  const destination = authenticationRequired.value ? route.query.redirect : '/about'
  router.push({
    path: destination,
    query: { login: 'success' },
  })
}
</script>

<template>
  <main class="container py-5">
    <section class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-7 col-lg-5">
        <div class="bg-white border rounded shadow-sm p-4">
          <h1 class="text-center mb-3">Member Login</h1>

          <div v-if="authenticationRequired" class="alert alert-warning" role="alert">
            Authentication is required to access the About page. Please log in to continue.
          </div>
          <div v-else-if="loggedOut" class="alert alert-success" role="status">
            You have logged out successfully. Protected pages are no longer available.
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="login-username" class="form-label">Username</label>
              <input
                id="login-username"
                v-model.trim="username"
                type="text"
                class="form-control"
                autocomplete="username"
                required
              />
            </div>

            <div class="mb-3">
              <label for="login-password" class="form-label">Password</label>
              <input
                id="login-password"
                v-model="password"
                type="password"
                class="form-control"
                autocomplete="current-password"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary w-100">Log in</button>
          </form>

          <div class="alert alert-secondary mt-4 mb-0 small" role="note">
            <strong>Lab demonstration credentials:</strong><br />
            Username: <code>admin</code><br />
            Password: <code>password123</code>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
