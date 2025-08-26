import { useSelector, useDispatch } from 'react-redux';

import NotificationSettingsComponent from '@/components/Settings/NotificationsSettings';
import { Loading } from '@/components/base/Loading';

import { RootState, AppDispatch } from '@/store';
import { updatePersonalProfile } from '@/store/slices/authSlice'; // If you add notification_settings to the API, use this

const NotificationSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const notification_settings = user?.notification_settings ?? {};

  const handleChange = (key: string, value: boolean) => {
    const updatedSettings = { ...notification_settings, [key]: value };
    dispatch(updatePersonalProfile({ notification_settings: updatedSettings }));
  };

  if (!user) return <Loading />;

  return (
    <NotificationSettingsComponent
      role={user?.role}
      notificationSettings={notification_settings}
      onChange={handleChange}
    />
  );
};

export default NotificationSettings;
