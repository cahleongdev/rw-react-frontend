import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditBoardMemberDialog as EditBoardMemberDialogComponent } from '@/components/Shared/EditBoardMemberDialog'; // Point back to Shared component
import { updateUser, SchoolUser } from '@/store/slices/schoolUsersSlice';
import { RootState, AppDispatch } from '@/store';
import { isAxiosError } from 'axios';
import axios from '@/api/axiosInstance';

interface EditBoardMemberDialogContainerProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const createInitialBoardMemberState = (): Partial<SchoolUser> => ({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  title: '',
  start_term: '',
  end_term: '',
});

export const EditBoardMemberDialog: React.FC<
  EditBoardMemberDialogContainerProps
> = ({ open, onClose, userId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const boardMemberToEdit = useSelector((state: RootState) =>
    state.schoolUsers.schoolUsers.find(
      (u) => u.id === userId && u.role === 'Board_Member',
    ),
  );

  const [formData, setFormData] = useState<Partial<SchoolUser>>(
    createInitialBoardMemberState(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (boardMemberToEdit) {
      setFormData({
        first_name: boardMemberToEdit.first_name || '',
        last_name: boardMemberToEdit.last_name || '',
        email: boardMemberToEdit.email || '',
        phone_number: boardMemberToEdit.phone_number || '',
        title: boardMemberToEdit.title || '',
        start_term: boardMemberToEdit.start_term || '',
        end_term: boardMemberToEdit.end_term || '',
      });
      setError('');
    } else if (open) {
      setError('Board Member data not found.');
      setFormData(createInitialBoardMemberState());
    }
  }, [boardMemberToEdit, open, userId]);

  useEffect(() => {
    if (!open) {
      setFormData(createInitialBoardMemberState());
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
    if (!boardMemberToEdit) {
      setError('Cannot save: Board Member data not found.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      // Ensure date fields are in YYYY-MM-DD or undefined, or whatever API expects
      const updates: Partial<SchoolUser> = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        title: formData.title,
        start_term: formData.start_term
          ? new Date(formData.start_term).toISOString().split('T')[0]
          : undefined,
        end_term: formData.end_term
          ? new Date(formData.end_term).toISOString().split('T')[0]
          : undefined,
      };

      const response = await axios.put<SchoolUser>(
        `/users/${userId}/`,
        updates,
      );

      dispatch(updateUser({ id: userId, updates: response.data }));
      onClose();
    } catch (err: unknown) {
      let errorMessage = 'Failed to update board member. Please try again.';
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

  const boardMemberNameForTitle = boardMemberToEdit
    ? `${boardMemberToEdit.first_name} ${boardMemberToEdit.last_name}`
    : undefined;

  return (
    <EditBoardMemberDialogComponent
      open={open}
      onClose={onClose}
      boardMemberName={boardMemberNameForTitle}
      formData={formData}
      isSubmitting={isSubmitting}
      error={error}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );
};
