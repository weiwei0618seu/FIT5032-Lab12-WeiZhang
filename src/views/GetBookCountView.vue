<script setup>
import { computed, ref } from 'vue'
import bookData from '../assets/json/books.json'

const BOOK_COUNT_FUNCTION_URL =
  'https://book-cofunction-cdfmfbrftp.cn-hangzhou.fcapp.run'

const count = ref(null)
const errorMessage = ref('')
const responseMessage = ref('')
const isLoading = ref(false)

const localBookCount = computed(() => bookData.books.length)
const endpointHost = new URL(BOOK_COUNT_FUNCTION_URL).host

const getBookCount = async () => {
  isLoading.value = true
  count.value = null
  errorMessage.value = ''
  responseMessage.value = ''

  try {
    const response = await fetch(BOOK_COUNT_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || `Cloud function returned HTTP ${response.status}.`)
    }

    if (!Number.isInteger(result.count) || result.count < 0) {
      throw new Error('Cloud function returned an invalid book count.')
    }

    count.value = result.count
    responseMessage.value = result.message || 'Book count calculated successfully.'
  } catch (error) {
    console.error('Book count request failed:', error)
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'The cloud function could not be reached. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="container py-5">
    <section class="book-counter-shell mx-auto">
      <div class="book-counter-hero">
        <div>
          <p class="eyebrow mb-2">FIT5032 Assessed Lab 9 · Task 9.1</p>
          <h1 class="display-5 fw-bold mb-3">Book Counter</h1>
          <p class="lead text-secondary mb-0">
            Send local JSON book data to an Alibaba Cloud Function and display the
            calculated total.
          </p>
        </div>
        <div class="cloud-badge" aria-label="Cloud function status">
          <span class="status-dot" aria-hidden="true"></span>
          Alibaba Cloud Function
        </div>
      </div>

      <div class="row g-3 my-4" aria-label="Request summary">
        <div class="col-md-4">
          <article class="summary-card h-100">
            <span class="summary-label">JSON records</span>
            <strong>{{ localBookCount }}</strong>
            <small>Loaded from books.json</small>
          </article>
        </div>
        <div class="col-md-4">
          <article class="summary-card h-100">
            <span class="summary-label">HTTP method</span>
            <strong>POST</strong>
            <small>Content-Type: application/json</small>
          </article>
        </div>
        <div class="col-md-4">
          <article class="summary-card h-100">
            <span class="summary-label">Cloud region</span>
            <strong>Hangzhou</strong>
            <small>Alibaba Function Compute</small>
          </article>
        </div>
      </div>

      <section class="request-panel" aria-labelledby="request-heading">
        <div class="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            <h2 id="request-heading" class="h4 fw-bold mb-2">Calculate the total</h2>
            <p class="text-secondary mb-1">
              The cloud function validates the JSON and counts the objects in its
              <code>books</code> array.
            </p>
            <small class="endpoint-text">Endpoint: {{ endpointHost }}</small>
          </div>

          <button
            type="button"
            class="btn btn-primary btn-lg px-4"
            :disabled="isLoading"
            @click="getBookCount"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>
            {{ isLoading ? 'Counting books…' : 'Get Book Count' }}
          </button>
        </div>

        <div class="result-region mt-4" aria-live="polite">
          <div v-if="isLoading" class="status-message">
            Sending {{ localBookCount }} book records to the cloud function…
          </div>

          <div v-else-if="errorMessage" class="alert alert-danger mb-0" role="alert">
            <strong>Request failed.</strong>
            <span class="d-block">{{ errorMessage }}</span>
          </div>

          <div v-else-if="count !== null" class="result-card" role="status">
            <div class="result-icon" aria-hidden="true">✓</div>
            <div>
              <span class="result-label">Cloud function result</span>
              <p class="result-total mb-1">Total number of books: {{ count }}</p>
              <small>{{ responseMessage }}</small>
            </div>
          </div>

          <div v-else class="status-message">
            Ready. Select <strong>Get Book Count</strong> to call the deployed function.
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.book-counter-shell {
  max-width: 68rem;
}

.book-counter-hero,
.request-panel {
  border: 1px solid #dce5ee;
  border-radius: 1.25rem;
  background: #ffffff;
  box-shadow: 0 1rem 2.5rem rgba(20, 45, 72, 0.08);
}

.book-counter-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.5rem;
}

.eyebrow,
.summary-label,
.result-label {
  color: #1769aa;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cloud-badge {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  border: 1px solid #b7dfc7;
  border-radius: 999px;
  background: #eefaf2;
  color: #176b3a;
  font-weight: 700;
}

.status-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  background: #20a05a;
  box-shadow: 0 0 0 0.25rem rgba(32, 160, 90, 0.14);
}

.summary-card {
  display: flex;
  flex-direction: column;
  padding: 1.4rem;
  border: 1px solid #dce5ee;
  border-radius: 1rem;
  background: #f8fbfe;
}

.summary-card strong {
  margin: 0.3rem 0;
  color: #15324b;
  font-size: 1.45rem;
}

.summary-card small,
.endpoint-text,
.result-card small {
  color: #657789;
}

.request-panel {
  padding: 2rem;
}

.endpoint-text {
  overflow-wrap: anywhere;
}

.result-region {
  min-height: 7.5rem;
}

.status-message,
.result-card {
  min-height: 7.5rem;
  border-radius: 1rem;
}

.status-message {
  display: grid;
  place-items: center;
  padding: 1.5rem;
  border: 1px dashed #b8c8d8;
  background: #f8fafc;
  color: #566b7d;
  text-align: center;
}

.result-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border: 1px solid #a8dabd;
  background: linear-gradient(135deg, #f0fbf4, #ffffff);
}

.result-icon {
  display: grid;
  flex: 0 0 auto;
  width: 3.5rem;
  height: 3.5rem;
  place-items: center;
  border-radius: 50%;
  background: #198754;
  color: #ffffff;
  font-size: 1.75rem;
  font-weight: 700;
}

.result-total {
  color: #123b27;
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 750;
}

@media (max-width: 767px) {
  .book-counter-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 1.75rem;
  }

  .request-panel {
    padding: 1.5rem;
  }
}
</style>
