import React, { useEffect, useState } from "react";
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    Dimensions,
    TextInput,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import configData from "../../../config.json";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { DocumentStackParamList } from "../../navigation/DocumentNavigator";
import { WebView } from "react-native-webview"; // Import WebView

// Define types for navigation and route
type LoadDocumentNavigationProp = StackNavigationProp<DocumentStackParamList, "LoadDocument">;
type LoadDocumentRouteProp = RouteProp<DocumentStackParamList, "LoadDocument">;

const screenWidth = Dimensions.get("window").width;
const columnCount = 3;

const LoadDocument: React.FC = () => {
    const [images, setImages] = useState<string[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const route = useRoute<LoadDocumentRouteProp>();
    const navigation = useNavigation<LoadDocumentNavigationProp>();
    const [loading, setLoading] = useState(false);

    const user = useSelector((state: RootState) => state.auth.user);
    const userID = user?.userID;
    const { documentID, documentName } = route.params;
    const serverEndpoint = configData.API_ENDPOINT;

    const [isEditing, setIsEditing] = useState(false);
    const [newDocumentName, setNewDocumentName] = useState(documentName);

    useEffect(() => {
        // Fetch document images only when the component mounts or when the documentID changes
        fetchDocumentImages();
    }, [documentID]); // Trigger the effect only when documentID changes

    useEffect(() => {
        // Update header options whenever newDocumentName or isEditing state changes
        navigation.setOptions({
            headerTitle: () =>
                isEditing ? (
                    <TextInput
                        style={styles.textInput}
                        value={newDocumentName}
                        onChangeText={(text) => {
                            if (text.length <= 50) {
                                setNewDocumentName(text);
                            }
                        }}
                        placeholder="Enter new name"
                        autoFocus
                    />
                ) : (
                    <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                        {newDocumentName}
                    </Text>
                ),
            headerRight: () => (
                <View style={styles.headerButtonsContainer}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity onPress={handleSaveEdit} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity onPress={handleEditDocument} style={styles.editButton}>
                                <Text style={styles.editButtonText}>Edit Name</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeleteDocument} style={styles.deleteButton}>
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            ),
        });
    }, [newDocumentName, isEditing]); // Update header options when newDocumentName or isEditing changes

    const fetchDocumentImages = async () => {
        setLoading(true); // Start loading

        try {
            const response = await axios.get(`${serverEndpoint}/documents/${userID}/${documentID}`);
            if (response.status === 200) {
                const { images } = response.data;
                if (images && images.length > 0) {
                    const pdfFile = images.find((item: string) => item.endsWith(".pdf"));
                    if (pdfFile) {
                        // Convert the PDF URL to Google Docs viewer URL
                        const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfFile)}`;
                        setPdfUrl(googleDocsUrl); // Use Google Docs viewer URL for the WebView
                        setImages([]); // Clear images if it's a PDF
                    } else {
                        setImages(images); // Set images if no PDF is found
                        setPdfUrl(null);
                    }
                } else {
                    Alert.alert("Error", "No images or PDF found for this document.");
                }
            } else {
                Alert.alert("Error", "Failed to load document.");
            }
        } catch (error) {
            console.error("Error fetching document details:", error);
            Alert.alert("Error", "An error occurred while loading the document.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditDocument = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setNewDocumentName(documentName); // Revert the name back to the original
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`${serverEndpoint}/documents/${userID}/${documentID}`, {
                newName: newDocumentName,
            });

            if (response.status === 200) {
                setNewDocumentName(newDocumentName); // Update the local state
                setIsEditing(false);
                Alert.alert("Success", "Document name updated successfully.");
            } else {
                Alert.alert("Error", "Failed to update document name.");
            }
        } catch (error) {
            console.error("Error updating document name:", error);
            Alert.alert("Error", "An error occurred while updating the document name.");
        }
        setIsEditing(false);
    };

    const handleDeleteDocument = async () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this document?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await axios.delete(
                                `${serverEndpoint}/documents/${userID}/${documentID}`
                            );

                            if (response.status === 200) {
                                Alert.alert("Success", "Document deleted successfully.");
                                navigation.goBack();
                            } else {
                                Alert.alert("Error", "Failed to delete document.");
                            }
                        } catch (error) {
                            console.error("Error deleting document:", error);
                            Alert.alert("Error", "An error occurred while deleting the document.");
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}
            {pdfUrl ? (
                <WebView
                    source={{ uri: pdfUrl }}
                    style={styles.pdf}
                    onError={(error) => {
                        console.error("Error loading PDF:", error);
                        Alert.alert("Error", "Failed to load PDF.");
                    }}
                />
            ) : (
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={columnCount}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.imageWrapper}
                            onPress={() => navigation.navigate("ImageViewer", { imageUri: item })}
                        >
                            <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => <Text style={styles.noImagesText}>No images found.</Text>}
                />
            )}
        </View>
    );

};

export default LoadDocument;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    row: {
        flex: 1,
        justifyContent: "flex-start",
    },
    imageWrapper: {
        width: screenWidth / columnCount - 15,
        margin: 5,
    },
    image: {
        width: "100%",
        height: 200,
    },
    noImagesText: {
        textAlign: "center",
        marginTop: 20,
    },
    pdf: {
        flex: 1,
        width: screenWidth - 20,
        marginTop: 10,
    },
    headerButtonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
    },
    textInput: {
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        width: 200,
        color: "black",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        maxWidth: 190,
    },
    editButton: {
        marginRight: 10,
        padding: 5,
    },
    editButtonText: {
        color: "#007AFF",
        fontWeight: "bold",
    },
    saveButton: {
        marginRight: 10,
        padding: 5,
    },
    saveButtonText: {
        color: "green",
        fontWeight: "bold",
    },
    cancelButton: {
        padding: 5,
    },
    cancelButtonText: {
        color: "gray",
        fontWeight: "bold",
    },
    deleteButton: {
        padding: 5,
    },
    deleteButtonText: {
        color: "red",
        fontWeight: "bold",
    },
    loadingIndicator: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 1,
    },

});
