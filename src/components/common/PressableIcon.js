import React from "react";

import { TouchableNativeFeedback, View } from "react-native";

const PressableIcon = ({ icon, marginHorizontal, marginVertical, padding, onPressIn }) => {
  return (
    <View style={{ marginHorizontal, marginVertical, borderRadius: 24, overflow: "hidden" }}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple("#EEEEEE", false)}
        style={{ borderRadius: 24 }}
        onPressIn={onPressIn}
      >
        <View style={{ padding: padding }}>
          {icon}
        </View>
      </TouchableNativeFeedback>
    </View>
  )
};

export default PressableIcon;