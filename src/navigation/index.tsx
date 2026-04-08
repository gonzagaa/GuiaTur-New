import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PlacesListScreen from '../screens/PlacesListScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import MostVisitedListScreen from '../screens/MostVisitedListScreen';
import MostVisitedDetailsScreen from '../screens/MostVisitedDetailsScreen';
import TourAgenciesScreen from '../screens/TourAgenciesScreen';
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
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PlacesList" component={PlacesListScreen} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
        <Stack.Screen name="MostVisitedList" component={MostVisitedListScreen} />
        <Stack.Screen name="MostVisitedDetails" component={MostVisitedDetailsScreen} />
        <Stack.Screen name="TourAgencies" component={TourAgenciesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}