import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { PlusCircleIcon } from '@heroicons/react/16/solid';
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  LockClosedIcon,
  CogIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

import { RootState, AppDispatch } from '@/store';
import { logoutUser } from '@/store/slices/authSlice';
import {
  setIsNotificationConnected,
  setIsNotificationsLoading,
  setNotifications,
} from '@/store/slices/notificationsSlice';

import { Avatar, AvatarFallback } from '@/components/base/Avatar';
import { Button } from '@/components/base/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/DropdownMenu';

import { setNotificationUnreadCount } from '@store/slices/notificationsSlice';

import { notificationService } from '@/services/notificationService';
import { messagingService } from '@/services/messagingService';
import {
  setIsMessagingConnected,
  setMessagingUnreadCount,
} from '@store/slices/messagingSlice';

const selectUserMenuState = createSelector(
  (state: RootState) => state.auth.user,
  (state: RootState) => state.auth.accessToken,
  (state: RootState) => state.notifications.notifications,
  (state: RootState) => state.notifications.isConnected,
  (state: RootState) => state.notifications.unreadCount,
  (state: RootState) => state.messaging.isConnected,
  (state: RootState) => state.messaging.unreadCount,
  (state: RootState) => state.notifications.isLoading,
  (
    user,
    accessToken,
    notifications,
    isNotificationConnected,
    notificationUnreadCount,
    isMessagingConnected,
    messagingUnreadCount,
    isNotificationsLoading,
  ) => ({
    user,
    accessToken,
    notifications,
    isNotificationConnected,
    notificationUnreadCount,
    isMessagingConnected,
    messagingUnreadCount,
    isNotificationsLoading,
  }),
);

const UserMenuBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    user,
    accessToken,
    notifications,
    isNotificationConnected,
    notificationUnreadCount,
    isMessagingConnected,
    messagingUnreadCount,
  } = useSelector(selectUserMenuState);

  // Set up notifications here so that we can use the notifications in the UserMenuBar
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isNotificationConnected) {
        // Fetch notifications from the server
        await notificationService.fetchNotifications().then(() => {
          const newNotifications = notificationService.getNotifications();
          dispatch(setNotifications(newNotifications));
        });

        // Update notifications when a new one is received
        notificationService.onNotification(() => {
          const newNotifications = notificationService.getNotifications();
          dispatch(setNotifications(newNotifications));
        });
      }
    };

    const fetchMessages = async () => {
      // Get number of unread messages for the current user
      const messagingUnreadCount = await messagingService.getMessages();
      dispatch(setMessagingUnreadCount(messagingUnreadCount));
    };

    const setUpServices = async () => {
      if (user && user.id && accessToken) {
        if (!isNotificationConnected) {
          dispatch(setIsNotificationsLoading(true));
          notificationService.connect(user.id, accessToken);
          fetchNotifications();
          dispatch(setIsNotificationConnected(true));
          dispatch(setIsNotificationsLoading(false));
        } else {
          dispatch(
            setNotificationUnreadCount(notificationService.getUnreadCount()),
          );
        }

        if (!isMessagingConnected) {
          messagingService.connect(accessToken);
          // TODO: Update the number of unread messages
          fetchMessages();
          dispatch(setIsMessagingConnected(true));
        }
      }
    };

    setUpServices();
  }, [
    user,
    accessToken,
    notifications.length,
    isNotificationConnected,
    isMessagingConnected,
    dispatch,
  ]);

  // Get initials from first_name and last_name
  const getInitials = () => {
    // Use optional chaining and nullish coalescing for safety
    const firstInitial = user?.first_name?.charAt(0) ?? '';
    const lastInitial = user?.last_name?.charAt(0) ?? '';
    return `${firstInitial}${lastInitial}`;
  };

  // Get full name
  const getFullName = () => {
    // Add similar safety checks here if needed, or ensure names exist
    if (!user?.first_name || !user?.last_name) return '';
    return `${user.first_name} ${user.last_name}`;
  };

  const handleSignOut = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="flex gap-4 items-center">
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer relative w-8 h-8"
      >
        <PlusCircleIcon className="size-6 text-blue-500" />
      </Button>
      <Link to="/notifications" className="h-6">
        <Button variant="ghost" className="cursor-pointer relative w-6 h-6">
          <BellIcon className="size-6 text-slate-700" />
          <div
            className={`absolute -top-[1px] right-[0px] w-[10px] min-w-[10px] rounded-[5px] h-[10px] ${notificationUnreadCount > 0 ? ' border border-slate-50 bg-orange-500' : ''}`}
          ></div>
        </Button>
      </Link>
      <Link to="/messaging" className="h-6">
        <Button variant="ghost" className="cursor-pointer relative w-6 h-6">
          <ChatBubbleLeftRightIcon className="size-6 text-slate-700" />
          <div
            className={`absolute -top-[1px] right-[0px] w-[10px] min-w-[10px] rounded-[5px] h-[10px] ${messagingUnreadCount > 0 ? ' border border-slate-50 bg-orange-500' : ''}`}
          ></div>
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-[10px] cursor-pointer">
            <Avatar className="text-orange-800 border border-orange-200 w-[24px] h-[24px]">
              <AvatarFallback className="body3-regular bg-orange-100">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-800 body2-regular">{getFullName()}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[198px] px-1 py-2.5">
          <DropdownMenuItem
            onClick={() => navigate('/settings/profile')}
            className="cursor-pointer px-3 py-2 flex flex-row gap-2.5 body2-regular text-slate-700"
          >
            <UserCircleIcon className="text-tertiary w-4 h-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate('/settings/notifications')}
            className="cursor-pointer px-3 py-2 flex flex-row gap-2.5 body2-regular text-slate-700"
          >
            <BellIcon className="text-tertiary w-4 h-4" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate('/settings/password-security')}
            className="cursor-pointer px-3 py-2 flex flex-row gap-2.5 body2-regular text-slate-700"
          >
            <LockClosedIcon className="text-tertiary w-4 h-4" />
            Password & Security
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate('/settings/integrations')}
            className="cursor-pointer px-3 py-2 flex flex-row gap-2.5 body2-regular text-slate-700"
          >
            <CogIcon className="text-tertiary w-4 h-4" />
            Integrations
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="cursor-pointer px-3 py-2 flex flex-row gap-2.5 body2-regular text-slate-700"
          >
            <ArrowRightStartOnRectangleIcon className="text-tertiary w-4 h-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenuBar;
