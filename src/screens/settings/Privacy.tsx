import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { colors, fonts } from "../../constants/constants";

const Privacy:React.FC<{navigation:any}> = ({navigation}) =>{
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Privacy Settings</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("SettingsHome")}
        style={styles.backButton} >
            <Text style={styles.backButtonText}>{"BACK"}</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default Privacy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 30,
    color: colors.blue,
    fontFamily: fonts.regular,
    padding: '5%'
  },
  backButton: {
    position: "absolute",
    top: '2%',
    left: '5%',
    paddingTop: '5%'
  },
  backButtonText: {
    fontSize: 18,
    color: colors.blue,
    fontFamily: fonts.regular,
  },
});