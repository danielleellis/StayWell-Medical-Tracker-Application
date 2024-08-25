import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { signUp } from "../redux/slices/authSlice";
import { useFonts } from "expo-font";
import { colors, fonts } from "../constants/constants";
import axios from 'axios';
import configData from "../../config.json";

const NewDocument: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [documentName, setDocumentName] = useState("");

    // Lock slider button
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    const saveDocument = () => {
        navigation.navigate('Documents');
    }

    return (
        <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>

            <Input
                placeholder="Document Name"
                value={documentName}
                onChangeText={setDocumentName}
                autoCapitalize="words"
                style={styles.input}
            />

            <View style={styles.row}>
                <Image 
                    source={require('../../assets/images/lock-icon.png')}
                    style={styles.lockIcon} 
                />
                <Text style={styles.text}>Password Protect </Text>
                <Switch
                    trackColor={{ false: colors.grey, true: colors.grey }}
                    thumbColor={isEnabled ? colors.white : colors.white}
                    ios_backgroundColor={colors.grey}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>

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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    contentContainer: {
        backgroundColor: '#45A6FF',
        margin: 5,
        borderWidth: 2,
        borderColor: '#6BB7ED',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
    },
    saveButton: {
        borderRadius: 10,
        backgroundColor: colors.white,
    },
    saveButtonText: {
        fontSize: 18,
        margin: 10,
        color: '#45A6FF',
        fontWeight: 'bold',
    },
    documentIcon: {
        width: 12,
        height: 16,
        marginRight: 10,
    },
    lockIcon: {
        width: 30,
        height: 35,
        margin: 10,
    },
    heading: {
        fontSize: 30,
        color: colors.white,
        marginBottom: '100%',
        fontFamily: fonts.regular,
    },
    innerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.blue,
        width: '90%',
        borderRadius: 15,
        margin: '20%'
    },
    input: {
        marginBottom: 16,
        color: colors.white,
    },
});
