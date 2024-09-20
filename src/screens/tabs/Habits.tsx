import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { colors, fonts } from "../../constants/constants";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";


const Habits: React.FC<{ navigation: any }> = ({ navigation }) => {

  const newHabit = () => {
    navigation.navigate("NewTask");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>S T A Y W E L L</Text>

      <View style ={styles.weekContainer}>
        <CalendarProvider
          date={'2024-09-19'}> 
          <WeekCalendar 
            allowShadow={false}
          />
          
        </CalendarProvider>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={newHabit}>
          <View style={styles.row}>
            <Image
              source={require("../../../assets/images/plus-icon.png")}
              style={styles.plusIcon}
            />
            <Text style={styles.buttonText}>Create Habit</Text>
          </View>
        </TouchableOpacity>

      </View>
      
    </View>
  );
};

export default Habits;

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
    color: colors.blue,
    marginTop: '5%',
    fontFamily: fonts.regular,
  },
  weekContainer:{
    flex: 1,
  },
  buttonContainer:{
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
},
  row: {
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  plusIcon: {
    width: 30,
    height: 30,
    margin: 10,
},
buttonText: {
  color: colors.blue,
  fontSize: 16,
  fontFamily: "JosefinSans-Bold",
},
});
