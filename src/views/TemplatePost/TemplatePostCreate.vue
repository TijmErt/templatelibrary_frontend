<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { CREATE_TEMPLATE_POST } from '../../graphql/templatePostGraphQL'

interface TemplatePostInput {
  title: string,
  description: string,
  createdDate: string,
  authorId: string,

  documentName: string,
  documentType: string,
}

const inputModel = ref<TemplatePostInput>({
  title: '',
  description: '',
  createdDate: '',
  authorId: '',

  documentName: '',
  documentType: '',

})
const uploadedFile = ref<File | null>(null);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  console.log("Change triggered");
  if (target.files) {
    uploadedFile.value = target.files[0];
    console.log(uploadedFile.value);
  }

};
const { mutate: createTemplatePost } = useMutation(CREATE_TEMPLATE_POST)
const submitForm = async () => {
  console.log("Submit triggered");
  if (uploadedFile.value) {
    console.log("Submit check passed ");
    console.log(uploadedFile.value);
    console.log(inputModel.value);
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    inputModel.value.createdDate = formattedDate
    await createTemplatePost({ input: inputModel.value, file: uploadedFile.value });
  }
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <input v-model="inputModel.title" placeholder="Title" required />
    <input v-model="inputModel.description" placeholder="Description" />
    <input v-model="inputModel.authorId" placeholder="Author ID" required />
    <input type="text" v-model="inputModel.documentName" placeholder="Document Name" required />
    <input type="text" v-model="inputModel.documentType" placeholder="Document Type" required />
    <input type="file" @change="onFileChange" required />
    <button type="submit">Create Post</button>
  </form>
</template>

<style scoped>

</style>
