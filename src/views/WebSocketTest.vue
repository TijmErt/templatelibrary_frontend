<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Reactive variables
const messages = ref<string[]>([]);
const inputMessage = ref<string>('');
let socket: WebSocket | null = null;

// WebSocket initialization
onMounted(() => {
  socket = new WebSocket('ws://localhost:8082/ws');

  socket.onopen = () => {
    console.log('WebSocket connection established.');
  };

  socket.onmessage = (event: MessageEvent) => {
    messages.value.push(event.data);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed.');
  };
});

// Clean up WebSocket on component unmount
onUnmounted(() => {
  if (socket) {
    socket.close();
    socket = null;
  }
});

// Send message to the server
const sendMessage = () => {
  if (socket && socket.readyState === WebSocket.OPEN && inputMessage.value.trim()) {
    socket.send(inputMessage.value);
    inputMessage.value = '';
  }
};
</script>
<template>
  <div>
    <h1>WebSocket Chat</h1>
    <div>
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
    <input v-model="inputMessage" placeholder="Type a message" @keyup.enter="sendMessage" />
  </div>
</template>
<style>
body {
  font-family: Arial, sans-serif;
}
h1 {
  color: #333;
}
input {
  margin-top: 10px;
  padding: 8px;
  width: 300px;
}
</style>

