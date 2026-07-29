'use strict'

const CORS_HEADERS = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json; charset=utf-8',
}

function createResponse(statusCode, payload) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    isBase64Encoded: false,
    body: JSON.stringify(payload),
  }
}

function parseHttpEvent(event) {
  const eventText = Buffer.isBuffer(event) ? event.toString('utf8') : event

  if (typeof eventText === 'string') {
    return JSON.parse(eventText)
  }

  if (eventText && typeof eventText === 'object') {
    return eventText
  }

  throw new TypeError('The HTTP event is missing or invalid.')
}

function parseJsonBody(httpEvent) {
  if (typeof httpEvent.body !== 'string' || !httpEvent.body.trim()) {
    throw new TypeError('Send a JSON request body containing a books array.')
  }

  const bodyText = httpEvent.isBase64Encoded
    ? Buffer.from(httpEvent.body, 'base64').toString('utf8')
    : httpEvent.body

  return JSON.parse(bodyText)
}

function countBooks(bookData) {
  if (!bookData || typeof bookData !== 'object' || Array.isArray(bookData)) {
    throw new TypeError('The request body must be a JSON object.')
  }

  if (!Array.isArray(bookData.books)) {
    throw new TypeError('The JSON object must contain a books array.')
  }

  const containsInvalidBook = bookData.books.some(
    (book) => !book || typeof book !== 'object' || Array.isArray(book),
  )

  if (containsInvalidBook) {
    throw new TypeError('Every item in the books array must be a JSON object.')
  }

  return bookData.books.length
}

/**
 * Alibaba Cloud Function Compute 3.0 HTTP handler.
 * Configure the Function Compute handler as: index.handler
 */
exports.handler = async function handler(event) {
  try {
    const httpEvent = parseHttpEvent(event)
    const method = httpEvent.requestContext?.http?.method?.toUpperCase()

    if (method === 'OPTIONS') {
      return createResponse(204, {})
    }

    if (method !== 'POST') {
      return createResponse(405, {
        error: 'Method not allowed. Send the book data with an HTTP POST request.',
      })
    }

    const bookData = parseJsonBody(httpEvent)
    const count = countBooks(bookData)

    return createResponse(200, {
      count,
      message: 'Book count calculated successfully.',
    })
  } catch (error) {
    console.error('Book count request failed:', error)

    if (error instanceof SyntaxError || error instanceof TypeError) {
      return createResponse(400, {
        error: error.message,
      })
    }

    return createResponse(500, {
      error: 'The book count could not be calculated.',
    })
  }
}

exports.countBooks = countBooks
