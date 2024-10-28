import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'

const app = createApp(App)

app.use(router)

app.mount('#app')

const apolloClient = new ApolloClient({
  uri: 'https://jouw-server-endpoint/graphql',
  cache: new InMemoryCache(),
})

provideApolloClient(apolloClient)
