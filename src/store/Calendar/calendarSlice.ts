import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

interface CalendarState {
  tasks: Task[];
}

const initialState: CalendarState = {
  tasks: [],
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    completeTask: (state, action: PayloadAction<string>) => {
      const taskIndex = state.tasks.findIndex((task) => task.id === action.payload);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].completed = true;
      }
    },
  },
});

export const { addTask, completeTask } = calendarSlice.actions;

export default calendarSlice.reducer;