<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  GET_TEMPLATE_POST,
  UPDATE_TEMPLATE_POST,
} from '../../graphql/templatePostGraphQL'
import { ref, watch } from 'vue'
import router from '../../router/index'
import { GET_ALL_CATEGORIES } from '../../graphql/categoryGraphQL'
import { store } from '../../state/stateManagement'
import { useRoute } from 'vue-router'

interface InputPost {
  title: string
  description: string
  categories: string[]
}
interface Category {
  id: string
  name: string
}
interface TemplatePost {
  id: string
  title: string
  description: string
  createdDate: Date
  fileKey: string
  author: {
    id: string
    userName: string
  }
  categories: {
    id: string
    name: string
  }[]
}
const inputPost = ref<InputPost>({
  title: '',
  description: '',
  categories: [],
})
const totalCategories = ref<Category[]>([])
const route = useRoute()
const currentPostID = route.params.id
const postBeforeEdit = ref<TemplatePost>()

const { mutate: updateTemplatePost } = useMutation(UPDATE_TEMPLATE_POST)

const { onResult: onResultTemplatePost } = useQuery(
  GET_TEMPLATE_POST,
  {
    id: currentPostID,
  },
  { fetchPolicy: 'cache-and-network' },
)

const { onResult: onResultCategories } = useQuery(
  GET_ALL_CATEGORIES,
  {},
  { fetchPolicy: 'cache-and-network' },
)
onResultTemplatePost(queryResult => {
  console.log(queryResult)
  if (!queryResult.loading) {
    postBeforeEdit.value = queryResult.data.getTemplatePost
    if (postBeforeEdit.value) {

      if (checkIfPostIsTheirs()) {
        inputPost.value = {
          title: postBeforeEdit.value.title,
          description: postBeforeEdit.value.description,
          categories: postBeforeEdit.value.categories.map(value => value.id),
        }
      } else {
        router.push({ name: 'home' })
      }

    }
    else {
      console.log("Fetched Post doesn't exist")
    }
  }
  else {
    console.log('TemplatePost is still loading')
  }
})
onResultCategories(queryResult => {
  console.log(queryResult)
  if (!queryResult.loading) {
    totalCategories.value = queryResult.data.getAllCategories
    if (!totalCategories.value) {
      console.log('Categories where not fetched correctly')
    }
  } else {
    console.log('Categories are still loading')
  }
})


const updatePost = async () => {
  if(checkIfPostIsTheirs()){
    try {
      const variables = {
        postID: currentPostID,
        input: {
          title: inputPost.value.title,
          description: inputPost.value.description,
          categories: inputPost.value.categories,
        },
      }
      const response = await updateTemplatePost(variables)
      if (response) {
        console.log('Updated Post:', response.data.updateTemplatePost)
        alert('Template Post updated successfully!')
      }
    } catch (error) {
      console.error('Error updating Template Post:', error)
      alert('Failed to update the Template Post.')
    }
  }
  else{
    alert("this isn't your post")
    router.push({ name: 'home' })
  }

}

// Update selected categories based on checkboxes
const toggleCategory = (categoryId: string) => {
  const index = inputPost.value.categories.indexOf(categoryId)
  if (index === -1) {
    inputPost.value.categories.push(categoryId) // Add category if not already selected
  } else {
    inputPost.value.categories.splice(index, 1) // Remove category if already selected
  }
}
const checkIfPostIsTheirs = () =>{
  if(postBeforeEdit.value){
    if(store.currentUser.id == postBeforeEdit.value.author.id){
      if(store.currentUser.id == postBeforeEdit.value.author.id){
        return true
      }
      else {
        console.log('Post does not belong to current user')
        return false
      }
    }
  }
}

watch(store.currentUser, () => {
  if(!checkIfPostIsTheirs()) {
    router.push({ name: 'home' })
  }
})
</script>

<template>
  <div>
    <h1>Update Template Post</h1>
    <form @submit.prevent="updatePost">
      <div>
        <label for="title">Title</label>
        <input
          id="title"
          v-model="inputPost.title"
          type="text"
          placeholder="Enter title"
        />
      </div>
      <div>
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="inputPost.description"
          placeholder="Enter description"
        ></textarea>
      </div>
      <div>
        <h2>Categories</h2>
        <div v-for="category in totalCategories" :key="category.id">
          <input
            id="{{category.name}}"
            type="checkbox"
            :value="category.id"
            :checked="inputPost.categories.includes(category.id)"
            @change="toggleCategory(category.id)"
          />
          <label for="{{category.name}}">{{ category.name }}</label>
        </div>
      </div>
      <button type="submit">Update Post</button>
    </form>
  </div>
</template>

<style scoped>
form div {
  margin-bottom: 1rem;
}
label {
  display: inline-block;
  font-weight: bold;
}
input[type=text], textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
