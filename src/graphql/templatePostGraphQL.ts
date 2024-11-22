import gql from 'graphql-tag';

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
  }
}`
);

export const CREATE_TEMPLATE_POST = gql(`
mutation CreateTemplatePost($input: TemplatePostInput!, $file: Upload) {
  createTemplatePost(input: $input, file: $file)
}`
);
