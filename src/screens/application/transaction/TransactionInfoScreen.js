import React from "react";

import { Dimensions, TouchableNativeFeedback, View } from "react-native";
import { Button, Input, Layout, Text, Select, SelectItem, IndexPath } from "@ui-kitten/components";
import { withStyles } from "@ui-kitten/components";

import DateTimePicker from '@react-native-community/datetimepicker';

import { Popup } from 'react-native-popup-confirm-toast';

import useAccountTableStore from "@stores/accountTableStore";
import useTransactionTable from "@hooks/useTransactionTable";

const typesTitle = {
  "INCOME": "Income",
  "EXPENSE": "Expense",
  "TRANSFER": "Transfer",
};

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

const PropertyBlock = ({ style, title, children }) => {
  return (
    <Layout style={style.propertyBlockLayout}>
      <Layout style={style.propertyTitleLayout}>
        <Text
          status="info"
          style={style.propertyTitleText}>
          {title}
        </Text>
      </Layout>
      <Layout style={style.propertyContentLayout}>
        {
          React.Children.map(children, (child) => {
            return child;
          })
        }
      </Layout>
    </Layout>
  );
}

const ThemedComponent = ({ eva, route, navigation }) => {
  const { accountNameTable } = useAccountTableStore();
  const accountNamePairs = Object.entries(accountNameTable);
  const categoriesTitlePairs = Object.entries(categoriesTitle);
  const typesTitlePairs = Object.entries(typesTitle);

  const { transaction, allowModify } = route.params;

  React.useEffect(() => {
    navigation.setOptions({
      title: typesTitle[transaction.type],
    });
  }, []);

  const initialDate = new Date(parseInt(transaction.date));
  const [date, setDate] = React.useState(initialDate);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const yearString = date.getFullYear().toString();
  const monthString = (date.getMonth() + 1).toString().padStart(2, '0');
  const dayString = date.getDate().toString().padStart(2, '0');
  const dateString = `${yearString} / ${monthString} / ${dayString}`;

  const hourString = date.getHours().toString().padStart(2, '0');
  const minuteString = date.getMinutes().toString().padStart(2, '0');
  const timeString = `${hourString} : ${minuteString}`;

  const initialFromIndex = accountNamePairs.findIndex(([accountID, name]) => accountID === transaction.accountSource);
  const [fromInput, setFromInput] = React.useState(new IndexPath(initialFromIndex));

  const initialToIndex = accountNamePairs.findIndex(([accountID, name]) => accountID === transaction.accountDestination);
  const [toInput, setToInput] = React.useState(new IndexPath(initialToIndex));

  const initialAccountIndex = accountNamePairs.findIndex(([accountID, name]) => (
    accountID === transaction.accountDestination || accountID === transaction.accountSource
  ));
  const [accountInput, setAccountInput] = React.useState(new IndexPath(initialAccountIndex));

  const initialCategoryIndex = categoriesTitlePairs.findIndex(([key, title]) => key === transaction.category);
  const [categoryInput, setCategoryInput] = React.useState(new IndexPath(initialCategoryIndex));

  const initialAmount = transaction.amount.toString();
  const [amountInput, setAmountInput] = React.useState(initialAmount);

  const initialDescription = transaction.description;
  const [descriptionInput, setDescriptionInput] = React.useState(initialDescription);

  const isInfoAvailable = amountInput !== "" && fromInput.row !== toInput.row && (
    initialDate.getFullYear() !== date.getFullYear() ||
    initialDate.getMonth() !== date.getMonth() ||
    initialDate.getDate() !== date.getDate() ||
    initialDate.getHours() !== date.getHours() ||
    initialDate.getMinutes() !== date.getMinutes() ||
    initialFromIndex !== fromInput.row ||
    initialToIndex !== toInput.row ||
    initialAccountIndex !== accountInput.row ||
    initialCategoryIndex !== categoryInput.row ||
    initialAmount !== amountInput ||
    initialDescription !== descriptionInput
  );
  // const hasInfoChanged = true;
  // console.log(hasInfoChanged)

  const accountOptions = accountNamePairs.map(([accountID, name]) => (
    <SelectItem key={accountID} title={name} />
  ));

  const categoryOptions = categoriesTitlePairs.map(([key, title]) => (
    <SelectItem key={key} title={title} />
  ));

  const { status, updateTransaction, deleteTransaction } = useTransactionTable();

  const onSave = () => {
    updateTransaction({
      date: date.toISOString(),  // timestamp
      accountSource: transaction.type === "EXPENSE" ? accountNamePairs[accountInput.row][0] : (
        transaction.type === "TRANSFER" ? accountNamePairs[fromInput.row][0] : null
      ),
      accountDestination: transaction.type === "INCOME" ? accountNamePairs[accountInput.row][0] : (
        transaction.type === "TRANSFER" ? accountNamePairs[toInput.row][0] : null
      ),
      category: categoriesTitlePairs[categoryInput.row][0],
      amount: parseFloat(amountInput),
      description: descriptionInput,
    }, transaction._id);
  }

  const onDelete = () => {
    deleteTransaction(transaction._id);
  }

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
      {
        showDatePicker ? (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(event, selectedDate) => {
              const { type } = event;
              if (type === "set") {
                setDate(selectedDate);
              }
              setShowDatePicker(false);
            }}
          />) : null
      }
      {
        showTimePicker ? (
          <DateTimePicker
            value={date}
            mode="time"
            onChange={(event, selectedDate) => {
              const { type } = event;
              if (type === "set") {
                setDate(selectedDate);
              }
              setShowTimePicker(false);
            }}
          />) : null
      }
      <Layout style={eva.style.wrapperLayout}>
        <PropertyBlock title="Date" style={eva.style}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple("#EEEEEE", false)}
            onPressOut={() => setShowDatePicker(true)}
          >
            <Layout style={eva.style.dateInput}>
              <Text style={eva.style.dateText}>
                {dateString}
              </Text>
            </Layout>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple("#EEEEEE", false)}
            onPressOut={() => setShowTimePicker(true)}
          >
            <Layout style={eva.style.timeInput}>
              <Text style={eva.style.timeText}>
                {timeString}
              </Text>
            </Layout>
          </TouchableNativeFeedback>
        </PropertyBlock>
        {
          transaction.type === "TRANSFER" ? (
            <React.Fragment>
              <PropertyBlock title="From" style={eva.style}>
                <Select
                  selectedIndex={fromInput}
                  onSelect={index => setFromInput(index)}
                  value={accountNamePairs[fromInput.row][1]}
                  style={{
                    width: "100%",
                  }}
                >
                  {accountOptions}
                </Select>
              </PropertyBlock>
              <PropertyBlock title="To" style={eva.style}>
                <Select
                  selectedIndex={toInput}
                  onSelect={index => setToInput(index)}
                  value={accountNamePairs[toInput.row][1]}
                  style={{
                    width: "100%",
                  }}
                >
                  {accountOptions}
                </Select>
              </PropertyBlock>
            </React.Fragment>
          ) : (
            <PropertyBlock title="Account" style={eva.style}>
              <Select
                selectedIndex={accountInput}
                onSelect={index => setAccountInput(index)}
                value={accountNamePairs[accountInput.row][1]}
                style={{
                  width: "100%",
                }}
              >
                {accountOptions}
              </Select>
            </PropertyBlock>
          )
        }
        <PropertyBlock title="Category" style={eva.style}>
          <Select
            selectedIndex={categoryInput}
            onSelect={index => setCategoryInput(index)}
            value={categoriesTitlePairs[categoryInput.row][1]}
            style={{
              width: "100%",
            }}
          >
            {categoryOptions}
          </Select>
        </PropertyBlock>
        <PropertyBlock title="Amount" style={eva.style}>
          <Input
            // textAlign="center"
            style={eva.style.propertyInput}
            // size="small"
            keyboardType="numeric"
            value={amountInput}
            onChangeText={setAmountInput}
          />
        </PropertyBlock>
        <Layout style={eva.style.descriptionLayout}>
          <Input
            // multiline={true}
            style={eva.style.descriptionInput}
            // size="small"
            placeholder="No description"
            value={descriptionInput}
            onChangeText={setDescriptionInput}
          />
        </Layout>
      </Layout>
      <Layout style={eva.style.buttonBlockLayout}>
        <Button
          style={eva.style.button}
          disabled={!isInfoAvailable}
          onPress={onSave}
        >
          Save
        </Button>
        <Button
          style={eva.style.button}
          status="danger"
          onPress={onDelete}
        >
          Delete
        </Button>
      </Layout>
    </Layout >
  );
};

const TransactionInfoScreen = withStyles(ThemedComponent, theme => ({
  rootLayout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: Dimensions.get("window").height,
    borderBottomWidth: 1,
    borderColor: theme["color-border-100"],
  },
  wrapperLayout: {
    width: "90%",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: theme["color-basic-400"],
    paddingTop: 15,
    paddingBottom: 10,
    overflow: "hidden",
  },
  propertyBlockLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderBottomColor: theme["color-basic-400"],
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  propertyTitleLayout: {
    flexDirection: "row",
    // justifyContent: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "30%",
    borderRightColor: theme["color-basic-400"],
    paddingVertical: 10,
  },
  propertyTitleText: {
    fontSize: 14,
  },
  propertyInput: {
    borderWidth: 0,
    backgroundColor: "transparent",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  propertyContentLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "70%",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    backgroundColor: "transparent",
    width: "62%",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  dateText: {
    fontSize: 13,
  },
  timeInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    backgroundColor: "transparent",
    width: "34%",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  timeText: {
    fontSize: 13,
  },
  descriptionLayout: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  descriptionInput: {
    borderWidth: 0,
    backgroundColor: "transparent",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  buttonBlockLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
    paddingVertical: 15,
  },
  button: {
    width: "48%",
  },
}));

export default TransactionInfoScreen;
