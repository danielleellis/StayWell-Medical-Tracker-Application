import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { colors, fonts } from "../constants/constants";

const CalendarScreen = () => {
  const [currentMonth, setCurrentMonth] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState("");
  const [daysInMonth, setDaysInMonth] = React.useState<number[]>([]);

  React.useEffect(() => {
    // fetch current date and month
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const date = today.getDate().toString();

    setCurrentMonth(month);
    setCurrentDate(date);

    // fetch days in current month
    const year = today.getFullYear();
    const days = new Date(year, today.getMonth() + 1, 0).getDate();
    const daysArray = Array.from({ length: days }, (_, i) => i + 1);

    setDaysInMonth(daysArray);
  }, []);

  // get the day of the week for given date
  const getDayOfWeek = (date: number): string => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      date
    ).getDay();
    return daysOfWeek[dayIndex];
  };

  // dayContainer dynamically fits 7 items per row
  const screenWidth = Dimensions.get("window").width;
  const containerPaddingHorizontal = 10;
  const dayContainerWidth = (screenWidth - 2 * containerPaddingHorizontal) / 7;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>S T A Y W E L L</Text>
      <Text style={styles.currentDate}>
        {currentMonth} {new Date().getFullYear()}
      </Text>
      <View style={styles.calendarContainer}>
        <View style={styles.daysOfWeekContainer}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text
              key={day}
              style={[styles.dayOfWeek, { width: dayContainerWidth }]}
            >
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.daysContainer}>
          {daysInMonth.map((day) => (
            <View
              key={day}
              style={[
                styles.dayContainer,
                {
                  marginLeft:
                    getDayOfWeek(day) === "Sun"
                      ? 0
                      : containerPaddingHorizontal,
                },
              ]}
            >
              <Text style={styles.day}>{day}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const Calendar = () => {
  return (
    <View style={styles.blueContainer}>
      <CalendarScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  blueContainer: {
    flex: 1,
    backgroundColor: colors.blue,
    alignItems: "center",
    paddingTop: 40,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    color: colors.white,
    fontFamily: fonts.regular,
    marginBottom: 25,
  },
  currentDate: {
    fontSize: 20,
    color: colors.white,
    fontFamily: fonts.regular,
  },
  calendarContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  daysOfWeekContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginLeft: 8,
    marginRight: 8,
  },
  dayOfWeek: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.white,
    width: 40,
    textAlign: "center",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  day: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
  },
});

export default Calendar;
