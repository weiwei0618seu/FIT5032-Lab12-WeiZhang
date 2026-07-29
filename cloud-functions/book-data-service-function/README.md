# Task 9.2 Firestore Book Data Service

This Function Compute HTTP function reads the Firestore `books` collection and
returns one of three demonstration data packages:

| Package | Records | Included data | Price |
| --- | ---: | --- | ---: |
| Basic | Up to 3 | ISBN and book name | CNY 5 |
| Standard | Up to 10 | ISBN and book name | CNY 12 |
| Premium | All | Complete records and summary | CNY 20 |

No real payment is processed.

## Function Compute settings

- Runtime: Node.js 20
- Handler: `index.handler`
- Trigger: HTTP
- Allowed methods: `POST` and `OPTIONS`

## Required environment variables

Configure these encrypted environment variables in Function Compute:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Use a dedicated Firebase service account with only the permissions required to
read the Firestore `books` collection. Never commit its JSON key to Git.

## Request

```json
{
  "packageType": "Premium"
}
```

## Local verification

```powershell
npm install
npm test
```
