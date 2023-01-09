import React from "react";

import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import { SignInScreen, SignUpScreen } from "@screens/authencation";
import useAppUserStore from "@stores/appUserStore";

const { Navigator, Screen } = createStackNavigator();

const SignInNavigator = ({ navigation, route }) => {
  const { appUser } = useAppUserStore();

  React.useEffect(() => {
    if (appUser) {
      navigation.navigate("ApplicationNavigator");
    }
  }, [appUser]);

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
        name="SignIn"
        component={SignInScreen}
        options={{
          title: 'SIGN IN',
        }}
        initialParams={route.params}
      />
      <Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          title: 'SIGN UP',
        }}
      />
    </Navigator>
  )
};

export default SignInNavigator;