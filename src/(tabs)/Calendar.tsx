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
 * Date: July 21, 2024
 * Version: Initial development
 */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { format, parseISO, isSameDay } from "date-fns";
import { colors, fonts } from "../constants/constants";

const { width, height } = Dimensions.get("window");

type Event = {
  title: string;
  startDate: string; // ISO string format
  endDate?: string;
  formattedDate: string; // formatted for display purposes
  location?: string;
  time?: string;
  recurring?: boolean;
};

const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "MMMM dd, yyyy");
};

const isSameDayEvent = (eventDate: string, selectedDate: string) => {
  return isSameDay(parseISO(eventDate), parseISO(selectedDate));
};

const App: React.FC = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(currentDate);
  const [currentDateDisplay, setCurrentDateDisplay] = useState<string>(
    formatDate(currentDate)
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // hard-coded mock events for demo
  const mockEvents: Event[] = [
    {
      title: "Daily Medication",
      startDate: currentDate,
      endDate: undefined, // indefinite end date
      formattedDate: formatDate(currentDate),
      recurring: true,
    },
    {
      title: "Refill Adderall",
      startDate: "2024-07-25",
      formattedDate: "July 25, 2024",
      recurring: false,
    },
    {
      title: "Cardiologist Appointment",
      startDate: "2024-07-26",
      formattedDate: "July 26, 2024",
      location: "1234 W Bell Rd.",
      recurring: false,
    },
    {
      title: "Blood Work",
      startDate: "2024-07-27",
      formattedDate: "July 27, 2024",
      recurring: false,
    },
  ];

  // filter events based on selected date
  const filterEvents = (selectedDate: string) => {
    const filtered = mockEvents.filter((event) => {
      if (event.recurring) {
        const eventStartDate = parseISO(event.startDate);
        const selectedDateObj = parseISO(selectedDate);

        // recurring events
        return selectedDateObj >= eventStartDate;
      } else {
        // non-recurring event
        return isSameDayEvent(event.startDate, selectedDate);
      }
    });

    console.log("Filtered events:", filtered);
    return filtered;
  };

  // update filteredEvents state when selectedDate changes
  useEffect(() => {
    const filtered = filterEvents(selectedDate);
    setFilteredEvents(filtered);
  }, [selectedDate]);

  const onDayPress = (day: any) => {
    const selectedDateString = day.dateString;
    console.log("Selected date:", selectedDateString);

    setSelectedDate(selectedDateString);
    setCurrentDateDisplay(formatDate(selectedDateString));
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const renderModal = () => {
    if (!selectedEvent) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
            <Text style={styles.modalDate}>
              Date: {selectedEvent.formattedDate}
            </Text>
            {selectedEvent.location && (
              <Text style={styles.modalLocation}>
                Location: {selectedEvent.location}
              </Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const calendarHeight = height * 0.5; // 50% of the screen height

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>S T A Y W E L L</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            style={{ width: width, height: calendarHeight }}
            current={selectedDate}
            hideArrows={false}
            onDayPress={onDayPress}
            monthFormat={"MMMM yyyy"}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: colors.blue },
            }}
          />
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.currentDate}>
            Events for {currentDateDisplay}
          </Text>
        </View>
        <ScrollView
          style={styles.eventContainer}
          key={selectedDate} // key to force rerender on date change
        >
          {filteredEvents.map((event, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleEventPress(event)}
              style={styles.eventItem}
            >
              <Text style={styles.titleText}>{event.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // CALENDAR CONTAINER
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: '10%',
  },
  heading: {
    fontSize: 30,
    color: colors.blue,
    marginTop: '5%',
    fontFamily: fonts.regular,
  },
  calendarContainer: {
    marginTop: '4%',
    marginBottom: '-10%',
  },

  // BOTTOM CONTAINER
  dateContainer: {
    alignSelf: "flex-start",
    width: "100%",
    backgroundColor: colors.white,
    borderTopWidth: 2,
    borderTopColor: colors.green,
    paddingTop: '5%',
    paddingBottom: '5%',
  },
  currentDate: {
    fontFamily: fonts.regular,
    fontSize: 24,
    color: colors.blue,
    marginLeft: 20,
  },
  eventContainer: {
    flex: 1,
    width: "100%",
    paddingTop: '5%',
    paddingHorizontal: '5%',
    backgroundColor: colors.white,
  },
  eventItem: {
    marginBottom: '5%',
  },
  titleText: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.black,
  },

  // MODAL
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: fonts.bold,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.blue,
    borderRadius: 5,
  },
  closeButtonText: {
    color: colors.white,
    textAlign: "center",
  },
  modalDate: {
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  modalLocation: {
    fontFamily: fonts.regular,
  },
});

export default App;
