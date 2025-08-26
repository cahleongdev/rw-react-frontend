import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { CustomInput } from '@/components/base/CustomInput';
import { Dropdown } from '@/components/base/Dropdown';
import {
  CustomFieldEntityType,
  EntityTypeWithCustomFields,
} from '@/store/slices/customFieldDefinitionsSlice';

// Use the field types specified by the user
const fieldTypeOptions = [
  { value: 'Text', label: 'Text' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Date', label: 'Date' },
  { value: 'File Upload', label: 'File Upload' },
];

interface AddFieldProps {
  open: boolean;
  onClose: () => void;
  fieldName: string;
  fieldType: string;
  error: string;
  entityType: EntityTypeWithCustomFields;
  onFieldNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldTypeChange: (value: string) => void;
  onSave: () => void;
}

export const AddField: React.FC<AddFieldProps> = ({
  open,
  onClose,
  fieldName,
  fieldType,
  error,
  entityType,
  onFieldNameChange,
  onFieldTypeChange,
  onSave,
}) => {
  const getReadableEntityType = (typeKey: EntityTypeWithCustomFields) => {
    switch (typeKey) {
      case CustomFieldEntityType.AgencyEntity:
        return 'Agency';
      case CustomFieldEntityType.SchoolEntity:
        return 'School';
      case CustomFieldEntityType.NetworkEntity:
        return 'Network';
      case CustomFieldEntityType.BoardMember:
        return 'Board Member';
      case CustomFieldEntityType.AgencyUser:
        return 'Agency User';
      case CustomFieldEntityType.SchoolUser:
        return 'School User';
      default:
        return 'Entity';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-[8px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            Add {getReadableEntityType(entityType)} Custom Field
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <CustomInput
              label="Field Name"
              id="fieldName"
              value={fieldName}
              onChange={onFieldNameChange}
              placeholder="Enter field name"
              required
              error={error && !fieldName.trim() ? error : ''}
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Dropdown
              label="Field Type"
              value={fieldType}
              onValueChange={onFieldTypeChange}
              options={fieldTypeOptions}
              placeholder="Select field type"
              required
              error={error && !fieldType ? error : ''}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
