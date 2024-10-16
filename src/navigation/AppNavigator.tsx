import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../constants/constants"; // Imported fonts
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
            tabBarStyle: {
                position: 'absolute',
                bottom: 20,
                left: 20,
                right: 20,
                borderRadius: 20,
                height: 70,
                backgroundColor: 'white',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 3,
            },
            tabBarLabelStyle: {
                fontFamily: fonts.regular, // Custom font for tab labels
                fontSize: 12, // Adjust font size as needed
                paddingBottom: 15, // Reduces space between icon and label
            },
            tabBarIconStyle: {
                marginBottom: -10, // Reduces the gap between the icon and the label
            },
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
            {/*<Tab.Screen*/}
            {/*    name="Create"*/}
            {/*    component={Create}*/}
            {/*    options={{*/}
            {/*        tabBarLabel: "Create",*/}
            {/*        tabBarIcon: ({ color, size }) => (*/}
            {/*            <Ionicons*/}
            {/*                name="add-outline"*/}
            {/*                color={color}*/}
            {/*                size={size}*/}
            {/*            />*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
            <Tab.Screen
                name="DocumentsHome"
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
