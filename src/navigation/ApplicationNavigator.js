import React from "react";

import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

import { AccountsScreenNavigator, TransactionsScreenNavigator } from "@navigation/application";

const { Navigator, Screen } = createBottomTabNavigator();

import useAccountTable from "@hooks/useAccountTable";

const BottomTabBar = ({ navigation, state }) => {
  return (
    <BottomNavigation
      options={{
        tabBarStyle: {
          borderTopWidth: 1
        }
      }}

      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <BottomNavigationTab
        icon={<Entypo name="text-document-inverted" size={24} color="black" />}
      />
      <BottomNavigationTab
        icon={<MaterialIcons name="account-balance" size={24} color="black" />}
      />
    </BottomNavigation>
  );
};

const TabNavigator = () => (
  <Navigator
    tabBar={(props) => <BottomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Screen name="TransactionsScreen" component={TransactionsScreenNavigator} />
    <Screen name="AccountsScreen" component={AccountsScreenNavigator} />
  </Navigator>
);

const AppNavigator = ({ navigation }) => {
  const { } = useAccountTable();
  // console.log(accountNameTable);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });
  }, [navigation]);

  return (
    <TabNavigator />
  )
};

export default AppNavigator;
