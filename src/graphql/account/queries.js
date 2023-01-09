import { gql } from '@apollo/client';

export const LOAD_ACCOUNT_TABLE_QUERY = gql`
query loadAccountTable($token: String!) {
  loadAccountTable(token: $token) {
    status
    accounts {
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

