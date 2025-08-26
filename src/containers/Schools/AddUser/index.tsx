// React
import React, { useState, useCallback, useEffect } from 'react';

// Third-party libraries
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; // Re-added AxiosError as it's used in the catch block

// Project API/Config
import axiosInstance from '@/api/axiosInstance';

// Project Redux Store
import { RootState } from '@/store';
import { SchoolResponse } from '@/store/slices/schoolsSlice';
// Import { CustomFieldDefinition } from '@/store/slices/customFieldDefinitionsSlice'; // No longer needed directly
import { addUser, SchoolUser } from '@/store/slices/schoolUsersSlice';

// Project Components & Component Types
import {
  AddUser as AddUserComponent,
  AddUserFormData,
} from '@/components/Schools/AddUser';

// Project Utils
import { validateField, formatPhoneNumber } from '@/utils/validation';

// Project Types (explicit type import)
import type { ValidationErrors } from '@/utils/validation';

type UserRole =
  | 'School_Admin'
  | 'School_User'
  | 'Board_Member'
  | 'Agency_Admin'
  | 'Super_Admin';

interface AddUserProps {
  open: boolean;
  onClose: () => void;
  entityId?: string;
  initialFirstName?: string;
  initialLastName?: string;
  onSubmitSuccess?: (createdUser: SchoolUser) => void;
}

export const AddUser: React.FC<AddUserProps> = ({
  open,
  onClose,
  entityId,
  initialFirstName = '',
  initialLastName = '',
  onSubmitSuccess,
}) => {
  const dispatch = useDispatch();
  const schools = useSelector((state: RootState) => state.schools.schools);

  // Get custom field definitions for users
  // Assuming school users for now, adjust key if needed (agency_user_fields?)
  const customFieldDefinitions = useSelector(
    (state: RootState) => state.customFieldDefinitions.school_user_fields || [],
  );

  const initialFormState: AddUserFormData = {
    first_name: initialFirstName,
    last_name: initialLastName,
    email: '',
    phone_number: '',
    title: '',
    role: '',
    is_active: true,
    status: 'Pending',
    profile_image: '',
    view_only: false,
    schools: entityId ? [entityId] : [],
    custom_fields: {},
  };

  const [formData, setFormData] = useState(initialFormState);
  const [createAnother, setCreateAnother] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAddingSchoolInline, setIsAddingSchoolInline] = useState(false);
  const [schoolSearchQueryInline, setSchoolSearchQueryInline] = useState('');
  const [searchResultsInline, setSearchResultsInline] = useState<
    SchoolResponse[]
  >([]);
  const [selectedSchoolInline, setSelectedSchoolInline] =
    useState<SchoolResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    custom_fields: {},
  });

  const assignedSchoolDetails = React.useMemo(() => {
    return formData.schools
      .map((id) => schools.find((s) => s.id === id))
      .filter((s) => s !== undefined) as SchoolResponse[];
  }, [formData.schools, schools]);

  // Initialize form custom fields based on definitions
  useEffect(() => {
    const initialCustomFields: Record<string, string> = {};
    customFieldDefinitions.forEach((def) => {
      initialCustomFields[def.Name] = ''; // Initialize with empty string
    });
    // Only set initially or if definitions change drastically?
    // Careful not to overwrite user input if definitions update while dialog is open.
    setFormData((prev) => ({ ...prev, custom_fields: initialCustomFields }));
  }, [customFieldDefinitions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Format phone number as it's typed
    if (name === 'phone_number') {
      finalValue = formatPhoneNumber(value);
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

  const searchSchoolsInline = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchResultsInline([]);
        return;
      }

      const filteredSchools = schools.filter(
        (school) =>
          !formData.schools.includes(school.id) &&
          school.name.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResultsInline(filteredSchools);
    },
    [schools, formData.schools],
  );

  const handleSchoolSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSchoolSearchQueryInline(query);
    searchSchoolsInline(query);
    setSelectedSchoolInline(null);
  };

  const handleSchoolSelect = (school: SchoolResponse) => {
    setSelectedSchoolInline(school);
    setSearchResultsInline([]);
    setSchoolSearchQueryInline(school.name);
  };

  const handleConfirmAddSchool = () => {
    if (!selectedSchoolInline) return;

    setFormData((prev) => ({
      ...prev,
      schools: [...prev.schools, selectedSchoolInline.id],
    }));

    setIsAddingSchoolInline(false);
    setSelectedSchoolInline(null);
    setSchoolSearchQueryInline('');
    setSearchResultsInline([]);
  };

  const handleCancelAddSchool = () => {
    setIsAddingSchoolInline(!isAddingSchoolInline);
    setSelectedSchoolInline(null);
    setSchoolSearchQueryInline('');
    setSearchResultsInline([]);
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      // In a real app, this would be an API call to upload the file
      // For now, we'll just create a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profile_image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        profile_image: '',
      }));
    }
  };

  const handleCustomFieldChange = (
    fieldName: string,
    value: string,
    fieldType?: string,
  ) => {
    let finalValue = value;

    // Format phone numbers as they're typed
    if (fieldType === 'Phone') {
      finalValue = formatPhoneNumber(value);
    }

    setFormData((prev) => ({
      ...prev,
      custom_fields: {
        ...prev.custom_fields,
        [fieldName]: finalValue,
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

  const handleRemoveSchool = (schoolIdToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      schools: prev.schools.filter((id) => id !== schoolIdToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate all required fields
    const requiredFields = ['first_name', 'last_name', 'email'] as const;
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

    // Validate phone if provided
    if (formData.phone_number) {
      const phoneError = validateField('phone_number', formData.phone_number);
      if (phoneError) {
        newErrors.phone_number = phoneError;
        hasErrors = true;
      }
    }

    // Validate custom fields
    customFieldDefinitions.forEach((fieldDef) => {
      const value = formData.custom_fields[fieldDef.Name] || '';
      const error = validateField(fieldDef.Name, value, fieldDef.Type);
      if (error) {
        if (!newErrors.custom_fields) newErrors.custom_fields = {}; // Ensure object exists
        newErrors.custom_fields[fieldDef.Name] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    if (formData.role !== 'Board_Member' && formData.schools.length === 0) {
      setError('Please assign at least one school to the user.');
      setIsSubmitting(false);
      return;
    }

    // Construct the payload for the API
    const payload = {
      ...formData,
      custom_fields: formData.custom_fields,
      role: formData.role as UserRole,
      status: formData.status || 'Pending',
      is_active: formData.is_active,
      view_only: formData.view_only,
      notification_settings: {
        benchmark: true,
        comments: true,
        daily_report: false,
        messages: true,
        report_assigned: true,
        report_rejected: true,
        report_returned: true,
        weekly_report: false,
      },
    };

    try {
      // Use the imported instance for the call
      const response = await axiosInstance.post<SchoolUser>('/users/', payload);

      const createdUser: SchoolUser = response.data; // Data is directly in response.data

      // Dispatch action to update Redux store
      dispatch(addUser({ user: createdUser }));

      // Call the success callback
      onSubmitSuccess?.(createdUser);

      if (createAnother) {
        // Reset form for adding another user, keeping assigned schools if entityId was passed
        setFormData({
          ...initialFormState,
          schools: entityId ? [entityId] : [], // Persist school if context given
          custom_fields: initialFormState.custom_fields, // Persist custom fields structure
        });
        setSelectedFile(null); // Clear file input
        // Don't close the dialog
      } else {
        onClose(); // Close dialog if not adding another
      }
    } catch (error) {
      console.error('Error creating user:', error);

      let errorMessage = 'An unknown error occurred. Please try again.';

      // Use the imported axios for the type guard
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(`Failed to create user: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AddUserComponent
      open={open}
      onClose={onClose}
      formData={formData}
      assignedSchoolDetails={assignedSchoolDetails}
      validationErrors={validationErrors}
      error={error}
      isSubmitting={isSubmitting}
      createAnother={createAnother}
      selectedFile={selectedFile}
      isAddingSchoolInline={isAddingSchoolInline}
      customFieldDefinitions={customFieldDefinitions}
      schoolSearchQueryInline={schoolSearchQueryInline}
      searchResultsInline={searchResultsInline}
      selectedSchoolInline={selectedSchoolInline}
      onInputChange={handleInputChange}
      onCustomFieldChange={handleCustomFieldChange}
      onCreateAnotherChange={setCreateAnother}
      onFileChange={handleFileChange}
      onSchoolSearchChange={handleSchoolSearchChange}
      onSchoolSelect={handleSchoolSelect}
      onConfirmAddSchool={handleConfirmAddSchool}
      onCancelAddSchool={handleCancelAddSchool}
      onRemoveSchool={handleRemoveSchool}
      onRoleChange={(value) =>
        setFormData((prev) => ({ ...prev, role: value }))
      }
      onViewOnlyChange={(checked) =>
        setFormData((prev) => ({ ...prev, view_only: checked as boolean }))
      }
      onSubmit={handleSubmit}
    />
  );
};
