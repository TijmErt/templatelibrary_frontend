<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_FILTERED_TEMPLATE_POST } from '../../graphql/templatePostGraphQL'
import router from '../../router/index'

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
  __typename?: string;
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
},{fetchPolicy:'cache-and-network'}
  )

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
const goToPost = (postId: string) =>{
  router.push({ name: 'TemplatePost View', params: { id: postId } ,force:true});
}
</script>
<template>
  <div class="header-overview textShadow">
    <h1>Template Library Searcher</h1>
    <h2>Results: {{pageInfo.total}}</h2>
  </div>

  <div v-if="loading">
    <p>Loading...</p>
  </div>

  <div v-else-if="error">
    <p>Error: {{ error }}</p>
  </div>
  <div v-else-if="result" class="postsBox">
    <div v-for="post in Posts" :key="post.id" class="postContainer" @click.left="goToPost(post.id)">
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
.header-overview{
  background-color: var(--color-background-box-secondary);
  border-radius: 5px 5px 0 0;
  padding: 5px 15px
}
.postsBox{
  width: 100%;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 10px;
  background-color: var(--color-background-soft);
  padding: 25px;
  border-radius: 0 0 5px 5px;
  border-collapse: collapse;
  border-style: inset;
  border-color: var(--vt-c-black);
  box-shadow: 2px 7px 5px rgba(0, 0, 0, 0.3) inset, -2px 0px 5px rgba(0, 0, 0, 0.3) inset ;
}
.postContainer{
  padding: 10px;
  border-style: outset;
  border-width: 2px;
  background-color: var(--color-background-white);
  border-color: var(--vt-c-black);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  color: var(--color-text-alt);

}

.pagination{
  color: var(--color-text-alt);
}
</style>
