import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { colors, fonts } from "../../constants/constants";
import configData from "../../../config.json";
import { useFocusEffect } from "@react-navigation/native";

const Documents: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [documents, setDocuments] = useState<any[]>([]); // State to hold documents
    const user = useSelector((state: RootState) => state.auth.user);
    const userID = user?.userID; // Get userID from Redux
    const serverEndpoint = configData.API_ENDPOINT;

    // Function to fetch documents from the backend
    const fetchDocuments = async () => {
        try {
            const response = await axios.get(
                `${serverEndpoint}/documents/${userID}`
            );
            if (response.status === 200) {
                setDocuments(response.data.documents); // Update documents state with the response data
            } else {
                Alert.alert("Error", "Failed to load documents");
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
            Alert.alert("Error", "An error occurred while fetching documents");
        }
    };

    // Fetch documents every time the screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchDocuments(); // Fetch documents when screen is focused
        }, [userID])
    );

    const createNewDocument = () => {
        navigation.navigate("NewDocument");
    };

    const openDocument = (documentID: string, documentName: string) => {
        navigation.navigate("LoadDocument", { documentID, documentName });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>D O C U M E N T S</Text>

            <TouchableOpacity style={styles.button} onPress={createNewDocument}>
                <View style={styles.row}>
                    <Image
                        source={require("../../../assets/images/plus-icon.png")}
                        style={styles.plusIcon}
                    />
                    <Text style={styles.buttonText}>Upload New Document</Text>
                </View>
            </TouchableOpacity>

            {/* Scrollable section for documents */}
            <ScrollView contentContainerStyle={styles.documentsContainer}>
                {documents.length > 0 ? (
                    documents.map((doc, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.documentContainer}
                            onPress={() =>
                                openDocument(doc.documentID, doc.documentName)
                            }
                        >
                            <View style={styles.row}>
                                <Image
                                    source={require("../../../assets/images/document-icon.png")}
                                    style={styles.documentIcon}
                                />
                                <Text style={styles.text}>
                                    {doc.documentName}
                                </Text>
                                {doc.lockPasscode && (
                                    <Image
                                        source={require("../../../assets/images/lock-icon.png")}
                                        style={styles.lockIcon}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={styles.noDocumentsText}>
                            No Documents Found
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default Documents;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        paddingTop: "10%",
        backgroundColor: colors.white,
    },
    button: {
        padding: 5,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 5,
        marginBottom: 5,
    },
    buttonText: {
        color: colors.blue,
        fontSize: 16,
        fontFamily: fonts.regular, // Consistent font
    },
    heading: {
        fontSize: 30,
        color: colors.blue,
        marginTop: "5%",
        fontFamily: fonts.regular, // Consistent font
        textAlign: "center",
    },
    text: {
        fontSize: 20,
        color: colors.white,
        fontFamily: fonts.regular, // Consistent font
    },
    documentsContainer: {
        paddingBottom: 20, // To ensure last item isn't hidden
    },
    documentContainer: {
        backgroundColor: colors.blue,
        width: "90%",
        margin: 5,
        borderWidth: 2,
        borderColor: colors.blue,
        borderRadius: 20,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
    },
    noDocumentsText: {
        textAlign: "center",
        color: "gray",
        fontSize: 18,
        marginTop: 20,
        fontFamily: fonts.regular, // Consistent font
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        fontSize: 16,
    },
    documentIcon: {
        width: 15,
        height: 19,
        marginRight: 10,
    },
    lockIcon: {
        width: 17,
        height: 20,
        marginLeft: 10,
    },
    plusIcon: {
        width: 53,
        height: 52,
        margin: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: fonts.regular, // Consistent font
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        width: "100%",
        padding: 10,
        marginBottom: 15,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
});
