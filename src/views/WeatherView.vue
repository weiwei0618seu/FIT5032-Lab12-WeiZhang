<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const weather = ref(null)
const city = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const locationMessage = ref('Requesting your current location...')

const weatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim()
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'

const iconUrl = (iconCode) =>
  iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : ''

const requestWeather = async (params, successMessage) => {
  const response = await axios.get(weatherApiUrl, {
    params: {
      ...params,
      appid: weatherApiKey,
      units: 'metric',
    },
  })

  weather.value = response.data
  locationMessage.value = successMessage
}

const loadCurrentWeather = () => {
  weather.value = null
  errorMessage.value = ''
  locationMessage.value = 'Requesting your current location...'

  if (!weatherApiKey) {
    errorMessage.value =
      'The weather API key is not configured. Add VITE_OPENWEATHER_API_KEY to .env.local and restart Vite.'
    return
  }

  if (!navigator.geolocation) {
    errorMessage.value = 'This browser does not support geolocation.'
    return
  }

  isLoading.value = true

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      locationMessage.value = 'Loading weather for your current location...'

      try {
        await requestWeather(
          {
            lat: coords.latitude,
            lon: coords.longitude,
          },
          'Weather loaded from your current location.',
        )
      } catch (error) {
        console.error('Current weather request failed:', error)
        errorMessage.value =
          error.response?.data?.message ||
          'The weather service could not be reached. Please try again.'
      } finally {
        isLoading.value = false
      }
    },
    (error) => {
      isLoading.value = false
      locationMessage.value = ''

      if (error.code === 1) {
        errorMessage.value =
          'Location permission was denied. Allow location access in the browser and try again.'
      } else {
        errorMessage.value = 'The browser could not determine your current location.'
      }
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    },
  )
}

const searchByCity = async () => {
  const cityQuery = city.value.trim()

  if (!cityQuery) {
    errorMessage.value = 'Enter a city and country, for example Clayton, AU.'
    return
  }

  if (!weatherApiKey) {
    errorMessage.value =
      'The weather API key is not configured. Add VITE_OPENWEATHER_API_KEY to .env.local and restart Vite.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  weather.value = null
  locationMessage.value = `Searching weather for ${cityQuery}...`

  try {
    await requestWeather({ q: cityQuery }, `Weather loaded for ${cityQuery}.`)
  } catch (error) {
    console.error('City weather request failed:', error)
    errorMessage.value =
      error.response?.data?.message ||
      'The city could not be found. Check the city and country format and try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCurrentWeather)
</script>

<template>
  <main class="container py-5">
    <section class="weather-shell mx-auto">
      <div class="weather-hero">
        <div>
          <p class="eyebrow mb-2">FIT5032 Assessed Lab 10 · Task 10.1</p>
          <h1 class="display-5 fw-bold mb-3">Current Location Weather</h1>
          <p class="lead text-secondary mb-0">
            Use browser geolocation to retrieve the current weather at your location.
          </p>
        </div>
        <div class="api-badge">OpenWeatherMap</div>
      </div>

      <section class="weather-panel mt-4" aria-live="polite">
        <form class="city-search" @submit.prevent="searchByCity">
          <label for="city" class="form-label fw-semibold">Search weather by city</label>
          <div class="input-group">
            <input
              id="city"
              v-model="city"
              type="search"
              class="form-control"
              placeholder="Enter city name, e.g. Clayton, AU"
              autocomplete="address-level2"
            />
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              Search
            </button>
          </div>
          <small class="text-secondary">Use the format City, Country code.</small>
        </form>

        <div v-if="isLoading" class="status-message">
          <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          {{ locationMessage }}
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger mb-0" role="alert">
          <strong>Unable to load weather.</strong>
          <span class="d-block">{{ errorMessage }}</span>
          <button type="button" class="btn btn-outline-danger mt-3" @click="loadCurrentWeather">
            Try again
          </button>
        </div>

        <div v-else-if="weather" class="weather-result">
          <div class="weather-location">
            <span class="result-label">Detected location</span>
            <h2 class="h3 fw-bold mb-0">
              {{ weather.name }}, {{ weather.sys?.country }}
            </h2>
          </div>

          <div class="weather-main">
            <img
              v-if="weather.weather?.[0]?.icon"
              class="weather-icon"
              :src="iconUrl(weather.weather[0].icon)"
              alt="Current weather icon"
            />
            <div>
              <div class="temperature">{{ Math.round(weather.main.temp) }} °C</div>
              <p class="weather-description mb-0">
                {{ weather.weather?.[0]?.description }}
              </p>
            </div>
          </div>

          <p class="text-secondary mb-0">{{ locationMessage }}</p>
        </div>

        <div v-else class="status-message">Preparing the weather request...</div>
      </section>

      <button
        type="button"
        class="btn btn-primary mt-3"
        :disabled="isLoading"
        @click="loadCurrentWeather"
      >
        Refresh current location weather
      </button>
    </section>
  </main>
</template>

<style scoped>
.weather-shell {
  max-width: 68rem;
}

.weather-hero,
.weather-panel {
  border: 1px solid #dce5ee;
  border-radius: 1.25rem;
  background: #ffffff;
  box-shadow: 0 1rem 2.5rem rgba(20, 45, 72, 0.08);
}

.weather-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.5rem;
}

.eyebrow,
.result-label {
  color: #1769aa;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.api-badge {
  flex: 0 0 auto;
  padding: 0.7rem 1rem;
  border: 1px solid #b7dfc7;
  border-radius: 999px;
  background: #eefaf2;
  color: #176b3a;
  font-weight: 700;
}

.weather-panel {
  padding: 2rem;
}

.city-search {
  margin-bottom: 1.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5ebf1;
}

.status-message {
  display: flex;
  min-height: 9rem;
  align-items: center;
  justify-content: center;
  border: 1px dashed #b8c8d8;
  border-radius: 1rem;
  background: #f8fafc;
  color: #566b7d;
  text-align: center;
}

.weather-result {
  display: grid;
  gap: 1.5rem;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #eef7ff, #ffffff);
}

.weather-icon {
  width: 6rem;
  height: 6rem;
}

.temperature {
  color: #15324b;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 750;
  line-height: 1;
}

.weather-description {
  margin-top: 0.5rem;
  color: #566b7d;
  text-transform: capitalize;
}

@media (max-width: 767px) {
  .weather-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 1.75rem;
  }

  .weather-panel {
    padding: 1.5rem;
  }
}
</style>
