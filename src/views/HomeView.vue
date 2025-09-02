<script setup lang="ts">
import { fetchSystemsByName } from '@/client'
import type { System } from '@/types/System'
import { ref } from 'vue'

const systemName = ref('')
const searchResults = ref<System[]>([])
const errorMsg = ref('')

async function searchSystem(e: Event) {
  e.preventDefault()
  if (!systemName.value) return

  try {
    const systems = await fetchSystemsByName(systemName.value)
    searchResults.value = systems
  } catch (err: unknown) {
    errorMsg.value = (err as Error).message || 'Error searching system'
  }
}
</script>

<template>
  <main>
    <form @submit="searchSystem">
      <input
        name="system"
        type="text"
        v-model="systemName"
        placeholder="Enter star system name"
        autocomplete="off"
      />
      <button type="submit">Search</button>
    </form>
    <div v-if="errorMsg" style="color: red">{{ errorMsg }}</div>
    <div v-if="searchResults.length">
      <h2>Results</h2>
      <ul>
        <li v-for="system in searchResults" :key="system.address">
          <strong>
            <a :href="`/systems/${system.address}`">{{ system.name }}</a> </strong
          ><br />
          Address: {{ system.address }}<br />
          Position: (x: {{ system.position.x }}, y: {{ system.position.y }}, z:
          {{ system.position.z }})
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
ul {
  margin-top: 1rem;
  padding-left: 1rem;
}
li {
  margin-bottom: 0.5rem;
}
a {
  color: #1976d2;
  text-decoration: underline;
}
</style>
