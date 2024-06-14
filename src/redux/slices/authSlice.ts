import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  isVerified: boolean;
  profileComplete: boolean;
}

const initialState: AuthState = {
  user: null,
  isVerified: false,
  profileComplete: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUp: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    verifyEmail: (state, action: PayloadAction<string>) => {
      state.isVerified = true;
    },
    setupProfile: (state, action: PayloadAction<string>) => {
      state.profileComplete = true;
    },
  },
});

export const { signUp, verifyEmail, setupProfile } = authSlice.actions;

export default authSlice.reducer;
