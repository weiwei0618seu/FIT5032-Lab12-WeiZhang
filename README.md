# FIT5032 Assessed Lab 7

Vue.js implementation of Firebase Authentication for the NoMash Library application.

## Implemented features

- Firebase Web App initialisation using Vite environment variables
- Email and password registration with validation and error feedback
- Email and password sign-in with current-user console evidence
- Administrator and standard-user role demonstration
- Role-specific authenticated account content
- Firebase logout with `currentUser` verification

## Application routes

| Route | Purpose |
| --- | --- |
| `/FireRegister` | Register a Firebase account |
| `/FireLogin` | Sign in with Firebase |
| `/FirebaseAccount` | View the authenticated user and role |

## Local setup

Install dependencies:

```sh
npm install
```

Copy `.env.example` to `.env.local`, then add the Firebase Web App configuration from Firebase Console. The administrator demonstration account is configured with the comma-separated `VITE_FIREBASE_ADMIN_EMAILS` value.

Start the development server:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```

## Role demonstration

Firebase Authentication verifies each account. An authenticated email listed in `VITE_FIREBASE_ADMIN_EMAILS` is displayed as an **Administrator**; other authenticated accounts are displayed as **Standard User**.

This client-side role mapping is intended for the assessed lab demonstration. A production application should enforce privileged access with trusted server-side authorisation, such as Firebase custom claims and Firebase Security Rules.
