import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './state';

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = memberSlice.actions;
export default memberSlice.reducer;
