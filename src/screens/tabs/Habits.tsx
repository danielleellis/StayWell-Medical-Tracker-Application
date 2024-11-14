import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { colors, fonts } from "../../constants/constants";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";

const Habits: React.FC<{ navigation: any }> = ({ navigation }) => {
  // navigate to create habit page when button is clicked
  const newHabit = () => {
    navigation.navigate("NewTask");
  };

  // current day so calendar opens to current date
  const currentDay = new Date().toISOString().split("T")[0];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>H A B I T S</Text>

      <View style={styles.weekContainer}>
        <CalendarProvider date={currentDay}>
          <WeekCalendar
            allowShadow={false}
            theme={{
              textSectionTitleColor: colors.black,
              dayTextColor: colors.black,
              selectedDayTextColor: colors.white,
              todayTextColor: colors.blue,
              textDisabledColor: colors.grey,
              arrowColor: colors.blue,
              selectedDotColor: colors.white,
              textDayFontFamily: fonts.regular,
              textMonthFontFamily: fonts.regular,
              textDayHeaderFontFamily: fonts.regular,
              textDayFontWeight: "normal",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "normal",
            }}
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
    paddingTop: "10%",
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 30,
    color: colors.blue,
    marginTop: "5%",
    fontFamily: fonts.regular,
  },
  weekContainer: {
    flex: 0.8, // Adjust the flex value to give more room for the button
  },
  buttonContainer: {
    paddingBottom: 20, // Adjust bottom padding to position the button
  },
  button: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Add shadow for better visibility
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily: fonts.regular,
  },
});
