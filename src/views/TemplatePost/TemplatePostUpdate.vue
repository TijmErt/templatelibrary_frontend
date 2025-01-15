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

    <form @submit.prevent="updatePost" class="form-container">
      <div class="form-header textShadow">
        <h1>Update Template Post</h1>
      </div>
      <div class="form-field">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="inputPost.title"
          type="text"
          placeholder="Enter title"
        />
      </div>
      <div class="form-field">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="inputPost.description"
          placeholder="Enter description"
        ></textarea>
      </div>
      <div class="form-field">
        <h2>Categories</h2>
        <div v-for="category in totalCategories" :key="category.id" class="categoryPart">
          <input
            id="{{category.name}}"
            type="checkbox"
            :value="category.id"
            :checked="inputPost.categories.includes(category.id)"
            @change="toggleCategory(category.id)"
          />
          <label style="margin-left: 10px" for="{{category.name}}">{{ category.name }}</label>
        </div>
      </div>
      <button type="submit">Update Post</button>
    </form>
  </div>
</template>

<style scoped>
.form-header{
  background-color: var(--color-background-box-secondary);
  color: var(--color-text);
  padding: 10px;
  border-radius: 10px;
  text-align: center; /* Centers the text content inside the header */
}
/* Container for the entire form */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Adds spacing between fields */
  max-width: 400px; /* Limits form width */
  margin: 0 auto; /* Centers the form horizontally */
  background-color: var(--color-background-soft);
  color: var(--color-text-alt);

  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.form-field {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
}

.categoryPart{
  border-radius: 20px;
  border-width: 1px var(--vt-c-black) solid;
  padding: 4px;
  background-color: var(--color-background);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
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
  padding: 10px 15px;
  font-size: 1em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 auto 20px auto;
}
button:hover {
  background-color: #45a049;
}
</style>
