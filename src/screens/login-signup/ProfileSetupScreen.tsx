import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setupProfile } from "../../redux/slices/authSlice";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { colors, fonts } from "../../constants/constants";
import axios from "axios";
import configData from "../../../config.json";
import { useSelector } from "react-redux";

const ProfileSetupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [phone, setPhone] = useState("");
    const [birthday, setBirthday] = useState("");
    const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const dispatch = useDispatch<AppDispatch>();
    const serverEndpoint = configData.API_ENDPOINT;

    const [loaded] = useFonts({
        "JosefinSans-Regular": require("../../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
        "JosefinSans-Bold": require("../../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf"),
    });

    if (!loaded) {
        return null;
    }

    const user = useSelector((state: RootState) => state.auth.user);
    const userID = user ? user.userID : null;

    // Allows the user to select a photo when they click the profile-picture circle
    const handleProfilePhotoUpload = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Permission to access gallery is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const localUri = result.assets[0].uri;
            setProfilePhotoUri(localUri);
        }
    };

    const handleProfileSetup = async () => {
        if (!validateForm()) return;

        const userData = {
            userID,
            username,
            pronouns,
            phone,
            birthday,
            profilePhoto: null, // Initially null, we'll update if there's an image
        };

        try {
            if (profilePhotoUri) {
                // Prepare the form data to upload the image
                const formData = new FormData();
                formData.append("image", {
                    uri: profilePhotoUri,
                    name: `${userID}`,
                    type: "image/jpeg",
                } as any);

                // Upload image to server
                const uploadResponse = await axios.post(
                    `${serverEndpoint}/upload-profile-picture`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                // Use uploaded image URL in user data
                userData.profilePhoto = uploadResponse.data.imageUrl;
            }

            // Submit the user data to the backend
            const response = await axios.put(
                `${serverEndpoint}/profile-setup`,
                userData
            );

            if (response.status === 200 && response.data.success) {
                dispatch(setupProfile(userData));
                navigation.navigate("Dashboard");
            } else {
                console.error("Profile setup failed:", response.data);
            }
        } catch (error) {
            console.error("Error during profile setup:", error);
        }
    };

    // Phone number formatting function
    const formatPhoneNumber = (input: string) => {
        const cleanedInput = input.replace(/\D/g, "");
        let formattedInput = cleanedInput;

        if (cleanedInput.length > 3) {
            formattedInput = `(${cleanedInput.slice(0, 3)}) `;
            if (cleanedInput.length > 6) {
                formattedInput += `${cleanedInput.slice(3, 6)}-${cleanedInput.slice(6, 10)}`;
            } else {
                formattedInput += cleanedInput.slice(3);
            }
        }
        return formattedInput;
    };

    // Birthday formatting function
    const formatBirthday = (input: string) => {
        // Remove all non-digit characters
        const cleanedInput = input.replace(/\D/g, "");

        let formattedInput = cleanedInput;

        // Format MM/DD/YYYY as the user types
        if (cleanedInput.length > 2) {
            formattedInput = `${cleanedInput.slice(0, 2)}/`;
            if (cleanedInput.length > 4) {
                formattedInput += `${cleanedInput.slice(2, 4)}/${cleanedInput.slice(4, 8)}`;
            } else {
                formattedInput += cleanedInput.slice(2);
            }
        }

        // Return formatted input (MM/DD/YYYY)
        return formattedInput;
    };

    // Function to validate the formatted birthday (checks for valid month, day, and year)
    const isValidBirthday = (input: string) => {
        const [month, day, year] = input.split('/').map(Number);

        // Check if the format is correct (MM/DD/YYYY)
        if (input.length !== 10 || isNaN(month) || isNaN(day) || isNaN(year)) {
            return false;
        }

        // Check if month, day, and year are valid
        const isValidMonth = month >= 1 && month <= 12;
        const isValidDay = day >= 1 && day <= 31;
        const isValidYear = year >= 1900 && year <= new Date().getFullYear(); // Adjust year range as needed

        return isValidMonth && isValidDay && isValidYear;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (username.length < 6) {
            newErrors.username = "Username must be at least 6 characters long";
        }

        if (phone.replace(/\D/g, "").length !== 10) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(birthday) || !isValidBirthday(birthday)) {
            newErrors.birthday = "Please enter a valid date in MM/DD/YYYY format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Set Up Profile</Text>

            {/* Only show selected image if it exists, otherwise show placeholder */}
            <TouchableOpacity onPress={handleProfilePhotoUpload}>
                <Image
                    source={
                        profilePhotoUri
                            ? { uri: profilePhotoUri }
                            : require("../../../assets/images/Temp-Profile-Picture.png")
                    }
                    style={styles.profilePhoto}
                />
            </TouchableOpacity>

            <Input
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            <Input
                placeholder="Pronouns (optional)"
                value={pronouns}
                onChangeText={setPronouns}
                style={styles.input}
            />
            <Input
                placeholder="Phone (xxx)-xxx-xxxx"
                value={phone}
                onChangeText={(text) => setPhone(formatPhoneNumber(text))}
                keyboardType="phone-pad"
                style={styles.input}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            <Input
                placeholder="Birthday MM/DD/YYYY"
                value={birthday}
                onChangeText={(text) => setBirthday(formatBirthday(text))}
                keyboardType="numeric"
                style={styles.input}
            />
            {errors.birthday && <Text style={styles.errorText}>{errors.birthday}</Text>}
            <Button title="Save" onPress={handleProfileSetup} />
        </View>
    );
};

export default ProfileSetupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        backgroundColor: colors.white,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 24,
        color: colors.blue,
        fontFamily: fonts.regular,
    },
    profilePhoto: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignSelf: "center",
        backgroundColor: colors.grey,
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: -12,
        marginBottom: 16,
    },
});
