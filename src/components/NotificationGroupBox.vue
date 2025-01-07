<script setup lang="ts">

import NotificationPopUp from '../components/NotificationPopUp.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { Client } from '@stomp/stompjs';


const bookmarkedPosts = ref<{ id: string; oldTitle: string }[]>([]);


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
        stompClient.subscribe(`/topic/post-updates/${post.id}`, (message) => {
          const updatedInfo = JSON.parse(message.body);
          const postToUpdate = bookmarkedPosts.value.find((p) => p.id === post.id);

          if (postToUpdate) {
            updatedMessages.value.push({
              id: postToUpdate.id,
              title: postToUpdate.oldTitle, // Use the correct property
              message: updatedInfo.message,
            });
          } else {
            console.error(`Post with ID ${post.id} not found in bookmarkedPosts.`);
          }
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
  <div class="notification-group" v-if="updatedMessages.length > 0">
    <div v-for="(message, index) in updatedMessages" :key="index">
      <NotificationPopUp
        :message="message"
        @clickedBox="removeClickedMessage"
      />
    </div>
  </div>
</template>

<style scoped>
.notification-group {
  border-style: outset;
  padding: 0.5rem;
}
</style>
