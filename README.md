# FIT5032 Assessed Lab 9

Serverless cloud-function implementation for the NoMash Library Vue application.
The project extends the Lab 8 Firestore application with two Alibaba Cloud
Function Compute services.

## Lab 9 features

### Task 9.1 — JSON book count

- Sends the local `books.json` dataset to an HTTP cloud function.
- Validates the request and calculates the number of book objects.
- Displays the returned count and cloud response in the Vue interface.
- Supports browser CORS preflight requests.

Deployed endpoint:

```text
https://book-cofunction-cdfmfbrftp.cn-hangzhou.fcapp.run
```

### Task 9.2 — Firestore book data service

- Reads live records from the Cloud Firestore `books` collection with the
  Firebase Admin SDK.
- Provides Basic, Standard, and Premium data packages.
- Applies package-specific record limits, included fields, and prices.
- Displays the generated package as a digital-data order with a responsive
  result table.
- Returns safe client errors without exposing Firestore or credential details.

Deployed endpoint:

```text
https://book-dafunction-tgkjwdwopa.cn-hongkong.fcapp.run
```

## Application routes

| Route | Purpose |
| --- | --- |
| `/get-book-count` | Task 9.1 JSON book-count interface |
| `/book-data-service` | Task 9.2 Firestore data-package marketplace |
| `/add-book` | Retained Lab 8 Firestore CRUD and query interface |
| `/FireRegister` | Firebase account registration |
| `/FireLogin` | Firebase sign-in |
| `/FirebaseAccount` | Authenticated account and role view |

## Project structure

```text
cloud-functions/
  book-count-function/
  book-data-service-function/
src/
  assets/json/books.json
  views/GetBookCountView.vue
  views/BookDataServiceView.vue
```

Each function directory contains its handler, automated tests, deployment
instructions, and a remote test script. Generated ZIP files and installed
dependencies are excluded from Git.

## Local setup

Install the Vue application dependencies:

```sh
npm install
```

Copy `.env.example` to `.env.local`, then add the Firebase Web App values from
Firebase Console. Start the development server:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```

Run the cloud-function tests:

```sh
cd cloud-functions/book-count-function
npm test

cd ../book-data-service-function
npm test
```

## Security

- `.env.local` is excluded from version control.
- Firebase service-account JSON files and private keys must never be committed.
- Alibaba Cloud OAuth working files, deployment ZIP files, `node_modules`, and
  build output are excluded from version control.
- Firebase Admin credentials are configured only as cloud-function environment
  variables.
