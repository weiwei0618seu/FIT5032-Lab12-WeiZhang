# FIT5032 Assessed Lab 11

Vue.js application deployed to Cloudflare Pages for FIT5032 Assessed Lab 11.
The project builds on the previous assessed labs and includes Firebase
authentication, Firestore features, library API pages, and OpenWeatherMap
weather functions.

## Live deployment

- Application: <https://fit5032-lab11-weizhang.pages.dev/>
- Get Weather: <https://fit5032-lab11-weizhang.pages.dev/WeatherCheck>
- GitHub repository: <https://github.com/weiwei0618seu/FIT5032-Lab11-WeiZhang>
- Cloudflare Pages project: `fit5032-lab11-weizhang`

## Lab 11 deployment configuration

| Setting | Value |
| --- | --- |
| Platform | Cloudflare Pages |
| Framework preset | Vue |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `22.18.0` |

The current production deployment can also be reproduced with Wrangler:

```sh
npm ci
npm run build
npx wrangler pages deploy dist --project-name fit5032-lab11-weizhang --branch main
```

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

Add the required values to `.env.local`, then start the development server:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
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

Configure the corresponding values in Cloudflare Pages before using a
Cloudflare-managed Git build. After changing a build-time variable, create a
new deployment.

## Security

- `.env.local` and other `*.local` files are excluded from Git.
- API keys and Firebase configuration values must not be committed to the
  repository or shown in assessment screenshots.
- Firebase service-account JSON files and private keys must never be
  committed.
- `node_modules`, `dist`, logs, generated deployment files, and temporary
  working files are excluded from Git.

## Version-control workflow

```sh
git add README.md package.json package-lock.json .gitignore
git commit -m "Document Lab 11 Cloudflare deployment"
git push lab11 main
```
