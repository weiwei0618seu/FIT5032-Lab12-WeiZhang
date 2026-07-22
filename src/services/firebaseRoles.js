export const FIREBASE_ROLES = Object.freeze({
  ADMINISTRATOR: 'administrator',
  STANDARD_USER: 'standard-user',
})

const administratorEmails = new Set(
  (import.meta.env.VITE_FIREBASE_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
)

// This client-side mapping is suitable for the Lab 7 role demonstration.
// Production authorisation must also be enforced by trusted server-side rules.
export const getFirebaseUserRole = (user) => {
  const email = user?.email?.trim().toLowerCase()

  if (email && administratorEmails.has(email)) {
    return FIREBASE_ROLES.ADMINISTRATOR
  }

  return FIREBASE_ROLES.STANDARD_USER
}

export const getFirebaseRoleLabel = (role) =>
  role === FIREBASE_ROLES.ADMINISTRATOR ? 'Administrator' : 'Standard User'

