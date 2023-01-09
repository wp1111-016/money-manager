import React from "react";

import { View } from "react-native";
import { Layout, Spinner } from "@ui-kitten/components";

const LoadingLayout = (props) => {
  const {
    style = {},
    loading = true,
    indicatorStyle = { spinnerSize: 'giant' },
    ...restProps
  } = props;

  const LoadingIndicator = (
    <View style={[props.style, indicatorStyle]}>
      <Spinner size={indicatorStyle.spinnerSize} status="primary" />
    </View>
  );

  return (
    <React.Fragment>
      {
        loading ?
          <Layout style={style}>{LoadingIndicator}</Layout> :
          <Layout style={style} {...restProps}></Layout>
      }
    </React.Fragment>
  );
};

export default LoadingLayout;