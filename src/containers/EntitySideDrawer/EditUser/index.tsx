import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditUserDialog as EditUserDialogComponent } from '@components/EntitySideDrawer/EditUser'; // Point back to Shared component
import { updateUser, SchoolUser } from '@/store/slices/schoolUsersSlice';
import { RootState, AppDispatch } from '@/store';
import { isAxiosError } from 'axios';
import axios from '@/api/axiosInstance';

interface EditUserDialogContainerProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const createInitialUserState = (): Partial<SchoolUser> => ({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  title: '',
});

const EditUserDialog: React.FC<EditUserDialogContainerProps> = ({
  open,
  onClose,
  userId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const userToEdit = useSelector((state: RootState) =>
    state.schoolUsers.schoolUsers.find((u) => u.id === userId),
  );

  const [formData, setFormData] = useState<Partial<SchoolUser>>(
    createInitialUserState(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        first_name: userToEdit.first_name || '',
        last_name: userToEdit.last_name || '',
        email: userToEdit.email || '',
        phone_number: userToEdit.phone_number || '',
        title: userToEdit.title || '',
      });
      setError('');
    } else if (open) {
      setError('User data not found.');
      setFormData(createInitialUserState());
    }
  }, [userToEdit, open, userId]);

  useEffect(() => {
    if (!open) {
      setFormData(createInitialUserState());
      setError('');
      setIsSubmitting(false);
    }
  }, [open]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) {
      setError('Cannot save: User data not found.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const updates: Partial<SchoolUser> = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        title: formData.title,
      };

      const response = await axios.put<SchoolUser>(
        `/users/${userId}/`,
        updates,
      );

      dispatch(updateUser({ id: userId, updates: response.data }));
      onClose();
    } catch (err: unknown) {
      let errorMessage = 'Failed to update user. Please try again.';
      if (isAxiosError(err) && err.response?.data) {
        const responseData = err.response.data;
        errorMessage =
          responseData?.detail ||
          (typeof responseData === 'string'
            ? responseData
            : JSON.stringify(responseData)) ||
          err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  const userNameForTitle = userToEdit
    ? `${userToEdit.first_name} ${userToEdit.last_name}`
    : undefined;

  return (
    <EditUserDialogComponent
      open={open}
      onClose={onClose}
      userName={userNameForTitle}
      formData={formData}
      isSubmitting={isSubmitting}
      error={error}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );
};

export default EditUserDialog;
