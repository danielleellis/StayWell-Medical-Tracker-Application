import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { DocumentStackParamList } from "../../navigation/DocumentNavigator";

// Define the route type for ImageViewer
type ImageViewerRouteProp = RouteProp<DocumentStackParamList, "ImageViewer">;

const ImageViewer: React.FC = () => {
    const route = useRoute<ImageViewerRouteProp>();
    const { imageUri } = route.params; // Destructure imageUri from route params

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUri }} style={styles.fullImage} />
        </View>
    );
};

export default ImageViewer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    fullImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
});
