import React from 'react';
import RNIcon from 'react-native-vector-icons/FontAwesome';
import {IconProps} from 'react-native-vector-icons/Icon';
import {COLORS} from 'helpers/colors';
import {StyleSheet, View} from 'react-native';

export const Icon = ({...props}: IconProps) => {
  return <RNIcon style={styles.container} {...props} />;
};

Icon.defaultProps = {
  size: 26,
  color: COLORS.primary,
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
});
