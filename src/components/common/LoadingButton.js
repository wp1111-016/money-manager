import React from 'react';

import { View } from "react-native";
import { Spinner, Button } from "@ui-kitten/components";

const LoadingButton = React.forwardRef((props, ref) => {
  const {
    loading = false,
    indicatorStyle = { spinnerSize: 'small' },
    ...restProps
  } = props;

  const LoadingIndicator = (props) => (
    <View style={[props.style, indicatorStyle]}>
      <Spinner size={indicatorStyle.spinnerSize} status="basic" />
    </View>
  );

  return (
    <Button
      {...restProps}
      ref={ref}
      accessoryLeft={loading ? LoadingIndicator : null}
      disabled={loading}
    />
  );
});

export default LoadingButton;