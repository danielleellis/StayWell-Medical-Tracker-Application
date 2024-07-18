import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import friendsReducer from './slices/friendsSlice';  // Import the friends reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,  // Add the friends reducer
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
