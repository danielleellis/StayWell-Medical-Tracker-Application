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
                    trackColor={{ false: colors.grey, true: colors.blue }}
                    thumbColor={isEnabled ? colors.white : colors.darkgrey}
                    ios_backgroundColor={colors.grey}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>

            <Button title="Save Document" onPress={saveDocument} />
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
        color: colors.black,
    },
    row: {
        flexDirection: 'row', // Align children horizontally 
        alignItems: 'center', // Center children vertically in the row
        marginBottom: 20,
    },
    contentContainer: {
        alignItems: "center",
        flexGrow: 1,
    },
    documentIcon: {
        width: 12,
        height: 16,
        marginRight: 10,
    },
    lockIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
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
    },
});
