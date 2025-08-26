import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '@/components/base/Button';
import { confirm } from '@/components/base/Confirmation';
import CustomFieldsEditor from '@/components/AgencySettings/FieldsSettings/CustomFieldsEditor';
import { RootState, AppDispatch } from '@/store/index';
import {
  CustomFieldEntityType,
  CustomFieldDefinition,
} from '@/store/slices/customFieldDefinitionsSlice';
import { fetchAgency, updateAgency } from '@store/slices/agencySlice';

const entityTypes = [
  { key: CustomFieldEntityType.AgencyEntity, label: 'Agency Fields' },
  { key: CustomFieldEntityType.BoardMember, label: 'Board Members' },
  { key: CustomFieldEntityType.NetworkEntity, label: 'Network Fields' },
  { key: CustomFieldEntityType.AgencyUser, label: 'Agency User Fields' },
  { key: CustomFieldEntityType.SchoolUser, label: 'School User Fields' },
];

const FieldsSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // TODO: GET agency ID from parent container like others
  const agencyId = useSelector((state: RootState) => state.auth.user?.agency);

  // const customFieldsState = useSelector(
  //   (state: RootState) => state.customFieldDefinitions,
  // );

  const { customFieldDefinitions: customFieldsState, loading } = useSelector(
    (state: RootState) => state.agency,
  );

  // Local state for all field types
  const [fields, setFields] = useState(() => {
    const initial: Record<string, CustomFieldDefinition[]> = {};
    entityTypes.forEach(({ key }) => {
      initial[key] = customFieldsState[key] || [];
    });
    return initial;
  });

  // Sync local state with Redux when opening page or after save
  React.useEffect(() => {
    const updated: Record<string, CustomFieldDefinition[]> = {};
    entityTypes.forEach(({ key }) => {
      updated[key] = customFieldsState[key] || [];
    });
    setFields(updated);
  }, [customFieldsState]);

  const handleFieldChange = (
    entityKey: string,
    idx: number,
    prop: keyof CustomFieldDefinition,
    value: string,
  ) => {
    setFields((prev) => {
      const updated = [...prev[entityKey]];
      updated[idx] = { ...updated[idx], [prop]: value };
      return { ...prev, [entityKey]: updated };
    });
  };

  const handleAddField = (entityKey: string) => {
    setFields((prev) => ({
      ...prev,
      [entityKey]: [...prev[entityKey], { Name: '', Type: 'Text' }],
    }));
  };

  const handleRemoveField = (entityKey: string, idx: number) => {
    setFields((prev) => {
      const updated = [...prev[entityKey]];
      updated.splice(idx, 1);
      return { ...prev, [entityKey]: updated };
    });
  };

  const handleSave = async () => {
    if (!agencyId) return;
    // Check for blank field names
    const hasBlank = Object.values(fields).some((fieldArr) =>
      fieldArr.some((field) => !field.Name.trim()),
    );
    if (hasBlank) {
      toast.error(
        'Field names cannot be blank. Please fill in all field names before saving.',
      );
      return;
    }
    try {
      dispatch(
        updateAgency({
          agencyId,
          updates: {
            agency_entity_fields: fields[CustomFieldEntityType.AgencyEntity],
            school_entity_fields: fields[CustomFieldEntityType.SchoolUser],
            network_entity_fields: fields[CustomFieldEntityType.NetworkEntity],
            board_member_fields: fields[CustomFieldEntityType.BoardMember],
            agency_user_fields: fields[CustomFieldEntityType.AgencyUser],
            school_user_fields: fields[CustomFieldEntityType.SchoolUser],
          },
        }),
      );
      toast.success('Custom fields updated successfully');
    } catch (error) {
      console.error('Error updating custom fields:', error);
      toast.error('Failed to update custom fields');
    }
  };

  const handleCancel = () => {
    confirm({
      title: 'Unsaved Changes',
      message:
        'Are you sure you want to leave this page? If you leave this page, any changes you have made will be lost.',
      onConfirm: () => {
        // Reset to Redux state
        const updated: Record<string, CustomFieldDefinition[]> = {};
        entityTypes.forEach(({ key }) => {
          updated[key] = customFieldsState[key] || [];
        });
        setFields(updated);
      },
      confirmText: 'Discard Changes',
      cancelText: 'Stay On This Page',
      confirmButtonStyle: 'bg-red-500 hover:bg-red-600 text-white',
    });
  };

  useEffect(() => {
    if (agencyId) {
      dispatch(fetchAgency(agencyId));
    }
  }, [agencyId, dispatch]);

  return (
    <div className="flex flex-col gap-6 pb-5 overflow-y-auto grow">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h4 className="text-slate-950">Fields</h4>
          <div className="body2-regular text-slate-500">
            Manage custom fields for all objects in one space.
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
      <hr className="border border-secondary" />
      {entityTypes.map(({ key, label }) => (
        <React.Fragment key={key}>
          <CustomFieldsEditor
            label={label}
            fields={fields[key]}
            onFieldChange={(idx, prop, value) =>
              handleFieldChange(key, idx, prop, value)
            }
            onAddField={() => handleAddField(key)}
            onRemoveField={(idx) => handleRemoveField(key, idx)}
            loading={loading}
          />
          <hr className="border border-secondary" />
        </React.Fragment>
      ))}
      <div className="flex justify-end items-center">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleSave}
            disabled={loading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FieldsSettings;
