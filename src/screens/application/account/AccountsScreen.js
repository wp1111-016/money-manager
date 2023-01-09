import React from "react";

import { Layout, Text, withStyles } from "@ui-kitten/components";
import { ScrollView, TouchableNativeFeedback } from "react-native";
import { AntDesign } from '@expo/vector-icons';

import useAccountTable from "@hooks/useAccountTable";
import { LoadingLayout, MoreActionsMenu } from "@components/common";

const groups = [
  { key: "CASH", title: "Cash" },
  { key: "BANK_ACCOUNT", title: "Bank Account" },
  { key: "DEBIT_CARD", title: "Debit Card" },
];

const ThemedComponent = ({ eva, navigation }) => {
  const { available, accountTable, refetch } = useAccountTable();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

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

  const navigateToAccountDetail = (account) => {
    navigation.navigate("AccountDetail", { account });
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MoreActionsMenu
          items={[
            { title: "Add Account", action: () => navigation.navigate("AddAccount") },
            { title: "Delete Account", action: () => navigation.navigate("DeleteAccount") }
          ]}
        />
      ),
    })
  }, []);

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
                      <TouchableNativeFeedback
                        key={index}
                        background={TouchableNativeFeedback.Ripple("#EEEEEE", false)}
                      >
                        <Layout
                          style={eva.style.accountGroupItemLayout}
                          accessible={true}
                          onTouchEnd={() => navigateToAccountDetail(account)}
                        >
                          <Text>{account.name}</Text>
                          <Layout style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#00000000" }}>
                            <Text category="c1" appearance="hint" style={{ marginRight: 8 }}>
                              {account.accessRecords.length} transactions
                            </Text>
                            <AntDesign name="arrowright" size={24} color="black" style={{ paddingVertical: 8 }} />
                          </Layout>
                        </Layout>
                      </TouchableNativeFeedback>
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
}

const AccountsScreen = withStyles(ThemedComponent, theme => ({
  primaryColor: theme["color-primary-500"],
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

export default AccountsScreen;
