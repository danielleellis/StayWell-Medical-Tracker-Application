import { Button, Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Alert} from "react-native";
import { colors, fonts } from "../../constants/constants";
import Input from "../../components/Input";
import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';

import axios from "axios";
import configData from "../../../config.json";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const NewTask: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [habitName, setHabitName] = useState("");
  const [allDay, setAllDay] = useState(false);
  
  // recurring
  const [recurring, setRecurring] = useState(false);

  //mode??
  const [mode, setMode] = useState('date');

  //start date, declare vars and set up show/hide functions
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const showMode = (currentMode: any) => {
    setShowStartDatePicker(true);
    setMode(currentMode);
  }; 

  //when start date button clicked and user selects date it'll close the picker
  const onChangeStartDate = (event: any, selectedDate: any) => {
    const currentStart = selectedDate;
    setStartDate(currentStart);
    setShowStartDatePicker(false);
  }; 

  //show start time picker
  const showStartTimeMode = (currentMode: any) => {
    setShowStartTimePicker(true);
  }; 

  //when start time button clicked and user selects time it'll close the picker
  const onChangeStartTime = (event: any, selectedDate: any) => {
    const currentStart = selectedDate;
    setStartTime(currentStart);
    setShowStartTimePicker(false);
  }; 
  

  // end date
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  //when end date button clicked and user selects date it'll close the picker
  const onChangeEndDate = (event: any, selectedDate: any) => {
    const currentStart = selectedDate;
    setEndDate(currentStart);
    setShowEndDatePicker(false);
  }; 

  //show end date picker
  const showEndDateMode = (currentMode: any) => {
    setShowEndDatePicker(true);
  }; 

  //show end time picker
  const showEndTimeMode = (currentMode: any) => {
    setShowEndTimePicker(true);
  }; 

  //when end time button clicked and user selects time it'll close the picker
  const onChangeEndTime = (event: any, selectedDate: any) => {
    const currentEnd = selectedDate;
    setEndTime(currentEnd);
    setShowEndTimePicker(false);
  }; 
  

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

      <View style= {styles.dateContainer}>
      
        <View style= {styles.testContainer}>
          <TouchableOpacity style={styles.clockButton} onPress={() => showMode('date')}>
            <Text style={styles.clockText}>Start Date</Text>
          </TouchableOpacity>
          {showStartDatePicker && (<DateTimePicker
            mode={"date"}
            display="default" 
            value = {startDate}
            onChange={onChangeStartDate}
            />)}
          <Text style={styles.regularText}>{startDate.toLocaleDateString()}</Text> 
        </View>

        <View style= {styles.testContainer}>
          <TouchableOpacity style={styles.clockButton} onPress={showStartTimeMode}>
            <Text style={styles.clockText}>Start Time</Text>
          </TouchableOpacity>
          {showStartTimePicker && (<DateTimePicker
            mode="time"
            display="default" 
            value = {startTime}
            onChange={onChangeStartTime}
            />)}
          <Text style={styles.regularText}>{startTime.toLocaleTimeString()}</Text>
        </View> 


        <View style= {styles.testContainer}>
          <TouchableOpacity style={styles.clockButton} onPress={showEndDateMode}>
            <Text style={styles.clockText}>End Date</Text>
          </TouchableOpacity>
          {showEndDatePicker && (<DateTimePicker
            mode="date"
            display="default" 
            value = {endDate}
            onChange={onChangeEndDate}
            />)}
          <Text style={styles.regularText}>{endDate.toLocaleDateString()}</Text> 
        </View>

        <View style= {styles.testContainer}>
          <TouchableOpacity style={styles.clockButton} onPress={showEndTimeMode}>
            <Text style={styles.clockText}>End Time</Text>
          </TouchableOpacity>
          {showEndTimePicker && (<DateTimePicker
            mode="time"
            display="default" 
            value = {endTime}
            onChange={onChangeEndTime}
            />)}
          <Text style={styles.regularText}>{endTime.toLocaleTimeString()}</Text>
        </View>

      </View>

      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveHabit}>
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
    paddingTop: '5%',
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 30,
    color: colors.white,
    fontFamily: fonts.regular,
    marginTop:'10%',
    padding: '10%'
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
  input: {
    width: '85%',
    backgroundColor: colors.white,
    margin:'3%'
  },
  saveButton: {
    borderRadius: 10,
    backgroundColor: colors.white,  
  },
  saveButtonText: {
    fontSize: 18,
    margin: 10,
    color: colors.blue,
    fontWeight: "bold",
  },
  saveContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    margin: '10%'
  },
  dateContainer:{
    flex: 1,
    justifyContent: "flex-start",
    alignItems: 'baseline',
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
  },
  regularText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.regular,
    margin: '5%'
  },
  clockText: {
    color: colors.blue,
    fontSize: 14,
    fontFamily: fonts.bold,
    padding: '3%',
  }, 
  clockButton: {
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  });
