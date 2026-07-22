<script setup>
import { computed, ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { firebaseAuth } from '../Firebase/init'

const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const canSubmit = computed(
  () =>
    email.value.trim() !== '' &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value &&
    !isSubmitting.value,
)

const registrationErrorMessage = (errorCode) => {
  const messages = {
    'auth/email-already-in-use': 'An account already exists for this email address.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password registration is not enabled in Firebase.',
    'auth/weak-password': 'Use a password containing at least six characters.',
    'auth/network-request-failed': 'Unable to reach Firebase. Check your network connection.',
  }

  return messages[errorCode] ?? `Registration failed (${errorCode ?? 'unknown error'}).`
}

const handleRegister = async () => {
  errorMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'The passwords do not match.'
    return
  }

  isSubmitting.value = true

  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email.value.trim(),
      password.value,
    )

    const registeredUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
    }

    console.log('Firebase registration successful:', registeredUser)

    await router.push({
      name: 'FireLogin',
      query: {
        registered: 'true',
        email: registeredUser.email,
      },
    })
  } catch (error) {
    console.error('Firebase registration failed:', error.code)
    errorMessage.value = registrationErrorMessage(error.code)
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
          <h1 class="mb-3">Create an Account</h1>
          <p class="text-secondary mb-4">
            Register with an email address and password to access the NoMash Library.
          </p>

          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label for="firebase-register-email" class="form-label">Email address</label>
              <input
                id="firebase-register-email"
                v-model.trim="email"
                type="email"
                class="form-control"
                autocomplete="email"
                placeholder="name@example.com"
                required
              />
            </div>

            <div class="mb-3">
              <label for="firebase-register-password" class="form-label">Password</label>
              <input
                id="firebase-register-password"
                v-model="password"
                type="password"
                class="form-control"
                autocomplete="new-password"
                minlength="6"
                aria-describedby="firebase-password-help"
                required
              />
              <div id="firebase-password-help" class="form-text">
                Use at least six characters.
              </div>
            </div>

            <div class="mb-4">
              <label for="firebase-register-confirm-password" class="form-label">
                Confirm password
              </label>
              <input
                id="firebase-register-confirm-password"
                v-model="confirmPassword"
                type="password"
                class="form-control"
                autocomplete="new-password"
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
              {{ isSubmitting ? 'Creating account...' : 'Register with Firebase' }}
            </button>
          </form>

          <p class="text-center mt-4 mb-0">
            Already registered?
            <RouterLink to="/FireLogin">Sign in</RouterLink>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
