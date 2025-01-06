

<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import { Client } from '@stomp/stompjs';

// Example bookmarked posts
const bookmarkedPosts = reactive([
  { id: '123', title: 'Post 1', status: 'No updates' },
  { id: '456', title: 'Post 2', status: 'No updates' },
]);

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
      bookmarkedPosts.forEach((post) => {
        stompClient.subscribe(`/topic/post-updates/${post.id}`, (message) => {
          const updatedInfo = message.body;
          const postToUpdate = bookmarkedPosts.find((p) => p.id === post.id);
          if (postToUpdate) {
            console.log(updatedInfo);
            postToUpdate.status = updatedInfo; // Update the post status
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
</script>

<template>
  <div>
    <h1>Bookmarked Posts</h1>
    <ul>
      <li v-for="post in bookmarkedPosts" :key="post.id">
        {{ post.title }} - {{ post.status }}
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
