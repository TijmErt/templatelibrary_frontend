<script lang="ts">

import { GET_TEMPLATE_POST } from '../graphql/templatePostGraphQL'

export default {
  apollo: {
    getTemplatePost: {
      query: GET_TEMPLATE_POST,
      variables: {
        id: 'tempPost-id-1',
      },
    },
  },

  data() {
    return {
      getTemplatePost: '',
    }
  },
}
</script>

<template>
  <h1>TemplateLibrary Searcher</h1>
  <p>{{ getTemplatePost }}</p>
</template>

<style scoped></style>
