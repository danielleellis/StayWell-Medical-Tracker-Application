// store.ts
import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './Member/slice';
import calendarReducer from './Calendar/calendarSlice';

const store = configureStore({
  reducer: {
    member: memberReducer,
    calendar: calendarReducer,
    // Add other reducers here if needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
