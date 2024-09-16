import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { DocumentStackParamList } from "../../navigation/DocumentNavigator";
import { colors } from "../../constants/constants";

type ImageViewerNavigationProp = StackNavigationProp<DocumentStackParamList, "ImageViewer">;
type ImageViewerRouteProp = RouteProp<DocumentStackParamList, "ImageViewer">;

type ImageViewerProps = {
    navigation: ImageViewerNavigationProp;
    route: ImageViewerRouteProp;
};

const ImageViewer: React.FC<ImageViewerProps> = ({ navigation, route }) => {
    const { imageUri } = route.params;

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: imageUri }}
                style={styles.fullScreenImage}
                resizeMode="contain"
            />
        </View>
    );
};

export default ImageViewer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    fullScreenImage: {
        width: "100%",
        height: "100%",
    },
});
