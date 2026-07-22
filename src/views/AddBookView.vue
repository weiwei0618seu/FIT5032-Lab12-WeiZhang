<script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import db from '../Firebase/init'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const addBook = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  const numericIsbn = Number(isbn.value)
  const bookName = name.value.trim()

  if (!Number.isInteger(numericIsbn) || numericIsbn <= 0 || !bookName) {
    errorMessage.value = 'Enter a positive whole-number ISBN and a book name.'
    return
  }

  isSubmitting.value = true

  try {
    await addDoc(collection(db, 'books'), {
      isbn: numericIsbn,
      name: bookName,
    })

    successMessage.value = `“${bookName}” was added successfully.`
    isbn.value = ''
    name.value = ''
  } catch (error) {
    console.error('Error adding book:', error)
    errorMessage.value = 'The book could not be added. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="container py-5">
    <section class="card border-0 shadow-sm mx-auto" style="max-width: 48rem">
      <div class="card-body p-4 p-md-5">
        <p class="text-primary fw-semibold text-uppercase small mb-2">Assessed Lab 8</p>
        <h1 class="h2 mb-3">Add a Book</h1>
        <p class="text-secondary mb-4">
          Enter a numeric ISBN and book name to create a document in the Firestore books
          collection.
        </p>

        <form class="row g-4" @submit.prevent="addBook">
          <div class="col-12">
            <label for="book-isbn" class="form-label fw-semibold">ISBN</label>
            <input
              id="book-isbn"
              v-model="isbn"
              type="number"
              class="form-control"
              min="1"
              step="1"
              placeholder="e.g. 1201"
              required
              :disabled="isSubmitting"
            />
          </div>

          <div class="col-12">
            <label for="book-name" class="form-label fw-semibold">Book name</label>
            <input
              id="book-name"
              v-model="name"
              type="text"
              class="form-control"
              maxlength="120"
              placeholder="e.g. Cloud Firestore Basics"
              required
              :disabled="isSubmitting"
            />
          </div>

          <div class="col-12">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Adding book…' : 'Add Book' }}
            </button>
          </div>
        </form>

        <div v-if="successMessage" class="alert alert-success mt-4 mb-0" role="status">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-danger mt-4 mb-0" role="alert">
          {{ errorMessage }}
        </div>
      </div>
    </section>

    <BookList />
  </main>
</template>
