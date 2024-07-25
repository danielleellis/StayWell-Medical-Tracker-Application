import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import { colors, fonts } from "../constants/constants";

const NewDocument = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
      <Text style={styles.heading}>New Document</Text>
      </View>
    </SafeAreaView>
  );
};

export default NewDocument;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: '10%',
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 30,
    color: colors.white,
    //marginTop: '5%',
    marginBottom:'100%',
    fontFamily: fonts.regular,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.blue,
    width:'90%',
    borderRadius:15,
    margin:'20%'
  },
});
