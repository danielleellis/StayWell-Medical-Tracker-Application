import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  pronouns: string;
  phone: string;
  birthday: string;
  profilePhoto: string | null;
}

interface AuthState {
  user: User | null;
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
    signUp: (state, action: PayloadAction<Omit<User, 'username' | 'pronouns' | 'phone' | 'birthday' | 'profilePhoto'>>) => {
      state.user = action.payload as User;
    },
    verifyEmail: (state, action: PayloadAction<string>) => {
      state.isVerified = true;
    },
    setupProfile: (state, action: PayloadAction<Omit<User, 'firstName' | 'lastName' | 'email' | 'password'>>) => {
      state.profileComplete = true;
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const { signUp, verifyEmail, setupProfile } = authSlice.actions;

export default authSlice.reducer;