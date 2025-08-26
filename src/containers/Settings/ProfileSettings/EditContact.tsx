import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import EditContactComponent from '@/components/Settings/ProfileSettings/EditContact';
import { Loading } from '@components/base/Loading';

import { AppDispatch, RootState } from '@/store';
import { updatePersonalProfile } from '@store/slices/authSlice';

interface EditContactProps {
  open: boolean;
  onClose: () => void;
}

const EditContact: React.FC<EditContactProps> = ({
  open,
  onClose,
}: EditContactProps) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (values: { phone: string }) => {
    try {
      await dispatch(
        updatePersonalProfile({
          phone_number: values.phone,
        }),
      ).unwrap();
      toast.success('Contact info updated successfully');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update contact info');
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <EditContactComponent
      open={open}
      email={user.email}
      phone={user.phone_number}
      onSubmit={handleSubmit}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
};

export default EditContact;
