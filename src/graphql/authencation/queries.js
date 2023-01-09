import { gql } from '@apollo/client';

export const USER_SIGN_IN_QUERY = gql`
query userSignIn($name: String!, $password: String!) {
  userSignIn(name: $name, password: $password) {
    status
    token
    appUser {
      name
      email
    }
  }
}
`;

