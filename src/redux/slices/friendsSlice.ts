import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Friend } from '../types/Friend';  // Adjust the import based on your file structure

interface FriendsState {
  friends: Friend[];
}

const initialState: FriendsState = {
  friends: [],
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.friends.push(action.payload);
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter(friend => friend.id !== action.payload);
    },
    updateFriend: (state, action: PayloadAction<Friend>) => {
      const index = state.friends.findIndex(friend => friend.id === action.payload.id);
      if (index !== -1) {
        state.friends[index] = action.payload;
      }
    },
  },
});

export const { addFriend, removeFriend, updateFriend } = friendsSlice.actions;
export default friendsSlice.reducer;
