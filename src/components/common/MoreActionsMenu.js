import React from "react";

import { Text, OverflowMenu, MenuItem } from "@ui-kitten/components";
import { View } from "react-native";
import { Feather } from '@expo/vector-icons';

import PressableIcon from "./PressableIcon";

const MoreActionsMenu = ({ items }) => {
  const [visible, setVisible] = React.useState(false);

  const onSelect = (index) => {
    setVisible(false);
    items[index.row].action();
  };

  return (
    <OverflowMenu
      style={{ borderRadius: 6, borderWidth: 1, borderColor: "#EEEEEE", elevation: 2 }}
      anchor={() => (
        <View>
          <PressableIcon
            marginHorizontal={8}
            marginVertical={8}
            padding={8}
            onPressIn={() => setVisible(true)}
            icon={<Feather name="more-vertical" size={24} color="black" style={{ backgroundColor: "#00000000" }} />}
          />
        </View>
      )}
      visible={visible}
      onSelect={onSelect}
      onBackdropPress={() => setVisible(false)}
    >
      {
        items.map((item, index) => (
          <MenuItem key={index} title={<Text>{item.title}</Text>} />
        ))
      }
    </OverflowMenu >
  )
};

export default MoreActionsMenu;