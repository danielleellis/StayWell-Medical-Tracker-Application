/**
 * StayWell Medical Tracker Application
 *
 * This file contains the main component for the StayWell Medical Tracker Application,
 * integrating a calendar view to display and manage medical events and appointments.
 *
 * Features:
 * - Calendar component using react-native-calendars for date selection.
 * - Display of medical events filtered by selected date.
 * - Modal for detailed view of selected event.
 * - Integration with mock data for demonstration purposes.
 *
 * Developed by: Team 21 Member:
 *    - Danielle Ellis
 * Date: September 19, 2024
 * Version: Initial development
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import configData from "../../../config.json";
import axios, { AxiosError } from "axios";
import { Calendar } from "react-native-calendars";
import { format, parseISO, isSameDay } from "date-fns";
import { colors, fonts } from "../../constants/constants";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

type Event = {
  eventID: string; // Unique identifier for the event
  eventName: string; // Title of the event
  color?: string; // Color associated with the event (optional)
  isPublic?: boolean; // Indicates if the event is public (optional)
  viewableBy?: string; // Users allowed to view the event (optional)
  notes?: string; // Notes about the event (optional)
  streakDays?: number; // Number of streak days (optional)
  reminder?: string; // Reminder for the event (optional)
  startTime: string; // ISO string format for start time
  endTime?: string; // ISO string format for end time (optional)
  allDay?: boolean; // Indicates if the event lasts all day (optional)
  eventType?: string; // Type of the event (optional)
  calendarID?: string; // ID of the associated calendar (optional)
  userID: string; // ID of the user associated with the event
};

const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "MMMM dd, yyyy");
};

const isSameDayEvent = (eventDate: string, selectedDate: string) => {
  return isSameDay(parseISO(eventDate), parseISO(selectedDate));
};

const CalendarScreen: React.FC = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(currentDate);
  const [currentDateDisplay, setCurrentDateDisplay] = useState<string>(
    formatDate(currentDate)
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [notes, setNotes] = useState<string>("");

  const serverEndpoint = configData.API_ENDPOINT;

  // Fetch events from the server
  const fetchEvents = async (userID: string) => {
    try {
      console.log(
        "Fetching events from:",
        `${serverEndpoint}/events/${userID}`
      );
      const response = await axios.get(`${serverEndpoint}/events/${userID}`);
      console.log("Fetched events:", response.data.events);

      if (response.status === 200) {
        const formattedEvents: Event[] = response.data.events.map(
          (event: any) => ({
            eventID: event.eventID,
            eventName: event.eventName,
            color: event.color,
            isPublic: event.isPublic === 1, // Convert tinyint to boolean
            viewableBy: event.viewableBy,
            notes: event.notes,
            streakDays: event.streakDays,
            reminder: event.reminder,
            startTime: event.startTime,
            endTime: event.endTime,
            allDay: event.allDay === 1, // Convert tinyint to boolean
            eventType: event.eventType,
            calendarID: event.calendarID,
            userID: event.userID,
            formattedDate: formatDate(event.startTime), // Format for display
          })
        );

        setEvents(formattedEvents); // Set the formatted events
      } else {
        console.error("Error fetching events:", response.status);
      }
    } catch (error: unknown) {
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  // Fetch events every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      const userID = "C5vj8Ibdks"; // Replace with actual userID
      fetchEvents(userID); // Fetch events for this user
    }, [])
  );

  // Filter events based on selected date
  const filterEvents = (selectedDate: string) => {
    const filtered = events.filter((event) => {
      // Compare event start time with selected date
      return isSameDayEvent(event.startTime, selectedDate);
    });

    console.log("Filtered events:", filtered);
    return filtered;
  };

  useEffect(() => {
    const filtered = filterEvents(selectedDate);
    setFilteredEvents(filtered);
  }, [selectedDate, events]);

  const onDayPress = (day: any) => {
    const selectedDateString = day.dateString;
    console.log("Selected date:", selectedDateString);
    setSelectedDate(selectedDateString);
    setCurrentDateDisplay(formatDate(selectedDateString));
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setNotes(event.notes || ""); // Load existing notes
    setModalVisible(true);
  };

  const markEventAsComplete = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.eventID === selectedEvent.eventID
            ? { ...e, notes } // Save notes here
            : e
        )
      );
      setModalVisible(false);
    }
  };

  const closeModal = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.eventID === selectedEvent.eventID
            ? { ...e, notes } // Always save notes when closing the modal
            : e
        )
      );
    }
    setModalVisible(false);
  };

  const renderModal = () => {
    if (!selectedEvent) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedEvent.eventName}</Text>
            <Text style={styles.modalDate}>
              Date: {selectedEvent.startTime}
            </Text>
            {selectedEvent.notes && (
              <Text style={styles.modalLocation}>
                Notes: {selectedEvent.notes}
              </Text>
            )}

            {/* TextInput for Notes */}
            <TextInput
              style={styles.notesInput}
              placeholder="Add your notes here..."
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Save and Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.completeButton}
                onPress={markEventAsComplete}
              >
                <Text style={styles.completeButtonText}>
                  Save and Complete Task
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const calendarHeight = height * 0.43; // 40% of the screen height
  const calendarWidth = width * 0.9; // 90% of the screen width

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar
            style={{ width: "100%", height: calendarHeight }}
            current={selectedDate}
            hideArrows={false}
            onDayPress={onDayPress}
            monthFormat={"MMMM yyyy"}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: colors.blue,
              },
            }}
            theme={{
              textSectionTitleColor: colors.black,
              textSectionTitleDisabledColor: colors.grey,
              dayTextColor: colors.black,
              todayTextColor: colors.blue,
              selectedDayTextColor: colors.white,
              textDisabledColor: colors.grey,
              dotColor: colors.blue,
              selectedDotColor: colors.white,
              arrowColor: colors.blue,
              disabledArrowColor: colors.grey,
              monthTextColor: colors.black,
              indicatorColor: colors.blue,
              textDayFontFamily: fonts.regular,
              textMonthFontFamily: fonts.regular,
              textDayHeaderFontFamily: fonts.regular,
              textDayFontWeight: "normal",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "normal",
            }}
          />
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.currentDate}>
            Events for {currentDateDisplay}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.eventContainer}
          key={selectedDate}
        >
          {filteredEvents.map((event, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleEventPress(event)}
              style={styles.eventItem}
            >
              <Text style={styles.titleText}>{event.eventName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "2%",
  },

  calendarContainer: {
    marginBottom: "6%",
    marginTop: "1%",
    width: "100%",
  },
  dateContainer: {
    alignSelf: "flex-start",
    width: "100%",
    backgroundColor: "rgba(240, 240, 240, 0.1)",
    paddingTop: "5%",
    paddingBottom: "3%",
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignItems: "center",
  },
  currentDate: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.black,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(240, 240, 240, 0.1)",
  },
  eventContainer: {
    paddingHorizontal: "4%",
    paddingVertical: "3%",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: "rgba(240, 240, 240, 0.1)",
  },

  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "3%",
    paddingVertical: "4%",
    paddingHorizontal: "4%",
    borderRadius: 15,
    backgroundColor: "rgba(69, 166, 255, 0.8)",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  titleText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
    marginLeft: "3%",
    flex: 1,
    textAlign: "left",
    paddingTop: "1%",
  },
  indicator: {
    width: 18,
    height: 18,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  completedTitleText: {
    fontFamily: fonts.regular,
    textDecorationLine: "line-through",
    color: colors.green,
  },
  completedIndicator: {
    backgroundColor: colors.green,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: "5%",
    borderRadius: 20,
    width: width * 0.85,
    alignItems: "center",
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 12,
    fontFamily: fonts.regular,
  },
  modalDate: {
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingBottom: "3%",
  },
  modalLocation: {
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  notesInput: {
    fontFamily: fonts.regular,
    height: 100,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: "5%",
    justifyContent: "space-between",
    width: "100%",
  },
  completeButton: {
    margin: "1%",
    padding: "3%",
    backgroundColor: colors.green,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedButton: {
    backgroundColor: colors.grey,
  },
  completeButtonText: {
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: "center",
  },
  closeButton: {
    padding: "3%",
    margin: "1%",
    backgroundColor: colors.blue,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButtonText: {
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: "center",
    fontSize: 14,
  },
});

export default CalendarScreen;
