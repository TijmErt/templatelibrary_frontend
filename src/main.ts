import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createApolloProvider } from '@vue/apollo-option'


import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'

const app = createApp(App)
const apolloClient = new ApolloClient({
  uri: 'https://localhost:8080/graphql',
  cache: new InMemoryCache(),
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

app.use(router)
app.use(apolloProvider)
app.mount('#app')


