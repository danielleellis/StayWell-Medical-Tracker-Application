import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/login-signup/SplashScreen";
import SignInScreen from "../screens/login-signup/SignInScreen";
import ForgotPasswordScreen from "../screens/login-signup/ForgotPasswordScreen";
import ChangePasswordScreen from "../screens/login-signup/ChangePasswordScreen";
import SignUpScreen from "../screens/login-signup/SignUpScreen";
import CodeVerificationScreen from "../screens/login-signup/CodeVerificationScreen";
import ProfileSetupScreen from "../screens/login-signup/ProfileSetupScreen";

type LoginSignupStackParamList = {
    Splash: undefined;
    SignIn: undefined;
    ForgotPassword: undefined;
    ChangePassword: undefined;
    SignUp: undefined;
    CodeVerification: undefined;
    ProfileSetup: undefined;
};

const LoginSignupStack = createStackNavigator<LoginSignupStackParamList>();

const LoginSignupNavigator: React.FC = () => {
    return (
        <LoginSignupStack.Navigator initialRouteName="Splash">
            <LoginSignupStack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
            />
            <LoginSignupStack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{ headerShown: false }}
            />
            <LoginSignupStack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ headerShown: false }}
            />
            <LoginSignupStack.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{ headerShown: false }}
            />
            <LoginSignupStack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: false }}
            />
            <LoginSignupStack.Screen
                name="CodeVerification"
                component={CodeVerificationScreen}
                options={{ headerShown: false }}
            />
            <LoginSignupStack.Screen
                name="ProfileSetup"
                component={ProfileSetupScreen}
                options={{ headerShown: false }}
            />
        </LoginSignupStack.Navigator>
    );
};

export default LoginSignupNavigator;
