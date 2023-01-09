import React from "react";

import { Layout, Text, withStyles } from "@ui-kitten/components"
import { AntDesign } from '@expo/vector-icons';
import { TouchableNativeFeedback } from "react-native";

import useAccountTableStore from "@stores/accountTableStore";

import { truncate } from "@utils/common";

const categoriesTitle = {
  "FOOD": "Food",
  "SALARY": "Salary",
  "TRANSPORTATION": "Transportation",
  "ENTERTAINMENT": "Entertainment",
  "HEALTH": "Health",
  "SHOPPING": "Shopping",
  "PERSONAL": "Personal",
  "TRANSFER": "Transfer",
  "OTHER": "Other",
  "INITIAL": "Initial"
};

const ThemedComponent = ({ eva, transaction, accountID, onPress }) => {
  const { accountNameTable } = useAccountTableStore();

  return (
    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#EEEEEE", false)}>
      <Layout style={eva.style.rootLayout} onTouchEnd={() => onPress(transaction)}>
        <Layout style={eva.style.typeLayout}>
          <Text appearance="hint" style={eva.style.typeText}>
            {/* {transactionTypeTitle[transaction.type]} */}
            {truncate(categoriesTitle[transaction.category], 8)}
          </Text>
        </Layout>
        <Layout style={eva.style.accountsLayout}>
          {
            (() => {
              switch (transaction.type) {
                case "TRANSFER":
                  return (
                    <React.Fragment>
                      <Text style={eva.style.accountText}>
                        {truncate(accountNameTable[transaction.accountSource], 8)}
                      </Text>
                      <AntDesign name="arrowright" size={18} color="black" />
                      <Text style={eva.style.accountText}>
                        {truncate(accountNameTable[transaction.accountDestination], 8)}
                      </Text>
                    </React.Fragment>
                  );
                case "INCOME":
                  return (
                    <React.Fragment>
                      <Text style={eva.style.accountText}>
                        {truncate(accountNameTable[transaction.accountDestination], 20)}
                      </Text>
                    </React.Fragment>
                  );
                case "EXPENSE":
                  <React.Fragment>
                    <Text style={eva.style.accountText}>
                      {truncate(accountNameTable[transaction.accountSource], 20)}
                    </Text>
                  </React.Fragment>
              }
            })()
          }
        </Layout >
        <Layout style={eva.style.amountLayout}>
          <Text
            style={eva.style.amountText}
            status={
              accountID ? (
                transaction.accountDestination === accountID ? "info" : "danger"
              ) : "basic"
            }
          >
            {transaction.amount.toFixed(1)}
          </Text>
        </Layout>
      </Layout>
    </TouchableNativeFeedback >
  );
};

const TransactionInfo = withStyles(ThemedComponent, (theme) => ({
  rootLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderTopWidth: 1,
    borderColor: theme["color-border-100"],
    backgroundColor: theme["color-basic-100"],
  },
  typeLayout: {
    width: "20%",
    backgroundColor: "#00000000"
  },
  typeText: {
    fontSize: 12,
  },
  accountsLayout: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "55%",
    backgroundColor: "#00000000"
  },
  accountText: {
    fontSize: 12,
    marginHorizontal: 5,
  },
  amountLayout: {
    alignItems: "center",
    width: "25%",
    backgroundColor: "#00000000"
  },
  amountText: {
    fontSize: 12,
  },
}));

export default TransactionInfo;