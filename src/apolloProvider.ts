import { createApolloProvider } from '@vue/apollo-option'
import {apolloClient} from './apolloClient'

export const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})
