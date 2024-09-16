import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/login-signup/SplashScreen";
import SignInScreen from "../screens/login-signup/SignInScreen";
import ForgotPasswordScreen from "../screens/login-signup/ForgotPasswordScreen";
import SignUpScreen from "../screens/login-signup/SignUpScreen";
import EmailVerificationScreen from "../screens/login-signup/EmailVerificationScreen";
import ProfileSetupScreen from "../screens/login-signup/ProfileSetupScreen";

type LoginSignupStackParamList = {
    Splash: undefined;
    SignIn: undefined;
    ForgotPassword: undefined;
    SignUp: undefined;
    EmailVerification: undefined;
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
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: false }}
            />
            <LoginSignupStack.Screen
                name="EmailVerification"
                component={EmailVerificationScreen}
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
