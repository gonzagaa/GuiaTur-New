import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlacesListScreen from '../screens/PlacesListScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="PlacesList"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="PlacesList" component={PlacesListScreen} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}