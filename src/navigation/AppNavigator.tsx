import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/constants";
import { createStackNavigator } from "@react-navigation/stack";
import FriendsListScreen from "../screens/viewfriendslist/FriendsListScreen";
import FriendProfileScreen from "../screens/viewfriendslist/FriendProfileScreen";
import DocumentNavigator from "./DocumentNavigator";
import SettingsNavigator from "./SettingsNavigator";
import LoginSignupNavigator from "./Login-SignupNavigator";

// Bottom tab bar
import Habits from "../screens/tabs/Habits";
import Calendar from "../screens/tabs/Calendar";
import Create from "../screens/tabs/Create";
import Profile from "../screens/tabs/Profile";
import NewTask from "../screens/createnew/NewTask";

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
                        <Ionicons
                            name="stats-chart-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={Calendar}
                options={{
                    tabBarLabel: "Calendar",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="calendar-clear-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Documents"
                component={DocumentNavigator}
                options={{
                    tabBarLabel: "Documents",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="document-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="person-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="LoginSignup">
            <Stack.Screen
                name="LoginSignup"
                component={LoginSignupNavigator}
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
                name="Dashboard"
                component={TabNav}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="NewTask"
                component={NewTask}
                options={{ headerShown: false, title: "New Task" }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
