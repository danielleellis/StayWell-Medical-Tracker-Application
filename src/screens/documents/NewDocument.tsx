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
    SafeAreaView,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import Input from "../../components/Input";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import configData from "../../../config.json";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { colors, fonts } from "../../constants/constants";

const NewDocument: React.FC<{ navigation: any }> = ({ navigation }) => {
    // State variables for document details
    const [documentName, setDocumentName] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedPdf, setSelectedPdf] = useState<{ uri: string; name: string } | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [lockPasscode, setLockPasscode] = useState<string | null>(null);
    const serverEndpoint = configData.API_ENDPOINT;

    // Retrieve the user ID from Redux state
    const user = useSelector((state: RootState) => state.auth.user);
    const userID = user?.userID;

    // Toggle password protection for the document
    const toggleSwitch = () => {
        setIsLocked((prevIsLocked) => !prevIsLocked);
        if (!isLocked) {
            setLockPasscode(null); // Clear passcode when disabling protection
        }
    };

    // Handle image upload using ImagePicker
    const handleImageUpload = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Permission to access gallery is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            setSelectedImages(result.assets.map((asset) => asset.uri));
            setSelectedPdf(null); // Clear PDF selection if images are selected
        }
    };

    // Handle PDF upload using DocumentPicker
    const handlePdfUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
        });

        if (result.canceled === false && result.assets && result.assets.length > 0) {
            const { uri, name } = result.assets[0];
            setSelectedPdf({ uri, name });
            setSelectedImages([]); // Clear image selection if a PDF is selected
        }
    };

    // Save the document by sending data to the backend
    const saveDocument = async () => {
        // Validate fields before sending
        if (!documentName) {
            Alert.alert("Error", "Document name is required");
            return;
        }

        if (selectedImages.length === 0 && !selectedPdf) {
            Alert.alert("Error", "You cannot create a document without images or a file!");
            return;
        }

        if (isLocked && (!lockPasscode || lockPasscode.trim() === "")) {
            Alert.alert("Error", "Password Protect is turned on, but no password was added!\n\nTurn the setting off or add a password.");
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

            // Add lock passcode if document is password protected
            if (isLocked && lockPasscode) {
                formData.append("lockPasscode", lockPasscode);
            }

            // Append selected PDF or images to formData
            if (selectedPdf) {
                formData.append("pdf", {
                    uri: selectedPdf.uri,
                    name: selectedPdf.name,
                    type: "application/pdf",
                } as any);
            } else {
                for (const [index, imageUri] of selectedImages.entries()) {
                    formData.append("images", {
                        uri: imageUri,
                        name: `image${index}.jpg`,
                        type: "image/jpeg",
                    } as any);
                }
            }

            const response = await axios.post(`${serverEndpoint}/new-document`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                navigation.navigate("Documents"); // Navigate to Documents screen on success
            } else {
                Alert.alert("Error", "Failed to create document");
            }
        } catch (error) {
            console.error("Error creating document:", error);
            Alert.alert("Error", "An error occurred");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.innerContainer}>
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Documents")}
                        style={styles.backButton} >
                        <Text style={styles.backButtonText}>{"BACK"}</Text>
                    </TouchableOpacity>

                    {/* Page Heading */}
                    <Text style={styles.heading}>Upload Document</Text>
                    
                    {/* Document Title Input */}
                    <Input
                        placeholder="Title"
                        value={documentName}
                        onChangeText={(text) => {
                            if (text.length <= 50) {
                                setDocumentName(text);
                            }
                        }}
                        autoCapitalize="words"
                        style={styles.input}
                    />

                    {/* Image and PDF Upload Buttons */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                            <Text style={styles.buttonText}>Upload Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.uploadButton} onPress={handlePdfUpload}>
                            <Text style={styles.buttonText}>Upload PDF</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Display selected images or PDF */}
                    {selectedImages.length > 0 ? (
                        <ScrollView horizontal contentContainerStyle={styles.imageScrollView} showsHorizontalScrollIndicator={false}>
                            {selectedImages.map((imageUri, index) => (
                                <Image key={index} source={{ uri: imageUri }} style={styles.uploadedImage} />
                            ))}
                        </ScrollView>
                    ) : selectedPdf ? (
                        <View style={styles.pdfPreviewContainer}>
                            <Image source={require("../../../assets/images/pdf-icon.png")} style={styles.pdfIcon} />
                            <Text style={styles.pdfText}>{selectedPdf.name}</Text>
                        </View>
                    ) : null}

                    {/* Password Protection Toggle */}
                    <View style={styles.row}>
                        <Text style={styles.switchText}>Password Protected</Text>
                        <Switch
                            trackColor={{ false: colors.lightblue, true: colors.lightblue }}
                            thumbColor={isLocked ? colors.white : colors.white}
                            ios_backgroundColor= {colors.lightblue}
                            onValueChange={toggleSwitch}
                            value={isLocked}
                        />
                    </View>

                    {/* Passcode Input if Password Protection is enabled */}
                    {isLocked && (
                        <Input
                            placeholder="Enter Passcode"
                            value={lockPasscode || ""}
                            onChangeText={setLockPasscode}
                            secureTextEntry
                            style={styles.input}
                            keyboardType="numeric"
                        />
                    )}

                    {/* Save Document Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={saveDocument}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default NewDocument;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: '5%',
        backgroundColor: colors.white,
    },
    innerContainer: {
        backgroundColor: colors.blue,
        width: '90%',
        borderRadius: 20,
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginVertical: 20,
    },
    heading: {
        fontSize: 30,
        color: colors.white,
        fontFamily: fonts.regular,
        marginTop:'10%',
        padding: '10%'
    },
    backButton: {
        position: "absolute",
        top: '5%',
        left: '5%'
    },
    backButtonText: {
        fontSize: 18,
        color: colors.white,
        fontFamily: fonts.regular,
    },
    input: {
        width: "100%",
        marginBottom: 16,
        backgroundColor: colors.lightblue,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        fontFamily: fonts.regular,
        fontSize: 20,
        color: colors.white,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        width: "100%",
    },
    uploadButton: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: colors.white,
        marginHorizontal: 5,
        paddingVertical: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonText: {
        fontSize: 18,
        color: colors.blue,
        fontFamily: fonts.regular,
    },
    imageScrollView: {
        flexDirection: "row",
        marginVertical: 10,
    },
    uploadedImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 5,
    },
    pdfPreviewContainer: {
        alignItems: "center",
        marginVertical: 10,
    },
    pdfIcon: {
        width: 40,
        height: 40,
    },
    pdfText: {
        fontSize: 14,
        color: colors.white,
        marginTop: 5,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        justifyContent: "space-between",
        width: "100%",
    },
    switchText: {
        fontSize: 18,
        color: colors.white,
        fontFamily: fonts.regular,
    },
    saveButton: {
        backgroundColor: colors.white,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    saveButtonText: {
        fontSize: 18,
        color: colors.blue,
        fontFamily: fonts.regular,
    },
});
