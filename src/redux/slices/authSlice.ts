import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    username: string;
    userID: string | null;
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
            // Populate default values for omitted fields
            state.user = {
                ...action.payload,
                username: '', // default
                pronouns: '', // default
                phone: '', // default
                birthday: '', // default
                profilePhoto: null, // default
            } as User;
        },
        signIn: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        signOut: (state) => {
            state.user = null;
            state.isVerified = false;
            state.profileComplete = false;
            console.log('User signed out');
            console.log(`User: ${state.user}`);
        },
        verifyEmail: (state) => {
            state.isVerified = true;
        },
        forgotPassword: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.email = action.payload; // Update the email if user exists
            } else {
                // Initialize the user with just the email if state.user is null
                state.user = {
                    firstName: '',
                    lastName: '',
                    email: action.payload,
                    password: '',
                    username: '',
                    userID: null,
                    pronouns: '',
                    phone: '',
                    birthday: '',
                    profilePhoto: null,
                };
            }
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

export const { signUp, signIn, signOut, verifyEmail, setupProfile, forgotPassword } = authSlice.actions;

export default authSlice.reducer;
