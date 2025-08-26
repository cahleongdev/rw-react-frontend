import { useSelector } from 'react-redux';

import { DataLoading } from '@/components/base/Loading';
import ProfileSettingsComponent from '@/components/Settings/ProfileSettings';

import { RootState } from '@/store';

const ProfileSettings = () => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading && !user) {
    return <DataLoading />;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return <ProfileSettingsComponent user={user} />;
};

export default ProfileSettings;
