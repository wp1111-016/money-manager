import React from "react";

import { Layout, Text, withStyles } from "@ui-kitten/components"
import { Entypo } from '@expo/vector-icons';
import { TransactionInfoGroup } from "@components/transaction";

import useAppUserStore from "@stores/appUserStore";

import { useQuery } from "@apollo/client";
import { LOAD_TRANSACTIONS_BY_IDS_QUERY } from "@graphql/transaction/queries";
import { ScrollView } from "react-native";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const ThemedComponent = ({ eva, route, navigation }) => {
  const { account } = route.params;
  const { token } = useAppUserStore();

  React.useEffect(() => {
    navigation.setOptions({ title: account.name });
  }, []);

  const [viewYear, setViewYear] = React.useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = React.useState(new Date().getMonth());

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

  const transactionIDs = account.accessRecords
    .map((accessRecord) => accessRecord.transaction);

  const [balances, setBalances] = React.useState([]);

  React.useEffect(() => {
    setBalances(
      account.balances.filter((balance) => {
        return balance.year === viewYear && balance.month === viewMonth;
      })
    );
  }, [viewYear, viewMonth]);

  const [transactionListByDay, setTransactionListByDay] = React.useState(
    Array.apply(null, Array(31))
      .map(() => ({ transactions: [] }))
  );

  const { loading, error, data, refetch } = useQuery(
    LOAD_TRANSACTIONS_BY_IDS_QUERY, {
    variables: { token: token, transactionIDs: transactionIDs }
  });

  React.useEffect(() => {
    if (!loading && !error && data) {
      const { loadTransactionsByIDs } = data;
      if (loadTransactionsByIDs.transactions) {
        const { transactions } = loadTransactionsByIDs;
        setTransactionListByDay(() => {
          let state = Array.apply(null, Array(31)).map(() => ({ transactions: [] }));
          for (let transaction of transactions) {
            const date = new Date(parseInt(transaction.date));
            state[date.getDate() - 1].transactions.push(transaction);
          }
          for (let balance of balances) {
            state[balance.day - 1].balance = balance;
          }
          return state;
        });
      }
    }
  }, [loading, error, data, balances]);

  const deposit = balances.reduce((acc, balance) => {
    return acc + balance.deposit;
  }, 0);
  const withdrawal = balances.reduce((acc, balance) => {
    return acc + balance.withdrawal;
  }, 0);
  const balance = deposit - withdrawal;

  const totalBalance = account.balances.reduce((acc, balance) => {
    return acc + balance.balance;
  }, 0);

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
          <Text style={eva.style.statsText}>{balance.toFixed(1)}</Text>
        </Layout>
        <Layout style={eva.style.statsBlockLayout}>
          <Text style={eva.style.statsText}>Balance</Text>
          <Text style={eva.style.statsText} status={totalBalance >= 0 ? "info" : "danger"}>
            {totalBalance.toFixed(1)}
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
                    accountID={account._id}
                    onPress={(transaction) => navigation.navigate("TransactionInfo", { transaction: transaction })}
                  />
                )
              })
          }
        </Layout>
      </ScrollView>
    </Layout>
  )
};

const AccountDetailScreen = withStyles(ThemedComponent, theme => {
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
      width: "25%",
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
    indicator: {
      justifyContent: 'center',
      alignItems: 'center',
      spinnerSize: 'giant',
    },
  };
});

export default AccountDetailScreen;