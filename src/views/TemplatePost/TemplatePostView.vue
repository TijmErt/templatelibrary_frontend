<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_TEMPLATE_POST } from '../../graphql/templatePostGraphQL'
import { useRoute } from 'vue-router'

interface TemplatePostModel{
  templatePost:{
    id: string,
    title: string,
    description: string,
    createdDate: Date,
    documentKey: string,
    author: {
      id: string,
      userName: string,
    },
    categories:{
      id: string,
      name: string,
    }[]

  },
  documentModel:{
    documentKey: string,
    documentName: string,
    documentType: string,
    uploadDate: Date,
  }
}


const route = useRoute()
const getTemplatePost = ref<TemplatePostModel | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const { result, loading: queryLoading, error: queryError  } = useQuery(GET_TEMPLATE_POST, {
  id:  route.params.id ,
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

  <div v-else-if="getTemplatePost">
    <h2>{{ getTemplatePost.templatePost.title }}</h2>
    <p>{{ getTemplatePost.templatePost.description }}</p>
    <p>Author: {{ getTemplatePost.templatePost.author.userName }}</p>
    <p>Created on: {{ getTemplatePost.templatePost.createdDate }}</p>
    <br>
    <p>{{ getTemplatePost.documentModel.documentName}}</p>
    <p>{{ getTemplatePost.documentModel.documentType}}</p>
    <p>{{ getTemplatePost.documentModel.uploadDate}}</p>
    <div v-for="category in getTemplatePost.templatePost.categories" v-bind:key="category.id">
      {{category.id}}
      {{category.name}}
    </div>
  </div>
</template>

<style scoped>

</style>
