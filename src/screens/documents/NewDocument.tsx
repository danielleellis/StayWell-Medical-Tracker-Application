import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import configData from "../../../config.json";
import { colors, fonts } from "../../constants/constants";

const NewDocument: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [documentName, setDocumentName] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]); // Storing URIs of selected images
    const [isLocked, setIsLocked] = useState(false); // State to handle whether the document is locked
    const [lockPasscode, setLockPasscode] = useState<string | null>(null); // State for the passcode
    const serverEndpoint = configData.API_ENDPOINT;

    // Fetch userID from Redux state
    const user = useSelector((state: RootState) => state.auth.user);
    const userID = user?.userID;

    // Handle lock switch toggle
    const toggleSwitch = () => {
        setIsLocked((isLocked) => !isLocked);
        if (!isLocked) {
            setLockPasscode(null); // Clear passcode when lock is enabled
        }
    };

    // Handle image selection
    const handleImageUpload = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Permission to access gallery is required!"
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true, // Allow multiple image selection
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            setSelectedImages(result.assets.map((asset) => asset.uri)); // Store URIs of selected images
        }
    };

    const saveDocument = async () => {
        if (!documentName) {
            Alert.alert("Error", "Document name is required");
            return;
        }

        if (!userID) {
            Alert.alert("Error", "User ID not found. Please log in.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("userID", userID);
            formData.append("documentName", documentName);

            // Only append lockPasscode if it's not null
            if (isLocked && lockPasscode) {
                formData.append("lockPasscode", lockPasscode);
            }

            // Upload selected images
            for (const [index, imageUri] of selectedImages.entries()) {
                formData.append("images", {
                    uri: imageUri,
                    name: `image${index}.jpg`,
                    type: "image/jpeg",
                } as any);
            }

            const response = await axios.post(
                `${serverEndpoint}/new-document`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                navigation.navigate("Documents");
            } else {
                Alert.alert("Error", "Failed to create document");
            }
        } catch (error) {
            console.error("Error creating document:", error);
            Alert.alert("Error", "An error occurred");
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.contentContainer}
            style={styles.container}
        >
            <Input
                placeholder="Document Name"
                value={documentName}
                onChangeText={setDocumentName}
                autoCapitalize="words"
                style={styles.input}
            />

            <View style={styles.row}>
                <Image
                    source={require("../../../assets/images/lock-icon.png")}
                    style={styles.lockIcon}
                />
                <Text style={styles.text}>Password Protect</Text>
                <Switch
                    trackColor={{ false: colors.grey, true: colors.grey }}
                    thumbColor={isLocked ? colors.white : colors.white}
                    ios_backgroundColor={colors.grey}
                    onValueChange={toggleSwitch}
                    value={isLocked}
                />
            </View>

            {isLocked && (
                <Input
                    placeholder="Enter Passcode"
                    value={lockPasscode || ""}
                    onChangeText={setLockPasscode}
                    style={styles.input}
                    keyboardType="numeric"
                />
            )}

            {/* Button to trigger image selection */}
            <Button title="Select Images" onPress={handleImageUpload} />

            <TouchableOpacity style={styles.saveButton} onPress={saveDocument}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default NewDocument;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.white,
    },
    text: {
        fontSize: 18,
        color: colors.white,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    contentContainer: {
        backgroundColor: "#45A6FF",
        margin: 5,
        borderWidth: 2,
        borderColor: "#6BB7ED",
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
    },
    saveButton: {
        borderRadius: 10,
        backgroundColor: colors.white,
        margin: 10
    },
    saveButtonText: {
        fontSize: 18,
        margin: 10,
        color: "#45A6FF",
        fontWeight: "bold",
    },
    lockIcon: {
        width: 30,
        height: 35,
        margin: 10,
    },
    input: {
        marginBottom: 16,
        backgroundColor: colors.white,
    },
});
