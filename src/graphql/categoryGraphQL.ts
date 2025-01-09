import gql from 'graphql-tag';

export const GET_ALL_CATEGORIES = gql(`
query getAllCategories{
  getAllCategories{
    id
    name
  }
}
`)
