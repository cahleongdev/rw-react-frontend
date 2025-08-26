import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isAxiosError } from 'axios';

import { addSchool, Network } from '@/store/slices/schoolsSlice';
import { RootState } from '@/store';

import { AddNetwork as AddNetworkComponent } from '@/components/Schools/AddNetwork';

import axiosInstance from '@/api/axiosInstance';

import { validateField } from '@/utils/validation';
import type { ValidationErrors } from '@/utils/validation';

interface AddNetworkProps {
  open: boolean;
  onClose: () => void;
}

export const AddNetwork: React.FC<AddNetworkProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();

  // Get custom field definitions for Networks
  const sharedCustomFields = useSelector(
    (state: RootState) =>
      state.customFieldDefinitions?.network_entity_fields || [],
  );

  const initialFormState: Omit<Network, 'id'> = {
    name: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    type: 'Network',
    county: '',
    district: '',
    custom_fields: sharedCustomFields.reduce(
      (acc: Record<string, string>, fieldDef) => {
        acc[fieldDef.Name] = '';
        return acc;
      },
      {} as Record<string, string>,
    ),
    status: 'Pending',
    gradeserved: [],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [createAnother, setCreateAnother] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    custom_fields: {},
  });

  // Update form data when shared custom fields change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      custom_fields: sharedCustomFields.reduce(
        (acc: Record<string, string>, fieldDef) => {
          acc[fieldDef.Name] = (prev.custom_fields || {})[fieldDef.Name] || '';
          return acc;
        },
        {} as Record<string, string>,
      ),
    }));
  }, [sharedCustomFields]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Special handling for zipcode to only allow numbers
    if (name === 'zipcode') {
      finalValue = value.replace(/\D/g, '').slice(0, 5);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    // Validate the field
    const error = validateField(name, finalValue);
    if (error) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    } else {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof prev];
        return newErrors;
      });
    }
  };

  const handleCustomFieldChange = (
    fieldName: string,
    value: string,
    fieldType?: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      custom_fields: {
        ...(prev.custom_fields || {}),
        [fieldName]: value,
      },
    }));

    // Validate the custom field
    const error = validateField(fieldName, value, fieldType || 'Text');
    setValidationErrors((prev) => ({
      ...prev,
      custom_fields: {
        ...prev.custom_fields,
        [fieldName]: error || '',
      },
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setValidationErrors({ custom_fields: {} }); // Reset validation errors

    // Validate all required fields
    const requiredFields = [
      'name',
      'address',
      'city',
      'state',
      'zipcode',
    ] as const;
    const newErrors: ValidationErrors = {
      custom_fields: {},
    };
    let hasErrors = false;

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field] as string);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        hasErrors = true;
      }
    });

    // Validate custom fields
    sharedCustomFields.forEach((fieldDef) => {
      const value = formData.custom_fields?.[fieldDef.Name] || '';
      const fieldError = validateField(fieldDef.Name, value, fieldDef.Type);
      if (fieldError) {
        if (!newErrors.custom_fields) newErrors.custom_fields = {};
        newErrors.custom_fields[fieldDef.Name] = fieldError;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare payload for API - Ensure type is 'Network' and remove unnecessary fields
      const payload: Partial<Network> = { ...formData }; // Create a mutable copy
      delete payload.gradeserved; // Remove gradeserved
      delete payload.schools; // Remove schools
      delete payload.id; // Ensure id is not sent if it somehow exists
      payload.type = 'Network'; // Explicitly set type

      // Make the API call
      // Ensure the payload matches what the API expects, potentially needs casting
      const response = await axiosInstance.post(
        '/schools/',
        payload as Omit<Network, 'id' | 'gradeserved' | 'schools'>,
      );

      // Dispatch addSchool with the data returned from the API
      // Assuming networks are added to the same schools slice
      dispatch(addSchool(response.data));

      if (createAnother) {
        resetForm();
      } else {
        onClose();
      }
    } catch (apiError: unknown) {
      console.error('Error creating network:', apiError);
      let errorMessage = 'Failed to create network. Please try again.';
      if (isAxiosError(apiError) && apiError.response) {
        // Safely access response data if it's an AxiosError
        const responseData = apiError.response.data;
        errorMessage =
          responseData?.detail ||
          (typeof responseData === 'string'
            ? responseData
            : JSON.stringify(responseData)) ||
          apiError.message;
      } else if (apiError instanceof Error) {
        errorMessage = apiError.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AddNetworkComponent
      open={open}
      onClose={onClose}
      formData={formData}
      validationErrors={validationErrors}
      error={error}
      isSubmitting={isSubmitting}
      createAnother={createAnother}
      onInputChange={handleInputChange}
      onCustomFieldChange={handleCustomFieldChange}
      onCreateAnotherChange={setCreateAnother}
      onSubmit={handleSubmit}
    />
  );
};
