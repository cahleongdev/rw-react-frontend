import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { AppDispatch, RootState } from '@store/index';
import { updatePersonalProfile } from '@/store/slices/authSlice';

import PersonalDetailsComponent from '@/components/Settings/ProfileSettings/PersonalDetails';
import { Loading } from '@/components/base/Loading';

interface PersonalDetailsProps {
  open: boolean;
  onClose: () => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ open, onClose }) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  if (!user) {
    return <Loading />;
  }

  const handleSubmit = async (values: {
    first_name: string;
    last_name: string;
    title?: string;
  }) => {
    try {
      await dispatch(
        updatePersonalProfile({
          ...values,
          title: values.title ?? '',
        }),
      ).unwrap();
      toast.success('Profile updated successfully');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <PersonalDetailsComponent
      open={open}
      firstName={user.first_name}
      lastName={user.last_name}
      title={user.title}
      onSubmit={handleSubmit}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
};

export default PersonalDetails;
