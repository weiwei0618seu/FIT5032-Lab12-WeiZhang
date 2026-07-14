<template>
  <main class="json-lab">
    <header class="lab-header">
      <p class="eyebrow">FIT5032 Assessed Lab 2</p>
      <h1>Week 2: One-Way Data Binding</h1>
      <p>
        JSON data is imported into this Vue 3 component and displayed with
        computed properties, built-in directives, and dynamic bindings.
      </p>
    </header>

    <section class="lab-section">
      <h2>Activity 1: Imported JSON Data</h2>
      <div class="summary-grid">
        <article>
          <span class="summary-label">Authors</span>
          <strong>{{ authors.length }}</strong>
        </article>
        <article>
          <span class="summary-label">Bookstore Company</span>
          <strong>{{ bookstores.name }}</strong>
        </article>
        <article>
          <span class="summary-label">Total Stores</span>
          <strong>{{ bookstores.totalStores }}</strong>
        </article>
      </div>
    </section>

    <section class="lab-section">
      <h2>Activities 2-5: Computed Properties</h2>

      <div class="two-column">
        <div>
          <h3>Activity 2: Authors Born After 1850</h3>
          <ul>
            <li v-for="author in modernAuthors" :key="author.id">
              {{ author.name }} ({{ author.birthYear }})
            </li>
          </ul>
        </div>

        <div>
          <h3>Activity 3: All Famous Works</h3>
          <ul>
            <li v-for="work in allFamousWorks" :key="work">
              {{ work }}
            </li>
          </ul>
        </div>
      </div>

      <div class="two-column">
        <div class="result-panel">
          <h3>Activity 4: Find Author by Name</h3>
          <p v-if="orwell">
            {{ orwell.name }} was born in {{ orwell.birthYear }}.
          </p>
          <p v-else>George Orwell was not found.</p>
        </div>

        <div class="result-panel">
          <h3>Activity 5: Find Author by ID</h3>
          <p v-if="austen">
            ID 1 belongs to {{ austen.name }}, born in {{ austen.birthYear }}.
          </p>
          <p v-else>Author ID 1 was not found.</p>
        </div>
      </div>
    </section>

    <section class="lab-section">
      <h2>Activities 6-8: List Rendering with v-for</h2>

      <div class="two-column">
        <div>
          <h3>Activity 6: Authors and Birth Years</h3>
          <ul>
            <li v-for="author in authors" :key="author.id">
              {{ author.name }} ({{ author.birthYear }})
            </li>
          </ul>
        </div>

        <div>
          <h3>Activity 7: Modern Authors</h3>
          <ul>
            <li v-for="author in modernAuthors" :key="`modern-${author.id}`">
              {{ author.name }} ({{ author.birthYear }})
            </li>
          </ul>
        </div>
      </div>

      <h3>Activity 8: Famous Works</h3>
      <ul class="work-list">
        <li v-for="work in allFamousWorks" :key="`work-${work}`">
          {{ work }}
        </li>
      </ul>
    </section>

    <section class="lab-section">
      <h2>Activities 9-12: Nested JSON Data</h2>

      <div class="two-column">
        <div>
          <h3>Activity 9: Jane Austen's Works</h3>
          <ul>
            <li v-for="work in austenWorks" :key="work.title">
              {{ work.title }} ({{ work.year }})
            </li>
          </ul>
        </div>

        <div>
          <h3>Activities 9a-9b: Object Properties</h3>
          <p><strong>Company:</strong> {{ bookstores.name }}</p>
          <p><strong>Total Stores:</strong> {{ bookstores.totalStores }}</p>
        </div>
      </div>

      <div class="two-column">
        <div>
          <h3>Activity 10: Store Types</h3>
          <ul>
            <li v-for="(count, type) in bookstores.storeTypes" :key="type">
              {{ formatLabel(type) }}: {{ count }} stores
            </li>
          </ul>
        </div>

        <div>
          <h3>Activity 11: Opening Hours</h3>
          <ul>
            <li v-for="(hours, day) in bookstores.openingHours" :key="day">
              {{ formatLabel(day) }}: {{ hours.open }} - {{ hours.close }}
            </li>
          </ul>
        </div>
      </div>

      <h3>Activity 12: Arrays in Objects</h3>
      <p>We operate in: {{ bookstores.countries.join(", ") }}</p>
      <p>Our #1 seller: {{ bookstores.topSellers[0] }}</p>
      <ul class="work-list">
        <li v-for="seller in bookstores.topSellers" :key="seller">
          {{ seller }}
        </li>
      </ul>
    </section>

    <section class="lab-section">
      <h2>Activity 13: v-if and v-else</h2>
      <button type="button" @click="showMessage = !showMessage">
        Toggle Message
      </button>
      <p v-if="showMessage" class="message success">
        You're a Vue superstar!
      </p>
      <p v-else class="message">Click the button to see a message.</p>
    </section>

    <section class="lab-section">
      <h2>Task 2.2: Attribute, Class and Style Binding</h2>
      <p>
        George Orwell is highlighted dynamically using bound attributes,
        classes, and inline styles.
      </p>

      <ul class="author-card-list">
        <li
          v-for="author in authors"
          :key="`highlight-${author.id}`"
          :title="getAuthorTitle(author)"
          :class="{ highlighted: isGeorgeOrwell(author) }"
          :style="getAuthorStyle(author)"
        >
          <div>
            <strong>{{ author.name }}</strong>
            <span>{{ author.birthYear }}</span>
          </div>
          <small>{{ author.genres.join(", ") }}</small>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from "vue"

import authors from "../assets/json/authors.json"
import bookstores from "../assets/json/bookstores.json"

const showMessage = ref(false)

const modernAuthors = computed(() =>
  authors.filter((author) => author.birthYear > 1850)
)

const allFamousWorks = computed(() =>
  authors.flatMap((author) => author.famousWorks.map((work) => work.title))
)

const orwell = computed(() =>
  authors.find((author) => author.name === "George Orwell")
)

const austen = computed(() =>
  authors.find((author) => Number(author.id) === 1)
)

const austenWorks = computed(() => austen.value?.famousWorks ?? [])

const isGeorgeOrwell = (author) => author.name === "George Orwell"

const getAuthorTitle = (author) =>
  isGeorgeOrwell(author) ? "Highlighted author: George Orwell" : author.name

const getAuthorStyle = (author) => ({
  borderColor: isGeorgeOrwell(author) ? "#2f7d5c" : "#d8dde6",
  backgroundColor: isGeorgeOrwell(author) ? "#e7f7ee" : "#ffffff",
})

const formatLabel = (value) =>
  value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())
</script>

<style scoped>
.json-lab {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0 48px;
  color: #263238;
  font-family:
    Inter,
    "Segoe UI",
    Arial,
    sans-serif;
}

.lab-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #cfd8dc;
}

.eyebrow {
  margin: 0 0 6px;
  color: #2f7d5c;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 8px;
  font-size: 2.1rem;
}

h2 {
  margin-bottom: 18px;
  font-size: 1.45rem;
}

h3 {
  margin-bottom: 10px;
  font-size: 1rem;
}

.lab-section {
  margin-bottom: 18px;
  padding: 20px;
  border: 1px solid #d8dde6;
  border-radius: 8px;
  background: #f9fbfb;
}

.summary-grid,
.two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.summary-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-grid article,
.result-panel {
  padding: 14px;
  border: 1px solid #d8dde6;
  border-radius: 8px;
  background: #ffffff;
}

.summary-label {
  display: block;
  margin-bottom: 6px;
  color: #59656f;
  font-size: 0.85rem;
}

ul {
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
}

li {
  margin-bottom: 8px;
  padding: 10px 12px;
  border: 1px solid #d8dde6;
  border-radius: 6px;
  background: #ffffff;
}

.work-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.work-list li {
  margin-bottom: 0;
}

button {
  min-height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: 6px;
  background: #2f6f9f;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.message {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  background: #ffffff;
}

.success {
  border-color: #2f7d5c;
  background: #e7f7ee;
  color: #1f6548;
  font-weight: 700;
}

.author-card-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.author-card-list li {
  margin-bottom: 0;
  border-width: 2px;
}

.author-card-list div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.author-card-list small {
  display: block;
  margin-top: 6px;
  color: #59656f;
}

.highlighted {
  box-shadow: 0 0 0 3px rgba(47, 125, 92, 0.16);
}

@media (max-width: 760px) {
  .summary-grid,
  .two-column,
  .work-list,
  .author-card-list {
    grid-template-columns: 1fr;
  }
}
</style>
