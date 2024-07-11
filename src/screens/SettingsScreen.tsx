import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { colors, fonts } from "../constants/constants";

const Settings: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* <Text style={styles.heading}>S T A Y W E L L</Text> */}
            <Text>Settings Screen</Text>
        </View>
    );

};

export default Settings;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 15,

    },
    heading: {
        fontSize: 30,
        color: colors.blue,
        fontFamily: fonts.regular,
    },
});
