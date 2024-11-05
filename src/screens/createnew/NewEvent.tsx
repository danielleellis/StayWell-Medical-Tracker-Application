import {
  Button,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  Switch,
  TextInput,
} from "react-native";
import { colors, fonts } from "../../constants/constants";
import Input from "../../components/Input";
import React, { useState, useEffect } from "react";
import DateTimePicker, {
  Event as RNEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { ColorPicker } from "react-native-color-picker";
import axios from "axios";
import configData from "../../../config.json";
import { useRoute } from "@react-navigation/native";

const NewEvent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [eventName, setEventName] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [viewableBy, setViewableBy] = useState("");
  const [notes, setNotes] = useState("");
  const [streakDays, setStreakDays] = useState(0);
  const [reminder, setReminder] = useState("");
  const [eventType, setEventType] = useState("");
  const [calendarID, setCalendarID] = useState("");
  const [userID, setUserID] = useState("");
  const [completed, setCompleted] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const serverEndpoint = configData.API_ENDPOINT;

  const saveEvent = async () => {
    if (!eventName || !eventType) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // start/end date and time together to match database
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours(), startTime.getMinutes());

    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

    if (endDateTime < startDateTime) {
      Alert.alert("Error", "End time must be after start time");
      return;
    }

    try {
      const response = await axios.post(`${serverEndpoint}/events`, {
        eventName,
        color,
        isPublic,
        viewableBy,
        notes,
        streakDays,
        reminder,
        startTime: startDateTime.toISOString(), // format for database compatibility
        endTime: endDateTime.toISOString(),
        allDay,
        eventType,
        calendarID,
        userID,
        completed,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Event created successfully!");
        navigation.navigate("Events");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create event");
    }
  };

  useEffect(() => {
    if (allDay) {
      const nextDay = new Date(startDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndDate(nextDay);
    } else {
      setEndDate(startDate);
    }
  }, [allDay, startDate]);

  useEffect(() => {
    const now = new Date();
    setStartDate(now);
    setStartTime(now);
    const initialEndTime = new Date(now);
    initialEndTime.setHours(now.getHours() + 1);
    setEndTime(initialEndTime);
    setEndDate(now);
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Create Event</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Calendar")}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{"BACK"}</Text>
          </TouchableOpacity>
          <Input
            placeholder="Event Name"
            value={eventName}
            onChangeText={(text) => {
              if (text.length <= 30) {
                setEventName(text);
              } else {
                Alert.alert(
                  "Limit Reached",
                  "Event Name cannot exceed 30 characters."
                );
              }
            }}
            autoCapitalize="words"
            style={styles.input}
          />

          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={[styles.halfClockButton, { marginRight: 5 }]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.centeredText}>
                Start Date: {"\n"}
                {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                mode="date"
                display="default"
                value={startDate}
                onChange={(event, date) => {
                  setShowStartDatePicker(false);
                  setStartDate(date || startDate);
                }}
              />
            )}

            {!allDay && (
              <TouchableOpacity
                style={styles.halfClockButton}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Text style={styles.centeredText}>
                  Start Time: {"\n"}
                  {formatTime(startTime)}
                </Text>
              </TouchableOpacity>
            )}
            {showStartTimePicker && (
              <DateTimePicker
                mode="time"
                display="default"
                value={startTime}
                onChange={(event, time) => {
                  setShowStartTimePicker(false);
                  setStartTime(time || startTime);
                }}
              />
            )}
          </View>

          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={[styles.halfClockButton, { marginRight: 5 }]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.centeredText}>
                End Date: {"\n"}
                {endDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                mode="date"
                display="default"
                value={endDate}
                onChange={(event, date) => {
                  setShowEndDatePicker(false);
                  setEndDate(date || endDate);
                }}
              />
            )}

            {!allDay && (
              <TouchableOpacity
                style={styles.halfClockButton}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Text style={styles.centeredText}>
                  End Time: {"\n"}
                  {formatTime(endTime)}
                </Text>
              </TouchableOpacity>
            )}
            {showEndTimePicker && (
              <DateTimePicker
                mode="time"
                display="default"
                value={endTime}
                onChange={(event, time) => {
                  setShowEndTimePicker(false);
                  setEndTime(time || endTime);
                }}
              />
            )}
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>All Day Event</Text>
            <Switch
              value={allDay}
              onValueChange={(value) => setAllDay(value)}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Recurring</Text>
            <Switch
              value={recurring}
              onValueChange={(value) => setRecurring(value)}
            />
          </View>

          {recurring && (
            <View style={styles.recurrenceContainer}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day) && styles.selectedDayButton,
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text style={styles.dayButtonText}>{day}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Event Type:</Text>
            <Picker
              selectedValue={eventType}
              onValueChange={(itemValue) => setEventType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="One-Time Appointment" value="appointment" />
              <Picker.Item label="Daily Task" value="task" />
              <Picker.Item label="Recurring Habit" value="habit" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Reminder:</Text>
            <Picker
              selectedValue={reminder}
              onValueChange={(itemValue) => setReminder(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="None" value="none" />
              <Picker.Item label="10 minutes before" value="10m" />
              <Picker.Item label="30 minutes before" value="30m" />
              <Picker.Item label="1 hour before" value="1h" />
              <Picker.Item label="1 day before" value="1d" />
            </Picker>
          </View>

          <Input
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Public</Text>
            <Switch
              value={isPublic}
              onValueChange={(value) => setIsPublic(value)}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Already Completed</Text>
            <Switch
              value={completed}
              onValueChange={(value) => setCompleted(value)}
            />
          </View>

          <View style={styles.saveContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={saveEvent}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: "5%",
  },
  scrollView: {
    width: "100%",
  },
  contentContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  backButton: {
    position: "absolute",
    top: "2%",
    left: "5%",
  },
  backButtonText: {
    fontSize: 18,
    color: colors.white,
    fontFamily: fonts.regular,
  },
  heading: {
    fontSize: 30,
    color: colors.white,
    fontFamily: fonts.regular,
    marginTop: "10%",
    padding: "10%",
  },
  innerContainer: {
    backgroundColor: colors.blue,
    width: "90%",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 20,
  },
  input: {
    width: "85%",
    backgroundColor: colors.white,
    margin: "3%",
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
    fontFamily: fonts.regular,
  },
  saveContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    marginBottom: "10%",
  },
  clockButton: {
    width: "85%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    backgroundColor: colors.white,
  },
  clockText: {
    fontSize: 16,
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.regular,
  },
  pickerContainer: {
    width: "85%",
    backgroundColor: colors.white,
    marginVertical: "3%",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: colors.black,
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  halfClockButton: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  centeredText: {
    textAlign: "center",
    fontFamily: fonts.regular,
    color: colors.blue,
  },
  pickerLabel: {
    textAlign: "left",
    margin: "3%",
    fontFamily: fonts.regular,
    color: colors.blue,
  },
  recurrenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  recurrenceTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.black,
    fontFamily: fonts.regular,
  },
  dayButton: {
    padding: 8,
    margin: 4,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  dayButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  selectedDayButton: {
    backgroundColor: colors.green,
  },
});
