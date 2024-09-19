import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { colors, fonts } from "../../constants/constants";
import Input from "../../components/Input";
import React, { useState } from "react";

const NewTask: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [habitName, setHabitName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.innerContainer}>
      <Text style={styles.heading}>Create Habit</Text>
      
      <TouchableOpacity
        onPress={() => navigation.navigate("Habits")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>{"BACK"}</Text>
      </TouchableOpacity>

      <Input
        placeholder="Title"
        value={habitName}
        onChangeText={setHabitName}
        autoCapitalize="words"
        style={styles.input}
      />

      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>   
      </View>  


      </View>
    </SafeAreaView>
  );
};

export default NewTask;

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
    fontFamily: fonts.regular,
    marginTop:'10%',
    padding: 40
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.blue,
    width:'90%',
    borderRadius:15,
    margin:'10%'
  },
  saveButton: {
    borderRadius: 10,
    backgroundColor: colors.white,
    
},
saveButtonText: {
    fontSize: 18,
    margin: 10,
    color: "#45A6FF",
    fontWeight: "bold",
},
input: {
  width: '85%',
  backgroundColor: colors.white,
},
saveContainer: {
  flex: 1,
  justifyContent: "flex-end",
  alignItems: "center",
  margin: '10%'
},
backButton: {
  position: "absolute",
  top: '3%',
  left: '5%'
},
backButtonText: {
  fontSize: 16,
  color: colors.white,
  fontFamily: fonts.regular,
},
});
