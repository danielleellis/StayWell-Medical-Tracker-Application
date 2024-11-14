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
    ActivityIndicator,
    Modal,
} from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import configData from "../../../config.json";
import { colors } from "../../constants/constants";
import { buttonStyles } from "../styles/buttonStyles";

const NewDocument: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [documentID, setDocumentID] = useState<string | null>(null);
    const [documentName, setDocumentName] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedPdf, setSelectedPdf] = useState<{ uri: string; name: string } | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [lockPasscode, setLockPasscode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
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

    const createDocument = async (): Promise<string | null> => {
        if (!documentName) {
            Alert.alert("Error", "Document name is required");
            return null;
        }

        try {
            const response = await axios.post(`${serverEndpoint}/new-document`, {
                userID,
                documentName,
                lockPasscode: isLocked ? lockPasscode : null,
            });

            if (response.data.success) {
                setDocumentID(response.data.documentID); // Store documentID for next request
                return response.data.documentID; // Return documentID
            } else {
                Alert.alert("Error", "Failed to create document");
                return null;
            }
        } catch (error) {
            console.error("Error creating document:", error);
            Alert.alert("Error", "An error occurred");
            return null;
        }
    };


    const uploadFiles = async (documentID: string) => {
        const formData = new FormData();
        formData.append("userID", userID as string);
        formData.append("documentID", documentID); // Attach the documentID

        if (selectedPdf) {
            formData.append("pdf", {
                uri: selectedPdf.uri,
                name: selectedPdf.name,
                type: "application/pdf",
            } as any);
        } else {
            selectedImages.forEach((imageUri, index) => {
                formData.append("images", {
                    uri: imageUri,
                    name: `image${index}.jpg`,
                    type: "image/jpeg",
                } as any);
            });
        }

        try {
            const response = await axios.post(`${serverEndpoint}/upload-files`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                Alert.alert("Success", "Files uploaded successfully.");
                navigation.navigate("Documents");
            } else {
                Alert.alert("Error", "Failed to upload files");
            }
        } catch (error) {
            console.error("Error uploading files:", error);
            Alert.alert("Error", "An error occurred during file upload.");
        }
    };


    const handleSave = async () => {
        setLoading(true);

        console.log("Creating new document");
        const newDocumentID = await createDocument(); // Retrieve document ID
        if (!newDocumentID) {
            console.log("Failed to create new document");
            setLoading(false);
            return; // Stop if document creation failed
        }

        console.log("Starting upload");
        await uploadFiles(newDocumentID); // Pass documentID directly to uploadFiles
        console.log("Finished upload");
        setLoading(false); // Only set loading to false after both steps are done
    };


    const cancelDocument = async () => {
        try {
            const response = await axios.delete(`${serverEndpoint}/documents/${userID}/${documentID}`);
            if (response.data.success) {
                Alert.alert("Upload canceled", "Document upload canceled and files deleted.");
                navigation.navigate("Documents"); // Navigate back to Documents screen
            } else {
                Alert.alert("Error", "Failed to delete document.");
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            Alert.alert("Error", "An error occurred while deleting the document.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Loading Modal */}
            <Modal transparent={true} visible={loading} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color={colors.blue} />
                        <Text style={styles.modalText}>
                            Your images are being uploaded. Please do not close the app.
                        </Text>

                        <TouchableOpacity onPress={cancelDocument} style={buttonStyles.cancelButton}>
                            <Text style={buttonStyles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            {/* Main Content */}
            <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
                <Input
                    placeholder="Document Name"
                    value={documentName}
                    onChangeText={(text) => {
                        if (text.length <= 50) {
                            setDocumentName(text);
                        }
                    }}
                    autoCapitalize="words"
                    style={styles.input}
                />

                <View style={styles.row}>
                    <Image source={require("../../../assets/images/lock-icon.png")} style={styles.lockIcon} />
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
                        secureTextEntry
                        style={styles.input}
                        keyboardType="numeric"
                    />
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                        <Text style={styles.buttonText}>Upload Images</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.uploadButton} onPress={handlePdfUpload}>
                        <Text style={styles.buttonText}>Upload a PDF</Text>
                    </TouchableOpacity>
                </View>

                {selectedImages.length > 0 ? (
                    <ScrollView horizontal contentContainerStyle={styles.imageScrollView} showsHorizontalScrollIndicator={false}>
                        {selectedImages.map((imageUri, index) => (
                            <Image key={index} source={{ uri: imageUri }} style={styles.uploadedImage} />
                        ))}
                    </ScrollView>
                ) : selectedPdf ? (
                    <View style={styles.pdfPreviewContainer}>
                        <Image
                            source={require("../../../assets/images/pdf-icon.png")}
                            style={styles.pdfIcon}
                        />
                        <Text style={styles.pdfText}>{selectedPdf.name}</Text>
                    </View>
                ) : null}

                <TouchableOpacity style={buttonStyles.saveButton} onPress={handleSave}>
                    <Text style={buttonStyles.saveButtonText}>Save Document</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
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
    loadingIndicator: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 1,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "80%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        color: "#333",
        marginTop: 10,
        textAlign: "center",
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
