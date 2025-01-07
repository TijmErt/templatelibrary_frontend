<script setup lang="ts">

import NotificationPopUp from '../components/NotificationPopUp.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { Client } from '@stomp/stompjs';

// Example bookmarked posts
const bookmarkedPosts = ref([
  'tempPost-id-1',
  'tempPost-id-2',
]);

interface Message {
  id: string;
  title: string;
  message: string;
}
const updatedMessages = ref<Message[]>([]);
let stompClient: Client;

onMounted(() => {
  stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    connectHeaders: {
      Authorization: `Basic `+ btoa("user:password")  // Add the JWT token to the headers
    },
    onConnect: () => {
      console.log('Connected to WebSocket');

      // Subscribe to topics for each bookmarked post
      bookmarkedPosts.value.forEach((post) => {
        stompClient.subscribe(`/topic/post-updates/${post}`, (message) => {
          const updatedInfo = JSON.parse(message.body);
          updatedMessages.value.push( {
            id: updatedInfo.id,
            title: updatedInfo.title,
            message: updatedInfo.message,
          });
        });
      });
    },
  });

  stompClient.activate();
});

onUnmounted(() => {
  if (stompClient) stompClient.deactivate();
});


const removeClickedMessage =(id:string)=>{
  // Find the index of the message with the given ID
  const index = updatedMessages.value.findIndex((message) => message.id === id);

  if (index !== -1) {
    // Remove the item at the found index
    updatedMessages.value.splice(index, 1);
  }

  console.log(`Removed message with ID: ${id}`);
}
</script>

<template>
  <div class="notification-group" v-if="updatedMessages.length >0">
    <div v-for="(message, index) in updatedMessages" :key="index">
      <NotificationPopUp :message="message" @clickedBox="removeClickedMessage" />
    </div>
  </div>
</template>

<style scoped>
.notification-group{
  border-style: outset;
  padding: 0.5rem;
}
</style>
