import { Button, Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView} from "react-native";
import { colors, fonts } from "../../constants/constants";
import Input from "../../components/Input";
import React, { useState } from "react";
import axios from "axios";
import configData from "../../../config.json";

const NewTask: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("");
  const freqDays = [
    {id:'1', title:'S'},
    {id:'2', title:'M'},
    {id:'3', title:'T'},
    {id:'4', title:'W'},
    {id:'5', title:'T'},
    {id:'6', title:'F'},
    {id:'7', title:'S'},
]

  const serverEndpoint = configData.API_ENDPOINT;

  //save habit
  const saveHabit = async () => {
    if (!habitName) {
      Alert.alert("Error", "Habit name is required");
      return;
  }
    navigation.navigate("Habits");
  }

  return (
    <SafeAreaView style={styles.container}> 
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}> 
    <View style={styles.innerContainer}>
      <Text style={styles.heading}>Create Habit</Text>
      
      <TouchableOpacity
        onPress={() => navigation.navigate("Habits")}
        style={styles.backButton} >
      
        <Text style={styles.backButtonText}>{"BACK"}</Text>
      </TouchableOpacity>

      <Input
        placeholder="Habit Name"
        value={habitName}
        onChangeText={setHabitName}
        autoCapitalize="words"
        style={styles.input}
      />   

      <Input
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        autoCapitalize="words"
        style={styles.inputDescription}
      />

      <Input
        placeholder="Emoji"
        value={emoji}
        onChangeText={setEmoji}
        autoCapitalize="words"
        style={styles.inputEmoji}
      />

      {/*
        <FlatList
        data={freqDays}
        horizontal={true}
        keyExtractor={item => item.id}
        renderItem={({item}) =>(
        <View style={styles.item}>
          <TouchableOpacity>
            <Text style={styles.title}>{item.title}</Text> 
          </TouchableOpacity>
        </View>)}     
      />
      */}
        
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveHabit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>   
      </View>  

      </View>
    </ScrollView>
      
    </SafeAreaView>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: '5%',
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 30,
    color: colors.white,
    fontFamily: fonts.regular,
    marginTop:'15%',
    padding: '10%'
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.blue,
    width:'90%',
    borderRadius:15,
    margin:'10%'
  },
  input: {
    width: '90%',
    backgroundColor: colors.white,
    margin:'3%'
  },
  inputDescription: {
    width: '90%',
    height: '15%',
    backgroundColor: colors.white,
    margin:'3%'
  },
  inputEmoji: {
    width: '20%',
    backgroundColor: colors.white,
    margin:'3%',
    justifyContent: 'flex-start'
  },
  saveButton: {
    borderRadius: 10,
    backgroundColor: colors.white,  
  },
  saveButtonText: {
    fontSize: 18,
    margin: 10,
    color: colors.blue,
    fontFamily: fonts.regular,
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
  testContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2%',
  },
  regularText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.regular,
    margin: '5%'
  },
  item:{
    backgroundColor: 'white',
    alignContent: 'center',
    //padding: '5%',
    //margin: '4%', 
    borderRadius: 10,
    height: 'auto',
    width: 'auto'
},
  title:{
    fontSize:16,
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  contentContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  scrollView: {
    width: "100%",
  },
  });
