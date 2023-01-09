import React from "react";

import { Layout, Text, withStyles } from "@ui-kitten/components"
import TransactionInfo from "./TransactionInfo";

import { getWeekDay } from "@utils/common";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ThemedComponent = ({ eva, transactions, balance, accountID, onPress }) => {
  return (
    <Layout style={eva.style.infoGroupLayout}>
      <Layout style={eva.style.infoGroupTitleLayout}>
        <Layout style={eva.style.infoGroupDateLayout}>
          <Text style={eva.style.dateText}>
            {String(balance.day).padStart(2, '0')}
          </Text>
          <Layout style={eva.style.weekdayTagLayout}>
            <Text style={eva.style.weekdayTagText} status="control">
              {dayNames[getWeekDay(balance.year, balance.month, balance.day)].substring(0, 3)}
            </Text>
          </Layout>
        </Layout>
        <Layout style={eva.style.statsLayout}>
          <Layout style={eva.style.statsTextLayout}>
            <Text style={eva.style.statsText} status="info">{balance.deposit.toFixed(1)}</Text>
          </Layout>
          <Layout style={eva.style.statsTextLayout}>
            <Text style={eva.style.statsText} status="danger">{balance.withdrawal.toFixed(1)}</Text>
          </Layout>
        </Layout>
      </Layout>
      {
        transactions.map((transaction, index) => (
          <TransactionInfo
            key={index}
            transaction={transaction}
            accountID={accountID}
            onPress={onPress}
          />
        ))
      }
    </Layout>
  );
};

const TransactionInfoGroup = withStyles(ThemedComponent, (theme) => ({
  infoGroupLayout: {
    width: "95%",
    marginTop: 10,
    borderRadius: 10,
    borderColor: theme["color-border-100"],
    borderWidth: 1,
    overflow: "hidden",
  },
  infoGroupTitleLayout: {
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
  infoGroupDateLayout: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#00000000",
  },
  weekdayTagLayout: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme["color-primary-500"],
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  weekdayTagText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 6,
  },
  statsLayout: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "50%",
    backgroundColor: "#00000000",
  },
  statsTextLayout: {
    alignItems: "center",
    width: "50%",
    backgroundColor: "#00000000",
  },
  statsText: {
    fontSize: 12,
    marginHorizontal: 6,
  },
  rootCard: {
    marginTop: 8,
    marginHorizontal: 8,
    borderRadius: 8,
  },
}));

export default TransactionInfoGroup;