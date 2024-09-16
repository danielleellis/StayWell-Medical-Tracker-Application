// SettingsNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/settings/SettingsScreen";
import Account from "../screens/settings/Account";
import Privacy from "../screens/settings/Privacy";
import Notification from "../screens/settings/Notification";
import RequestInfo from "../screens/settings/RequestInfo";
import Deactivate from "../screens/settings/Deactivate";

type SettingsStackParamList = {
    Settings: undefined;
    Account: undefined;
    Privacy: undefined;
    Notification: undefined;
    RequestInfo: undefined;
    Deactivate: undefined;
};

const SettingsStack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator: React.FC = () => {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: true, title: "Settings" }}
            />
            <SettingsStack.Screen
                name="Account"
                component={Account}
                options={{ headerShown: true, title: "Account Settings" }}
            />
            <SettingsStack.Screen
                name="Privacy"
                component={Privacy}
                options={{ headerShown: true, title: "Privacy Settings" }}
            />
            <SettingsStack.Screen
                name="Notification"
                component={Notification}
                options={{ headerShown: true, title: "Notification Settings" }}
            />
            <SettingsStack.Screen
                name="RequestInfo"
                component={RequestInfo}
                options={{ headerShown: true, title: "Request Information" }}
            />
            <SettingsStack.Screen
                name="Deactivate"
                component={Deactivate}
                options={{ headerShown: true, title: "Deactivate Account" }}
            />
        </SettingsStack.Navigator>
    );
};

export default SettingsNavigator;
