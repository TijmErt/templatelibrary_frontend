import gql from 'graphql-tag';


export const GET_USERS = gql(`
  query getUsers {
    getAllUsers{
      id
      userName
    }
  }
`);

export const GET_USER = gql(`
query getUser($id: String!) {
  getUser(id:$id){
    id
    userName
    email
    myBookMarkLists{
      id
      title
      bookMarkedPosts{
        id
        title
      }
    }
    myPosts{
      id
      title
    }
  }
}
`)
