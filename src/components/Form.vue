<template>
  <main class="container mt-5">
    <section class="row">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto">
        <h1 class="text-center mb-4">User Information Form / Credentials</h1>

        <form class="bg-white border rounded shadow-sm p-4" @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="username" class="form-label">Username:</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.username }"
              id="username"
              name="username"
              v-model="formData.username"
              @blur="validateName(true)"
              @input="validateName(false)"
            />
            <div v-if="errors.username" class="text-danger mt-1" role="alert">
              {{ errors.username }}
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label for="password" class="form-label">Password:</label>
              <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                id="password"
                name="password"
                autocomplete="new-password"
                v-model="formData.password"
                @blur="validatePassword(true)"
                @input="validatePassword(false)"
              />
              <div v-if="errors.password" class="text-danger mt-1" role="alert">
                {{ errors.password }}
              </div>
            </div>

            <div class="col-md-6">
              <label for="confirm-password" class="form-label">Confirm password:</label>
              <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors.confirmPassword }"
                id="confirm-password"
                name="confirm-password"
                autocomplete="new-password"
                v-model="formData.confirmPassword"
                @blur="validateConfirmPassword(true)"
              />
              <div v-if="errors.confirmPassword" class="text-danger mt-1" role="alert">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <div class="mb-3">
            <fieldset>
              <legend class="col-form-label pt-0">Australian Resident?</legend>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  :class="{ 'is-invalid': errors.resident }"
                  type="radio"
                  id="residentYes"
                  name="resident"
                  value="Yes"
                  v-model="formData.resident"
                  @change="validateResident(true)"
                />
                <label class="form-check-label" for="residentYes">Yes</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  :class="{ 'is-invalid': errors.resident }"
                  type="radio"
                  id="residentNo"
                  name="resident"
                  value="No"
                  v-model="formData.resident"
                  @change="validateResident(true)"
                />
                <label class="form-check-label" for="residentNo">No</label>
              </div>
              <div v-if="errors.resident" class="text-danger mt-1" role="alert">
                {{ errors.resident }}
              </div>
            </fieldset>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">Reason For Joining:</label>
            <textarea
              class="form-control"
              :class="{ 'is-invalid': errors.reason }"
              id="reason"
              name="reason"
              rows="3"
              v-model="formData.reason"
              @blur="validateReason(true)"
              @input="validateReason(false)"
            ></textarea>
            <div v-if="errors.reason" class="text-danger mt-1" role="alert">
              {{ errors.reason }}
            </div>
            <div v-if="reasonMessage" class="text-success mt-1" role="status">
              {{ reasonMessage }}
            </div>
          </div>

          <div class="mb-4">
            <label for="gender" class="form-label">Gender</label>
            <select
              class="form-select"
              :class="{ 'is-invalid': errors.gender }"
              id="gender"
              v-model="formData.gender"
              @change="validateGender(true)"
            >
              <option disabled value="">Please select one option</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            <div v-if="errors.gender" class="text-danger mt-1" role="alert">
              {{ errors.gender }}
            </div>
          </div>

          <button type="submit" class="btn btn-primary me-2">Submit</button>
          <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
        </form>
      </div>
    </section>

    <section class="row mt-5" v-if="submittedUsers.length">
      <div class="col-12">
        <h2 class="text-center mb-3">Submitted User Information</h2>
        <DataTable
          :value="submittedUsers"
          stripedRows
          showGridlines
          responsiveLayout="scroll"
          tableStyle="min-width: 50rem"
        >
          <Column field="username" header="Username" sortable />
          <Column field="password" header="Password" />
          <Column field="resident" header="Australian Resident" sortable />
          <Column field="gender" header="Gender" sortable />
          <Column field="reason" header="Reason for Joining" />
        </DataTable>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineOptions({
  name: 'LibraryRegistrationForm',
})

const initialFormData = {
  username: '',
  password: '',
  confirmPassword: '',
  resident: '',
  reason: '',
  gender: '',
}

const formData = ref({ ...initialFormData })
const submittedUsers = ref([])
const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null,
})

const validateName = (blur) => {
  if (formData.value.username.trim().length < 3) {
    if (blur) errors.value.username = 'Username must be at least 3 characters.'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const isValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!isValid) {
    if (blur) {
      errors.value.password =
        'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.'
    }
  } else {
    errors.value.password = null
  }
}

/**
 * Show a mismatch error after the user leaves the confirmation field.
 * Waiting for blur avoids displaying an error while the user is still typing.
 */
const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateResident = (blur) => {
  if (!formData.value.resident) {
    if (blur) errors.value.resident = 'Please select your Australian resident status.'
  } else {
    errors.value.resident = null
  }
}

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Please select a gender.'
  } else {
    errors.value.gender = null
  }
}

const validateReason = (blur) => {
  const reasonLength = formData.value.reason.trim().length

  if (reasonLength < 10 || reasonLength > 200) {
    if (blur) errors.value.reason = 'Reason must be between 10 and 200 characters.'
  } else {
    errors.value.reason = null
  }
}

const reasonMessage = computed(() =>
  formData.value.reason.toLowerCase().includes('friend') ? 'Great to have a friend' : '',
)

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateResident(true)
  validateGender(true)
  validateReason(true)

  if (Object.values(errors.value).some((error) => error)) return

  submittedUsers.value.push({
    ...formData.value,
  })
}

const clearForm = () => {
  formData.value = { ...initialFormData }
  errors.value = {
    username: null,
    password: null,
    confirmPassword: null,
    resident: null,
    gender: null,
    reason: null,
  }
}
</script>
