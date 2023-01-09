import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import { default as theme } from "./theme.json";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import { Root } from "react-native-popup-confirm-toast";

import { ApplicationNavigator, AuthencationNavigator } from "@navigation";

import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { ScrollView, StyleSheet, Dimensions, View } from "react-native";

import { GRAPHQL_HTTP_URI, GRAPHQL_WS_URI } from "@env";

import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthencation from "@hooks/useAuthencation";


const httpLink = new HttpLink({
  uri: GRAPHQL_HTTP_URI,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: GRAPHQL_WS_URI,
    options: {
      lazy: true,
    }
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      nextFetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
      nextFetchPolicy: 'no-cache',
    },
  },
});

const style = StyleSheet.create({
  rootLayout: {
    width: "100%",
    height: Dimensions.get("window").height,
  }
});


const { Navigator, Screen } = createStackNavigator();

export default function App() {
  const [cacheLoading, setCacheLoading] = React.useState(true);
  const [cacheData, setCacheData] = React.useState({
    initialUserName: "", initialPassword: ""
  });

  React.useEffect(() => {
    const getUserData = async () => {
      try {
        const user_name = await AsyncStorage.getItem('@user_name');
        const user_password = await AsyncStorage.getItem('@user_password');
        if (user_name !== null && user_password !== null) {
          setCacheData({
            initialUserName: user_name,
            initialPassword: user_password,
          });
        }
      } catch (e) {
        // error reading value
      }
      setCacheLoading(false);
    };
    getUserData();
  }, []);



  return (
    <ApolloProvider client={client}>
      <ApplicationProvider {...eva} theme={{ ...theme, ...eva.light }}>
        {/* <AppContainer /> */}
        <Root>
          <ScrollView>
            <View style={style.rootLayout}>
              {
                cacheLoading ? null : (
                  <NavigationContainer>
                    <Navigator>
                      <Screen
                        name="AuthencationNavigator"
                        component={AuthencationNavigator}
                        options={{
                          headerShown: false,
                        }}
                        initialParams={cacheData}
                      />
                      <Screen
                        name="ApplicationNavigator"
                        component={ApplicationNavigator}
                        options={{
                          headerShown: false,
                        }}
                      />
                    </Navigator>
                  </NavigationContainer>
                )
              }
            </View>
          </ScrollView>
        </Root>
      </ApplicationProvider>
    </ApolloProvider>
  );
}
