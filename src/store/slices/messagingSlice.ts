import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessagingState {
  unreadCount: number;
  isConnected: boolean;
}

const initialState: MessagingState = {
  unreadCount: 0,
  isConnected: false,
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    setMessagingUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setIsMessagingConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setMessagingUnreadCount, setIsMessagingConnected } =
  messagingSlice.actions;

export default messagingSlice.reducer;
