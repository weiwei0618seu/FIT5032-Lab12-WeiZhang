<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import authors from '../assets/json/authors.json'

const defaultServiceUrl = 'https://book-dafunction-tgkjwdwopa.cn-hongkong.fcapp.run'
const serviceUrl = import.meta.env.VITE_BOOK_DATA_SERVICE_URL?.trim() || defaultServiceUrl

const authorsCount = computed(() => authors.length)
const totalBooks = ref(null)
const apiResponse = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const endpointHost = computed(() => {
  try {
    return new URL(serviceUrl).host
  } catch {
    return serviceUrl
  }
})

const getApiData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  apiResponse.value = null
  totalBooks.value = null

  try {
    const response = await axios.post(serviceUrl, {
      packageType: 'premium',
    })

    const data = response.data
    if (!Array.isArray(data?.books)) {
      throw new Error('The library API response does not contain a books array.')
    }

    apiResponse.value = data
    totalBooks.value = Number.isInteger(data.availableBookCount)
      ? data.availableBookCount
      : data.books.length
  } catch (error) {
    console.error('Library API request failed:', error)
    errorMessage.value =
      error.response?.data?.error ||
      error.message ||
      'The library API could not be reached. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(getApiData)
</script>

<template>
  <main class="container py-5">
    <section class="count-shell mx-auto">
      <div class="count-hero">
        <div>
          <p class="eyebrow mb-2">FIT5032 Assessed Lab 10 · Task 10.1</p>
          <h1 class="display-5 fw-bold mb-3">Count Book API</h1>
          <p class="lead text-secondary mb-0">
            Retrieve library data from the API and calculate the number of authors and books.
          </p>
        </div>
        <div class="api-badge">Cloud API</div>
      </div>

      <section class="request-panel mt-4" aria-live="polite">
        <div class="request-summary">
          <span class="summary-label">API endpoint</span>
          <code class="endpoint">{{ endpointHost }}</code>
          <small>Premium package request · HTTP POST</small>
        </div>

        <div v-if="isLoading" class="status-message">
          <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          Loading authors and books from the library API...
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger mb-0" role="alert">
          <strong>API request failed.</strong>
          <span class="d-block">{{ errorMessage }}</span>
          <button type="button" class="btn btn-outline-danger mt-3" @click="getApiData">
            Try again
          </button>
        </div>

        <div v-else-if="apiResponse" class="result-grid">
          <article class="metric-card">
            <span class="metric-label">Total authors</span>
            <strong>{{ authorsCount }}</strong>
            <small>Loaded from authors.json</small>
          </article>
          <article class="metric-card">
            <span class="metric-label">Total books</span>
            <strong>{{ totalBooks }}</strong>
            <small>Returned by the library API</small>
          </article>
        </div>

        <div v-else class="status-message">Preparing the API request...</div>
      </section>

      <button
        type="button"
        class="btn btn-primary mt-3"
        :disabled="isLoading"
        @click="getApiData"
      >
        Refresh API data
      </button>
    </section>
  </main>
</template>

<style scoped>
.count-shell {
  max-width: 68rem;
}

.count-hero,
.request-panel {
  border: 1px solid #dce5ee;
  border-radius: 1.25rem;
  background: #ffffff;
  box-shadow: 0 1rem 2.5rem rgba(20, 45, 72, 0.08);
}

.count-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.5rem;
}

.eyebrow,
.summary-label,
.metric-label {
  color: #1769aa;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.api-badge {
  flex: 0 0 auto;
  padding: 0.7rem 1rem;
  border: 1px solid #b7dfc7;
  border-radius: 999px;
  background: #eefaf2;
  color: #176b3a;
  font-weight: 700;
}

.request-panel {
  padding: 2rem;
}

.request-summary {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 0.9rem;
  background: #f8fafc;
}

.endpoint {
  overflow-wrap: anywhere;
  color: #334155;
}

.request-summary small,
.metric-card small {
  color: #657789;
}

.status-message {
  display: flex;
  min-height: 9rem;
  align-items: center;
  justify-content: center;
  border: 1px dashed #b8c8d8;
  border-radius: 1rem;
  background: #f8fafc;
  color: #566b7d;
  text-align: center;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.metric-card {
  display: flex;
  min-height: 10rem;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem;
  border: 1px solid #b9d8ef;
  border-radius: 1rem;
  background: linear-gradient(135deg, #eef7ff, #ffffff);
}

.metric-card strong {
  margin: 0.35rem 0;
  color: #15324b;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  line-height: 1;
}

@media (max-width: 767px) {
  .count-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 1.75rem;
  }

  .request-panel {
    padding: 1.5rem;
  }

  .result-grid {
    grid-template-columns: 1fr;
  }
}
</style>
