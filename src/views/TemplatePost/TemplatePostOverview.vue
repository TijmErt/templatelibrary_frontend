<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_FILTERED_TEMPLATE_POST } from '../../graphql/templatePostGraphQL'

interface TemplatePost{
  id: string,
  title: string,
  description: string,
  createdDate: Date,
  avgRating: string,
  author: {
    id: string,
    userName: string,
  },
  categories:{
    name: string,
  }[]
}

interface PageInfo {
  limit: number
  page: number
  total: number
  totalPages: number
  sortField: string
  sortOrder: string
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Define a reactive variable to store the result of the query
const Posts = ref<TemplatePost[] | null>(null)
const pageInfo = ref<PageInfo> ({
  limit:4,
  page:0,
  total:0,
  totalPages:0,
  sortField:"avgRating",
  sortOrder:"desc",
  hasNextPage:true,
  hasPreviousPage:false
})
const loading = ref(true)
const error = ref<string | null>(null)

const { result,refetch, loading: queryLoading, error: queryError  } = useQuery(GET_FILTERED_TEMPLATE_POST, {
  pageInfo: pageInfo.value,
  searchTerm:""
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
  Posts.value = result.value.getFilteredTemplatePosts.posts
  pageInfo.value = result.value.getFilteredTemplatePosts.pageInfo
  console.log(value)
})
const PageInfoInput = computed(() => {
  console.log(pageInfo.value)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...cleanedPageInfo } = pageInfo.value
  console.log(cleanedPageInfo)
  return cleanedPageInfo
})

// Pagination functions
const nextPage = () => {
  if (pageInfo.value?.hasNextPage) {
    pageInfo.value = {
      ...pageInfo.value,
      page: pageInfo.value.page + 1,
    }
    refetch({pageInfo: PageInfoInput.value, searchTerm: "" })
  }
}

const previousPage = () => {
  if (pageInfo.value?.hasPreviousPage) {
    pageInfo.value = {
      ...pageInfo.value,
      page: pageInfo.value.page - 1,
    }
    refetch({ pageInfo: PageInfoInput.value, searchTerm: "" })
  }
}
</script>
<template>
  <h1>Template Library Searcher</h1>

  <div v-if="loading">
    <p>Loading...</p>
  </div>

  <div v-else-if="error">
    <p>Error: {{ error }}</p>
  </div>
  <div v-else-if="result" class="postsBox">
    <div v-for="post in Posts" :key="post.id" class="postContainer">
      <!-- You can display the properties of each post here -->
      <h2>{{ post.title }}</h2>
      <p>Rating: {{ post.avgRating }}</p>
      <p>Author: {{ post.author.userName }}</p>
      <p>Categories:
        <span v-for="(category, index) in post.categories" :key="index">{{ category.name +" " }}</span>
      </p>
    </div>

  </div>
  <div class="pagination">
    <button @click="previousPage" :disabled="!pageInfo?.hasPreviousPage">Previous</button>
    <span>Page {{ pageInfo?.page + 1 }} of {{ pageInfo?.totalPages }}</span>
    <button @click="nextPage" :disabled="!pageInfo?.hasNextPage">Next</button>
  </div>
</template>

<style scoped>
.postsBox{
  width: 100%;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 10px;
}
.postContainer{
  padding: 10px;
  border-style: outset;
}
</style>
