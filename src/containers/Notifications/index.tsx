import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isToday, isYesterday, parseISO, format, isThisMonth } from 'date-fns';

import {
  FilterType,
  Notification,
} from '@/containers/Notifications/index.types';

import { AppDispatch, RootState } from '@/store';
import { setNotifications } from '@/store/slices/notificationsSlice';

import NotificationsComponent from '@/components/Notifications';

import { notificationService } from '@/services/notificationService';

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [error, setError] = useState<string | null>(null);

  const { userId, notifications, isNotificationsLoading } = useSelector(
    (state: RootState) => ({
      userId: state.auth.user?.id,
      notifications: state.notifications.notifications,
      isNotificationsLoading: state.notifications.isLoading,
    }),
  );

  const sortedData = [...notifications].sort((a, b) => {
    const comparison =
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return sortOrder === 'newest' ? comparison : -comparison;
  });

  const filteredData = sortedData.filter((item: Notification) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !item.read;
    if (activeFilter === 'Read') return item.read;
    return false;
  });

  const handleView = async (itemId: string) => {
    if (!userId) return;

    try {
      // Update local state
      const updatedNotifications = await notificationService.markAsRead(itemId);
      dispatch(setNotifications(updatedNotifications));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    }
  };

  const groupNotifications = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};

    notifications.forEach((notification) => {
      const date = parseISO(notification.created_at);
      let key: string;

      if (isToday(date)) {
        key = 'Today';
      } else if (isYesterday(date)) {
        key = 'Yesterday';
      } else if (isThisMonth(date)) {
        key = format(date, 'MMMM d');
      } else {
        key = format(date, 'MMMM yyyy');
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(notification);
    });

    return groups;
  };

  const groupedNotifications = groupNotifications(filteredData);

  return (
    <NotificationsComponent
      loading={isNotificationsLoading}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      error={error}
      groupedNotifications={groupedNotifications}
      handleView={handleView}
    />
  );
};

export default Notifications;
