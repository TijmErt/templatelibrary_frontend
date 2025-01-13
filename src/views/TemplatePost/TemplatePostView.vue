<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_TEMPLATE_POST } from '../../graphql/templatePostGraphQL';
import { useRoute,onBeforeRouteUpdate } from 'vue-router';
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
    avgRating:number,
}
const route = useRoute()
const currentPostID = route.params.id;
const getTemplatePost = ref<TemplatePost | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
// ...

onBeforeRouteUpdate(async (to) => {
  // react to route changes...
  refetch({id: to.params.id})
})

const { result, loading: queryLoading, error: queryError, refetch } = useQuery(GET_TEMPLATE_POST, {
  id:  currentPostID ,
},{fetchPolicy:'cache-and-network'})
const givenPDF = ref({})
const { pdf, pages } = usePDF(givenPDF)
const fetchPDF = async (fileKey: string) => {
  try {
    const responseFile = await apiClient.get(`/get/${fileKey}/pdf`,{responseType:'blob' });
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
        <div class="contentHeader textShadow">
          <h2>{{ getTemplatePost.title }}</h2>
          <p>rating: {{getTemplatePost.avgRating}}</p>
          <p>Author: {{ getTemplatePost.author.userName }}</p>
        </div>

        <div class="contentBody">
          <div class="categoryBody">
            <div v-for="category in getTemplatePost.categories" v-bind:key="category.id" class="categoryPart">
              {{category.name}}
            </div>
          </div>

          <div class="descriptionBody">
            <p>{{ getTemplatePost.description }}</p>
            <br/>
            <hr/>
            <i>Created on: {{ getTemplatePost.createdDate }}</i>
          </div>

        </div>
      </div>
    </div>
    <div class="pdfContainer OrderLeft " >
      <div v-if="givenPDF"  >
        <div v-for="page in pages" :key="page">
          <VuePDF class="vue-pdf" :pdf="pdf" :page="page" :text-layer="true" :annotation-layer="true" :fit-parent=true intent="display"/>
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
  overflow: hidden;
  max-height: 500px;
  border-radius: var(--radius-standard);
  border-width: 0;
  box-shadow: var(--shadow-base-inset);
  padding: 20px;
}

.pdfContainer:hover{
  overflow: auto;
}

.contentContainer {
  max-height: fit-content;
  max-width: fit-content;
  background-color: var(--color-background-soft);
  border-radius: var(--radius-standard);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.contentHeader{
  background-color: var(--color-background-box-secondary);
  padding: 10px;
  border-radius: var(--radius-standard);
  margin-bottom: 10px;
}

.contentBody{
  padding: 10px;
  color: var(--color-text-alt);
}

.categoryBody{
  width: 95%;
  margin: 0 auto 10px auto;
  background-color: var(--color-background-box-secondary);
  padding: 10px;
  border-radius: var(--radius-standard);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.categoryPart{
  border-radius: 20px;
  border-width: 1px;
  padding: 3px 7px;
  background-color: var(--color-background);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.descriptionBody{
  margin: 0 auto 10px auto;
  padding: 10px;
}

@media (min-width: 1024px) {
  .pageContainer{
    width: 100%;
    display: grid;
    grid-template-areas: "contentContainer pdfContainer";
    grid-gap: 100px;

  }
  .pdfContainer{
    max-height: 600px;
    max-width: 700px;
    overflow-x: hidden;
  }
  .pdfContainer:hover{
    overflow: auto;
    overflow-x: hidden;
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
