<script setup lang="ts">
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { GET_USER, GET_USERS } from '../graphql/userGraphQL'
import { updateUser, store, emptyUser } from '../state/stateManagement'
import { apolloClient } from '../apolloClient'

// Define a reactive variable to store the fetched users
const Users = ref<{ id: string, userName: string }[]>([])
const selectedUserId = ref<string | null>(null)
const isUsersListVisible = ref(false) // Track visibility of user list
// Query to fetch all users
const { result, loading: queryLoading, error: queryError } = useQuery(GET_USERS, {}, { fetchPolicy: 'cache-and-network' })

onMounted(() =>{
  if(store.currentUser){
    selectedUserId.value = store.currentUser.id
  }
})

// Watch for result changes and update Users when data is fetched
watchEffect(() => {
  if (result.value) {
    Users.value = result.value.getAllUsers || []
  }
})

const selectUser = (userId: string) => {
  if (selectedUserId.value === userId) {
    // Deselect the user if they are already selected
    selectedUserId.value = null
    emptyUser()
  } else {
    selectedUserId.value = userId
    provideApolloClient(apolloClient);
    const {result: queryResult} =useQuery(GET_USER, {id:selectedUserId.value}, { fetchPolicy: 'cache-and-network' })

    watch(queryResult,()=>{
      if (queryResult.value) {
        const user = queryResult.value.getUser;
        updateUser(user);
      }
    })
  }

}

// Function to toggle visibility
const toggleUserList = () => {
  isUsersListVisible.value = !isUsersListVisible.value
}
</script>

<template>
  <button @click="toggleUserList">
    {{ isUsersListVisible ? 'Hide Users' : 'Show Users' }}
  </button>
  <div class="toggleUserContainer" v-if="isUsersListVisible">
    <h1>Users List</h1>

    <!-- Button to toggle visibility -->


    <!-- Loading and error handling -->
    <div v-if="queryLoading">Loading...</div>
    <div v-if="queryError">Error: {{ queryError.message }}</div>

    <!-- Collapsible list of users -->
    <ul v-if="!queryLoading && !queryError">
      <li
        v-for="user in Users"
        :key="user.id"
        :class="{ selected: selectedUserId === user.id }+' listItem '"
        @click="selectUser(user.id)"
        :style="{ cursor: 'pointer', padding: '5px', backgroundColor: selectedUserId === user.id ? '#45a049' : '' }"
      >
        {{ user.userName }} <p v-if="selectedUserId === user.id"> Registered</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.toggleUserContainer{
  width: 300px;
  border-style: dashed;
  background: #282828;
}

/* Styles for selected user */
.selected {
  font-weight: bold;
  background-color: #45a049;
}
.listItem{
  width:fit-content;
  border-radius: 6px;
}
button {
  margin-bottom: 10px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>
