<script setup>
import { onMounted, ref } from 'vue'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import db from '../Firebase/init'

const books = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const activeQuery = ref('All books')
const queryDescription = ref('Every document in the books collection.')
const editingBookId = ref('')
const editedIsbn = ref('')
const editedName = ref('')
const isUpdating = ref(false)
const updateSuccessMessage = ref('')
const updateErrorMessage = ref('')
const deletingBookId = ref('')
const deleteSuccessMessage = ref('')
const deleteErrorMessage = ref('')

let currentBookQuery = null
let currentQueryLabel = ''
let currentQueryDescription = ''

const runBookQuery = async (bookQuery, label, description) => {
  isLoading.value = true
  errorMessage.value = ''
  activeQuery.value = label
  queryDescription.value = description
  currentBookQuery = bookQuery
  currentQueryLabel = label
  currentQueryDescription = description

  try {
    const querySnapshot = await getDocs(bookQuery)
    books.value = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }))
  } catch (error) {
    console.error('Error fetching books:', error)
    errorMessage.value = 'The book list could not be loaded. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const loadAllBooks = () =>
  runBookQuery(
    collection(db, 'books'),
    'All books',
    'Every document in the books collection.',
  )

const loadWhereQuery = () =>
  runBookQuery(
    query(collection(db, 'books'), where('isbn', '>', 1000)),
    'Where query',
    'Books where isbn > 1000.',
  )

const loadOrderByQuery = () =>
  runBookQuery(
    query(collection(db, 'books'), orderBy('isbn', 'asc')),
    'OrderBy query',
    'All books ordered by isbn in ascending order.',
  )

const loadLimitQuery = () =>
  runBookQuery(
    query(collection(db, 'books'), orderBy('isbn', 'asc'), limit(3)),
    'Limit query',
    'The first 3 books after ordering by isbn.',
  )

const loadCombinedQuery = () =>
  runBookQuery(
    query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
      limit(3),
    ),
    'Combined query',
    'Books where isbn > 1000, ordered by isbn, limited to 3 results.',
  )

const startUpdate = (book) => {
  editingBookId.value = book.id
  editedIsbn.value = String(book.isbn ?? '')
  editedName.value = book.name ?? ''
  updateSuccessMessage.value = ''
  updateErrorMessage.value = ''
  deleteSuccessMessage.value = ''
  deleteErrorMessage.value = ''
}

const cancelUpdate = () => {
  editingBookId.value = ''
  editedIsbn.value = ''
  editedName.value = ''
  updateErrorMessage.value = ''
}

const updateBook = async (documentId) => {
  updateSuccessMessage.value = ''
  updateErrorMessage.value = ''

  const numericIsbn = Number(editedIsbn.value)
  const bookName = editedName.value.trim()

  if (!Number.isInteger(numericIsbn) || numericIsbn <= 0 || !bookName) {
    updateErrorMessage.value = 'Enter a positive whole-number ISBN and a book name.'
    return
  }

  isUpdating.value = true

  try {
    await updateDoc(doc(db, 'books', documentId), {
      isbn: numericIsbn,
      name: bookName,
    })

    updateSuccessMessage.value = `“${bookName}” was updated successfully.`
    editingBookId.value = ''

    if (currentBookQuery) {
      await runBookQuery(currentBookQuery, currentQueryLabel, currentQueryDescription)
    }
  } catch (error) {
    console.error('Error updating book:', error)
    updateErrorMessage.value = 'The book could not be updated. Please try again.'
  } finally {
    isUpdating.value = false
  }
}

const deleteBook = async (book) => {
  const confirmed = window.confirm(`Delete “${book.name}” from Firestore?`)

  if (!confirmed) {
    return
  }

  deleteSuccessMessage.value = ''
  deleteErrorMessage.value = ''
  updateSuccessMessage.value = ''
  updateErrorMessage.value = ''
  deletingBookId.value = book.id

  try {
    await deleteDoc(doc(db, 'books', book.id))
    deleteSuccessMessage.value = `“${book.name}” was deleted successfully.`

    if (editingBookId.value === book.id) {
      cancelUpdate()
    }

    if (currentBookQuery) {
      await runBookQuery(currentBookQuery, currentQueryLabel, currentQueryDescription)
    }
  } catch (error) {
    console.error('Error deleting book:', error)
    deleteErrorMessage.value = 'The book could not be deleted. Please try again.'
  } finally {
    deletingBookId.value = ''
  }
}

onMounted(loadAllBooks)
</script>

<template>
  <section class="card border-0 shadow-sm mx-auto mt-4" style="max-width: 48rem">
    <div class="card-body p-4 p-md-5">
      <div class="mb-4">
        <p class="text-primary fw-semibold text-uppercase small mb-2">Cloud Firestore</p>
        <h2 class="h3 mb-3">Books in Firestore</h2>
        <div class="d-flex flex-wrap gap-2" role="group" aria-label="Firestore query options">
          <button
            type="button"
            class="btn btn-outline-primary"
            :class="{ active: activeQuery === 'All books' }"
            :disabled="isLoading"
            @click="loadAllBooks"
          >
            All books
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            :class="{ active: activeQuery === 'Where query' }"
            :disabled="isLoading"
            @click="loadWhereQuery"
          >
            Where: ISBN &gt; 1000
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            :class="{ active: activeQuery === 'OrderBy query' }"
            :disabled="isLoading"
            @click="loadOrderByQuery"
          >
            Order by ISBN
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            :class="{ active: activeQuery === 'Limit query' }"
            :disabled="isLoading"
            @click="loadLimitQuery"
          >
            Limit to 3
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            :class="{ active: activeQuery === 'Combined query' }"
            :disabled="isLoading"
            @click="loadCombinedQuery"
          >
            Combined query
          </button>
        </div>
      </div>

      <div class="alert alert-light border" aria-live="polite">
        <strong>{{ activeQuery }}</strong>
        <span class="d-block text-secondary">{{ queryDescription }}</span>
      </div>

      <div v-if="updateSuccessMessage" class="alert alert-success" role="status">
        {{ updateSuccessMessage }}
      </div>
      <div v-if="updateErrorMessage" class="alert alert-danger" role="alert">
        {{ updateErrorMessage }}
      </div>
      <div v-if="deleteSuccessMessage" class="alert alert-success" role="status">
        {{ deleteSuccessMessage }}
      </div>
      <div v-if="deleteErrorMessage" class="alert alert-danger" role="alert">
        {{ deleteErrorMessage }}
      </div>

      <p v-if="isLoading" class="text-secondary mb-0" role="status">Loading books…</p>

      <div v-else-if="errorMessage" class="alert alert-danger mb-0" role="alert">
        {{ errorMessage }}
      </div>

      <p v-else-if="books.length === 0" class="text-secondary mb-0">
        No books have been added yet.
      </p>

      <div v-else>
        <p class="small text-secondary">Showing {{ books.length }} result(s).</p>
        <ul class="list-group" aria-label="Firestore books">
          <li v-for="book in books" :key="book.id" class="list-group-item">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <div class="d-flex flex-wrap align-items-center gap-2">
                  <span class="fw-semibold">{{ book.name }}</span>
                  <span class="badge text-bg-primary rounded-pill">ISBN: {{ book.isbn }}</span>
                </div>
                <small class="text-secondary">Document ID: {{ book.id }}</small>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  :disabled="deletingBookId === book.id"
                  @click="startUpdate(book)"
                >
                  Update
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  :disabled="deletingBookId === book.id"
                  @click="deleteBook(book)"
                >
                  {{ deletingBookId === book.id ? 'Deleting…' : 'Delete' }}
                </button>
              </div>
            </div>

            <form
              v-if="editingBookId === book.id"
              class="row g-3 border-top mt-3 pt-3"
              @submit.prevent="updateBook(book.id)"
            >
              <div class="col-md-4">
                <label :for="`update-isbn-${book.id}`" class="form-label">Update ISBN</label>
                <input
                  :id="`update-isbn-${book.id}`"
                  v-model="editedIsbn"
                  type="number"
                  class="form-control"
                  min="1"
                  step="1"
                  required
                  :disabled="isUpdating"
                />
              </div>
              <div class="col-md-8">
                <label :for="`update-name-${book.id}`" class="form-label">Update book name</label>
                <input
                  :id="`update-name-${book.id}`"
                  v-model="editedName"
                  type="text"
                  class="form-control"
                  maxlength="120"
                  required
                  :disabled="isUpdating"
                />
              </div>
              <div class="col-12 d-flex flex-wrap gap-2">
                <button type="submit" class="btn btn-success" :disabled="isUpdating">
                  {{ isUpdating ? 'Saving…' : 'Save changes' }}
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  :disabled="isUpdating"
                  @click="cancelUpdate"
                >
                  Cancel
                </button>
              </div>
            </form>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
