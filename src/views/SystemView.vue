<script setup lang="ts">
import { fetchSystems, listMarkets } from '@/client'
import type { Market, System } from '@/types/System'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const address_param = route.params.address as string

const system = ref<System | null>(null)
const errorMsg = ref('')
const markets = ref<Market[] | null>(null)
const aquisition_markets = ref<Market[] | null>(null)
onMounted(async () => {
  errorMsg.value = ''
  system.value = null
  try {
    const address = parseInt(address_param)
    markets.value = (await listMarkets(address, 0)).result.markets

    let aquisition_markets_result = (await listMarkets(address, 30, ['Fortified', 'Stronghold']))
      .result.markets
    aquisition_markets_result.sort((a, b) => a.distance - b.distance)
    aquisition_markets_result = aquisition_markets_result.filter((market) => market.distance > 0)
    aquisition_markets_result = aquisition_markets_result.filter(
      (market) =>
        market.distance <= 20 && ['Fortified', 'Stronghold'].includes(market.power_state || ''),
    )
    aquisition_markets_result = aquisition_markets_result.filter(
      (market) => market.distance <= 30 && ['Stronghold'].includes(market.power_state || ''),
    )
    aquisition_markets.value = aquisition_markets_result

    system.value = await fetchSystems(address)
    if (!system.value) throw new Error('System not found')
  } catch (err: unknown) {
    errorMsg.value = (err as Error).message || 'Error loading system'
  }
})
</script>

<template>
  <main>
    <div v-if="errorMsg" style="color: red">{{ errorMsg }}</div>
    <div v-else-if="system">
      <h1>{{ system.name }}</h1>
      <div>
        State: {{ system.state }}<br />
        Power: {{ system.power }}
      </div>
      <div v-if="markets && markets.length">
        <h2>Local Markets</h2>
        <ul>
          <li v-for="market in markets" :key="market.market_id">
            <strong
              ><a :href="`/markets/${market.market_id}`">{{ market.market_name }}</a></strong
            >
          </li>
        </ul>
      </div>
      <div v-if="aquisition_markets && aquisition_markets.length">
        <h2>Aquisition Markets</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>System</th>
              <th>Pad Size</th>
              <th>Distance (ly)</th>
              <th>Power</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="market in aquisition_markets" :key="market.market_id">
              <td>{{ market.market_name }}</td>
              <td>
                <a :href="`/systems/${market.system_address}`">{{ market.system_name }}</a>
              </td>
              <td>{{ market.landing_pad }}</td>
              <td>{{ market.distance.toFixed(1) }}</td>
              <td>{{ market.power }}</td>
              <td>{{ market.power_state }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else>Loading...</div>
  </main>
</template>

<style scoped>
ul {
  margin-top: 1rem;
  padding-left: 1rem;
}
li {
  margin-bottom: 0.5rem;
}
</style>
