<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_TEMPLATE_POST } from '../graphql/templatePostGraphQL'

// Define a reactive variable to store the result of the query
const getTemplatePost = ref('')

// Use the `useQuery` hook from `vue-apollo-composable` to fetch the data
const { result } = useQuery(GET_TEMPLATE_POST, {
  id: 'tempPost-id-1',
})

// Watch the query result and assign it to `getTemplatePost` when data is fetched
onMounted(() => {
  if (result.value) {
    getTemplatePost.value = result.value.getTemplatePost
    console.log(getTemplatePost.value)
  }
  else{
    console.log(result.value)
  }

})
watch(result, value => {
  getTemplatePost.value = result.value.getTemplatePost
  console.log(value)
})
</script>

<template>
  <h1>TemplateLibrary Searcher TEST</h1>
  <p>{{ getTemplatePost.valueOf() }}</p>
</template>

<style scoped>

</style>
