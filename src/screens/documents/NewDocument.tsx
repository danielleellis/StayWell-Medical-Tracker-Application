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
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import configData from "../../../config.json";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
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

    const user = useSelector((state: RootState) => state.auth.user);
    const userID = user?.userID;

    const toggleSwitch = () => {
        setIsLocked((isLocked) => !isLocked);
        if (!isLocked) {
            setLockPasscode(null);
        }
    };

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
            setSelectedPdf(null);
        }
    };

    const handlePdfUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
        });

        if (result.canceled === false && result.assets && result.assets.length > 0) {
            const { uri, name } = result.assets[0];
            setSelectedPdf({ uri, name });
            setSelectedImages([]);
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
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    uploadButton: {
        borderRadius: 10,
        backgroundColor: colors.white,
        marginHorizontal: 5,
        padding: 10,
        width: 145,
        alignItems: "center",
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
});
