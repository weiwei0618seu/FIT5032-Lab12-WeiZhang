<script setup>
import { computed, ref } from 'vue'

const dataPackages = [
  {
    type: 'basic',
    name: 'Basic',
    price: 5,
    limit: 'Up to 3 records',
    description: 'ISBN and book name',
  },
  {
    type: 'standard',
    name: 'Standard',
    price: 12,
    limit: 'Up to 10 records',
    description: 'ISBN and book name',
    recommended: true,
  },
  {
    type: 'premium',
    name: 'Premium',
    price: 20,
    limit: 'All available records',
    description: 'Complete book dataset and summary',
  },
]

const defaultServiceUrl = 'https://book-dafunction-tgkjwdwopa.cn-hongkong.fcapp.run'
const serviceUrl = import.meta.env.VITE_BOOK_DATA_SERVICE_URL?.trim() || defaultServiceUrl
const selectedPackage = ref('standard')
const isLoading = ref(false)
const errorMessage = ref('')
const dataOrder = ref(null)

const selectedPackageDetails = computed(() =>
  dataPackages.find((dataPackage) => dataPackage.type === selectedPackage.value),
)

const serviceHost = computed(() => {
  if (!serviceUrl) return 'Not configured'

  try {
    return new URL(serviceUrl).host
  } catch {
    return serviceUrl
  }
})

const formattedGeneratedAt = computed(() => {
  const generatedAt = dataOrder.value?.summary?.generatedAt
  if (!generatedAt) return ''

  const date = new Date(generatedAt)
  return Number.isNaN(date.getTime()) ? generatedAt : date.toLocaleString()
})

const formatFieldName = (fieldName) =>
  fieldName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const additionalFields = (book) =>
  Object.entries(book).filter(([fieldName]) => !['id', 'isbn', 'name'].includes(fieldName))

const selectPackage = (packageType) => {
  selectedPackage.value = packageType
  errorMessage.value = ''
  dataOrder.value = null
}

const generateDataPackage = async () => {
  errorMessage.value = ''
  dataOrder.value = null

  if (!serviceUrl) {
    errorMessage.value =
      'The data service URL is not configured. Add VITE_BOOK_DATA_SERVICE_URL to .env.local and restart Vite.'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        packageType: selectedPackage.value,
      }),
    })

    let responseBody
    try {
      responseBody = await response.json()
    } catch {
      throw new Error(`The cloud function returned an invalid response (HTTP ${response.status}).`)
    }

    if (!response.ok) {
      throw new Error(responseBody?.error || `The request failed with HTTP ${response.status}.`)
    }

    if (!Array.isArray(responseBody?.books)) {
      throw new Error('The cloud function response does not contain a valid books array.')
    }

    dataOrder.value = responseBody
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'The data package could not be generated.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="data-marketplace py-5">
    <div class="container">
      <section class="marketplace-hero mb-4 p-4 p-lg-5 text-white shadow-sm">
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <p class="eyebrow mb-2">NOMASH LIBRARY · DIGITAL DATA MARKETPLACE</p>
            <h1 class="display-6 fw-bold mb-3">Book Data Service</h1>
            <p class="lead mb-0">
              Choose a data package and generate a live dataset from the Cloud Firestore
              <code class="text-white">books</code> collection.
            </p>
          </div>
          <div class="col-lg-4">
            <div class="service-status p-3">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span
                  class="status-dot"
                  :class="{ 'status-dot-online': serviceUrl }"
                  aria-hidden="true"
                ></span>
                <span class="fw-semibold">
                  {{ serviceUrl ? 'Cloud service configured' : 'Cloud service setup required' }}
                </span>
              </div>
              <small class="d-block text-break opacity-75">{{ serviceHost }}</small>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="package-heading">
        <div class="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
          <div>
            <p class="section-kicker mb-1">STEP 1</p>
            <h2 id="package-heading" class="h3 mb-0">Select a data package</h2>
          </div>
          <p class="text-secondary mb-0">Demonstration pricing — no payment is processed.</p>
        </div>

        <div class="row g-4">
          <div v-for="dataPackage in dataPackages" :key="dataPackage.type" class="col-md-4">
            <button
              type="button"
              class="package-card card h-100 w-100 text-start shadow-sm"
              :class="{ selected: selectedPackage === dataPackage.type }"
              :aria-pressed="selectedPackage === dataPackage.type"
              @click="selectPackage(dataPackage.type)"
            >
              <span v-if="dataPackage.recommended" class="recommended-badge">POPULAR</span>
              <span class="card-body d-flex flex-column p-4">
                <span class="d-flex justify-content-between align-items-start gap-2">
                  <span class="h4 fw-bold mb-0">{{ dataPackage.name }}</span>
                  <span class="selection-indicator" aria-hidden="true">
                    {{ selectedPackage === dataPackage.type ? '✓' : '' }}
                  </span>
                </span>
                <span class="package-price my-3">
                  <span class="currency">CNY</span>
                  <span class="amount">{{ dataPackage.price }}</span>
                  <span class="text-secondary">/ package</span>
                </span>
                <span class="fw-semibold mb-2">{{ dataPackage.limit }}</span>
                <span class="text-secondary">{{ dataPackage.description }}</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <section class="order-panel card border-0 shadow-sm mt-4" aria-labelledby="order-heading">
        <div class="card-body p-4">
          <div class="row align-items-center g-3">
            <div class="col-lg">
              <p class="section-kicker mb-1">STEP 2</p>
              <h2 id="order-heading" class="h4 mb-1">
                Generate the {{ selectedPackageDetails.name }} package
              </h2>
              <p class="text-secondary mb-0">
                A secure POST request will ask the cloud function to query Firestore.
              </p>
            </div>
            <div class="col-lg-auto">
              <button
                type="button"
                class="btn btn-primary btn-lg px-4"
                :disabled="isLoading"
                @click="generateDataPackage"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
                {{ isLoading ? 'Generating…' : `Generate for CNY ${selectedPackageDetails.price}` }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div v-if="errorMessage" class="alert alert-danger mt-4 mb-0" role="alert">
        <h2 class="h6 alert-heading">The data package was not generated</h2>
        <p class="mb-0">{{ errorMessage }}</p>
      </div>

      <section
        v-if="dataOrder"
        class="result-panel card border-0 shadow-sm mt-4 overflow-hidden"
        aria-labelledby="result-heading"
      >
        <div class="result-heading p-4 text-white">
          <div class="row align-items-center g-3">
            <div class="col">
              <p class="eyebrow mb-1">DATA ORDER COMPLETE</p>
              <h2 id="result-heading" class="h3 mb-1">
                {{ dataOrder.packageName }} package generated
              </h2>
              <p class="mb-0 opacity-75">{{ dataOrder.summary?.message }}</p>
            </div>
            <div class="col-auto">
              <span class="success-check" aria-hidden="true">✓</span>
            </div>
          </div>
        </div>

        <div class="card-body p-4">
          <div class="row g-3 mb-4">
            <div class="col-6 col-lg-3">
              <div class="metric h-100 p-3">
                <small>PACKAGE</small>
                <strong>{{ dataOrder.packageName }}</strong>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="metric h-100 p-3">
                <small>DELIVERED</small>
                <strong>{{ dataOrder.bookCount }} books</strong>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="metric h-100 p-3">
                <small>CATALOGUE SIZE</small>
                <strong>{{ dataOrder.availableBookCount }} books</strong>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="metric h-100 p-3">
                <small>PRICE</small>
                <strong>{{ dataOrder.currency }} {{ dataOrder.price }}</strong>
              </div>
            </div>
          </div>

          <div class="d-flex flex-wrap justify-content-between gap-2 mb-3">
            <div>
              <h3 class="h5 mb-1">Delivered book records</h3>
              <p class="text-secondary mb-0">{{ dataOrder.includedData }}</p>
            </div>
            <small class="text-secondary align-self-end">
              Generated {{ formattedGeneratedAt }}
            </small>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ISBN</th>
                  <th scope="col">Book name</th>
                  <th scope="col">Additional data</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(book, index) in dataOrder.books" :key="book.id || index">
                  <td class="text-secondary">{{ index + 1 }}</td>
                  <td><code>{{ formatValue(book.isbn) }}</code></td>
                  <td class="fw-semibold">{{ formatValue(book.name) }}</td>
                  <td>
                    <span v-if="additionalFields(book).length === 0" class="text-secondary">—</span>
                    <span v-else class="d-flex flex-wrap gap-1">
                      <span
                        v-for="[fieldName, value] in additionalFields(book)"
                        :key="fieldName"
                        class="data-chip"
                      >
                        {{ formatFieldName(fieldName) }}: {{ formatValue(value) }}
                      </span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.data-marketplace {
  min-height: calc(100vh - 80px);
  background:
    radial-gradient(circle at 85% 10%, rgba(13, 110, 253, 0.12), transparent 26rem),
    #f4f7fb;
}

.marketplace-hero {
  border-radius: 1.25rem;
  background:
    linear-gradient(120deg, rgba(5, 18, 45, 0.96), rgba(24, 77, 145, 0.93)),
    #071b38;
}

.eyebrow,
.section-kicker {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.section-kicker {
  color: #0d6efd;
}

.service-status {
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.08);
}

.status-dot {
  width: 0.65rem;
  height: 0.65rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #ffc107;
  box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.16);
}

.status-dot-online {
  background: #45dd8d;
  box-shadow: 0 0 0 0.25rem rgba(69, 221, 141, 0.16);
}

.package-card {
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 1rem;
  color: inherit;
  background: #fff;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.package-card:hover {
  transform: translateY(-3px);
  border-color: rgba(13, 110, 253, 0.3);
}

.package-card.selected {
  border-color: #0d6efd;
  box-shadow: 0 0.75rem 1.75rem rgba(13, 110, 253, 0.16) !important;
}

.recommended-badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.35rem 0.8rem;
  border-bottom-left-radius: 0.75rem;
  color: #fff;
  background: #0d6efd;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.selection-indicator {
  width: 1.7rem;
  height: 1.7rem;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  color: #fff;
  background: #fff;
  text-align: center;
  line-height: 1.45rem;
}

.selected .selection-indicator {
  border-color: #0d6efd;
  background: #0d6efd;
}

.package-price {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.package-price .currency {
  color: #0d6efd;
  font-size: 0.8rem;
  font-weight: 800;
}

.package-price .amount {
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1;
}

.order-panel,
.result-panel {
  border-radius: 1rem;
}

.result-heading {
  background: linear-gradient(120deg, #087443, #0b9560);
}

.success-check {
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  border-radius: 50%;
  color: #087443;
  background: #fff;
  font-size: 1.5rem;
  font-weight: 900;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.8rem;
  background: #f8fafc;
}

.metric small {
  color: #64748b;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.metric strong {
  font-size: 1.05rem;
}

.data-chip {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  color: #334155;
  background: #e9eef5;
  font-size: 0.75rem;
}
</style>
