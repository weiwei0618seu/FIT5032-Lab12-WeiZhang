<script setup>
import { computed, ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router'
import { firebaseAuth } from '../firebase'
import { getFirebaseRoleLabel, getFirebaseUserRole } from '../services/firebaseRoles'

const route = useRoute()
const router = useRouter()

const registrationSucceeded = computed(() => route.query.registered === 'true')
const registeredEmail = computed(() =>
  typeof route.query.email === 'string' ? route.query.email : '',
)

const email = ref(registeredEmail.value)
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const canSubmit = computed(
  () => email.value.trim() !== '' && password.value.length >= 6 && !isSubmitting.value,
)

const signInErrorMessage = (errorCode) => {
  const messages = {
    'auth/invalid-credential': 'The email address or password is incorrect.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/user-disabled': 'This Firebase account has been disabled.',
    'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
    'auth/network-request-failed': 'Unable to reach Firebase. Check your network connection.',
  }

  return messages[errorCode] ?? `Sign-in failed (${errorCode ?? 'unknown error'}).`
}

const handleSignIn = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await signInWithEmailAndPassword(firebaseAuth, email.value.trim(), password.value)

    const role = getFirebaseUserRole(firebaseAuth.currentUser)
    const roleLabel = getFirebaseRoleLabel(role)

    console.log('Firebase sign-in successful:', {
      uid: firebaseAuth.currentUser?.uid,
      email: firebaseAuth.currentUser?.email,
      role,
      roleLabel,
    })
    console.log('Current Firebase user:', firebaseAuth.currentUser)
    console.log('Authenticated Firebase role:', roleLabel)

    await router.push({
      name: 'FirebaseAccount',
    })
  } catch (error) {
    console.error('Firebase sign-in failed:', error.code)
    errorMessage.value = signInErrorMessage(error.code)
  } finally {
    isSubmitting.value = false
  }
}
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
            Sign in with the email address and password registered in Firebase Authentication.
          </p>

          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleSignIn">
            <div class="mb-3">
              <label for="firebase-signin-email" class="form-label">Email address</label>
              <input
                id="firebase-signin-email"
                v-model.trim="email"
                type="email"
                class="form-control"
                autocomplete="email"
                placeholder="name@example.com"
                required
              />
            </div>

            <div class="mb-4">
              <label for="firebase-signin-password" class="form-label">Password</label>
              <input
                id="firebase-signin-password"
                v-model="password"
                type="password"
                class="form-control"
                autocomplete="current-password"
                minlength="6"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="!canSubmit">
              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
              {{ isSubmitting ? 'Signing in...' : 'Sign in with Firebase' }}
            </button>
          </form>

          <p class="text-center mt-4 mb-0">
            Need an account?
            <RouterLink to="/FireRegister">Register with Firebase</RouterLink>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
