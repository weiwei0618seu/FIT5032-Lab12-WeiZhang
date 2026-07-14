<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from '../services/auth'

const router = useRouter()

const handleLogout = () => {
  logout()
  router.push({
    name: 'Login',
    query: { loggedOut: 'true' },
  })
}
</script>

<template>
  <header class="bg-white border-bottom shadow-sm">
    <nav class="container d-flex flex-wrap align-items-center justify-content-between gap-3 py-3">
      <RouterLink to="/" class="navbar-brand fw-semibold text-primary">
        NoMash Library
      </RouterLink>

      <ul class="nav nav-pills" aria-label="Primary navigation">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link" exact-active-class="active">
            Home (Week 5)
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/about" class="nav-link" active-class="active">About</RouterLink>
        </li>
        <li v-if="!isAuthenticated" class="nav-item">
          <RouterLink to="/login" class="nav-link" active-class="active">Login</RouterLink>
        </li>
        <li v-else class="nav-item ms-2">
          <button type="button" class="btn btn-outline-danger" @click="handleLogout">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>
