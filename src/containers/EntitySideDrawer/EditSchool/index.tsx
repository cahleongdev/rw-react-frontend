import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditSchool as EditSchoolComponent } from '@/components/Schools/EditSchool';
import { updateSchool, School } from '@/store/slices/schoolsSlice';
import { RootState, AppDispatch } from '@/store';
import { isAxiosError } from 'axios';
import axios from '@/api/axiosInstance';

interface EditSchoolContainerProps {
  open: boolean;
  onClose: () => void;
  schoolId: string;
}

// Helper to create initial state
const createInitialState = (): School => ({
  name: '',
  address: '',
  city: '',
  state: '',
  zipcode: '',
  gradeserved: [],
  county: '',
  district: '',
  type: '',
  id: '',
  status: '',
  custom_fields: {},
});

export const EditSchool: React.FC<EditSchoolContainerProps> = ({
  open,
  onClose,
  schoolId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Find the school to edit
  const schoolToEdit = useSelector((state: RootState) =>
    state.schools.schools.find((s): s is School => s.id === schoolId),
  );

  const [formData, setFormData] = useState<School>(createInitialState());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Pre-populate form when schoolToEdit data is available or schoolId changes
  useEffect(() => {
    if (schoolToEdit) {
      setFormData({
        name: schoolToEdit.name || '',
        address: schoolToEdit.address || '',
        city: schoolToEdit.city || '',
        state: schoolToEdit.state || '',
        zipcode: schoolToEdit.zipcode || '',
        gradeserved: schoolToEdit.gradeserved || [],
        county: schoolToEdit.county || '',
        district: schoolToEdit.district || '',
        type: schoolToEdit.type || '',
        id: schoolToEdit.id || '',
        status: schoolToEdit.status || '',
        custom_fields: schoolToEdit.custom_fields || {},
      });
      setError(''); // Clear error on successful data load
    } else if (open) {
      // If dialog is open but no valid school found, show error and reset
      setError('School data not found or invalid type.');
      setFormData(createInitialState());
    }
  }, [schoolToEdit, open, schoolId]); // Add schoolId dependency explicitly

  // Reset form state when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData(createInitialState());
      setError('');
      setIsSubmitting(false);
    }
  }, [open]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // Basic zipcode formatting (can enhance)
      if (name === 'zipcode') {
        const numericValue = value.replace(/\D/g, '').slice(0, 5);
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    [],
  );

  const handleDropdownChange = useCallback(
    (name: keyof School, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolToEdit) {
      setError('Cannot save: School data not found.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      // Create the update object only with fields present in EditSchoolFormData
      const updates: Partial<School> = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        gradeserved: formData.gradeserved,
        county: formData.county,
        district: formData.district,
        type: formData.type,
        // Do NOT include id, status, or custom_fields unless the API expects them
      };

      // Call the API
      console.log(`Updating school ${schoolId} with payload:`, updates);
      const response = await axios.put<School>(
        `/schools/${schoolId}/`,
        updates,
      );
      console.log('Update successful, API response:', response.data);

      // Dispatch update to Redux using API response data
      dispatch(updateSchool({ id: schoolId, updates: response.data }));

      // Optional: Add a small delay for visual feedback before closing
      // await new Promise(resolve => setTimeout(resolve, 300));

      onClose();
    } catch (err: unknown) {
      console.error('Error updating school:', err);
      // Extract more specific error message if possible
      let errorMessage = 'Failed to update school. Please try again.';
      if (isAxiosError(err) && err.response?.data) {
        // Try to get a detailed message from the response
        const responseData = err.response.data;
        errorMessage =
          responseData?.detail ||
          (typeof responseData === 'string'
            ? responseData
            : JSON.stringify(responseData)) ||
          err.message; // Fallback to general error message
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only render the component if it should be open
  if (!open) {
    return null;
  }

  return (
    <EditSchoolComponent
      open={open}
      onClose={onClose}
      schoolName={schoolToEdit?.name || ''} // Pass name for title
      formData={formData}
      isSubmitting={isSubmitting}
      error={error}
      onInputChange={handleInputChange}
      onDropdownChange={handleDropdownChange}
      onSubmit={handleSubmit}
    />
  );
};
