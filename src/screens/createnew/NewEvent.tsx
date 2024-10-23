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
    if (!eventName || !calendarID || !eventType) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    try {
      const response = await axios.post(`${serverEndpoint}/events`, {
        eventName,
        startDate,
        startTime,
        endDate,
        endTime,
        allDay,
        color,
        isPublic,
        viewableBy,
        notes,
        streakDays,
        reminder,
        eventType,
        calendarID,
        userID,
        completed,
        recurring,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Event created successfully!");
        navigation.navigate("Events");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create event");
    }
  };

  // handles endDate when allDay is true
  useEffect(() => {
    if (allDay) {
      const nextDay = new Date(startDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndDate(nextDay);
    } else {
      setEndDate(startDate); // reset endDate if allDay is false
    }
  }, [allDay, startDate]);

  // handles recurring events
  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day); // remove if already selected
      } else {
        return [...prev, day]; // add if not selected
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Create Event</Text>

          <Input
            placeholder="Event Name"
            value={eventName}
            onChangeText={setEventName}
            autoCapitalize="words"
            style={styles.input}
          />

          {/* Start Date and Time Pickers */}
          <View style={styles.rowContainer}>
            {/* Start Date */}
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

            {/* Start Time */}
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

          {/* End Date and Time Pickers */}
          <View style={styles.rowContainer}>
            {/* End Date */}
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

            {/* End Time */}
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

          {/* Event Type Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Event Type:</Text>
            <Picker
              selectedValue={eventType}
              onValueChange={(itemValue) => setEventType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Appointment" value="appointment" />
              <Picker.Item label="Task" value="task" />
              <Picker.Item label="Habit" value="habit" />
            </Picker>
          </View>

          {/* Reminder Picker */}
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

          {/* Notes Input */}
          <Input
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
          />

          {/* All Day Event toggle */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>All Day Event</Text>
            <Switch
              value={allDay}
              onValueChange={(value) => setAllDay(value)}
            />
          </View>

          {/* Recurring Event toggle */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Recurring</Text>
            <Switch
              value={recurring}
              onValueChange={(value) => setRecurring(value)}
            />
          </View>

          {/* Recurring Event Details */}
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

          {/* Public Event toggle */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Public</Text>
            <Switch
              value={isPublic}
              onValueChange={(value) => setIsPublic(value)}
            />
          </View>

          {/* Completed Event toggle */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Completed</Text>
            <Switch
              value={completed}
              onValueChange={(value) => setCompleted(value)}
            />
          </View>

          {/* For future implementation
          <Input
            placeholder="Color"
            value={color}
            onChangeText={setColor}
            style={styles.input}
          />

          <Input
            placeholder="Viewable By"
            value={viewableBy}
            onChangeText={setViewableBy}
            style={styles.input}
          />
            

          <Input
            placeholder="Streak Days"
            value={streakDays.toString()}
            onChangeText={(text) => setStreakDays(Number(text))}
            keyboardType="numeric"
            style={styles.input}
          />
            */}

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
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  heading: {
    fontSize: 30,
    color: colors.white,
    fontFamily: fonts.regular,
    marginTop: "10%",
    padding: "10%",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.blue,
    width: "100%",
    borderRadius: 15,
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
  },
  saveContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
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
  },
  pickerLabel: {
    textAlign: "left",
    margin: "2%",
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
  },
  selectedDayButton: {
    backgroundColor: colors.green,
  },
});
