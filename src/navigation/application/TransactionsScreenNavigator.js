import React from "react";

import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import { TransactionsScreen, TransactionInfoScreen, AddTransactionScreen } from "@screens/application/transaction";

const { Navigator, Screen } = createStackNavigator();

const TransactionsScreenNavigator = () => {

  return (
    <Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          borderBottomWidth: 1,
        },
        gestureEnabled: true,
        gestureDirection: "horizontal",
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: 'Transactions',
          headerLeft: () => null,
        }}
      />
      <Screen
        name="TransactionInfo"
        component={TransactionInfoScreen}
        options={{
          title: 'Transaction',
        }}
      />
      <Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          title: 'Add Transaction',
        }}
      />
    </Navigator>
  )
};

export default TransactionsScreenNavigator;