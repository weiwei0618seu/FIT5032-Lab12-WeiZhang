'use strict'

const { cert, getApps, initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const { buildBookDataPackage } = require('./data-packages')

const CORS_HEADERS = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json; charset=utf-8',
}

let firestoreClient

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
    throw new TypeError('Send a JSON request body containing a packageType.')
  }

  const bodyText = httpEvent.isBase64Encoded
    ? Buffer.from(httpEvent.body, 'base64').toString('utf8')
    : httpEvent.body

  return JSON.parse(bodyText)
}

function getFirestoreClient() {
  if (firestoreClient) {
    return firestoreClient
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase service-account environment variables are incomplete.')
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    })
  }

  firestoreClient = getFirestore()
  return firestoreClient
}

function toPlainJson(value) {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString()
  }

  if (Array.isArray(value)) {
    return value.map(toPlainJson)
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, toPlainJson(nestedValue)]),
    )
  }

  return value
}

async function loadBooksFromFirestore() {
  const snapshot = await getFirestoreClient().collection('books').get()

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...toPlainJson(document.data()),
  }))
}

function createHandler(loadBooks = loadBooksFromFirestore) {
  return async function handler(event) {
    try {
      const httpEvent = parseHttpEvent(event)
      const method = httpEvent.requestContext?.http?.method?.toUpperCase()

      if (method === 'OPTIONS') {
        return createResponse(204, {})
      }

      if (method !== 'POST') {
        return createResponse(405, {
          error: 'Method not allowed. Select a package with an HTTP POST request.',
        })
      }

      const requestBody = parseJsonBody(httpEvent)
      const books = await loadBooks()
      const dataPackage = buildBookDataPackage(books, requestBody.packageType)

      return createResponse(200, dataPackage)
    } catch (error) {
      console.error('Book data service request failed:', error)

      if (error instanceof SyntaxError || error instanceof TypeError) {
        return createResponse(400, {
          error: error.message,
        })
      }

      return createResponse(500, {
        error: 'The Firestore book data package could not be generated.',
      })
    }
  }
}

exports.handler = createHandler()
exports.createHandler = createHandler
exports.loadBooksFromFirestore = loadBooksFromFirestore
