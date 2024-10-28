<script lang="ts">
import {defineComponent, ref} from 'vue'
import {GET_TEMPLATE_POST} from '../graphql/templatePostGraphQL'
import { useQuery } from '@vue/apollo-composable';

const templatePostId = ref('jouw-template-post-id'); // vervang met de echte ID
const { result: data, loading, error } = useQuery(GET_TEMPLATE_POST, {
  id: templatePostId.value,
});
export default defineComponent({
  name: 'TemplatePostOverview',
})

interface TemplatePost{

}
</script>

<template>
  <h1>TemplateLibrary Searcher</h1>
</template>

<style scoped></style>
