import { ApolloClient, InMemoryCache, ApolloLink, concat } from '@apollo/client/core'
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const cache = new InMemoryCache()
const uploadLink = createUploadLink({
  uri: 'http://localhost:8080/graphql', // Update with your server URL
});

const token = btoa("user:password")

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: "basic "+token,
    }
  }));
  return forward(operation);
})

export const apolloClient = new ApolloClient({
  cache,
  link: concat(authMiddleware,uploadLink),
})
