import { gql } from "@apollo/client";

export const CREATE_ACCOUNT_MUTATION = gql`
mutation createAccount($token: String!, $group: String!, $name: String!, $deposit: Float!) {
  createAccount(input: {
    token: $token,
    group: $group,
    name: $name,
    deposit: $deposit
  }) {
    status
    account {
      group
      name
      balances {
        year
        month
        day
        deposit
        withdrawal
        balance
      }
      accessRecords {
        date
        type
        amount
        transaction
      }
      _id
    }
  }
}
`;

export const DELETE_ACCOUNT_MUTATION = gql`
mutation deleteAccount($token: String!, $accountID: String!) {
  deleteAccount(input: {
    token: $token,
    _id: $accountID
  }) {
    status
  }
}
`;