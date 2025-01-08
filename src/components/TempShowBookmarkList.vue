<script setup lang="ts">

import { getAllBookMarkedPosts, type BookMarkedPost, store } from '../state/stateManagement'
import { onMounted, ref, watch } from 'vue'

const bookmarkedPosts = ref<BookMarkedPost[]>([]);
const listIsEmpty = ref(true);
const isListVisible = ref(false);
onMounted(()=>{
  fillList()
})

watch(store.currentUser, () => {

  fillList()
})

// Function to toggle visibility
const toggleUserList = () => {
  isListVisible.value = !isListVisible.value
}
const fillList=()=>{
    listIsEmpty.value = !(store.currentUser.myBookMarkLists.length > 0);
    bookmarkedPosts.value = getAllBookMarkedPosts()

}
</script>

<template>
  <button @click="toggleUserList">
    {{ isListVisible ? 'Hide bookmarked' : 'Show bookmarked' }}
  </button>
  <div class="toggleUserContainer" v-if="isListVisible">
    <h1>Users List</h1>
    <ul v-if="!listIsEmpty">
      <li v-for="post in bookmarkedPosts" :key="post.id " class="listItem">
        {{post.id}}
        {{ post.title }}
      </li>
    </ul>
    <div v-else class="toggleUserContainer">
      <p>the user has no bookmarked Items</p>
    </div>
  </div>
</template>

<style scoped>
.toggleUserContainer{
  width: 300px;
  border-style: dashed;
  background: #282828;
}
/* Styles for selected user */
.listItem{
  width:fit-content;
  border-radius: 6px;
  padding: 6px;
}
button {
  margin-bottom: 10px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>
