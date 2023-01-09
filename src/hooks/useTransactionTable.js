import React from 'react';

import { useMutation } from '@apollo/client';
import { UPDATE_TRANSACTION_MUTATION, DELETE_TRANSACTION_MUTATION, CREATE_TRANSACTION_MUTATION } from "@graphql/transaction/mutations";

import useAppUserStore from "@stores/appUserStore";

const useTransactionTable = () => {
  const { token } = useAppUserStore();

  const [status, setStatus] = React.useState({});

  const [qlUpdateTransaction] = useMutation(UPDATE_TRANSACTION_MUTATION);
  const [qlDeleteTransaction] = useMutation(DELETE_TRANSACTION_MUTATION);
  const [qlCreateTransaction] = useMutation(CREATE_TRANSACTION_MUTATION);

  const updateTransaction = (input, transactionID) => {
    const { date, accountSource, accountDestination, category, amount, description } = input;
    // console.log({
    //   token: token,
    //   transactionID: transactionID,
    //   date: date,
    //   accountSource: accountSource,
    //   accountDestination: accountDestination,
    //   category: category,
    //   amount: parseFloat(amount),
    //   description: description,
    // });

    qlUpdateTransaction({
      variables: {
        token: token,
        transactionID: transactionID,
        date: date,
        accountSource: accountSource,
        accountDestination: accountDestination,
        category: category,
        amount: parseFloat(amount),
        description: description,
      }
    }).then((result) => {
      console.log(result);
      if (result.data && result.data["updateTransaction"]) {
        const { status, transaction } = result.data["updateTransaction"];

        switch (status) {
          case "-1":
            setStatus({
              flag: "error",
              title: 'Unknown Error',
              message: "Please try again later"
            });
            break;

          case "1":
            setStatus({
              flag: "success",
              title: 'Successfully Modified',
              message: "The transaction info is changed"
            });
            break;

          default:
            break;
        }
      } else {
        setStatus({
          flag: "error",
          title: 'Unknown Error',
          message: "Please try again later"
        });
      }
    }).catch((error) => {
      console.log(error);
      setStatus({
        flag: "error",
        title: 'Unknown Error',
        message: "Please try again later"
      });
    });

  };

  const deleteTransaction = (transactionID) => {

    qlDeleteTransaction({
      variables: {
        token: token,
        transactionID: transactionID,
      }
    }).then((result) => {
      console.log(result);
      if (result.data && result.data["deleteTransaction"]) {
        const { status } = result.data["deleteTransaction"];

        switch (status) {
          case "1":
            // refetch();
            setStatus({
              flag: "success",
              title: 'Successfully Deleted',
              message: "Transaction is deleted"
            });
            break;

          case "-1":
            setStatus({
              flag: "error",
              title: 'Unknown Error',
              message: "Please try again later"
            });
            break;

          default:
            break;
        }
      } else {
        setStatus({
          flag: "error",
          title: 'Unknown Error',
          message: "Please try again later"
        });
      }
    }).catch((error) => {
      console.log(error);
      setStatus({
        flag: "error",
        title: 'Unknown Error',
        message: "Please try again later"
      });
    });
  };

  const createTransaction = (input) => {
    const { type, date, accountSource, accountDestination, category, amount, description } = input;
    // console.log({
    //   type: type,
    //   token: token,
    //   date: date,
    //   accountSource: accountSource,
    //   accountDestination: accountDestination,
    //   category: category,
    //   amount: amount,
    //   description: description,
    // });

    qlCreateTransaction({
      variables: {
        type: type,
        token: token,
        date: date,
        accountSource: accountSource,
        accountDestination: accountDestination,
        category: category,
        amount: parseFloat(amount),
        description: description,
      }
    }).then((result) => {
      console.log(result);
      if (result.data && result.data["createTransaction"]) {
        const { status, transaction } = result.data["createTransaction"];

        switch (status) {
          case "-1":
            setStatus({
              flag: "error",
              title: 'Unknown Error',
              message: "Please try again later"
            });
            break;

          case "1":
            setStatus({
              flag: "success",
              title: 'Successfully Created',
              message: "The transaction is created"
            });
            break;

          default:
            break;
        }
      } else {
        setStatus({
          flag: "error",
          title: 'Unknown Error',
          message: "Please try again later"
        });
      }
    }).catch((error) => {
      console.log(error);
      setStatus({
        flag: "error",
        title: 'Unknown Error',
        message: "Please try again later"
      });
    });
  };

  return {
    status, updateTransaction, deleteTransaction, createTransaction
  };
};

export default useTransactionTable;