import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import configData from "../../../config.json";
import { colors, fonts } from "../../constants/constants";
import { DocumentStackParamList } from "../../navigation/DocumentNavigator";

// Define types for navigation and route
type LoadDocumentNavigationProp = StackNavigationProp<
    DocumentStackParamList,
    "LoadDocument"
>;
type LoadDocumentRouteProp = RouteProp<DocumentStackParamList, "LoadDocument">;

const LoadDocument: React.FC = () => {
    const [images, setImages] = useState<string[]>([]); // State to store document images
    const route = useRoute<LoadDocumentRouteProp>();
    const navigation = useNavigation<LoadDocumentNavigationProp>();

    const { documentID, documentName } = route.params;
    const serverEndpoint = configData.API_ENDPOINT;

    useEffect(() => {
        navigation.setOptions({ title: documentName }); // Set document name in the header

        // Fetch document details (including images)
        const fetchDocumentDetails = async () => {
            try {
                const response = await axios.get(
                    `${serverEndpoint}/documents/${documentID}`
                );
                if (response.status === 200 && response.data.images) {
                    setImages(response.data.images); // Set images in state
                } else {
                    Alert.alert("Error", "Failed to load document images.");
                }
            } catch (error) {
                console.error("Error fetching document details:", error);
                Alert.alert(
                    "Error",
                    "An error occurred while loading document."
                );
            }
        };

        fetchDocumentDetails();
    }, [documentID, documentName, navigation]);

    const viewImageFullScreen = (imageUri: string) => {
        navigation.navigate("ImageViewer", { imageUri });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {images.length > 0 ? (
                images.map((imageUri, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => viewImageFullScreen(imageUri)}
                    >
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noImagesText}>
                    No images found for this document.
                </Text>
            )}
        </ScrollView>
    );
};

export default LoadDocument;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: "center",
        backgroundColor: colors.white,
    },
    image: {
        width: "90%",
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    noImagesText: {
        fontSize: 18,
        color: "gray",
        marginTop: 20,
        textAlign: "center",
    },
});
