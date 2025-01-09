<script setup lang="ts">

import { type TemplatePost, store, getAllMyPosts } from '../state/stateManagement'
import { onMounted, ref, watch } from 'vue'
import router from '../router/index'

const myPosts = ref<TemplatePost[]>([]);
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
  listIsEmpty.value = !(store.currentUser.myPosts.length > 0);
  myPosts.value = getAllMyPosts()

}
const goToPost = (selectedID: string) =>{
  router.push({name:"TemplatePost View",params:{id:selectedID} ,force:true})
}
const goToEditPost = (selectedID: string) =>{
  router.push({name:"TemplatePost Update",params:{id:selectedID} ,force:true})
}
</script>

<template>
  <button @click="toggleUserList">
    {{ isListVisible ? 'Hide my posts' : 'Show my posts' }}
  </button>
  <div class="toggleContainer" v-if="isListVisible">
    <h1>My Posts List</h1>
    <ul v-if="!listIsEmpty">
      <li v-for="post in myPosts" :key="post.id " class="listItem">
        <div @click.self="goToPost(post.id)">
          ID:{{post.id}}
          <br/>
          title:{{ post.title }}
        </div>
        <div class="gotToEdit" @click.stop="goToEditPost(post.id)">
          Edit
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
.gotToEdit{
  cursor: crosshair;
  background: #282828;
  color: white;
}
</style>
