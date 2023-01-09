import React from "react";

import { Input, Layout, Text } from "@ui-kitten/components";
import { withStyles } from "@ui-kitten/components";

import { Popup } from 'react-native-popup-confirm-toast';

import { LoadingButton } from "@components/common";

import useConsecutiveInput from "@hooks/useConsecutiveInput";
import useAuthencation from "@hooks/useAuthencation";

const ThemedComponent = ({ eva }) => {
  const { signUpAppUser, status } = useAuthencation();
  const [userNameInput, setUserNameInput] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");
  const [emailInput, setEmailInput] = React.useState("");

  const [processing, setProcessing] = React.useState(false);

  const {
    inputRefs, inputStatus,
    nextInputFuncs, submitRef, onSubmit
  } = useConsecutiveInput(3, () => {
    signUpAppUser({
      userNameInput, passwordInput, emailInput
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
      <Text category="h1" style={{ margin: 10 }}>Accuont</Text>
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
        ref={inputRefs[1]}
        blurOnSubmit={false}
        secureTextEntry={true}
        onSubmitEditing={nextInputFuncs[1]}
        status={inputStatus[1]}
      />
      <Input
        style={eva.style.input}
        label='E-mail'
        value={emailInput}
        onChangeText={setEmailInput}
        blurOnSubmit={false}
        ref={inputRefs[2]}
        onSubmitEditing={nextInputFuncs[2]}
        status={inputStatus[2]}
      />
      <LoadingButton
        style={eva.style.button}
        ref={submitRef}
        onPress={onSubmit}
        loading={processing}
        indicatorStyle={eva.style.indicator}
      >
        SIGN UP
      </LoadingButton>
      {/* </Layout> */}
    </Layout>
  );
};

const SignUpScreen = withStyles(ThemedComponent, theme => {
  return ({
    rootLayout: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
    titleLayout: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
      maxHeight: "20%",
    },
    // formLayout: {
    //   flex: 1,
    //   justifyContent: "center",
    //   alignItems: "center",
    //   width: "80%",
    //   maxHeight: "62%",
    //   borderRadius: 20,
    //   borderColor: theme["color-border-100"],
    //   borderWidth: 1,
    // },
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

export default SignUpScreen;
