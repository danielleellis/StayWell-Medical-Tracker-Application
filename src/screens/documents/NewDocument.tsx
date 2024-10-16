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
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import configData from "../../../config.json";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { colors } from "../../constants/constants";

const NewDocument: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [documentName, setDocumentName] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedPdf, setSelectedPdf] = useState<{ uri: string; name: string } | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [lockPasscode, setLockPasscode] = useState<string | null>(null);
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

    const saveDocument = async () => {
        // Check if document has a name
        if (!documentName) {
            Alert.alert("Error", "Document name is required");
            return;
        }

        // Check if neither images or a PDF is selected
        if (selectedImages.length === 0 && !selectedPdf) {
            Alert.alert("Error", "You cannot create a document without images or a file!");
            return;
        }

        // Check if the user wanted to set a password, but didn't add anything
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

            if (isLocked && lockPasscode) {
                formData.append("lockPasscode", lockPasscode);
            }

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
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

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
    saveButton: {
        borderRadius: 10,
        backgroundColor: colors.white,
        margin: 10,
        padding: 10,
    },
    saveButtonText: {
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
});
