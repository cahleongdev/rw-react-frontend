import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Notification } from '@/containers/Notifications/index.types';

interface NotificationsState {
  isConnected: boolean;
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

const initialState: NotificationsState = {
  isConnected: false,
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload,
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount--;
      }
    },
    setIsNotificationConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setNotificationUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setIsNotificationsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setNotifications,
  markAsRead,
  setIsNotificationConnected,
  setNotificationUnreadCount,
  setIsNotificationsLoading,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
