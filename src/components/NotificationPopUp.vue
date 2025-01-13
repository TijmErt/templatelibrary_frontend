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
  <h3>{{message.title}} : {{message.message}}</h3>

</div>
</template>

<style scoped>
.messageContainer{
  border-style: groove;
  padding: 1rem;
  background-color: var(--color-background);
  box-shadow: var(--shadow-base);
  border-width: 2px;
}
.messageContainer:hover{
  cursor: pointer;
  text-decoration-line: underline;
}
</style>
