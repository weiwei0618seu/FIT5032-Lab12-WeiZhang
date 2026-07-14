import { readonly, ref } from 'vue'

const AUTH_STORAGE_KEY = 'nomash-library-authenticated'

const authenticated = ref(localStorage.getItem(AUTH_STORAGE_KEY) === 'true')

export const isAuthenticated = readonly(authenticated)

export const login = (username, password) => {
  const credentialsAreValid = username === 'admin' && password === 'password123'

  if (credentialsAreValid) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true')
    authenticated.value = true
  }

  return credentialsAreValid
}

export const logout = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  authenticated.value = false
}
