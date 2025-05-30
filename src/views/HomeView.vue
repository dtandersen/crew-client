<script setup lang="ts">
import { ref } from 'vue'

const socket = ref<WebSocket | null>(null)
const isConnected = ref(false)

function openWebSocket() {
  if (socket.value) {
    console.log('WebSocket already opened.')
    return
  }

  socket.value = new WebSocket('ws://192.168.0.108:8000/ws')

  socket.value.onopen = () => {
    isConnected.value = true
    console.log('WebSocket connection opened.')

    // Send a JSON message once the socket opens
    const message = {
      action: 'post_message',
      request: {
        receiver: '#ship',
        id: 'ToggleCargoScoop',
        message: {},
      },
    }

    socket.value?.send(JSON.stringify(message))
    console.log('Sent JSON:', message)
  }

  socket.value.onmessage = (event) => {
    console.log('Received:', event.data)
  }

  socket.value.onclose = () => {
    isConnected.value = false
    console.log('WebSocket connection closed.')
  }

  socket.value.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}
</script>

<template>
  <main>
    <button @click="openWebSocket" :disabled="isConnected">
      {{ isConnected ? 'Connected' : 'Open WebSocket' }}
    </button>
  </main>
</template>

<style scoped>
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
