import React from "react";

import { IndexPath, Input, Layout, Select, SelectItem } from "@ui-kitten/components";
import { withStyles } from "@ui-kitten/components";

import { Popup } from 'react-native-popup-confirm-toast';

import { LoadingButton } from "@components/common";

import useAppUserStore from "@stores/appUserStore";
import useConsecutiveInput from "@hooks/useConsecutiveInput";

import useAccountTable from "@hooks/useAccountTable";

const groups = [
  { key: "CASH", title: "Cash" },
  { key: "BANK_ACCOUNT", title: "Bank Account" },
  { key: "DEBIT_CARD", title: "Debit Card" },
];

const ThemedComponent = ({ eva, route, navigation }) => {
  const { token } = useAppUserStore();
  const { addAccount, status } = useAccountTable();

  const [groupSelectedIndex, setGroupSelectedIndex] = React.useState(new IndexPath(0));
  const [nameInput, setnameInput] = React.useState("New Account");
  const [depositInput, setDepositInput] = React.useState("1234");

  const [processing, setProcessing] = React.useState(false);

  const {
    inputRefs, inputStatus, nextInputFuncs,
    submitRef, onSubmit
  } = useConsecutiveInput(2, () => {
    addAccount([
      groups[groupSelectedIndex.row].key, nameInput, depositInput
    ], setProcessing);
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
          onCloseComplete: () => {
            navigation.goBack();
          }
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
      <Select
        style={eva.style.input}
        label="Group"
        value={groups[groupSelectedIndex.row].title}
        selectedIndex={groupSelectedIndex}
        onSelect={setGroupSelectedIndex}
      >
        {
          groups.map((group) => (
            <SelectItem key={group.key} title={group.title} />
          ))
        }
      </Select>
      <Input
        style={eva.style.input}
        label="Name"
        value={nameInput}
        onChangeText={setnameInput}
        blurOnSubmit={false}
        ref={inputRefs[0]}
        onSubmitEditing={nextInputFuncs[0]}
        status={inputStatus[0]}
      />
      <Input
        style={eva.style.input}
        label='Deposit'
        value={depositInput}
        onChangeText={setDepositInput}
        blurOnSubmit={false}
        ref={inputRefs[1]}
        onSubmitEditing={nextInputFuncs[1]}
        status={inputStatus[1]}
      />
      <LoadingButton
        style={eva.style.button}
        ref={submitRef}
        onPress={onSubmit}
        loading={processing}
        // loading={false}
        indicatorStyle={eva.style.indicator}
      >
        ADD
      </LoadingButton>
    </Layout >
  );
};

const AddAccountScreen = withStyles(ThemedComponent, theme => {
  return {
    rootLayout: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      borderBottomWidth: 1,
      borderColor: theme["color-border-100"],
    },
    formLayout: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
      maxHeight: "50%",
      // height: "fit-content",
      borderRadius: 20,
      borderColor: theme["color-border-100"],
      borderWidth: 1,
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
  };
});

export default AddAccountScreen;