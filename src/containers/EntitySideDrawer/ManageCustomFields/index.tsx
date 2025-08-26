import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OnDragEndResponder, DropResult } from 'react-beautiful-dnd';
import isEqual from 'lodash/isEqual';

import { ManageCustomFields as ManageCustomFieldsComponent } from '@components/EntitySideDrawer/ManageCustomFields';

import {
  CustomFieldDefinition,
  updateCustomFieldDefinitionsAPI,
  EntityTypeWithCustomFields,
} from '@/store/slices/customFieldDefinitionsSlice';
import { RootState, AppDispatch } from '@/store';

interface ManageCustomFieldsContainerProps {
  open: boolean;
  onClose: () => void;
  entityType: EntityTypeWithCustomFields;
}

export const ManageCustomFields: React.FC<ManageCustomFieldsContainerProps> = ({
  open,
  onClose,
  entityType,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { initialFields, agencyUniqueId } = useSelector((state: RootState) => ({
    initialFields: state.customFieldDefinitions[entityType] || [],
    agencyUniqueId: state.auth.user?.agency,
  }));

  const [fields, setFields] = useState<CustomFieldDefinition[]>(initialFields);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEqual(fields, initialFields)) {
      setFields(initialFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFields]);

  useEffect(() => {
    if (!open) {
      setNewFieldName('');
      setNewFieldType('');
      setError('');
    }
  }, [open]);

  const handleNewFieldNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewFieldName(e.target.value);
      if (e.target.value.trim()) setError('');
    },
    [],
  );

  const handleNewFieldTypeChange = useCallback((value: string) => {
    setNewFieldType(value);
    if (value) setError('');
  }, []);

  const handleAddField = useCallback(() => {
    if (!newFieldName.trim()) {
      setError('Field name is required');
      return;
    }
    if (!newFieldType) {
      setError('Field type is required');
      return;
    }
    if (
      fields.some(
        (field) =>
          field.Name.toLowerCase() === newFieldName.trim().toLowerCase(),
      )
    ) {
      setError('Field name already exists');
      return;
    }

    const newField: CustomFieldDefinition = {
      Name: newFieldName.trim(),
      Type: newFieldType,
    };

    console.log('newField', newField);

    setFields([...fields, newField]);
    setNewFieldName('');
    setNewFieldType('');
    setError('');
  }, [newFieldName, newFieldType, fields]);

  const handleRemoveField = useCallback((fieldName: string) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field.Name !== fieldName),
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!agencyUniqueId) {
      setError('Agency ID not found. Cannot save.');
      console.error('Agency ID missing, cannot save custom field definitions.');
      return;
    }

    if (fields.some((field) => !field.Name || !field.Type)) {
      setError('All fields must have a name and type.');
      return;
    }

    try {
      await dispatch(
        updateCustomFieldDefinitionsAPI({
          agencyUniqueId,
          entityTypeKey: entityType,
          fields,
        }),
      ).unwrap();
      setError('');
      onClose();
    } catch (apiError: unknown) {
      console.error('Failed to save custom field definitions:', apiError);
      const message =
        apiError instanceof Error ? apiError.message : String(apiError);
      setError(`Save failed: ${message || 'Unknown error'}`);
    }
  }, [dispatch, entityType, fields, agencyUniqueId, onClose]);

  const handleDragEnd: OnDragEndResponder = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const items: CustomFieldDefinition[] = Array.from(fields);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setFields(items);
    },
    [fields],
  );

  if (!open) {
    return null;
  }

  return (
    <ManageCustomFieldsComponent
      open={open}
      onClose={onClose}
      entityType={entityType}
      fields={fields}
      newFieldName={newFieldName}
      newFieldType={newFieldType}
      error={error}
      onNewFieldNameChange={handleNewFieldNameChange}
      onNewFieldTypeChange={handleNewFieldTypeChange}
      onAddField={handleAddField}
      onRemoveField={handleRemoveField}
      onSave={handleSave}
      onDragEnd={handleDragEnd}
    />
  );
};
