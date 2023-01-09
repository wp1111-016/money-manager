import { gql } from "@apollo/client";

export const UPDATE_TRANSACTION_MUTATION = gql`
mutation updateTransaction(
	$token: String!, 
	$transactionID: String!,
	$date: String,
	$accountSource: String,
	$accountDestination: String,
	$category: String,
	$amount: Float,
	$description: String,
) {
	updateTransaction(input: {
		token: $token,
		_id: $transactionID,
		date: $date,
		accountSource: $accountSource,
		accountDestination: $accountDestination,
		category: $category,
		amount: $amount,
		description: $description
  }) {
		status
		transaction {
			_id
		}
	}
}
`;

export const CREATE_TRANSACTION_MUTATION = gql`
mutation createTransaction(
	$token: String!,
	$type: String!,
	$date: String!,
	$accountSource: String,
	$accountDestination: String,
	$category: String!,
	$amount: Float!,
	$description: String!,
) {
	createTransaction(input: {
		token: $token,
		type: $type,
		date: $date,
		accountSource: $accountSource,
		accountDestination: $accountDestination,
		category: $category,
		amount: $amount,
		description: $description
	}) {
		status
		transaction {
			_id
		}
	}
}
`;

export const DELETE_TRANSACTION_MUTATION = gql`
mutation deleteTransaction($token: String!, $transactionID: String!) {
  deleteTransaction(input: {
    token: $token,
    _id: $transactionID
  }) {
    status
  }
}
`;