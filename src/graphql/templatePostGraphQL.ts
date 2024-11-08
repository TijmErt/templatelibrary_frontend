import gql from 'graphql-tag';

export const GET_TEMPLATE_POST = gql(`
  query GetTemplatePost($id: String!) {
    getTemplatePost(id: $id) {
      templatePost {
        id
        title
        description
        createdDate
        documentKey
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
      documentModel {
        documentKey
        documentName
        documentType
        uploadDate
      }
    }
  }
`);

export const CREATE_TEMPLATE_POST = gql(`
mutation CreateTemplatePost($input: TemplatePostInput!, $file: Upload!) {
    createTemplatePost(input: $input, file: $file) {
      templatePost {
        id
        title
        description
        createdDate
        documentKey
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
      documentModel {
        documentKey
        documentName
        documentType
        uploadDate
      }
    }
  }`
);
