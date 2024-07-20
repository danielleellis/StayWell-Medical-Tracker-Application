import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { colors, fonts } from "../constants/constants";

const Documents = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>S T A Y W E L L</Text>
    </View>
  );
};

export default Documents;

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
    marginTop: 20,
    fontFamily: fonts.regular,
  },
});
