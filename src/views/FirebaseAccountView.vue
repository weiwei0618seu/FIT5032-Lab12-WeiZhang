<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from '../Firebase/init'
import FirebaseLogoutButton from '../components/FirebaseLogoutButton.vue'
import {
  FIREBASE_ROLES,
  getFirebaseRoleLabel,
  getFirebaseUserRole,
} from '../services/firebaseRoles'

const currentUser = ref(firebaseAuth.currentUser)
const isLoading = ref(!firebaseAuth.currentUser)
let stopObservingAuth = null

const currentRole = computed(() => getFirebaseUserRole(currentUser.value))
const currentRoleLabel = computed(() => getFirebaseRoleLabel(currentRole.value))
const isAdministrator = computed(
  () => currentRole.value === FIREBASE_ROLES.ADMINISTRATOR,
)

onMounted(() => {
  stopObservingAuth = onAuthStateChanged(firebaseAuth, (user) => {
    currentUser.value = user
    isLoading.value = false
  })
})

onUnmounted(() => {
  stopObservingAuth?.()
})
</script>

<template>
  <main class="container py-5">
    <section class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <div class="bg-white border rounded shadow-sm p-4 p-md-5">
          <p class="text-primary fw-semibold mb-2">Firebase Authentication</p>
          <h1 class="mb-4">Authenticated Account</h1>

          <div v-if="isLoading" class="text-center py-4" role="status">
            <div class="spinner-border text-primary" aria-hidden="true"></div>
            <p class="mt-3 mb-0">Checking the Firebase authentication state...</p>
          </div>

          <template v-else-if="currentUser">
            <div class="alert alert-success" role="status">
              Firebase sign-in successful. This account has been identified as
              <strong>{{ currentRoleLabel }}</strong>.
            </div>

            <dl class="row border rounded bg-light p-3 mb-4">
              <dt class="col-sm-3">Email</dt>
              <dd class="col-sm-9 text-break">{{ currentUser.email }}</dd>

              <dt class="col-sm-3">Firebase UID</dt>
              <dd class="col-sm-9 text-break">{{ currentUser.uid }}</dd>

              <dt class="col-sm-3 mb-0">System role</dt>
              <dd class="col-sm-9 mb-0">
                <span
                  class="badge fs-6"
                  :class="isAdministrator ? 'text-bg-danger' : 'text-bg-primary'"
                >
                  {{ currentRoleLabel }}
                </span>
              </dd>
            </dl>

            <section v-if="isAdministrator" class="border border-danger rounded p-4">
              <h2 class="h4 text-danger">Administrator Area</h2>
              <p class="mb-2">Administrator-only functionality is available for this account.</p>
              <ul class="mb-0">
                <li>Manage the library catalogue</li>
                <li>Review registered library members</li>
              </ul>
            </section>

            <section v-else class="border border-primary rounded p-4">
              <h2 class="h4 text-primary">Standard User Area</h2>
              <p class="mb-0">
                This account can access the standard NoMash Library user interface.
              </p>
            </section>

            <div class="border-top mt-4 pt-4 d-flex align-items-center justify-content-between gap-3">
              <p class="text-secondary mb-0">End the current Firebase authentication session.</p>
              <FirebaseLogoutButton />
            </div>
          </template>

          <div v-else class="alert alert-warning mb-0" role="alert">
            No Firebase user is currently signed in.
            <RouterLink to="/FireLogin" class="alert-link">Open Firebase Sign In</RouterLink>.
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
