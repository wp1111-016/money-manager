import { gql } from '@apollo/client';

export const LOAD_TRANSACTIONS_BY_IDS_QUERY = gql`
query loadTransactionsByIDs($token: String!, $transactionIDs: [String]!) {
  loadTransactionsByIDs(token: $token, transactionIDs: $transactionIDs) {
    status
    transactions {
      type
      date
      accountSource
      accountDestination
      category
      amount
      description
      _id
    }
  }
}
`;

export const LOAD_TRANSACTION_TABLE_QUERY = gql`
query loadTransactionTable(
  $token: String!, 
  $startDate: String, $endDate: String,
  $filters: [String]!, $filterKeys: [[String]]!
) {
  loadTransactionTable(
    token: $token, 
    startDate: $startDate, endDate: $endDate,
    filters: $filters, filterKeys: $filterKeys 
  ) {
    status
    transactions {
      type
      date
      accountSource
      accountDestination
      category
      amount
      description
      _id
    }
  }
}
`;