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
      ,
`);
