<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_TEMPLATE_POST } from '../../graphql/templatePostGraphQL'

interface TemplatePost{
  id: string,
  title: string,
  description: string,
  createdDate: Date,
  fileKey: string,
  author: {
    id: string,
    userName: string,
  },
  categories:{
    id: string,
    name: string,
  }[]
}

// Define a reactive variable to store the result of the query
const getTemplatePost = ref<TemplatePost | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Use the `useQuery` hook from `vue-apollo-composable` to fetch the data
const { result, loading: queryLoading, error: queryError  } = useQuery(GET_TEMPLATE_POST, {
  id: 'tempPost-id-1',
})

// Update loading state
watch(queryLoading, (value) => {
  loading.value = value
})

// Update error state
watch(queryError, (value) => {
  if (value) {
    error.value = value.message
  }
})

watch(result, value => {
  getTemplatePost.value = result.value.getTemplatePost
  console.log(value)
})
</script>
<template>
  <h1>Template Library Searcher</h1>

  <div v-if="loading">
    <p>Loading...</p>
  </div>

  <div v-else-if="error">
    <p>Error: {{ error }}</p>
  </div>
</template>

<style scoped>

</style>
