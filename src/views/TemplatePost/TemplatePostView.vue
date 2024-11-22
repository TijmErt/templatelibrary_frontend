<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_TEMPLATE_POST } from '../../graphql/templatePostGraphQL';
import { useRoute } from 'vue-router';
import apiClient from '../../axios';
import { VuePDF, usePDF, type PDFSrc } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
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
const route = useRoute()
const getTemplatePost = ref<TemplatePost | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const { result, loading: queryLoading, error: queryError  } = useQuery(GET_TEMPLATE_POST, {
  id:  route.params.id ,
})
const givenPDF = ref<PDFSrc>()
const { pdf } = usePDF(givenPDF)

const fetchPDF = async (fileKey: string) => {
  try {
    const responseFile = await apiClient.get(`/get/${fileKey}`,{responseType:'blob' });
    const arrayBuffer = await responseFile.data.arrayBuffer()
    const byteArray = new Uint8Array(arrayBuffer);
    givenPDF.value = byteArray
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
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
  if(getTemplatePost.value){
    fetchPDF(getTemplatePost.value.fileKey)
  }
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
    <h2>{{ getTemplatePost.title }}</h2>
    <p>{{ getTemplatePost.description }}</p>
    <p>Author: {{ getTemplatePost.author.userName }}</p>
    <p>Created on: {{ getTemplatePost.createdDate }}</p>
    <br>
    <div v-for="category in getTemplatePost.categories" v-bind:key="category.id">
      {{category.id}}
      {{category.name}}
    </div>
    <div v-if="givenPDF">
      <VuePDF :pdf="pdf" :text-layer="true" annotation-layer>

      </VuePDF>
    </div>
  </div>
</template>

<style scoped>

</style>
