import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isAxiosError } from 'axios';

import { AddSchool as AddSchoolComponent } from '@/components/Schools/AddSchool';

import {
  addSchool,
  School,
  addSchoolToNetwork,
} from '@/store/slices/schoolsSlice';
import { RootState } from '@/store';

import { validateField } from '@/utils/validation';
import type { ValidationErrors } from '@/utils/validation';

import axios from '@/api/axiosInstance';

interface AddSchoolProps {
  open: boolean;
  onClose: () => void;
  initialName?: string;
  network?: string;
}

export const AddSchool: React.FC<AddSchoolProps> = ({
  open,
  onClose,
  initialName = '',
  network,
}) => {
  const dispatch = useDispatch();

  // Get custom field definitions for Schools
  const sharedCustomFields = useSelector(
    (state: RootState) =>
      state.customFieldDefinitions?.school_entity_fields || [],
  );

  const initialFormState: Omit<School, 'id'> = {
    name: initialName,
    address: '',
    city: '',
    state: '',
    zipcode: '',
    type: 'School',
    gradeserved: [],
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
    network: network,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [createAnother, setCreateAnother] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    custom_fields: {},
  });

  // Update form data when initialName changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: initialName,
    }));
  }, [initialName]);

  // Add effect to sync custom fields when sharedCustomFields change
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

    // Handle array values (like gradeserved)
    if (name === 'gradeserved') {
      setFormData((prev) => ({
        ...prev,
        [name]: Array.isArray(value) ? value : [value],
      }));
      return;
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
        delete newErrors[name as keyof ValidationErrors];
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

  // New handler for multi-select grades
  const handleGradesChange = (gradeValue: string, isChecked: boolean) => {
    setFormData((prev) => {
      const currentGrades = prev.gradeserved || [];
      let updatedGrades;
      if (isChecked) {
        // Add grade if checked and not already present
        updatedGrades = [...currentGrades, gradeValue];
      } else {
        // Remove grade if unchecked
        updatedGrades = currentGrades.filter((g) => g !== gradeValue);
      }
      // Remove duplicates just in case, although UI logic should prevent this
      updatedGrades = [...new Set(updatedGrades)];
      return { ...prev, gradeserved: updatedGrades };
    });
    // TODO: Add validation for gradeserved if needed (e.g., at least one selected)
  };

  // Note: handleDropdownChange might still be used for 'type' dropdown.
  // If not, it can be removed.
  const handleDropdownChange = (name: string, value: string) => {
    // if (name === 'gradeserved') {
    //   // This part is now handled by handleGradesChange
    //   // setFormData((prev) => ({ ...prev, [name]: [value] }));
    // } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // }
    // TODO: Re-validate if necessary
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
      // 'type' is required, but handled by dropdown, maybe validate selection?
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
      // Prepare payload for API - ensure gradeserved is an array
      const payload = {
        ...formData,
        // Ensure gradeserved is always an array, even if empty or single value
        gradeserved: Array.isArray(formData.gradeserved)
          ? formData.gradeserved
          : [formData.gradeserved].filter(Boolean),
      };

      // Make the API call
      const response = await axios.post('/schools/', payload);

      // Dispatch addSchool with the data returned from the API
      dispatch(addSchool(response.data));

      // If this AddSchool dialog was opened within a Network context, also add the school to that network in Redux
      if (network) {
        dispatch(
          addSchoolToNetwork({
            networkId: network,
            school: response.data as School,
          }),
        );
      }

      if (createAnother) {
        resetForm(); // Reset form if createAnother is checked
      } else {
        onClose(); // Close dialog on success
      }
    } catch (apiError: unknown) {
      console.error('Error creating school:', apiError);
      // Extract more specific error messages if available
      let errorMessage = 'Failed to create school. Please try again.';
      if (isAxiosError(apiError) && apiError.response) {
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
    <AddSchoolComponent
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
      onDropdownChange={handleDropdownChange}
      onGradesChange={handleGradesChange}
    />
  );
};
