# FIT5032 Assessed Lab 12

Vue.js application prepared for FIT5032 Assessed Lab 12. The project
uses Vite, GitHub Actions, and GitHub Pages for continuous integration
and deployment.

## Live deployment

- Application: <https://weiwei0618seu.github.io/FIT5032-Lab12-WeiZhang/>
- GitHub repository: <https://github.com/weiwei0618seu/FIT5032-Lab12-WeiZhang>
- GitHub Actions: <https://github.com/weiwei0618seu/FIT5032-Lab12-WeiZhang/actions>

## Lab 12 deployment configuration

| Setting | Value |
| --- | --- |
| Deployment platform | GitHub Pages |
| CI/CD platform | GitHub Actions |
| Production branch | `main` |
| Deployment branch | `gh-pages` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `22.18.0` |
| Vite base path | `/FIT5032-Lab12-WeiZhang/` |

Every push to `main` starts the workflow in
`.github/workflows/deploy.yml`. The workflow installs dependencies,
builds the production application, and deploys the `dist` directory to
the `gh-pages` branch.

## Main features

- Current-location weather using the browser Geolocation API.
- City and country weather search using OpenWeatherMap.
- Celsius temperature, weather description, and weather icon display.
- Firebase account registration, sign-in, account, and role features.
- Firestore book-management functionality.
- Author/book count and complete-book-list API pages.
- Vue Router navigation and protected routes.

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Application home page |
| `/WeatherCheck` | Current-location and city weather search |
| `/CountBookAPI` | Author and book count API page |
| `/GetAllBookAPI` | All books displayed as formatted JSON |
| `/get-book-count` | Book-count interface |
| `/book-data-service` | Firestore data-package interface |
| `/add-book` | Firestore book interface |
| `/FireRegister` | Firebase account registration |
| `/FireLogin` | Firebase sign-in page |
| `/FirebaseAccount` | Authenticated account and role view |

## Local setup

Install the dependencies:

```sh
npm install
```

Copy the environment template:

```powershell
Copy-Item .env.example .env.local
```

Add the required values to `.env.local`, then start the development
server:

```sh
npm run dev
```

Create and preview a production build:

```sh
npm run build
npm run preview
```

## Environment variables

The project uses the following Vite environment variables:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_FIREBASE_ADMIN_EMAILS
VITE_BOOK_DATA_SERVICE_URL
VITE_OPENWEATHER_API_KEY
```

For GitHub Actions, configure the required values under the repository's
Settings, Secrets and variables, Actions. The workflow reads sensitive
values from GitHub Secrets during the build and reads the public book
service URL from a repository variable.

## Security

- `.env.local` and other `*.local` files are excluded from Git.
- API keys and local configuration values must not be committed to the
  repository or shown in assessment screenshots.
- Firebase service-account JSON files and private keys must never be
  committed.
- `node_modules`, `dist`, logs, and temporary working files are excluded
  from Git.
- Vite `VITE_*` values used by a browser application are included in the
  generated client bundle; sensitive services should therefore use
  appropriate domain restrictions, quotas, and server-side protection.

## Version-control workflow

```sh
git add .
git commit -m "Update Lab 12 documentation"
git push origin main
```
