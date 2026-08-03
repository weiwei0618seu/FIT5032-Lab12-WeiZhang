<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const defaultServiceUrl = 'https://book-dafunction-tgkjwdwopa.cn-hongkong.fcapp.run'
const serviceUrl = import.meta.env.VITE_BOOK_DATA_SERVICE_URL?.trim() || defaultServiceUrl

const books = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const hasLoaded = ref(false)

const endpointHost = computed(() => {
  try {
    return new URL(serviceUrl).host
  } catch {
    return serviceUrl
  }
})

const getAllBooks = async () => {
  isLoading.value = true
  errorMessage.value = ''
  hasLoaded.value = false
  books.value = []

  try {
    const response = await axios.post(serviceUrl, {
      packageType: 'premium',
    })

    if (!Array.isArray(response.data?.books)) {
      throw new Error('The library API response does not contain a books array.')
    }

    books.value = response.data.books
    hasLoaded.value = true
  } catch (error) {
    console.error('GetAllBookAPI request failed:', error)
    errorMessage.value =
      error.response?.data?.error ||
      error.message ||
      'The library API could not be reached. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(getAllBooks)
</script>

<template>
  <main class="container py-5">
    <section class="all-books-shell mx-auto">
      <div class="all-books-hero">
        <div>
          <p class="eyebrow mb-2">FIT5032 Assessed Lab 10 · Task 10.2</p>
          <h1 class="display-5 fw-bold mb-3">GetAllBookAPI</h1>
          <p class="lead text-secondary mb-0">
            Retrieve all available book records and display the API response as formatted JSON.
          </p>
        </div>
        <div class="api-badge">JSON API</div>
      </div>

      <section class="json-panel mt-4" aria-live="polite">
        <div class="request-summary">
          <span class="summary-label">API endpoint</span>
          <code class="endpoint">{{ endpointHost }}</code>
          <small>Premium package request · HTTP POST</small>
        </div>

        <div v-if="isLoading" class="status-message">
          <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          Loading all books...
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger mb-0" role="alert">
          <strong>API request failed.</strong>
          <span class="d-block">{{ errorMessage }}</span>
          <button type="button" class="btn btn-outline-danger mt-3" @click="getAllBooks">
            Try again
          </button>
        </div>

        <div v-else-if="hasLoaded" class="json-result">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <span class="summary-label">Returned records</span>
              <strong class="record-count">{{ books.length }} books</strong>
            </div>
            <span class="badge text-bg-success">Request successful</span>
          </div>
          <pre class="json-output"><code>{{ JSON.stringify(books, null, 2) }}</code></pre>
        </div>

        <div v-else class="status-message">Preparing the API request...</div>
      </section>

      <button
        type="button"
        class="btn btn-primary mt-3"
        :disabled="isLoading"
        @click="getAllBooks"
      >
        Refresh all books
      </button>
    </section>
  </main>
</template>

<style scoped>
.all-books-shell {
  max-width: 68rem;
}

.all-books-hero,
.json-panel {
  border: 1px solid #dce5ee;
  border-radius: 1.25rem;
  background: #ffffff;
  box-shadow: 0 1rem 2.5rem rgba(20, 45, 72, 0.08);
}

.all-books-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.5rem;
}

.eyebrow,
.summary-label {
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

.json-panel {
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

.request-summary small {
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

.record-count {
  display: block;
  margin-top: 0.25rem;
  color: #15324b;
  font-size: 1.4rem;
}

.json-output {
  max-height: 32rem;
  margin: 0;
  overflow: auto;
  padding: 1.25rem;
  border: 1px solid #d6e0ea;
  border-radius: 0.9rem;
  color: #dbeafe;
  background: #0f172a;
  font-size: 0.9rem;
  line-height: 1.55;
  text-align: left;
  white-space: pre-wrap;
}

@media (max-width: 767px) {
  .all-books-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 1.75rem;
  }

  .json-panel {
    padding: 1.5rem;
  }
}
</style>
