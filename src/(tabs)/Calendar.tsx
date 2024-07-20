import React, { useState } from "react";
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
  date: string; // ISO string format
  formattedDate: string; // formatted for display purposes
  location?: string;
  time?: string;
};

const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "MMMM dd, yyyy");
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

  // Hard-coded mock events for demo
  // Replace with actual data fetching logic
  const mockEvents: Event[] = [
    {
      title: "Refill Adderall",
      date: "2024-07-18",
      formattedDate: "July 18, 2024",
    },
    {
      title: "Cardiologist Appointment",
      date: "2024-07-19",
      formattedDate: "July 19, 2024",
      location: "1234 W Bell Rd.",
    },
    {
      title: "Blood Work",
      date: "2024-07-20",
      formattedDate: "July 20, 2024",
    },
  ];

  const onDayPress = (day: any) => {
    const selectedDateString = day.dateString; // ISO date string
    setSelectedDate(selectedDateString);
    setCurrentDateDisplay(formatDate(selectedDateString));

    // filter events based on selected date
    const filteredEvents = mockEvents.filter((event) =>
      isSameDay(parseISO(event.date), parseISO(selectedDateString))
    );

    setEvents(filteredEvents);
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

  const filteredEvents = events.filter((event) =>
    isSameDay(parseISO(event.date), parseISO(selectedDate))
  );

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
          <Text style={styles.currentDate}>{currentDateDisplay}</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.eventContainer}>
            {filteredEvents.map((event, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEventPress(event)}
                style={styles.eventItem}
              >
                <Text style={styles.titleText}>{event.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    //flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    color: colors.blue,
    marginTop: 11,
    fontFamily: fonts.regular,
  },
  calendarContainer: {
    marginTop: 10,
  },

  // BOTTOM CONTAINER
  dateContainer: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 20,
  },
  currentDate: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.blue,
  },
  eventContainer: {
    width: "100%",
  },
  eventItem: {
    marginBottom: 10,
  },
  titleText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
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
