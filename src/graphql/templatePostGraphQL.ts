import gql from 'graphql-tag';

export const GET_FILTERED_TEMPLATE_POST = gql(`
query getFilteredTemplatePosts ($pageInfo: PageInfoInput, $searchTerm: String){
  getFilteredTemplatePosts(pageInfo:$pageInfo, searchTerm:$searchTerm ){
    posts{
      id
      title
      description
      createdDate
      avgRating
      author{
        id
        userName
      }
      categories{
        name
      }
    }
    pageInfo{
      limit
      page
      total
      totalPages
      sortField
      sortOrder
      hasNextPage
      hasPreviousPage
    }
  }
}
`)


export const GET_TEMPLATE_POST = gql(`
 query GetTemplatePost($id: String!) {
  getTemplatePost(id: $id) {
    id
    title
    description
    createdDate
    fileKey
    author {
          id
          userName
        }
    reviews {
      id
      content
      rating
      author {
        id
        userName
      }
    }
    categories{
      id
      name
    }
    avgRating
  }
}`
);

export const CREATE_TEMPLATE_POST = gql(`
mutation CreateTemplatePost($input: TemplatePostInput!, $file: Upload) {
  createTemplatePost(input: $input, file: $file)
}`
);

export const UPDATE_TEMPLATE_POST = gql(`
  mutation UpdateTemplatePost($postID: ID!, $input: UpdateTemplatePostInput!) {
    updateTemplatePost(postID: $postID, input: $input) {
      id
      title
      description
      createdDate
      fileKey
      avgRating
      author {
        id
        userName
      }
      categories {
        id
        name
      }
      reviews {
        id
        content
        rating
      }
    }
  }
`);

