import React from "react";

import { useLazyQuery, useMutation } from '@apollo/client';
import { USER_SIGN_IN_QUERY } from "@graphql/authencation/queries";
import { USER_SIGN_UP_MUTATION } from "@graphql/authencation/mutations";

import useAppUserStore from "@stores/appUserStore";

import AsyncStorage from '@react-native-async-storage/async-storage';


const useAuthencation = () => {
  const [qlUserSignIn] = useLazyQuery(USER_SIGN_IN_QUERY);
  const [qlUserSignUp] = useMutation(USER_SIGN_UP_MUTATION);

  const [status, setStatus] = React.useState({});

  const { setAppUser } = useAppUserStore();

  const storeUserData = async (name, password) => {
    try {
      await AsyncStorage.setItem('@user_name', name);
      await AsyncStorage.setItem('@user_password', password);
    } catch (e) {
      // saving error
    }
  }

  const signInAppUser = (input, setProcessing) => {
    const { userNameInput, passwordInput } = input;
    setProcessing(true);

    qlUserSignIn({ variables: { name: userNameInput, password: passwordInput } })
      .then((result) => {
        setProcessing(false);

        if (result.data && result.data["userSignIn"]) {
          const { status, token, appUser } = result.data["userSignIn"];

          switch (status) {
            case "0":
              setStatus({
                flag: "error",
                title: "Login Failed",
                message: "Invalid Username or Password"
              });
              break;

            case "1":
              setStatus({
                flag: "success",
                title: 'Successfully Signed In',
                message: "Welcome to Money Manager!"
              });
              setAppUser({
                name: appUser.name
              }, token);

              storeUserData(userNameInput, passwordInput)
                .then(() => {
                  console.log("User data stored");
                });

              break;

            case "-1":
              setStatus({
                flag: "error",
                title: 'Unknown Error',
                message: "Please try again later"
              });
              break;

            default:
              break;
          }
        } else {
          setStatus({
            flag: "error",
            title: 'Unknown Error',
            message: "Please try again later"
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setProcessing(false);
        setStatus({
          flag: "error",
          title: 'Unknown Error',
          message: "Please try again later"
        });
      });
  };

  const signUpAppUser = (input, setProcessing) => {
    const { userNameInput, passwordInput, emailInput } = input;
    setProcessing(true);

    qlUserSignUp({ variables: { name: userNameInput, password: passwordInput, email: emailInput } })
      .then((result) => {
        setProcessing(false);

        if (result.data && result.data["userSignUp"]) {
          const { status, token, appUser } = result.data["userSignUp"];

          switch (status) {
            case "0-0":
              setStatus({
                flag: "error",
                title: "User Exists",
                message: "Use a different username"
              });
              break;

            case "0-1":
              setStatus({
                flag: "error",
                title: "E-mail Used",
                message: "Use a different e-mail"
              });
              break;

            case "1":
              setStatus({
                flag: "success",
                title: 'Successfully Signed Up',
                message: "Welcome to Money Manager!"
              });

              setAppUser({
                name: appUser.name
              }, token);

              storeUserData(userNameInput, passwordInput)
                .then(() => {
                  console.log("User data stored");
                });

              break;

            case "-1":
              setStatus({
                flag: "error",
                title: 'Unknown Error',
                message: "Please try again later"
              });
              break;

            default:
              break;
          }
        } else {
          setStatus({
            flag: "error",
            title: 'Unknown Error',
            message: "Please try again later"
          });
        }
      })
      .catch((error) => {
        setProcessing(false);
        setStatus({
          flag: "error",
          title: 'Unknown Error',
          message: "Please try again later"
        });
      });
  };

  return {
    signInAppUser,
    signUpAppUser,
    status
  };
};

export default useAuthencation;