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
          email
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
      }
      documentModel {
        documentKey
        documentName
        documentType
        uploadDate
      }
    }
  }
      ,
`);
