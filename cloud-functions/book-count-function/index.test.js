'use strict'

const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const test = require('node:test')

const { countBooks, handler } = require('./index')

const sampleData = JSON.parse(readFileSync(join(__dirname, 'books.json'), 'utf8'))

function createHttpEvent(method, body = '') {
  return JSON.stringify({
    version: 'v1',
    rawPath: '/',
    body,
    isBase64Encoded: false,
    headers: {
      'Content-Type': 'application/json',
    },
    queryParameters: {},
    requestContext: {
      http: {
        method,
        path: '/',
      },
    },
  })
}

test('countBooks returns the number of objects in the books array', () => {
  assert.equal(countBooks(sampleData), 8)
})

test('handler returns the book count for a valid POST request', async () => {
  const response = await handler(createHttpEvent('POST', JSON.stringify(sampleData)))

  assert.equal(response.statusCode, 200)
  assert.deepEqual(JSON.parse(response.body), {
    count: 8,
    message: 'Book count calculated successfully.',
  })
})

test('handler rejects JSON without a books array', async () => {
  const response = await handler(createHttpEvent('POST', '{"items":[]}'))

  assert.equal(response.statusCode, 400)
  assert.deepEqual(JSON.parse(response.body), {
    error: 'The JSON object must contain a books array.',
  })
})

test('handler rejects malformed JSON', async () => {
  const response = await handler(createHttpEvent('POST', '{"books":'))

  assert.equal(response.statusCode, 400)
})

test('handler supports browser CORS preflight requests', async () => {
  const response = await handler(createHttpEvent('OPTIONS'))

  assert.equal(response.statusCode, 204)
  assert.equal(response.headers['Access-Control-Allow-Origin'], '*')
})

test('handler rejects unsupported HTTP methods', async () => {
  const response = await handler(createHttpEvent('GET'))

  assert.equal(response.statusCode, 405)
})
