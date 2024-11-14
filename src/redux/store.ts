import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import forgotDocumentPasscodeReducer from './slices/forgotDocumentPasscodeSlice';
import friendsReducer from './slices/friendsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        forgotDocumentPasscode: forgotDocumentPasscodeReducer,
        friends: friendsReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
