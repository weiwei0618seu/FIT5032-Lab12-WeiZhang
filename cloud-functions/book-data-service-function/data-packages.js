'use strict'

const PACKAGE_DEFINITIONS = Object.freeze({
  basic: Object.freeze({
    name: 'Basic',
    limit: 3,
    price: 5,
    includedData: 'ISBN and book name',
  }),
  standard: Object.freeze({
    name: 'Standard',
    limit: 10,
    price: 12,
    includedData: 'ISBN and book name',
  }),
  premium: Object.freeze({
    name: 'Premium',
    limit: Number.POSITIVE_INFINITY,
    price: 20,
    includedData: 'Complete book dataset and summary',
  }),
})

function normalizePackageType(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError('Select a Basic, Standard, or Premium data package.')
  }

  const packageType = value.trim().toLowerCase()

  if (!PACKAGE_DEFINITIONS[packageType]) {
    throw new TypeError('Package type must be Basic, Standard, or Premium.')
  }

  return packageType
}

function sortBooks(books) {
  return [...books].sort((firstBook, secondBook) => {
    const firstIsbn = Number(firstBook.isbn)
    const secondIsbn = Number(secondBook.isbn)

    if (Number.isFinite(firstIsbn) && Number.isFinite(secondIsbn)) {
      return firstIsbn - secondIsbn
    }

    return String(firstBook.name ?? '').localeCompare(String(secondBook.name ?? ''))
  })
}

function selectBookFields(book, packageType) {
  if (packageType === 'premium') {
    return { ...book }
  }

  return {
    id: book.id,
    isbn: book.isbn,
    name: book.name,
  }
}

function buildBookDataPackage(books, requestedPackage, generatedAt = new Date()) {
  if (!Array.isArray(books)) {
    throw new TypeError('Firestore book records must be provided as an array.')
  }

  const packageType = normalizePackageType(requestedPackage)
  const definition = PACKAGE_DEFINITIONS[packageType]
  const sortedBooks = sortBooks(books)
  const selectedBooks = sortedBooks
    .slice(0, definition.limit)
    .map((book) => selectBookFields(book, packageType))

  return {
    packageName: definition.name,
    bookCount: selectedBooks.length,
    availableBookCount: sortedBooks.length,
    price: definition.price,
    currency: 'CNY',
    includedData: definition.includedData,
    books: selectedBooks,
    summary: {
      source: 'Cloud Firestore books collection',
      generatedAt: generatedAt.toISOString(),
      message: `${definition.name} data package generated successfully.`,
    },
  }
}

module.exports = {
  PACKAGE_DEFINITIONS,
  buildBookDataPackage,
  normalizePackageType,
}
