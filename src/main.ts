import './assets/main.css'

import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apolloClient'


const app = createApp({
  render: () => h(App),

})
app.provide(DefaultApolloClient, apolloClient)
app.use(router)
app.mount('#app')


