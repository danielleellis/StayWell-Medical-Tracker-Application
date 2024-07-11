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

  // calculate width for day containers based on screen width
  const screenWidth = Dimensions.get("window").width;
  const containerPaddingHorizontal = 0;
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
              style={[
                styles.dayOfWeek,
                { width: dayContainerWidth, textAlign: "center" },
              ]}
            >
              {day}
            </Text>
          ))}
        </View>
        <View style={[styles.daysContainer, { flex: 1 }]}>
          {daysInMonth.map((day) => (
            <View
              key={day}
              style={[
                styles.dayContainer,
                { width: dayContainerWidth, marginBottom: 10 },
                getDayOfWeek(day) === "Sun"
                  ? { marginLeft: 0 }
                  : { marginLeft: containerPaddingHorizontal },
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
    paddingHorizontal: 10,
    paddingTop: 25,
  },
  heading: {
    fontSize: 24,
    color: colors.white,
    fontFamily: fonts.regular,
    marginBottom: 30,
  },
  currentDate: {
    fontSize: 20,
    color: colors.white,
    fontFamily: fonts.regular,
  },
  calendarContainer: {
    marginTop: 10,
  },
  daysOfWeekContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 5,
  },
  dayOfWeek: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayContainer: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 7,
    marginHorizontal: -3,
  },
  day: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
  },
});

export default Calendar;
