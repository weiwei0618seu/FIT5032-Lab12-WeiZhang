# Alibaba Cloud Function Compute deployment

## Upload package

Upload `book-count-function.zip` to Alibaba Cloud Function Compute.

Use these function settings:

- Function type: Event Function
- Function name: `book-count-function`
- Runtime: Built-in Runtime, Node.js 20
- Code upload method: Upload ZIP
- Handler: `index.handler`
- Timeout: 60 seconds
- Minimum instances: 0

The ZIP must contain `index.js` and `package.json` at its root.

## HTTP trigger

After the function is created, add a trigger with these settings:

- Trigger type: HTTP Trigger
- Trigger name: `book-count-http-trigger`
- Version or alias: LATEST
- Authentication: No Authentication
- Allowed methods: POST and OPTIONS

Copy the public endpoint after the trigger is created.

## Remote test

From the `book-count-function` directory, run:

```powershell
.\deployment\test-remote.ps1 `
  -FunctionUrl "https://replace-with-your-function-url"
```

The expected result is:

```text
count message
----- -------
    8 Book count calculated successfully.
```

Do not commit credentials, access keys, tokens, or account screenshots to the
Git repository.
