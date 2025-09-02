// src/services/userService.ts
import axios from 'axios'
import type { MarketResult, System } from '@/types/System' // Import the User interface

const API_BASE_URL = 'http://localhost:9988'

export async function fetchSystems(system_address: number): Promise<System> {
  const response = await axios.get<System>(
    `${API_BASE_URL}/systems/${encodeURIComponent(system_address)}`,
  )
  return response.data
}

export async function fetchSystemsByName(system_name: string): Promise<System[]> {
  const response = await axios.get<System[]>(
    `${API_BASE_URL}/systems?name=${encodeURIComponent(system_name)}`,
  )
  return response.data
}

export async function fetchSystemByAddress(address: number): Promise<System> {
  const response = await axios.get<System>(`${API_BASE_URL}/systems/${address}`)
  return response.data
}

export async function listMarkets(
  address: number,
  distance: number = 0,
  power_state?: string[],
): Promise<MarketResult> {
  const url = new URL(`${API_BASE_URL}/markets`)
  url.searchParams.append('system', address.toString())
  url.searchParams.append('distance', distance.toString())

  if (power_state) {
    power_state.forEach((state) => url.searchParams.append('power_state', state))
  }
  const response = await axios.get<MarketResult>(url.toString())
  return response.data
}
