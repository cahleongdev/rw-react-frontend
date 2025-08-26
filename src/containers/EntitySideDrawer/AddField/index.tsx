import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AddField as AddFieldComponent } from '@/components/Schools/AddField';

import {
  CustomFieldDefinition,
  EntityTypeWithCustomFields,
  updateCustomFieldDefinitionsAPI,
} from '@/store/slices/customFieldDefinitionsSlice';
import { RootState, AppDispatch } from '@/store';

interface AddFieldProps {
  open: boolean;
  onClose: () => void;
  entityType: EntityTypeWithCustomFields;
}

export const AddField: React.FC<AddFieldProps> = ({
  open,
  onClose,
  entityType,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { currentFields, agencyUniqueId } = useSelector((state: RootState) => ({
    currentFields: state.customFieldDefinitions[entityType] || [],
    agencyUniqueId: state.auth.user?.agency,
  }));

  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('');
  const [error, setError] = useState('');

  const handleFieldNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldName(e.target.value);
      if (e.target.value.trim()) setError('');
    },
    [],
  );

  const handleFieldTypeChange = useCallback((value: string) => {
    setFieldType(value);
    if (value) setError('');
  }, []);

  const handleSave = useCallback(async () => {
    if (!fieldName.trim() || !fieldType) {
      setError('Please fill in all required fields');
      return;
    }

    const trimmedFieldName = fieldName.trim();
    if (
      currentFields.some(
        (field) => field.Name.toLowerCase() === trimmedFieldName.toLowerCase(),
      )
    ) {
      setError('Field name already exists');
      return;
    }

    if (!agencyUniqueId) {
      setError('Agency ID not found. Cannot save.');
      console.error(
        'Agency ID missing, cannot save new custom field definition.',
      );
      return;
    }

    const newFieldDefinition: CustomFieldDefinition = {
      Name: trimmedFieldName,
      Type: fieldType,
    };

    const updatedFields = [...currentFields, newFieldDefinition];

    try {
      await dispatch(
        updateCustomFieldDefinitionsAPI({
          agencyUniqueId,
          entityTypeKey: entityType,
          fields: updatedFields,
        }),
      ).unwrap();

      setFieldName('');
      setFieldType('');
      setError('');
      onClose();
    } catch (apiError: unknown) {
      console.error('Failed to add custom field definition:', apiError);
      const message =
        apiError instanceof Error ? apiError.message : String(apiError);
      setError(`Save failed: ${message || 'Unknown error'}`);
    }
  }, [
    dispatch,
    fieldName,
    fieldType,
    entityType,
    currentFields,
    agencyUniqueId,
    onClose,
  ]);

  return (
    <AddFieldComponent
      open={open}
      onClose={onClose}
      fieldName={fieldName}
      fieldType={fieldType}
      error={error}
      entityType={entityType}
      onFieldNameChange={handleFieldNameChange}
      onFieldTypeChange={handleFieldTypeChange}
      onSave={handleSave}
    />
  );
};
