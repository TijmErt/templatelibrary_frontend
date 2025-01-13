<script setup lang="ts">

import { getAllBookMarkedPosts, type TemplatePost, store } from '../state/stateManagement'
import { onMounted, ref, watch } from 'vue'
import router from '../router/index'

const bookmarkedPosts = ref<TemplatePost[]>([]);
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
const goToPost = (selectedID: string) =>{
  router.push({name:"TemplatePost View",params:{id:selectedID} ,force:true})
}

</script>

<template>
  <button @click="toggleUserList">
    {{ isListVisible ? 'Hide bookmarked' : 'Show bookmarked' }}
  </button>
  <div class="toggleContainer" v-if="isListVisible">
    <h1>BookMarkedPost List</h1>
    <ul v-if="!listIsEmpty">
      <li v-for="post in bookmarkedPosts" :key="post.id " class="listItem">
        <div @click="goToPost(post.id)">
          ID: {{post.id}}
          <br/>
          title: {{ post.title }}
        </div>
      </li>
    </ul>
    <div v-else class="listItem">
      <p style="padding: 6px">the user has no bookmarked Items</p>
    </div>
  </div>
</template>

<style scoped>
.toggleContainer{
  width: 350px;
  border-style: dashed;
  background: #282828;
  padding: 20px;
}
/* Styles for selected user */
.listItem{
  width:fit-content;
  border-style: double;
  border-radius: 6px;
  padding: 6px;
  margin: 5px;
  cursor: pointer;
}
button {
  margin-bottom: 10px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}
.listItem:hover{
  text-decoration-line: underline;
}

</style>
