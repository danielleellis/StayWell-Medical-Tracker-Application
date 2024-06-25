import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../screens/SignUpScreen';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Habits from '../(tabs)/Habits';
import Calendar from '../(tabs)/Calendar';
import Create from '../(tabs)/Create';
import Documents from '../(tabs)/Documents';
import Profile from '../(tabs)/Profile';
import Ionicons from '@react-native-vector-icons/ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNav = () =>{
  return(
      <Tab.Navigator initialRouteName='Calendar'>
          <Tab.Screen name="Habits" component={Habits} options={{ headerShown: false}} />
          <Tab.Screen name="Calendar" component={Calendar} options={{ headerShown: false }} />
          <Tab.Screen name="Create" component={Create} options={{ headerShown: false }} />
          <Tab.Screen name="Documents" component={Documents} options={{ headerShown: false }} />
          <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      </Tab.Navigator>
  )
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={TabNav} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;