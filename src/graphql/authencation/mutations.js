import { gql } from "@apollo/client";

export const USER_SIGN_UP_MUTATION = gql`
mutation userSignUp($name: String!, $password: String!, $email: String!) {
  userSignUp(input: {
    name: $name,
    password: $password,
    email: $email
  }) {
    status
    token
    appUser {
      name
      email
    }
  }
}
`;