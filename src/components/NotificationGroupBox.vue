<script setup lang="ts">
import NotificationPopUp from '../components/NotificationPopUp.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Client, type StompSubscription } from '@stomp/stompjs'
import {
  getAllBookMarkedPosts,
  store,
  type TemplatePost,
} from '../state/stateManagement'

const bookmarkedPosts = ref<TemplatePost[]>([])

interface Message {
  id: string
  title: string
  message: string
}
const updatedMessages = ref<Message[]>([])
let stompClient: Client
const subscriptions = ref<StompSubscription[]>([])

const WebSocketConnect = () => {
  if (store.currentUser.myBookMarkLists) {
    bookmarkedPosts.value = getAllBookMarkedPosts()
  }

  stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    connectHeaders: {
      Authorization: `Basic ` + btoa('user:password'), // Add the JWT token to the headers
    },
  })
  Subscribe()
  stompClient.activate()
}

const WebSocketDisconnect = () => {
  if (stompClient) {
    subscriptions.value.forEach(sub => sub.unsubscribe())
    subscriptions.value = [] // Clear subscriptions
    stompClient.deactivate()
  }
}
const Subscribe = () => {
  stompClient.onConnect = () => {

    // Subscribe to topics for each bookmarked post
    bookmarkedPosts.value.forEach(post => {
      const subscription = stompClient.subscribe(
        `/topic/post-updates/${post.id}`,
        message => {
          const updatedInfo = JSON.parse(message.body)
          const postToUpdate = bookmarkedPosts.value.find(p => p.id === post.id)

          if (postToUpdate) {
            updatedMessages.value.push({
              id: postToUpdate.id,
              title: postToUpdate.title, // Use the correct property
              message: updatedInfo.message,
            })
          } else {
            console.error(
              `Post with ID ${post.id} not found in bookmarkedPosts.`,
            )
          }
        },
      )
      if (subscription) {
        subscriptions.value.push(subscription) // Save the subscription for cleanup later
      }
    })
  }
}

onMounted(() => {
  if (store.currentUser.id !== '') {
    WebSocketConnect()
  }
})
onUnmounted(() => {
  WebSocketDisconnect()
})

watch(store.currentUser, () => {
  WebSocketDisconnect()
  if (store.currentUser.id !== '') {
    WebSocketConnect()
  }
})

const removeClickedMessage = (id: string) => {
  // Find the index of the message with the given ID
  const index = updatedMessages.value.findIndex(message => message.id === id)

  if (index !== -1) {
    // Remove the item at the found index
    updatedMessages.value.splice(index, 1)
  }

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
