import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { completeTask, addTask } from '../../store/Calendar/calendarSlice';

const CalendarScreen: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.calendar.tasks);
  const dispatch = useDispatch();

  const handleTaskCompletion = (taskId: string) => {
    dispatch(completeTask(taskId));
  };

  const handleAddTask = () => {
    // Navigate to the task creation screen or show a modal
    // You can implement the navigation or modal logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>
      <View style={styles.calendar}>
        {/* Render calendar dates */}
        {/* Implement the logic to display dates and highlight the current date */}
        <Text>June 5{'\n'}Fri</Text>
        <Text>June 6{'\n'}Sat</Text>
        <Text style={styles.currentDate}>June 7{'\n'}Sun</Text>
        <Text>June 8{'\n'}Mon</Text>
        <Text>June 9{'\n'}Tues</Text>
      </View>
      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={styles.taskItem}
          onPress={() => handleTaskCompletion(task.id)}
        >
          <Text style={styles.taskText}>{task.title}</Text>
          <Text style={styles.taskTime}>{task.time}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        {/* Render footer icons */}
        {/* Implement the logic to display and handle interactions for footer icons */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  currentDate: {
    color: 'red',
    fontWeight: 'bold',
  },
  taskItem: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskTime: {
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff0000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default CalendarScreen;