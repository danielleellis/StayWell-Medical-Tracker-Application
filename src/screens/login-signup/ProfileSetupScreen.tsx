import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setupProfile } from "../../redux/slices/authSlice";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { colors, fonts } from "../../constants/constants";
import axios from "axios";
import configData from "../../../config.json";

const ProfileSetupScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    // Access user data from Redux store
    const user = useSelector((state: RootState) => state.auth.user);
    const userID = user ? user.userID : null;

    const { from } = route.params; // to determine whether to return to profile or go to calendar once done

    // State for form fields
    const [username, setUsername] = useState(user?.username || "");
    const [pronouns, setPronouns] = useState(user?.pronouns || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [birthday, setBirthday] = useState(user?.birthday || "");
    const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(user?.profilePhoto || null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const dispatch = useDispatch<AppDispatch>();
    const serverEndpoint = configData.API_ENDPOINT;

    // Load fonts
    const [loaded] = useFonts({
        "JosefinSans-Regular": require("../../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
        "JosefinSans-Bold": require("../../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf"),
    });

    if (!loaded) {
        return null;
    }

    // Function to allow user to select profile photo
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
            profilePhoto: profilePhotoUri, // Use current profile photo URI
        };

        try {
            if (profilePhotoUri && profilePhotoUri !== user?.profilePhoto) {
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
                dispatch(setupProfile(userData)); // Update Redux

                // Check how the user reached this screen and navigate accordingly
                
                if (from === "signup") {
                    navigation.navigate("Dashboard");
                } else {
                    navigation.navigate("Dashboard", {
                        screen: "Profile", // Target the Profile tab in the TabNavigator
                    });

                }
            } else {
                console.error("Profile setup failed:", response.data);
            }
        } catch (error) {
            console.error("Error during profile setup:", error);
        }
    };

    // Format phone number as (xxx) xxx-xxxx
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

    // Format birthday as MM/DD/YYYY
    const formatBirthday = (input: string) => {
        const cleanedInput = input.replace(/\D/g, "");
        let formattedInput = cleanedInput;

        if (cleanedInput.length > 2) {
            formattedInput = `${cleanedInput.slice(0, 2)}/`;
            if (cleanedInput.length > 4) {
                formattedInput += `${cleanedInput.slice(2, 4)}/${cleanedInput.slice(4, 8)}`;
            } else {
                formattedInput += cleanedInput.slice(2);
            }
        }

        return formattedInput;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (username.length < 6) {
            newErrors.username = "Username must be at least 6 characters long";
        }

        if (phone.replace(/\D/g, "").length !== 10) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(birthday)) {
            newErrors.birthday = "Please enter a valid date in MM/DD/YYYY format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle cancel to navigate back to the Profile screen
    const handleCancel = () => {
        navigation.navigate("Dashboard", { screen: "Profile" });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Set Up Profile</Text>

            {/* Show selected image or placeholder */}
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

            <Button
                title="Cancel"
                onPress={handleCancel}
                buttonStyle={styles.redButton} // Pass custom red style
                textStyle={styles.redButtonText} // Pass custom text style
            />
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
    cancelButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "red",
        borderRadius: 5,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "white",
        fontSize: 16,
        fontFamily: fonts.regular,
    },
    redButton: {
        backgroundColor: "red",
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
    },
    redButtonText: {
        color: "white",
        fontSize: 16,
        fontFamily: 'JosefinSans-Bold',
    },
});
