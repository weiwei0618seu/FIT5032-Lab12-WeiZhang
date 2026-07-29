# Task 9.1 Book Count Function

This directory contains the JSON book-count HTTP function for Alibaba Cloud
Function Compute 3.0.

## Function Compute settings

- Runtime: Node.js 20 or later
- Handler: `index.handler`
- Trigger: HTTP
- Allowed methods: `POST` and `OPTIONS`
- Authentication: use the setting required by the assessment environment

The function has no third-party runtime dependencies.

## Request

Send `books.json` as an `application/json` POST body.

```json
{
  "books": [
    {
      "id": 1,
      "isbn": 9780141439518,
      "name": "Pride and Prejudice"
    }
  ]
}
```

## Successful response

```json
{
  "count": 1,
  "message": "Book count calculated successfully."
}
```

## Local verification

```powershell
cd cloud-functions\book-count-function
npm test
```
