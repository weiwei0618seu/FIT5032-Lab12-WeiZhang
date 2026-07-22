<script setup>
import { ref } from 'vue'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { firebaseAuth } from '../firebase'

const router = useRouter()
const isSigningOut = ref(false)
const errorMessage = ref('')

const handleFirebaseLogout = async () => {
  errorMessage.value = ''
  isSigningOut.value = true

  try {
    console.log('Firebase user before logout:', {
      uid: firebaseAuth.currentUser?.uid,
      email: firebaseAuth.currentUser?.email,
    })

    await signOut(firebaseAuth)

    console.log('Firebase logout successful.')
    console.log('Current Firebase user after logout:', firebaseAuth.currentUser)

    await router.push({
      name: 'FireLogin',
      query: { loggedOut: 'true' },
    })
  } catch (error) {
    console.error('Firebase logout failed:', error.code)
    errorMessage.value = `Unable to sign out (${error.code ?? 'unknown error'}).`
  } finally {
    isSigningOut.value = false
  }
}
</script>

<template>
  <div>
    <button
      type="button"
      class="btn btn-outline-danger"
      :disabled="isSigningOut"
      @click="handleFirebaseLogout"
    >
      <span
        v-if="isSigningOut"
        class="spinner-border spinner-border-sm me-2"
        aria-hidden="true"
      ></span>
      {{ isSigningOut ? 'Signing out...' : 'Log out of Firebase' }}
    </button>

    <p v-if="errorMessage" class="text-danger mt-2 mb-0" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>

