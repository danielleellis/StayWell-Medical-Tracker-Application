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
 * Date: September 4, 2024
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
import { colors, fonts } from "../../constants/constants";

const { width, height } = Dimensions.get("window");

type Event = {
    title: string;
    startDate: string; // ISO string format
    endDate?: string;
    formattedDate: string; // formatted for display purposes
    location?: string;
    time?: string;
    recurring?: boolean;
    completed?: boolean;
};

const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMMM dd, yyyy");
};

const isSameDayEvent = (eventDate: string, selectedDate: string) => {
    return isSameDay(parseISO(eventDate), parseISO(selectedDate));
};

// hard-coded mock events for demo
const mockEvents: Event[] = [
    {
        title: "Daily Medication",
        startDate: new Date().toISOString().split("T")[0], // current date for demo purposes
        formattedDate: formatDate(new Date().toISOString().split("T")[0]),
        recurring: true,
    },
    {
        title: "Refill Adderall",
        startDate: "2024-09-04",
        formattedDate: "September 4, 2024",
        recurring: false,
    },
    {
        title: "Cardiologist Appointment",
        startDate: "2024-09-04",
        formattedDate: "September 4, 2024",
        location: "1234 W Bell Rd.",
        recurring: false,
    },
    {
        title: "Blood Work",
        startDate: "2024-09-04",
        formattedDate: "September 4, 2024",
        recurring: false,
    },
];

const App: React.FC = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState<string>(currentDate);
    const [currentDateDisplay, setCurrentDateDisplay] = useState<string>(
        formatDate(currentDate)
    );
    const [events, setEvents] = useState<Event[]>(mockEvents); // initialize events using mock events
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

    // filter events based on selected date
    const filterEvents = (selectedDate: string) => {
        const filtered = events.filter((event) => {
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
    }, [selectedDate, events]);

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

    // Mark the event as completed
    const markEventAsComplete = () => {
        if (selectedEvent) {
            setEvents((prevEvents) =>
                prevEvents.map((e) =>
                    e.title === selectedEvent.title
                        ? { ...e, completed: true }
                        : e
                )
            );
            setSelectedEvent((prevEvent) =>
                prevEvent ? { ...prevEvent, completed: true } : null
            );
            setModalVisible(false);
        }
    };

    // Toggle event completion
    const toggleEventCompletion = (eventTitle: string) => {
        setEvents((prevEvents) =>
            prevEvents.map((e) =>
                e.title === eventTitle ? { ...e, completed: !e.completed } : e
            )
        );
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
                        <Text style={styles.modalTitle}>
                            {selectedEvent.title}
                        </Text>
                        <Text style={styles.modalDate}>
                            Date: {selectedEvent.formattedDate}
                        </Text>
                        {selectedEvent.location && (
                            <Text style={styles.modalLocation}>
                                Location: {selectedEvent.location}
                            </Text>
                        )}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.completeButton,
                                    selectedEvent.completed &&
                                        styles.completedButton,
                                ]}
                                onPress={markEventAsComplete}
                                disabled={selectedEvent.completed}
                            >
                                <Text style={styles.completeButtonText}>
                                    {selectedEvent.completed
                                        ? "Completed"
                                        : "Mark as Complete"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>
                                    Close
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
                <Text style={styles.heading}>S T A Y W E L L</Text>
                <View style={styles.calendarContainer}>
                    <Calendar
                        style={{ width: calendarWidth, height: calendarHeight }}
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
                    />
                </View>

                <View style={styles.dateContainer}>
                    <Text style={styles.currentDate}>
                        Events for {currentDateDisplay}
                    </Text>
                </View>

                {/* ScrollView for the list of events */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.eventContainer}
                    key={selectedDate} // key to force rerender on date change
                >
                    {filteredEvents.map((event, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleEventPress(event)}
                            style={styles.eventItem}
                        >
                            <TouchableOpacity
                                onPress={() =>
                                    toggleEventCompletion(event.title)
                                }
                                style={[
                                    styles.indicator,
                                    event.completed &&
                                        styles.completedIndicator,
                                ]}
                            />
                            <Text
                                style={[
                                    styles.titleText,
                                    event.completed &&
                                        styles.completedTitleText,
                                ]}
                            >
                                {event.title}
                            </Text>
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
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "1%",
    },
    heading: {
        fontSize: 26,
        marginTop: "5%",
        color: colors.blue,
        fontFamily: fonts.regular,
        textAlign: "center",
    },
    calendarContainer: {
        marginBottom: "6%", // Decrease margin to create closer proximity to the events container
        marginTop: "1%",
    },

    // BOTTOM CONTAINER
    dateContainer: {
        alignSelf: "flex-start",
        width: "100%",
        backgroundColor: "rgba(69, 166, 255, 0.05)",
        paddingTop: "5%",
        paddingBottom: "5%",
        borderTopWidth: 2,
        borderTopColor: "rgba(151, 193, 127, 0.4)",
    },
    currentDate: {
        fontFamily: fonts.regular,
        fontSize: 20,
        color: colors.black,
        marginLeft: "4%",
    },
    scrollView: {
        flex: 1,
        width: "100%",
        backgroundColor: colors.lightgrey,
    },
    eventContainer: {
        paddingHorizontal: "4%",
        backgroundColor: "rgba(69, 166, 255, 0.05)",
    },
    eventItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "3%",
        paddingVertical: "3%",
        paddingHorizontal: "2%",
        borderRadius: 15,
        backgroundColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    titleText: {
        fontFamily: fonts.regular,
        fontSize: 16,
        color: colors.black,
        marginLeft: "3%",
        flex: 1,
        textAlign: "left",
        paddingTop: "1%",
    },
    indicator: {
        width: 18,
        height: 18,
        borderRadius: 12,
        backgroundColor: colors.grey,
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    completedTitleText: {
        textDecorationLine: "line-through",
        color: colors.darkgrey,
    },
    completedIndicator: {
        backgroundColor: colors.green,
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
        fontFamily: fonts.bold,
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
    buttonContainer: {
        flexDirection: "row",
        marginTop: "5%",
        justifyContent: "space-between",
        width: "100%",
    },
    completeButton: {
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
        color: colors.white,
        textAlign: "center",
    },
    closeButton: {
        padding: "4%",
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
        color: colors.white,
        textAlign: "center",
        fontSize: 16,
    },
});

export default App;
