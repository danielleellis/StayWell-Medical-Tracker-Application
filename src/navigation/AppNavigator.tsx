// Library dependencies
import React from "react";
import { TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../constants/constants";
import { createStackNavigator } from "@react-navigation/stack";
// Login and Signup
import SignUpScreen from "../screens/login-signup/SignUpScreen";
import EmailVerificationScreen from "../screens/login-signup/EmailVerificationScreen";
import ProfileSetupScreen from "../screens/login-signup/ProfileSetupScreen";
import DashboardScreen from "../screens/login-signup/DashboardScreen";
import SplashScreen from "../screens/login-signup/SplashScreen";
import SignInScreen from "../screens/login-signup/SignInScreen";
import ForgotPasswordScreen from "../screens/login-signup/ForgotPasswordScreen";
// Friends list
import FriendsListScreen from "../screens/viewfriendslist/FriendsListScreen";
import FriendProfileScreen from "../screens/viewfriendslist/FriendProfileScreen";
// Bottom tab bar
import Habits from "../screens/tabs/Habits";
import Calendar from "../screens/tabs/Calendar";
import Create from "../screens/tabs/Create";
import Documents from "../screens/tabs/Documents";
import Profile from "../screens/tabs/Profile";
// Creating new calendar events
import NewDocument from "../screens/createnew/NewDocument";
import NewTask from "../screens/createnew/NewTask";
// Settings navigation
import SettingsScreen from "../screens/settings/SettingsScreen";
import Account from "../screens/settings/Account";
import Privacy from "../screens/settings/Privacy";
import Notification from "../screens/settings/Notification";
import RequestInfo from "../screens/settings/RequestInfo";
import Deactivate from "../screens/settings/Deactivate";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNav: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="Calendar"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.blue,
      }}
    >
      <Tab.Screen
        name="Habits"
        component={Habits}
        options={{
          tabBarLabel: "Habits",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          tabBarLabel: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-clear-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={Documents}
        options={{
          tabBarLabel: "Documents",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Friends"
        component={FriendsListScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfileScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Dashboard"
        component={TabNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewTask"
        component={NewTask}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewDocument"
        component={NewDocument}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RequestInfo"
        component={RequestInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Deactivate"
        component={Deactivate}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
