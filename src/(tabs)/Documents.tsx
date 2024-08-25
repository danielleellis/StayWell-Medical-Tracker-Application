import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setupProfile } from "../redux/slices/authSlice";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { colors, fonts } from "../constants/constants";
import axios from 'axios';
import configData from "../../config.json";
import { useSelector } from 'react-redux';

const Documents: React.FC<{ navigation: any }> = ({ navigation }) => {
    const createNewDocument = () => {
        console.log("Button clicked: Create New Document");
        navigation.navigate('NewDocument');
    }

    

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>D O C U M E N T S</Text>

            <TouchableOpacity style={styles.button} onPress={createNewDocument}>
                <Text style={styles.buttonText}>Create New Document</Text>
            </TouchableOpacity>
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
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