import React from "react";

import { useQuery, useMutation } from '@apollo/client';
import { LOAD_ACCOUNT_TABLE_QUERY } from "@graphql/account/queries";
import { CREATE_ACCOUNT_MUTATION, DELETE_ACCOUNT_MUTATION } from "@graphql/account/mutations";

import useAppUserStore from "@stores/appUserStore";
import useAccountTableStore from "@stores/accountTableStore";

const useAccountTable = () => {
  const { token } = useAppUserStore();
  const { accountTable, setAccountTable } = useAccountTableStore();

  const [status, setStatus] = React.useState({});
  const [available, setAvailable] = React.useState(false);

  const { loading, error, data, refetch } = useQuery(
    LOAD_ACCOUNT_TABLE_QUERY,
    { variables: { token: token } }
  );

  const [qlCreateAccount] = useMutation(CREATE_ACCOUNT_MUTATION);
  const [qlDeleteAccount] = useMutation(DELETE_ACCOUNT_MUTATION);

  React.useEffect(() => {
    if (!loading && !error && data) {
      const { loadAccountTable } = data;
      if (loadAccountTable) {
        const { status, accounts } = loadAccountTable;
        if (status === "1") {
          setAccountTable(accounts);
          setAvailable(true);
        }
      }
    } else {
      setAvailable(false);
    }
  }, [loading, error, data]);

  const addAccount = (input, setProcessing) => {
    const [group, name, deposit] = input;
    setProcessing(true);

    qlCreateAccount({
      variables: {
        token: token,
        group: group,
        name: name,
        deposit: parseFloat(deposit),
      }
    }).then((result) => {
      setProcessing(false);

      if (result.data && result.data["createAccount"]) {
        const { status, account } = result.data["createAccount"];

        switch (status) {
          case "0":
            setStatus({
              flag: "error",
              title: "Account Exists",
              message: "Please try another name"
            });
            break;

          case "1":
            // refetch();
            setStatus({
              flag: "success",
              title: 'Successfully Added',
              message: "New account is created"
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
      setProcessing(false);
      console.log(error);
      setStatus({
        flag: "error",
        title: 'Unknown Error',
        message: "Please try again later"
      });
    });
  };

  const deleteAccount = (input) => {
    const [accountID] = input;
    console.log(accountID);

    qlDeleteAccount({
      variables: {
        token: token,
        accountID: accountID,
      }
    }).then((result) => {
      if (result.data && result.data["deleteAccount"]) {
        const { status } = result.data["deleteAccount"];

        switch (status) {
          case "1":
            // refetch();
            setStatus({
              flag: "success",
              title: 'Successfully Deleted',
              message: "Account is deleted"
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

  return {
    available, accountTable,
    addAccount, deleteAccount,
    status, refetch
  };
};

export default useAccountTable;