import React from "react";

import { Layout, Select, SelectGroup, SelectItem, Text, withStyles } from "@ui-kitten/components"
import { Entypo } from '@expo/vector-icons';
import { TransactionInfoGroup } from "@components/transaction";
import { ScrollView } from "react-native";
import { PressableIcon } from "@components/common";
import { Ionicons } from '@expo/vector-icons';
import { Popup } from 'react-native-popup-confirm-toast';

import useAccountTableStore from "@stores/accountTableStore";
import useAppUserStore from "@stores/appUserStore";

import { useQuery } from "@apollo/client";
import { LOAD_TRANSACTION_TABLE_QUERY } from "@graphql/transaction/queries";

import { truncate } from "@utils/common";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const types = [
  { key: "INCOME", title: "Income" },
  { key: "EXPENSE", title: "Expense" },
  { key: "TRANSFER", title: "Transfer" },
];

const categories = [
  { key: "FOOD", title: "Food" },
  { key: "SALARY", title: "Salary" },
  { key: "TRANSPORTATION", title: "Transportation" },
  { key: "ENTERTAINMENT", title: "Entertainment" },
  { key: "HEALTH", title: "Health" },
  { key: "SHOPPING", title: "Shopping" },
  { key: "PERSONAL", title: "Personal" },
  { key: "TRANSFER", title: "Transfer" },
  { key: "OTHER", title: "Other" },
  { key: "INITIAL", title: "Initial" }
];

const ThemedComponent = ({ eva, navigation }) => {
  const { accountNameTable } = useAccountTableStore();
  const accountEmpty = Object.keys(accountNameTable).length === 0;

  const onAddIconPressed = accountEmpty ? () => {
    Popup.show({
      type: 'danger',
      title: 'Operation not allowed',
      textBody: 'You need to create at least one account before adding a transaction.',
      buttonEnabled: false,
      duration: 0,
      closeDuration: 50,
      bounciness: 3,
      timing: 1500,
    });
  } : () => {
    navigation.navigate("AddTransaction");
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PressableIcon
          marginHorizontal={8}
          marginVertical={8}
          padding={8}
          onPressIn={onAddIconPressed}
          icon={<Ionicons name="add" size={24} color="black" />}
        />
      ),
    })
  }, [accountEmpty]);

  const { token } = useAppUserStore();

  const [viewYear, setViewYear] = React.useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = React.useState(new Date().getMonth());

  const startDate = new Date(viewYear, viewMonth, 1).toUTCString();
  const endDate = new Date(viewYear, viewMonth + 1, 0).toUTCString();

  const increaseMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const decreaseMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const [multiSelectedIndex, setMultiSelectedIndex] = React.useState([]);

  const typeFilterKeys = multiSelectedIndex
    .filter((index) => index.section === 0)
    .map((index) => types[index.row].key);

  const categoryFilterKeys = multiSelectedIndex
    .filter((index) => index.section === 1)
    .map((index) => categories[index.row].key);

  const filters = [
    typeFilterKeys.length === 0 ? null : "type",
    categoryFilterKeys.length === 0 ? null : "category"
  ];
  const filterKeys = [[...typeFilterKeys], [...categoryFilterKeys]];

  const selectedTypesStringLimit = categoryFilterKeys.length === 0 ? 26 : 13;
  const selectedCategoriesStringLimit = typeFilterKeys.length === 0 ? 26 : 13;

  const selectedTypesString = truncate(multiSelectedIndex
    .filter((index) => index.section === 0)
    .map((index) => types[index.row].title).join(", "),
    selectedTypesStringLimit
  );

  const selectedCategoriesString = truncate(multiSelectedIndex
    .filter((index) => index.section === 1)
    .map((index) => categories[index.row].title).join(", "),
    selectedCategoriesStringLimit
  );

  const selectedString = selectedTypesString === "" ? selectedCategoriesString : (
    selectedCategoriesString === "" ? selectedTypesString : (
      `${selectedTypesString}, ${selectedCategoriesString}`
    )
  );

  const [transactionListByDay, setTransactionListByDay] = React.useState(
    Array.apply(null, Array(31))
      .map(() => ({ transactions: [] }))
  );

  const { loading, error, data, refetch } = useQuery(LOAD_TRANSACTION_TABLE_QUERY, {
    variables: {
      token: token,
      // startDate: startDate,
      // endDate: endDate,
      filters: filters,
      filterKeys: filterKeys,
    }
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (!loading && !error && data) {
      const { loadTransactionTable } = data;
      if (loadTransactionTable.transactions) {
        const { transactions } = loadTransactionTable;
        setTransactionListByDay(() => {
          let state = Array.apply(null, Array(31)).map(() => ({ transactions: [] }));
          for (let transaction of transactions) {
            const date = new Date(parseInt(transaction.date));
            if (date.getMonth() === viewMonth && date.getFullYear() === viewYear)
              state[date.getDate() - 1].transactions.push(transaction);
          }

          for (let i = 0; i < state.length; i++) {
            if (state[i].transactions.length > 0) {
              state[i].balance = { year: viewYear, month: viewMonth, day: i + 1 };
              state[i].balance.deposit = state[i].transactions
                .filter((transaction) => transaction.type === "INCOME")
                .reduce((acc, transaction) => acc + transaction.amount, 0);
              state[i].balance.withdrawal = state[i].transactions
                .filter((transaction) => transaction.type === "EXPENSE")
                .reduce((acc, transaction) => acc + transaction.amount, 0);
              state[i].balance.total = state[i].balance.deposit - state[i].balance.withdrawal;
            }
          }

          return state;
        });
      }
    }
  }, [loading, error, data, viewMonth, viewYear]);

  const deposit = transactionListByDay
    .filter((day) => day.balance)
    .reduce((acc, day) => acc + day.balance.deposit, 0);
  const withdrawal = transactionListByDay
    .filter((day) => day.balance)
    .reduce((acc, day) => acc + day.balance.withdrawal, 0);
  const total = deposit - withdrawal;

  return (
    <Layout style={eva.style.rootLayout}>
      <Layout style={eva.style.timeRangeLayout}>
        <Entypo name="chevron-small-left" size={36} color="black" onPress={decreaseMonth} />
        <Text style={eva.style.timeRangeText}>
          {monthNames[viewMonth].substring(0, 3)} {viewYear}
        </Text>
        <Entypo name="chevron-small-right" size={36} color="black" onPress={increaseMonth} />
      </Layout>
      <Layout style={eva.style.statsLayout}>
        <Layout style={eva.style.statsBlockLayout}>
          <Text style={eva.style.statsText}>Deposit</Text>
          <Text style={eva.style.statsText} status="info">{deposit.toFixed(1)}</Text>
        </Layout>
        <Layout style={eva.style.statsBlockLayout}>
          <Text style={eva.style.statsText}>Withdrawal</Text>
          <Text style={eva.style.statsText} status="danger">{withdrawal.toFixed(1)}</Text>
        </Layout>
        <Layout style={eva.style.statsBlockLayout}>
          <Text style={eva.style.statsText}>Total</Text>
          <Text style={eva.style.statsText} status={total >= 0 ? "info" : "danger"}>
            {total.toFixed(1)}
          </Text>
        </Layout>
      </Layout>
      <ScrollView>
        <Layout style={eva.style.transactionListLayout}>
          {
            transactionListByDay
              .filter(({ balance }) => balance)
              .reverse()
              .map(({ balance, transactions }, index) => {
                return (
                  <TransactionInfoGroup
                    key={index}
                    transactions={transactions}
                    balance={balance}
                    onPress={(transaction) => navigation.navigate("TransactionInfo", { transaction: transaction })}
                  />
                )
              })
          }
        </Layout>
      </ScrollView>
      <Layout style={eva.style.filterLayout}>
        <Select
          style={eva.style.filterInput}
          value={selectedString}
          multiSelect={true}
          selectedIndex={multiSelectedIndex}
          placeholder="Select Filter"
          onSelect={index => setMultiSelectedIndex(index)}
        >
          <SelectGroup title="Type">
            {
              types.map((type, index) => (
                <SelectItem title={type.title} key={index} />
              ))
            }
          </SelectGroup>
          <SelectGroup title="Category">
            {
              categories.map((category, index) => (
                <SelectItem title={category.title} key={index} />
              ))
            }
          </SelectGroup>
        </Select>
      </Layout>
    </Layout>
  )
};

const TransactionsScreen = withStyles(ThemedComponent, theme => {
  return {
    rootLayout: {
      flex: 1,
      justifyContent: "flex-start",
      width: "100%",
      borderBottomWidth: 1,
      borderColor: theme["color-border-100"],
    },
    timeRangeLayout: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: theme["color-border-100"],
    },
    timeRangeText: {
      fontSize: 18,
      marginHorizontal: 8,
    },
    statsLayout: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: theme["color-border-100"],
    },
    statsBlockLayout: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: `${100 / 3}%`,
    },
    statsText: {
      fontSize: 11,
    },
    transactionListLayout: {
      flex: 1,
      alignItems: "center",
      width: "100%",
      paddingBottom: 8,
    },
    filterLayout: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
      paddingVertical: 8,
      borderTopWidth: 1,
      borderColor: theme["color-border-100"],
    },
    indicator: {
      justifyContent: 'center',
      alignItems: 'center',
      spinnerSize: 'giant',
    },
    filterInput: {
      width: "90%",
      marginTop: 5,
      marginBottom: 5,
    },
    filterInputItem: {
      fontSize: 10,
    },
  };
});

export default TransactionsScreen;