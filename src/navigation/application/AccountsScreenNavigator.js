import React from "react";

import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import { AccountsScreen, AccountDetailScreen, AddAccountScreen, DeleteAccountScreen } from "@screens/application/account";
import { TransactionInfoScreen } from "@screens/application/transaction";

const { Navigator, Screen } = createStackNavigator();

const AccountsScreenNavigator = () => {

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
        name="Accounts"
        component={AccountsScreen}
        options={{
          title: 'Accounts',
          headerLeft: () => null,
        }}
      />
      <Screen
        name="AccountDetail"
        component={AccountDetailScreen}
        options={{
          title: 'Detail',
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
        name="AddAccount"
        component={AddAccountScreen}
        options={{
          title: 'Add Account',
        }}
      />
      <Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{
          title: 'Delete Account',
        }}
      />
    </Navigator>
  )
};

export default AccountsScreenNavigator;