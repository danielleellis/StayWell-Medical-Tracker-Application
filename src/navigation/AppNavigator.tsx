import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "../screens/SignUpScreen";
import EmailVerificationScreen from "../screens/EmailVerificationScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SplashScreen from "../screens/SplashScreen";
import SignInScreen from "../screens/SignInScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import FriendsListScreen from "../screens/FriendsListScreen";
import FriendProfileScreen from "../viewfriendslist/FriendProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Habits from "../(tabs)/Habits";
import Calendar from "../(tabs)/Calendar";
import Create from "../(tabs)/Create";
import Documents from "../(tabs)/Documents";
import Profile from "../(tabs)/Profile";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../constants/constants";
import NewDocument from "../(createnew)/NewDocument";
import NewTask from "../(createnew)/NewTask";
import ProfileSettings from "../settings/Profile";
import Account from "../settings/Account";
import Privacy from "../settings/Privacy";
import Notification from "../settings/Notification";
import RequestInfo from "../settings/RequestInfo";
import Deactivate from "../settings/Deactivate";
import { TouchableOpacity } from "react-native";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNav: React.FC<{navigation:any}> = ({navigation}) => {
    return (
        <Tab.Navigator
            initialRouteName="Dashboard"
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
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileSettings}
                options={{ headerShown: false }}
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
