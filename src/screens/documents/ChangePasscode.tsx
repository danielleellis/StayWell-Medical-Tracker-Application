import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useFonts } from "expo-font";
import { colors, fonts } from "../../constants/constants";
import axios from 'axios';
import configData from "../../../config.json";

const ChangePasscodeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const serverEndpoint = configData.API_ENDPOINT;
    // Get email from auth state and documentID from the forgotDocumentPasscode state
    const email = useSelector((state: RootState) => state.auth.user?.email);
    const documentID = useSelector((state: RootState) => state.forgotDocumentPasscode.documentID);
    const documentName = useSelector((state: RootState) => state.forgotDocumentPasscode.documentName);


    const [passcode, setPasscode] = useState("");
    const [passcodeConfirmed, setConfirmedPasscode] = useState("");
    const [isPasscodeHidden, setIsPasscodeHidden] = useState(true);
    const passcodeMaxLength = 10;

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    const [loaded] = useFonts({
        "JosefinSans-Regular": require("../../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
        "JosefinSans-Bold": require("../../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf"),
    });

    if (!loaded) {
        return null;
    }

    const isValidPasscode = (passcode: string) => {
        return passcode.length >= 4 && passcode.length <= passcodeMaxLength;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!passcode) {
            newErrors.passcode = "Passcode is required";
        } else if (!isValidPasscode(passcode)) {
            newErrors.passcode = "Passcode must be between 4 and 6 digits.";
        }

        if (passcode !== passcodeConfirmed) {
            newErrors.passcodeConfirmed = "Passcodes do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        setHasAttemptedSubmit(true);

        if (!validateForm()) {
            return;
        }

        if (!documentID) {
            Alert.alert("Error", "No document ID found. Please try again.");
            return;
        }

        const passcodeData = { documentID, passcode }; // Only send documentID and passcode

        try {
            const response = await axios.post(`${serverEndpoint}/document-passcode-reset`, passcodeData);
            if (response.status === 200 && response.data.success) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Documents' }],
                });

                navigation.navigate("Documents");
            } else {
                Alert.alert("Error", response.data.error || "Failed to change passcode.");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred. Please try again later.");
        }
    };


    const isFormFilled = () => {
        return passcode !== "" && passcodeConfirmed !== "";
    };

    const togglePasscodeVisibility = () => {
        setIsPasscodeHidden(!isPasscodeHidden);
    };

    const handlePasscodeChange = (text: string) => {
        const regex = new RegExp(`^\\d{0,${passcodeMaxLength}}$`);
        if (regex.test(text)) {
            setPasscode(text);
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require("../../../assets/images/sun.png")}
                style={styles.logo}
            />
            <Text style={styles.title}>Change your document passcode</Text>
            <Text style={styles.description}>
                Please enter the new passcode for your document.
            </Text>
            <Input
                placeholder="Passcode"
                value={passcode}
                onChangeText={handlePasscodeChange}
                secureTextEntry={isPasscodeHidden}
                autoCorrect={false}
                keyboardType="numeric"
                textContentType="oneTimeCode"
                style={styles.input}
                isPassword={true}
                togglePasswordVisibility={togglePasscodeVisibility}
            />
            <Input
                placeholder="Confirm Passcode"
                value={passcodeConfirmed}
                onChangeText={setConfirmedPasscode}
                secureTextEntry={isPasscodeHidden}
                autoCorrect={false}
                keyboardType="numeric"
                textContentType="oneTimeCode"
                style={styles.input}
                isPassword={true}
                togglePasswordVisibility={togglePasscodeVisibility}
            />
            {hasAttemptedSubmit && errors.passcode && (
                <Text style={styles.errorText}>{errors.passcode}</Text>
            )}
            {hasAttemptedSubmit && errors.passcodeConfirmed && (
                <Text style={styles.errorText}>{errors.passcodeConfirmed}</Text>
            )}
            <Button title="Next" onPress={handleNext} disabled={!isFormFilled()} />
            <TouchableOpacity onPress={() => navigation.navigate("Documents")}>
                <Text style={styles.signInText}>Go back to Documents</Text>
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

export default ChangePasscodeScreen;
