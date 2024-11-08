import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const cache = new InMemoryCache()
const uploadLink = createUploadLink({
  uri: 'http://localhost:8080/graphql', // Update with your server URL
});
export const apolloClient = new ApolloClient({
  cache,
  link: uploadLink,
})
