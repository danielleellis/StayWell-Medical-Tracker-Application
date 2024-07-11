import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { colors, fonts } from "../constants/constants";

const NewTask = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New Task</Text>
    </View>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },
  heading: {
    fontSize: 30,
    color: colors.black,
    fontFamily: fonts.regular,
  },
});
