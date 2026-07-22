# FIT5032 Assessed Lab 8

Vue.js and Cloud Firestore implementation for the NoMash Library application. This project extends the Firebase application from Lab 7 with book creation, retrieval, queries, updates, and deletion.

## Implemented features

- Shared Firebase initialisation in `src/Firebase/init.js`
- Cloud Firestore database instance exported for reuse
- Add Book page with required ISBN and book-name validation
- Numeric ISBN values stored in the Firestore `books` collection
- Reusable `BookList.vue` component for retrieving and displaying documents
- Firestore queries using `where`, `orderBy`, and `limit`
- Combined filtering, ordering, and result limiting
- Book updates using `doc` and `updateDoc`
- Book deletion using `doc` and `deleteDoc`
- Loading, success, validation, and error feedback
- Existing Firebase Authentication features retained from Lab 7

## Firestore data structure

Each book is stored as a document in the `books` collection:

```text
books/{documentId}
  isbn: number
  name: string
```

Example:

```text
isbn: 1201
name: "Cloud Firestore Basics"
```

## Firestore queries

The Book List interface demonstrates the following database queries:

| Query | Behaviour |
| --- | --- |
| `where('isbn', '>', 1000)` | Retrieves books with an ISBN greater than 1000 |
| `orderBy('isbn', 'asc')` | Orders books by ISBN in ascending order |
| `limit(3)` | Restricts the displayed result to three documents |
| Combined query | Filters by ISBN, orders ascending, and returns at most three documents |

## Application routes

| Route | Purpose |
| --- | --- |
| `/add-book` | Create, retrieve, query, update, and delete Firestore book records |
| `/FireRegister` | Register a Firebase account |
| `/FireLogin` | Sign in with Firebase |
| `/FirebaseAccount` | View the authenticated user and role |

## Local setup

Install dependencies:

```sh
npm install
```

Copy `.env.example` to `.env.local`, then enter the Firebase Web App values from Firebase Console. Do not commit `.env.local`.

Create a Cloud Firestore database for the configured Firebase project before using the book features. Test Mode may be used for the assessed laboratory demonstration, but production applications require appropriately restricted Firebase Security Rules.

Start the development server:

```sh
npm run dev
```

Open the Add Book page at:

```text
http://localhost:5173/add-book
```

Create a production build:

```sh
npm run build
```

## Assessed Lab 8 coverage

- **Task 8.1:** Add Book browser page, source implementation, and newly created Firestore document
- **Task 8.2:** Browser and source evidence for `where`, `orderBy`, `limit`, update, and delete operations

All Firebase configuration values are loaded from Vite environment variables. Local secrets and generated production files are excluded from version control.
