import React from "react";

import { Dimensions } from "react-native";
import { Input, Layout, Text } from "@ui-kitten/components";
import { withStyles } from "@ui-kitten/components";

import { Popup } from 'react-native-popup-confirm-toast';

import { LoadingButton } from "@components/common";

import useConsecutiveInput from "@hooks/useConsecutiveInput";
import useAuthencation from "@hooks/useAuthencation";

const ThemedComponent = ({ eva, route, navigation }) => {
  const { initialUserName, initialPassword } = route.params;

  const { signInAppUser, status } = useAuthencation();
  const [userNameInput, setUserNameInput] = React.useState(initialUserName);
  const [passwordInput, setPasswordInput] = React.useState(initialPassword);

  const [processing, setProcessing] = React.useState(false);

  const {
    inputRefs, inputStatus, nextInputFuncs,
    submitRef, onSubmit
  } = useConsecutiveInput(2, () => {
    signInAppUser({
      userNameInput, passwordInput
    }, setProcessing);
  });

  const showStatus = (status) => {
    const { flag, title, message } = status;
    switch (flag) {
      case "success":
        Popup.show({
          type: 'success',
          title: title,
          textBody: message,
          buttonEnabled: false,
          duration: 0,
          closeDuration: 50,
          bounciness: 3,
          timing: 1500,
        })
        break;
      case "error":
        Popup.show({
          type: 'danger',
          title: title,
          textBody: message,
          buttonEnabled: false,
          duration: 0,
          closeDuration: 50,
          bounciness: 3,
          timing: 1500,
        })
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    showStatus(status);
  }, [status]);

  return (
    <Layout style={eva.style.rootLayout}>
      {/* <Layout style={eva.style.formLayout} level="2"> */}
      <Text category="h1" style={{ margin: 10 }}>Welcome</Text>
      <Input
        style={eva.style.input}
        label="Username"
        value={userNameInput}
        onChangeText={setUserNameInput}
        blurOnSubmit={false}
        ref={inputRefs[0]}
        onSubmitEditing={nextInputFuncs[0]}
        status={inputStatus[0]}
      />
      <Input
        style={eva.style.input}
        label='Password'
        value={passwordInput}
        onChangeText={setPasswordInput}
        blurOnSubmit={false}
        secureTextEntry={true}
        ref={inputRefs[1]}
        onSubmitEditing={nextInputFuncs[1]}
        status={inputStatus[1]}
      />
      <LoadingButton
        style={eva.style.button}
        ref={submitRef}
        onPress={onSubmit}
        loading={processing}
        indicatorStyle={eva.style.indicator}
      >
        SIGN IN
      </LoadingButton>
      {/* </Layout> */}
      <Layout style={eva.style.footerLayout}>
        <Text appearance="hint">
          Don't have an account?&nbsp;
          <Text
            appearance="hint"
            status="primary"
            category="p2"
            onPress={() => { navigation.navigate("SignUp") }}
          >
            Sign Up
          </Text>
        </Text>
      </Layout>
    </Layout >
  );
};

const SignInScreen = withStyles(ThemedComponent, theme => {
  return ({
    rootLayout: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: Dimensions.get("window").height,
    },
    titleLayout: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
      maxHeight: "20%",
    },
    input: {
      width: "80%",
      marginTop: 10,
      marginBottom: 10,
    },
    button: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 15,
      marginBottom: 15,
      width: "80%",
    },
    indicator: {
      justifyContent: 'center',
      alignItems: 'center',
      spinnerSizeL: 'small',
    },
    footerLayout: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
      maxHeight: "5%",
    }
  })
});

export default SignInScreen;
