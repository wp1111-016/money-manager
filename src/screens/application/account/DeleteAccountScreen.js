import React from "react";

import { Layout, Text, withStyles } from "@ui-kitten/components";
import { ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Popup } from 'react-native-popup-confirm-toast';

import { PressableIcon } from "@components/common";

import useAccountTable from "@hooks/useAccountTable";
import { LoadingLayout } from "@components/common";

const groups = [
  { key: "CASH", title: "Cash" },
  { key: "BANK_ACCOUNT", title: "Bank Account" },
  { key: "DEBIT_CARD", title: "Debit Card" },
];

const ThemedComponent = ({ eva, route, navigation }) => {
  const { available, accountTable, deleteAccount, status } = useAccountTable();

  const [accountListByGroup, setAccountListByGroup] = React.useState(
    Object.fromEntries(groups.map((category) => [category.key, []]))
  );

  React.useEffect(() => {
    if (available) {
      setAccountListByGroup(() => {
        let state = Object.fromEntries(groups.map((category) => [category.key, []]));
        for (let i = 0; i < accountTable.length; i++) {
          const account = accountTable[i];
          state[account.group].push(account);
        }
        return state;
      });
    }
  }, [available, accountTable]);

  const showStatus = (status) => {
    const { flag, title, message } = status;
    switch (flag) {
      case "success":
        Popup.show({
          type: 'success',
          title: title,
          textBody: message,
          buttonEnabled: false,
          duration: 0,
          closeDuration: 50,
          bounciness: 3,
          timing: 1500,
          onCloseComplete: () => {
            navigation.goBack();
          }
        })
        break;
      case "error":
        Popup.show({
          type: 'danger',
          title: title,
          textBody: message,
          buttonEnabled: false,
          duration: 0,
          closeDuration: 50,
          bounciness: 3,
          timing: 1500,
        })
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    showStatus(status);
  }, [status]);

  const [toDeleteAccountID, setToDeleteAccountID] = React.useState(null);
  const [confirmPanelVisible, setConfirmPanelVisible] = React.useState(false);

  React.useEffect(() => {
    if (!confirmPanelVisible && toDeleteAccountID) {
      console.log("Deleting account: " + toDeleteAccountID);
      deleteAccount([toDeleteAccountID]);
      setToDeleteAccountID(null);
    }
  }, [confirmPanelVisible, toDeleteAccountID]);

  const onDeleteAccount = (accountID) => {
    setConfirmPanelVisible(true);
    Popup.show({
      type: 'confirm',
      title: 'Warning',
      textBody: 'Are you sure to continue? This action cannot be undone. All transactions related to this account will be deleted.',
      buttonEnabled: true,
      duration: 0,
      closeDuration: 50,
      bounciness: 3,
      okButtonStyle: {
        backgroundColor: eva.style.dangerColor,
      },
      buttonText: 'Delete',
      confirmButtonStyle: {
        backgroundColor: eva.style.successColor,
      },
      callback: () => {
        Popup.hide();
        setToDeleteAccountID(accountID);
      },
      onCloseComplete: () => {
        setConfirmPanelVisible(false);
      }
    });
  }

  return (
    <LoadingLayout
      style={eva.style.rootLayout}
      loading={!available}
      indicatorStyle={eva.style.indicator}
    >
      <ScrollView>
        <Layout style={eva.style.accountListLayout}>
          {
            groups.map((category, index) => {
              return (
                <Layout key={index} style={eva.style.accountGroupLayout}>
                  <Layout style={eva.style.accountGroupTitleLayout}>
                    <Text >{category.title}</Text>
                    <Text category="c1" appearance="hint">
                      {accountListByGroup[category.key].length} accounts
                    </Text>
                  </Layout>
                  {
                    accountListByGroup[category.key].map((account, index) => (
                      <Layout
                        style={eva.style.accountGroupItemLayout}
                        key={index}
                      >
                        <Text>{account.name}</Text>
                        <Layout style={{ flexDirection: "row", backgroundColor: "#00000000" }}>
                          <PressableIcon
                            padding={6}
                            marginVertical={2}
                            icon={<MaterialIcons name="delete" size={24} color={eva.style.dangerColor} />}
                            onPressIn={() => onDeleteAccount(account._id)}
                          />
                        </Layout>
                      </Layout>
                    ))
                  }
                </Layout>
              );
            })
          }
        </Layout>
      </ScrollView>
    </LoadingLayout>
  );
};

const DeleteAccountScreen = withStyles(ThemedComponent, theme => ({
  primaryColor: theme["color-primary-500"],
  successColor: theme["color-success-500"],
  infoColor: theme["color-info-500"],
  dangerColor: theme["color-danger-500"],
  rootLayout: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: theme["color-border-100"],
  },
  accountListLayout: {
    alignItems: "center",
    width: "100%",
    paddingBottom: 10,
    marginTop: 10,
  },
  accountGroupLayout: {
    width: "95%",
    marginTop: 10,
    borderRadius: 10,
    borderColor: theme["color-border-100"],
    borderWidth: 1,
    overflow: "hidden",
  },
  accountGroupTitleLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: theme["color-basic-200"],
  },
  accountGroupItemLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // paddingTop: 10,
    // paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderTopWidth: 1,
    borderColor: theme["color-border-100"],
    backgroundColor: theme["color-basic-100"],
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
    spinnerSize: 'giant',
  },
}));

export default DeleteAccountScreen;