import React, { useEffect, useState } from "react";
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Dimensions,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import configData from "../../../config.json";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { colors } from "../../constants/constants";
import { DocumentStackParamList } from "../../navigation/DocumentNavigator";

// Define types for navigation and route
type LoadDocumentNavigationProp = StackNavigationProp<DocumentStackParamList, "LoadDocument">;
type LoadDocumentRouteProp = RouteProp<DocumentStackParamList, "LoadDocument">;

const LoadDocument: React.FC = () => {
    const [images, setImages] = useState<string[]>([]); // State to store document images
    const route = useRoute<LoadDocumentRouteProp>();
    const navigation = useNavigation<LoadDocumentNavigationProp>();

    const user = useSelector((state: RootState) => state.auth.user);
    const userID = user?.userID; // Get userID from Redux
    const { documentID, documentName } = route.params;
    const serverEndpoint = configData.API_ENDPOINT;


    useEffect(() => {
        navigation.setOptions({ title: documentName }); // Set document name in the header

        // Fetch document details (including images)
        const fetchDocumentImages = async () => {
            try {
                const response = await axios.get(
                    `${serverEndpoint}/documents/${userID}/${documentID}`
                );
                if (response.status === 200 && response.data.images) {
                    setImages(response.data.images); // Set images in state
                    console.log("Fetched images:", response.data.images);
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


        fetchDocumentImages();
    }, [documentID, documentName, navigation]);

    const viewImageFullScreen = (imageUri: string) => {
        navigation.navigate("ImageViewer", { imageUri });
    };


    return (
        <FlatList
            data={images}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2} // Set number of columns to 2
            contentContainerStyle={styles.container}
            columnWrapperStyle={styles.row}
            renderItem={({ item: imageUri, index }) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("ImageViewer", { imageUri })}
                    style={styles.imageWrapper}
                >
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        resizeMode="contain"
                        onError={(error) => {
                            console.error("Error loading image:", error.nativeEvent.error);
                            Alert.alert("Error", "Failed to load image.");
                        }}
                    />
                </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
                <Text style={styles.noImagesText}>
                    No images found for this document.
                </Text>
            )}
        />
    );

};

export default LoadDocument;

const screenWidth = Dimensions.get('window').width;

const styles = {
    container: {
        paddingHorizontal: 10,
    },
    row: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    imageWrapper: {
        width: (screenWidth / 2) - 15,
        margin: 5,
    },
    image: {
        width: '100%',
        height: 125,
    },
    noImagesText: {
        textAlign: 'center',
        marginTop: 20,
    },
};
