# Alibaba Cloud deployment for Task 9.2

Upload `book-data-service-function.zip` to Alibaba Cloud Function Compute.

## Function settings

- Function type: Event Function
- Function name: `book-data-service-function`
- Runtime: Built-in Runtime, Node.js 20
- Code upload method: Upload ZIP
- Handler: `index.handler`
- Timeout: 60 seconds
- Minimum instances: 0

Because the function calls Google Firestore, China (Hong Kong) is the preferred
Alibaba Cloud region. If a mainland region is required, test outbound Firestore
connectivity before using the endpoint in the Vue application.

## Firebase service-account environment variables

In Firebase Console, open Project Settings > Service accounts and create a
dedicated service-account key. Set these values directly in Function Compute:

- `FIREBASE_PROJECT_ID`: the JSON key's `project_id`
- `FIREBASE_CLIENT_EMAIL`: the JSON key's `client_email`
- `FIREBASE_PRIVATE_KEY`: the JSON key's `private_key`

Paste the private key as its JSON escaped value containing `\n`. The function
converts those sequences back to line breaks at runtime.

Do not upload the service-account JSON file, commit it to Git, paste it into
source code, or include it in a screenshot.

## HTTP trigger

- Trigger type: HTTP Trigger
- Trigger name: `book-data-service-http-trigger`
- Version or alias: LATEST
- Authentication: No Authentication
- Allowed methods: POST and OPTIONS

## Remote test

```powershell
.\deployment\test-remote.ps1 `
  -FunctionUrl "https://replace-with-your-function-url" `
  -PackageType Premium
```
