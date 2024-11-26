<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_TEMPLATE_POST } from '../../graphql/templatePostGraphQL';
import { useRoute } from 'vue-router';
import apiClient from '../../axios';
import { VuePDF, usePDF} from '@tato30/vue-pdf'
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
const givenPDF = ref({})
const { pdf, pages } = usePDF(givenPDF)
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
  <div class="pageContainer">

    <div class="contentContainer OrderRight" >
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
      </div>
    </div>
    <div class="pdfContainer OrderLeft" >
      <div v-if="givenPDF" >
        <div v-for="page in pages" :key="page">
          <VuePDF :pdf="pdf" :page="page" :text-layer="true" :annotation-layer="true" fit-parent/>
        </div>
      </div>
    </div>
</div>
</template>

<style scoped>
.pageContainer{
  width: 100%;
  flex-direction: column;
}
.pdfContainer{
  overflow-y: auto;
  max-height: 500px;

}
.contentContainer {
  max-height: fit-content;
  max-width: 700px;
}
@media (min-width: 1024px) {
  .pageContainer{
    width: 100%;
    display: grid;
    grid-template-areas: "contentContainer pdfContainer";
    grid-gap: 100px;

  }
  .pdfContainer{
    overflow-y: auto;
    max-height: 600px;
    max-width: 700px;
  }
  .contentContainer {
    max-height: fit-content;
    max-width: 700px;
  }
  .OrderLeft{
    order: 0;
  }
  .OrderRight{
    order:1;
  }
}
</style>
