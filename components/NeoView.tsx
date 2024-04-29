import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';

type Props = {
  children: React.ReactNode;
  size?: number;
  rounded?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};
const NeoView = ({ children, containerStyle, size, rounded = false }: Props) => {
  return (
    <View style={styles.topShadow}>
      <View style={styles.bottomShadow}>
        <View
          style={[
            styles.inner,
            {
              width: size ? size : undefined,
              height: size ? size : undefined,
              borderRadius: rounded && size ? size : undefined,
              justifyContent: rounded ? 'center' : undefined,
              alignItems: rounded ? 'center' : undefined,
            },
            containerStyle,
          ]}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default NeoView;

const styles = StyleSheet.create({
  inner: {
    backgroundColor: Colors.primary,
    borderColor: Colors.border,
    borderWidth: 0.8,
  },
  topShadow: {
    shadowOffset: {
      width: -6,
      height: -6,
    },
    shadowColor: Colors.secondary,
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  bottomShadow: {
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowColor: Colors.accent,
    shadowOpacity: 1,
    shadowRadius: 6,
  },
});
