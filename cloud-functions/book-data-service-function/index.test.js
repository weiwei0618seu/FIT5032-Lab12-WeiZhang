'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')

const { buildBookDataPackage } = require('./data-packages')
const { createHandler } = require('./index')

const sampleBooks = [
  { id: 'book-4', isbn: 1404, name: 'Fourth Book', category: 'Cloud' },
  { id: 'book-1', isbn: 1101, name: 'First Book', category: 'Vue' },
  { id: 'book-3', isbn: 1303, name: 'Third Book', category: 'Security' },
  { id: 'book-2', isbn: 1202, name: 'Second Book', category: 'Firebase' },
]

function createHttpEvent(method, body = '') {
  return JSON.stringify({
    version: 'v1',
    rawPath: '/',
    body,
    isBase64Encoded: false,
    headers: {
      'Content-Type': 'application/json',
    },
    requestContext: {
      http: {
        method,
        path: '/',
      },
    },
  })
}

test('Basic package returns up to three books and public fields only', () => {
  const result = buildBookDataPackage(
    sampleBooks,
    'Basic',
    new Date('2026-07-29T00:00:00.000Z'),
  )

  assert.equal(result.packageName, 'Basic')
  assert.equal(result.bookCount, 3)
  assert.equal(result.availableBookCount, 4)
  assert.equal(result.price, 5)
  assert.equal(result.currency, 'CNY')
  assert.deepEqual(Object.keys(result.books[0]), ['id', 'isbn', 'name'])
  assert.equal(result.books[0].isbn, 1101)
})

test('Standard package returns up to ten books for CNY 12', () => {
  const result = buildBookDataPackage(sampleBooks, 'standard')

  assert.equal(result.packageName, 'Standard')
  assert.equal(result.bookCount, 4)
  assert.equal(result.price, 12)
})

test('Premium package returns all fields and all records for CNY 20', () => {
  const result = buildBookDataPackage(sampleBooks, 'PREMIUM')

  assert.equal(result.packageName, 'Premium')
  assert.equal(result.bookCount, 4)
  assert.equal(result.price, 20)
  assert.equal(result.books[0].category, 'Vue')
})

test('handler returns a generated Firestore data package', async () => {
  const handler = createHandler(async () => sampleBooks)
  const response = await handler(
    createHttpEvent('POST', JSON.stringify({ packageType: 'Basic' })),
  )
  const result = JSON.parse(response.body)

  assert.equal(response.statusCode, 200)
  assert.equal(result.packageName, 'Basic')
  assert.equal(result.bookCount, 3)
  assert.equal(result.price, 5)
})

test('handler rejects an unsupported package', async () => {
  const handler = createHandler(async () => sampleBooks)
  const response = await handler(
    createHttpEvent('POST', JSON.stringify({ packageType: 'Enterprise' })),
  )

  assert.equal(response.statusCode, 400)
})

test('handler supports browser CORS preflight requests', async () => {
  const handler = createHandler(async () => sampleBooks)
  const response = await handler(createHttpEvent('OPTIONS'))

  assert.equal(response.statusCode, 204)
  assert.equal(response.headers['Access-Control-Allow-Origin'], '*')
})

test('handler hides internal Firestore errors from the client', async () => {
  const handler = createHandler(async () => {
    throw new Error('Sensitive Firestore connection detail')
  })
  const response = await handler(
    createHttpEvent('POST', JSON.stringify({ packageType: 'Premium' })),
  )

  assert.equal(response.statusCode, 500)
  assert.deepEqual(JSON.parse(response.body), {
    error: 'The Firestore book data package could not be generated.',
  })
})
