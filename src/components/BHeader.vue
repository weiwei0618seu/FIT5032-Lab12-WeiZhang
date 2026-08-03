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
        <li class="nav-item">
          <RouterLink to="/add-book" class="nav-link" active-class="active">Add Book</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/get-book-count" class="nav-link" active-class="active">
            Book Counter
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/book-data-service" class="nav-link" active-class="active">
            Data Packages
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/WeatherCheck" class="nav-link" active-class="active">
            Get Weather
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/CountBookAPI" class="nav-link" active-class="active">
            Count Book API
          </RouterLink>
        </li>
        <li v-if="!isAuthenticated" class="nav-item">
          <RouterLink to="/login" class="nav-link" active-class="active">Week 5 Login</RouterLink>
        </li>
        <li v-else class="nav-item ms-2">
          <button type="button" class="btn btn-outline-danger" @click="handleLogout">
            Logout
          </button>
        </li>
        <li class="nav-item">
          <RouterLink to="/FireRegister" class="nav-link" active-class="active">
            Firebase Register
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/FireLogin" class="nav-link" active-class="active">
            Firebase Sign In
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/FirebaseAccount" class="nav-link" active-class="active">
            Firebase Account
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
