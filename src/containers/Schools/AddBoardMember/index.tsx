import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios'; // Import axios for type checking
import { useDispatch, useSelector } from 'react-redux';

import { AddBoardMember as AddBoardMemberComponent } from '@/components/Schools/AddBoardMember';
import {
  SchoolUser,
  fetchAllBoardMembers,
  fetchBoardMembersForSchool,
} from '@/store/slices/schoolUsersSlice';
import { RootState, AppDispatch } from '@/store';

import { formatPhoneNumber, validateField } from '@/utils/validation';
import type { ValidationErrors } from '@/utils/validation';

import axiosInstance from '@/api/axiosInstance'; // Import axiosInstance

// Define local type for the form data
interface BoardMemberFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  title: string;
  start_term?: string;
  end_term?: string;
  schools: string[];
  custom_fields: Record<string, string>;
}

interface AddBoardMemberProps {
  open: boolean;
  onClose: () => void;
  entityId?: string;
  initialFirstName?: string;
  initialLastName?: string;
}

export const AddBoardMember: React.FC<AddBoardMemberProps> = ({
  open,
  onClose,
  entityId,
  initialFirstName = '',
  initialLastName = '',
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Select definitions
  const { customFieldDefinitions } = useSelector((state: RootState) => ({
    customFieldDefinitions:
      state.customFieldDefinitions.board_member_fields || [],
  }));

  // Function to create initial state
  const createInitialState = useCallback((): BoardMemberFormData => {
    const initialCustomFields: Record<string, string> = {};
    customFieldDefinitions.forEach((def) => {
      initialCustomFields[def.Name] = '';
    });

    return {
      first_name: initialFirstName,
      last_name: initialLastName,
      email: '',
      phone_number: '',
      title: '',
      start_term: '',
      end_term: '',
      schools: entityId ? [entityId] : [],
      custom_fields: initialCustomFields,
    };
  }, [entityId, customFieldDefinitions, initialFirstName, initialLastName]);

  // Initialize form state using the function
  const [formData, setFormData] =
    useState<BoardMemberFormData>(createInitialState);

  const [createAnother, setCreateAnother] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    custom_fields: {},
  });

  // Effect to reset form when initial props change
  useEffect(() => {
    // Reset using the initial state function if dialog reopens or key props change
    setFormData(createInitialState());
    setError('');
    setValidationErrors({ custom_fields: {} });
  }, [initialFirstName, initialLastName, entityId, customFieldDefinitions]); // Depend on definitions too

  // Effect to initialize form custom fields based on definitions
  // useEffect(() => {
  //   const initialCustomFields: Record<string, string> = {};
  //   customFieldDefinitions.forEach((def) => {
  //     initialCustomFields[def.Name] = formData.custom_fields[def.Name] || '';
  //   });
  //   setFormData((prev) => ({ ...prev, custom_fields: initialCustomFields }));
  // }, [customFieldDefinitions, formData.custom_fields]); // Rerun if definitions change

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      let finalValue = value;

      if (name === 'phone_number') {
        finalValue = formatPhoneNumber(value);
      }

      setFormData((prev) => ({ ...prev, [name]: finalValue }));

      let fieldError = validateField(name, finalValue);

      if (name === 'start_term' || name === 'end_term') {
        const dateValue = new Date(finalValue);
        if (finalValue && isNaN(dateValue.getTime())) {
          // Validate only if not empty
          fieldError = 'Please enter a valid date';
        } else if (name === 'end_term' && formData.start_term) {
          const startDate = new Date(formData.start_term);
          if (!isNaN(startDate.getTime()) && dateValue < startDate) {
            fieldError = 'End term must be after start term';
          }
        }
      }

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (fieldError) {
          newErrors[name as keyof ValidationErrors] = fieldError;
        } else {
          delete newErrors[name as keyof ValidationErrors];
        }
        return newErrors;
      });
    },
    [formData.start_term, setFormData, setValidationErrors],
  );

  // Updated handler for Record<string, string>
  const handleCustomFieldChange = useCallback(
    (fieldName: string, value: string, fieldType?: string) => {
      let finalValue = value;
      if (fieldType === 'Phone') {
        finalValue = formatPhoneNumber(value);
      }

      setFormData((prev) => ({
        ...prev,
        custom_fields: { ...prev.custom_fields, [fieldName]: finalValue },
      }));
      const fieldError = validateField(fieldName, value, fieldType);
      setValidationErrors((prev) => ({
        ...prev,
        custom_fields: {
          ...prev.custom_fields,
          [fieldName]: fieldError || '',
        },
      }));
    },
    [setFormData, setValidationErrors],
  );

  // Remove handleAddCustomField - Managed via ManageCustomFields dialog

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError('');

      const requiredFields: (keyof BoardMemberFormData)[] = [
        'first_name',
        'last_name',
        'email',
        // Term dates might be optional depending on requirements
        // 'start_term',
        // 'end_term',
      ];
      const newErrors: ValidationErrors = {
        custom_fields: {},
      };
      let hasErrors = false;

      requiredFields.forEach((field) => {
        const value = formData[field] as string;
        const fieldError = validateField(field, value);
        if (fieldError) {
          newErrors[field as keyof ValidationErrors] = fieldError;
          hasErrors = true;
        }
      });

      if (formData.phone_number) {
        const phoneError = validateField('phone_number', formData.phone_number);
        if (phoneError) {
          newErrors.phone_number = phoneError;
          hasErrors = true;
        }
      }

      // Validate term dates if present
      const startDate = formData.start_term
        ? new Date(formData.start_term)
        : null;
      const endDate = formData.end_term ? new Date(formData.end_term) : null;

      if (formData.start_term && (!startDate || isNaN(startDate.getTime()))) {
        newErrors.start_term = 'Please enter a valid start date';
        hasErrors = true;
      }
      if (formData.end_term && (!endDate || isNaN(endDate.getTime()))) {
        newErrors.end_term = 'Please enter a valid end date';
        hasErrors = true;
      }
      if (
        startDate &&
        endDate &&
        !isNaN(startDate.getTime()) &&
        !isNaN(endDate.getTime()) &&
        endDate < startDate
      ) {
        newErrors.end_term = 'End term must be after start term';
        hasErrors = true;
      }

      // Validate custom fields
      customFieldDefinitions.forEach((fieldDef) => {
        const value = formData.custom_fields[fieldDef.Name] || '';
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

      // Construct payload for POST /board_members/
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone_number, // API expects 'phone' not 'phone_number'
        title: formData.title,
        // Role is implicit for this endpoint
        // is_active is likely handled by the backend
        schools: formData.schools, // Array of school IDs
        start_term: formData.start_term || null, // Send null if empty
        end_term: formData.end_term || null, // Send null if empty
        custom_fields: formData.custom_fields, // Pass the object
        // Removed notification_settings, as they weren't in the user spec for this endpoint
      };

      setIsSubmitting(true);
      try {
        console.log('Creating board member with payload:', payload);
        // Use the correct endpoint: POST /board_members/
        const response = await axiosInstance.post<SchoolUser>(
          '/board_members/',
          payload,
        );
        console.log('Board member created:', response.data);

        // Refetch all board members for the suggestion list
        dispatch(fetchAllBoardMembers());

        // Also, refetch board members for all schools this new member was assigned to
        // This ensures the EntityInfoDrawer for any of those schools updates its list
        if (payload.schools && payload.schools.length > 0) {
          payload.schools.forEach((schoolId) => {
            if (schoolId) {
              // Ensure schoolId is not null/empty
              dispatch(fetchBoardMembersForSchool(schoolId));
            }
          });
        }

        if (createAnother) {
          setFormData(createInitialState()); // Reset form using function
          setValidationErrors({ custom_fields: {} }); // Clear validation errors too
        } else {
          onClose();
        }
      } catch (err: unknown) {
        console.error('Error creating board member:', err);
        let message = 'Failed to create board member.';
        if (axios.isAxiosError(err) && err.response?.data) {
          const responseData = err.response.data;
          message =
            responseData?.detail || JSON.stringify(responseData) || err.message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      dispatch,
      formData,
      customFieldDefinitions,
      createAnother,
      onClose,
      createInitialState,
    ],
  );

  // Only render if open
  if (!open) {
    return null;
  }

  return (
    <AddBoardMemberComponent
      open={open}
      onClose={onClose}
      formData={formData}
      customFieldDefinitions={customFieldDefinitions} // Pass definitions
      validationErrors={validationErrors}
      error={error}
      isSubmitting={isSubmitting}
      createAnother={createAnother}
      onCreateAnotherChange={setCreateAnother}
      onInputChange={handleInputChange}
      onCustomFieldChange={handleCustomFieldChange}
      onSubmit={handleSubmit}
    />
  );
};
