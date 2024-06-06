// store.ts
import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './member/slice';

const store = configureStore({
  reducer: {
    member: memberReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
