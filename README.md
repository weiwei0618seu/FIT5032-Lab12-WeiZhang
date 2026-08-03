# FIT5032 Assessed Lab 10

Vue.js application for FIT5032 Assessed Lab 10. The project demonstrates
external API integration with OpenWeatherMap and a custom library data API.
The application is built on the previous NoMash Library project and retains
the earlier Firebase and book-management features.

## Lab 10 features

### Task 10.1 - Current location weather

- Uses the browser Geolocation API to obtain latitude and longitude.
- Sends the coordinates to OpenWeatherMap with Axios.
- Displays the detected location, temperature in degrees Celsius, weather
  description, and weather icon.

### Task 10.1 - Author and book counts

- Calls the library data API using an HTTP POST request.
- Calculates and displays the number of authors and books.
- Shows loading, success, retry, and error states.

### Task 10.2 - City weather search

- Accepts a city and country value such as `Clayton, AU`.
- Uses the OpenWeatherMap `q` parameter to search by city.
- Displays the returned location, Celsius temperature, description, and icon.

### Task 10.2 - GetAllBookAPI

- Calls the library data API for the Premium book data package.
- Displays all returned book records as formatted JSON.
- Shows the request status and number of returned records.

## Application routes

| Route | Purpose |
| --- | --- |
| `/WeatherCheck` | Current-location weather and city weather search |
| `/CountBookAPI` | Author and book count API page |
| `/GetAllBookAPI` | All books displayed as formatted JSON |
| `/get-book-count` | Retained Lab 9 book-count interface |
| `/book-data-service` | Retained Lab 9 Firestore data-package interface |
| `/add-book` | Retained Lab 8 Firestore book interface |
| `/FireRegister` | Firebase account registration |
| `/FireLogin` | Firebase sign in |
| `/FirebaseAccount` | Authenticated account and role view |

## API configuration

The weather request uses the OpenWeatherMap endpoint:

```text
https://api.openweathermap.org/data/2.5/weather
```

The library data service endpoint is configured with:

```text
VITE_BOOK_DATA_SERVICE_URL
```

If this variable is not set, the application uses the configured default
deployment endpoint in the Vue views.

## Project structure

```text
cloud-functions/
  book-count-function/
  book-data-service-function/
src/
  assets/json/authors.json
  assets/json/books.json
  components/BHeader.vue
  router/index.js
  views/WeatherView.vue
  views/CountBookAPIView.vue
  views/GetAllBookAPIView.vue
```

## Local setup

Install the Vue application dependencies:

```sh
npm install
```

Copy the example environment file and add the local Firebase and weather API
configuration:

```powershell
Copy-Item .env.example .env.local
```

Set the following value in `.env.local`:

```env
VITE_OPENWEATHER_API_KEY=your_private_api_key
```

The API key must remain in `.env.local` and must never be committed to Git.
Start the development server with:

```sh
npm run dev
```

Create a production build with:

```sh
npm run build
```

Run the cloud-function tests with:

```sh
cd cloud-functions/book-count-function
npm test

cd ../book-data-service-function
npm test
```

## Security

- `.env.local` is excluded from version control.
- OpenWeatherMap API keys must not be written into Vue source files,
  screenshots, or the public repository.
- Firebase service-account JSON files and private keys must never be committed.
- Cloud deployment ZIP files, `node_modules`, logs, and build output are
  excluded from Git.
- Firebase Admin credentials are configured only as cloud-function environment
  variables.

## Repository

```text
https://github.com/weiwei0618seu/FIT5032-Lab10-WeiZhang
```
