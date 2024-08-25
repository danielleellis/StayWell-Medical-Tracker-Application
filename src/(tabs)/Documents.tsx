import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setupProfile } from "../redux/slices/authSlice";
import { useSelector } from 'react-redux';
import { colors, fonts } from "../constants/constants";

const Documents: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [documents, setDocuments] = useState([
        { name: 'Document 1', isLocked: false },
        { name: 'Document 2', isLocked: true },
        { name: 'Document 3', isLocked: false },
    ]);

    const createNewDocument = () => {
        console.log("Button clicked: Create New Document");
        navigation.navigate('NewDocument');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>D O C U M E N T S</Text>

            <TouchableOpacity style={styles.button} onPress={createNewDocument}>
                <Text style={styles.buttonText}>Create New Document</Text>
            </TouchableOpacity>

            {documents.map((doc, index) => (
                <View key={index} style={styles.documentContainer}>
                    <View style={styles.row}>
                        <Image
                            source={require('../../assets/images/document-icon.png')}
                            style={styles.documentIcon}
                        />
                        <Text style={styles.text}>{doc.name}</Text>
                        {doc.isLocked && (
                            <Image
                                source={require('../../assets/images/lock-icon.png')}
                                style={styles.lockIcon}
                            />
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};

export default Documents;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: '10%',
        backgroundColor: colors.white,
    },
    button: {
        backgroundColor: '#6BB7ED',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'JosefinSans-Bold',
    },
    heading: {
        fontSize: 30,
        color: colors.blue,
        marginTop: '5%',
        fontFamily: fonts.regular,
    },
    text: {
        fontSize: 18,
        color: colors.black,
    },
    documentContainer: {
        width: '90%',
        margin: 5,
        borderWidth: 2,
        borderColor: '#6BB7ED',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        fontSize: 16,
    },
    documentIcon: {
        width: 12,
        height: 18,
        marginRight: 10,
    },
    lockIcon: {
        width: 18,
        height: 18,
        marginLeft: 10,
    },
    input: {
        fontSize: 16,
        marginRight: 10,
    },
});
