<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { CREATE_TEMPLATE_POST } from '../../graphql/templatePostGraphQL'

interface TemplatePostInput {
  title: string
  description: string
  createdDate: string
  authorId: string
}

const inputModel = ref<TemplatePostInput>({
  title: '',
  description: '',
  createdDate: '',
  authorId: '',
})

// Type for error messages
interface Errors {
  title?: string
  description?: string
  file?: string
}
const errors = ref<Errors>({})
const uploadedFile = ref<File | null>(null)

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  console.log('Change triggered')
  if (target.files) {
    uploadedFile.value = target.files[0]
    console.log(uploadedFile.value)
    errors.value.file = ''
  }
}

const validateField = (field: keyof Errors): void => {
  if (field === 'title') {
    const titleRegex = /^[a-zA-Z0-9&_\- ]{4,}$/ // Minimum 4 characters, allowed special chars: & _ -
    if (!inputModel.value.title.trim()) {
      errors.value.title = 'Titel is verplicht.'
    } else if (!titleRegex.test(inputModel.value.title)) {
      errors.value.title =
        'Titel moet minstens 4 tekens bevatten en mag alleen & _ - bevatten.'
    } else {
      errors.value.title = ''
    }
  } else if (field === 'description') {
    const descriptionRegex = /^[a-zA-Z0-9&_\-.,!? ]{11,}$/
    if (!inputModel.value.description.trim()) {
      errors.value.description = 'Omschrijving is verplicht.'
    } else if (!descriptionRegex.test(inputModel.value.description)) {
      errors.value.description =
        'Omschrijving moet minstens 11 tekens bevatten en geen gevaarlijke tekens.'
    } else {
      errors.value.description = ''
    }
  } else if (field === 'file') {
    const allowedFileTypes = [,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ,
      'application/pdf',
    ]
    if (!uploadedFile.value) {
      errors.value.file = 'Een bestand is verplicht.'
    } else if (!allowedFileTypes.includes(uploadedFile.value.type)) {
      errors.value.file =
        'Bestandstype niet toegestaan. Alleen DOC, DOCX, ODT en PDF zijn toegestaan.'
    } else {
      errors.value.file = ''
    }
  }
}

const { mutate: createTemplatePost } = useMutation(CREATE_TEMPLATE_POST)
const submitForm = async () => {
  validateField('title')
  validateField('description')
  validateField('file')
  if (Object.values(errors.value).some(error => error)) {
    console.error('Validatie mislukt:', errors.value)
    return // Stop form submission
  }

  console.log('Submit triggered')
  if (uploadedFile.value) {
    console.log('Submit check passed ')
    console.log(uploadedFile.value)
    console.log(inputModel.value)
    const date = new Date()
    const formattedDate = date.toISOString().split('T')[0]
    inputModel.value.createdDate = formattedDate
    try {
      await createTemplatePost({
        input: inputModel.value,
        file: uploadedFile.value,
      })
      console.log('Post succesvol aangemaakt!')
    } catch (error) {
      console.error('Fout tijdens het maken van post:', error)
    }
  }
}
</script>

<template>
  <form @submit.prevent="submitForm" class="form-container">
    <!-- Title field with validation error -->
    <div class="form-field">
      <input
        v-model="inputModel.title"
        placeholder="Title"
        required
        @blur="validateField('title')"
      />
      <span v-if="errors.title" class="error">{{ errors.title }}</span>
    </div>

    <!-- Description field as a textarea with validation error -->
    <div class="form-field">
      <textarea
        v-model="inputModel.description"
        placeholder="Description"
        rows="6"
        @blur="validateField('description')"
      ></textarea>
      <span v-if="errors.description" class="error">{{
          errors.description
        }}</span>
    </div>

    <!-- Author ID field -->
    <div class="form-field">
      <input
        v-model="inputModel.authorId"
        placeholder="Author ID"
        required
      />
    </div>

    <!-- File input with validation error -->
    <div class="form-field">
      <input
        type="file"
        @change="onFileChange"
        required
        accept=" application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf"
      />
      <span v-if="errors.file" class="error">{{ errors.file }}</span>
    </div>

    <button type="submit">Create Post</button>
  </form>
</template>

<style scoped>
/* Container for the entire form */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Adds spacing between fields */
  max-width: 400px; /* Limits form width */
  margin: 0 auto; /* Centers the form horizontally */
}

/* Styles for individual fields */
.form-field {
  display: flex;
  flex-direction: column;
}

/* Input fields */
input[type="text"],
input[type="file"] {
  padding: 8px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Error message styling */
.error {
  color: red;
  font-size: 0.85em;
  margin-top: 5px;
}

/* Submit button styling */
button {
  padding: 10px 15px;
  font-size: 1em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>

