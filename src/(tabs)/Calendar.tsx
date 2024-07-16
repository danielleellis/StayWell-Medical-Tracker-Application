import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { colors, fonts } from "../constants/constants";

const { width, height } = Dimensions.get("window");

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("2024-07-16");

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const calendarHeight = height * 0.5; // 50% of the screen height

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>S T A Y W E L L</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.calendarContainer}>
            <Calendar
              style={[
                //styles.calendar, in case we need to style the calendar independently in the future
                { width: width, height: calendarHeight },
              ]}
              current={selectedDate}
              hideArrows={false}
              onDayPress={onDayPress}
              monthFormat={"MMMM"}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: colors.blue },
              }}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 30,
    color: colors.blue,
    fontFamily: fonts.regular,
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  //calendar: {
  // for future styling
  //},
});

export default App;
