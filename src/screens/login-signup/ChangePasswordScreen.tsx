import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { signUp } from "../../redux/slices/authSlice";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useFonts } from "expo-font";
import { colors, fonts } from "../../constants/constants";
import axios from 'axios';
import configData from "../../../config.json";

const ChangePasswordScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const email = useSelector((state: RootState) => state.auth.user?.email);

    const [password, setPassword] = useState("");
    const [passwordConfirmed, setConfirmedPassword] = useState("");
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const serverEndpoint = configData.API_ENDPOINT;

    const [loaded] = useFonts({
        "JosefinSans-Regular": require("../../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
        "JosefinSans-Bold": require("../../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf"),
    });

    if (!loaded) {
        return null;
    }

    const isValidPassword = (password: string) => {
        if (password.length < 8 || password.length > 32) {
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            return false;
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return false;
        }
        return true;
    };

    const validateForm = () => {
        if (!password) {
            errors.password = "Password is required";
        } else if (!isValidPassword(password)) {
            errors.password =
                "Password must be between 8 and 32 characters, contain at least one uppercase letter, and one of these symbols: !@#$%^&*";
        }
        if (password !== passwordConfirmed) {
            errors.passwordConfirmed = "Passwords do not match";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = async () => {
        setHasAttemptedSubmit(true);

        if (validateForm()) {

            if (password !== passwordConfirmed) {
                alert("Passwords do not match. Please check and try again.");
                return;
            }

            setHasAttemptedSubmit(true);

            const userData = {
                email,
                password,
            };

            try {
                const response = await axios.post(`${serverEndpoint}/change-password`, userData);

                if (response.status === 200 && response.data.success) {
                    console.log("Password changed successfully.");
                    // Navigate to sign-in screen or dashboard
                    navigation.navigate("SignIn");
                } else {
                    console.error("Failed to change password:", response.data);
                    Alert.alert("Error", response.data.error || "Failed to change password.");
                }
            } catch (error) {
                console.error("An error occurred during password change:", error);
                Alert.alert("Error", "An error occurred. Please try again later.");
            }
        }
    };


    const isFormFilled = () => {
        return (
            password !== "" &&
            passwordConfirmed !== ""
        );
    };

    const togglePasswordVisibility = () => {
        setIsPasswordHidden(!isPasswordHidden);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Splash")}
                style={styles.backButton}
            >
                <Text style={styles.backButtonText}>{"BACK"}</Text>
            </TouchableOpacity>
            <Image
                source={require("../../../assets/images/sun.png")}
                style={styles.logo}
            />
            <Text style={styles.title}>Change your password</Text>
            <Text style={styles.description}>
                Please enter the new password for: {email}
            </Text>
            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={isPasswordHidden}
                autoCorrect={false}
                textContentType="oneTimeCode"
                style={styles.input}
                isPassword={true}
                togglePasswordVisibility={togglePasswordVisibility}
            />
            <Input
                placeholder="Confirm Password"
                value={passwordConfirmed}
                onChangeText={setConfirmedPassword}
                secureTextEntry={isPasswordHidden}
                autoCorrect={false}
                textContentType="oneTimeCode"
                style={styles.input}
                isPassword={true}
                togglePasswordVisibility={togglePasswordVisibility}
            />
            {hasAttemptedSubmit && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
            )}
            {hasAttemptedSubmit && errors.passwordConfirmed && (
                <Text style={styles.errorText}>{errors.passwordConfirmed}</Text>
            )}
            <Button title="Next" onPress={handleNext} disabled={!isFormFilled()} />
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                <Text style={styles.signInText}>Go back to Sign In</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 16,
        backgroundColor: colors.white,
    },
    logo: {
        width: 240,
        height: 75,
        alignSelf: "center",
        marginBottom: 24,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 16,
    },
    backButtonText: {
        fontSize: 16,
        color: colors.blue,
        fontFamily: fonts.regular,
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: "center",
        color: colors.blue,
        fontFamily: fonts.regular,
    },
    input: {
        marginBottom: 16,
    },
    signInText: {
        marginTop: 16,
        textAlign: "center",
        color: colors.blue,
        fontFamily: fonts.regular,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: -12,
        marginBottom: 16,
        fontFamily: fonts.regular,
    },
    description: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: "center",
        color: "#666",
        fontFamily: fonts.regular,
    },
});

export default ChangePasswordScreen;
