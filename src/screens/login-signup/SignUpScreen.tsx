import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { signUp } from "../../redux/slices/authSlice";
import { useFonts } from "expo-font";
import { colors, fonts } from "../../constants/constants";
import axios from 'axios';
import configData from "../../../config.json";

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmed, setConfirmedPassword] = useState("");
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
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

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidName = (name: string) => {
        const nameRegex = /^[a-zA-Z]+$/;
        return nameRegex.test(name);
    };

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
        const newErrors: { [key: string]: string } = {};
        if (!firstName) {
            newErrors.firstName = "First name is required";
        } else if (!isValidName(firstName)) {
            newErrors.firstName = "First name should contain only letters";
        }
        if (!lastName) {
            newErrors.lastName = "Last name is required";
        } else if (!isValidName(lastName)) {
            newErrors.lastName = "Last name should contain only letters";
        }
        if (!email) newErrors.email = "Email is required";
        else if (!isValidEmail(email))
            newErrors.email = "Please enter a valid email address";
        if (!password) {
            newErrors.password = "Password is required";
        } else if (!isValidPassword(password)) {
            newErrors.password =
                "Password must be between 8 and 32 characters, contain at least one uppercase letter, and one of these symbols: !@#$%^&*";
        }
        if (password !== passwordConfirmed) {
            newErrors.passwordConfirmed = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkEmailAvailability = async (email: string) => {
        try {
            const response = await axios.get(`${serverEndpoint}/check-email/${email}`);

            if (response.status === 200) {
                return !response.data.taken;
            } else {
                console.error('Error checking email availability.');
                console.error('Email not available.');
                return false;
            }
        } catch (error) {
            console.error('An error occurred while checking email availability:', error);
            Alert.alert('Network Error', 'An error occurred while checking email availability. Please try again.');
            return false;
        }
    };

    const handleNext = async () => {
        setHasAttemptedSubmit(true);

        if (validateForm()) {

            if (password !== passwordConfirmed) {
                alert("Passwords do not match. Please check and try again.");
                return;
            }

            setHasAttemptedSubmit(true);

            const emailAvailable = await checkEmailAvailability(email);
            if (!emailAvailable) {
                Alert.alert('Email already taken', 'Please use a different email address.');
                return;
            }

            const userData = {
                firstName,
                lastName,
                email,
                password,
            };

            try {
                const response = await axios.post(`${serverEndpoint}/signup`, userData);

                if (response.status === 200 && response.data.success) {
                    const { userID, hashedPassword } = response.data;

                    // Update userData to include userID and hashedPassword
                    const updatedUserData = { ...userData, userID: userID, password: hashedPassword };

                    dispatch(signUp(updatedUserData));

                    // Send the verification code after successful signup
                    await sendVerificationCode(email);

                    // Navigate to EmailVerification screen
                    navigation.navigate('EmailVerification');
                    console.log('Sign up successful. UserData:', updatedUserData);
                } else {
                    console.error('Failed to sign up:', response.data);
                }
            } catch (error) {
                console.error('An error occurred during sign up:', error);
            }
        }
    };

    const sendVerificationCode = async (email: string) => {
        try {
            console.log("Requesting to send verification code to server.js");
            const response = await axios.put(`${serverEndpoint}/verify-code/${email}`);

            if (response.status === 200) {
                setVerificationCodeSent(true);
                setVerificationCode(response.data.verificationCode); // Assuming backend sends back the generated code
                Alert.alert('Verification Code Sent', 'Please check your email for the verification code.');
            } else {
                console.error('Failed to send verification code:', response.data);
                Alert.alert('Error', 'Failed to send verification code. Please try again later.');
            }
        } catch (error) {
            console.error('An error occurred while sending verification code:', error);
            Alert.alert('Network Error', 'An error occurred while sending verification code. Please try again.');
        }
    };

    const isFormFilled = () => {
        return (
            firstName !== "" &&
            lastName !== "" &&
            email !== "" &&
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
            <Text style={styles.title}>Create an Account</Text>
            <Input
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                style={styles.input}
            />
            {hasAttemptedSubmit && errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
            <Input
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                style={styles.input}
            />
            {hasAttemptedSubmit && errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
            {hasAttemptedSubmit && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
            )}
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
                <Text style={styles.signInText}>Already have an account? Sign In</Text>
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
});

export default SignUpScreen;
