import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>GuiaTur</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: colors.primary,
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
