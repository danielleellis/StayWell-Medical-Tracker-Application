import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../constants/colors";

const Create = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>S T A Y W E L L</Text>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },
  heading: {
    fontSize: 30,
    color: colors.blue,
    fontFamily: "JosefinSans-Regular",
  },
});
