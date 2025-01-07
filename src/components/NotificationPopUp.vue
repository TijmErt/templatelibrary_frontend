<script setup lang="ts">

import router from '../router/index'
const emit = defineEmits<{clickedBox: [id:string]}>()
const props = defineProps<{
  message: {
    id: string;
    title:string,
    message:string,
  }
}>()
const message = props.message

const routeTo =()=>{
  router.push({ name: 'TemplatePost View', params: { id: message.id } ,force:true});
  emit('clickedBox',message.id)
}

</script>

<template>
<div class="messageContainer" @click="routeTo()">
  <p>{{message.title}} : {{message.message}}</p>

</div>
</template>

<style scoped>
.messageContainer{
  border-style: groove;
  padding: 1rem;
}
</style>
