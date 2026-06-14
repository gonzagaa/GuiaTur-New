import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PlacesListScreen from '../screens/PlacesListScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import MostVisitedListScreen from '../screens/MostVisitedListScreen';
import MostVisitedDetailsScreen from '../screens/MostVisitedDetailsScreen';
import TourAgenciesScreen from '../screens/TourAgenciesScreen';
import HotelsScreen from '../screens/HotelsScreen';
import ExchangeScreen from '../screens/ExchangeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LowSecurityScreen from '../screens/LowSecurityScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';
import LocationSearchScreen from '../screens/LocationSearchScreen';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import {
  DestinationProvider,
  useDestination,
} from '../contexts/DestinationContext';

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

const screenOptions = {
  headerShown: false,
  contentStyle: {
    backgroundColor: colors.background,
  },
};

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  const { destination } = useDestination();
  const initialRouteName: keyof RootStackParamList = destination
    ? 'Home'
    : 'LocationSearch';

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={screenOptions}>
      <Stack.Screen name="LocationSearch" component={LocationSearchScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PlacesList" component={PlacesListScreen} />
      <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
      <Stack.Screen name="MostVisitedList" component={MostVisitedListScreen} />
      <Stack.Screen name="MostVisitedDetails" component={MostVisitedDetailsScreen} />
      <Stack.Screen name="TourAgencies" component={TourAgenciesScreen} />
      <Stack.Screen name="Hotels" component={HotelsScreen} />
      <Stack.Screen name="Exchange" component={ExchangeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="LowSecurity" component={LowSecurityScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { loading: destinationLoading } = useDestination();

  if (authLoading || destinationLoading) {
    return <SplashScreen />;
  }

  return user ? <AppStack /> : <AuthStack />;
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <DestinationProvider>
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
        </NavigationContainer>
      </DestinationProvider>
    </AuthProvider>
  );
}
