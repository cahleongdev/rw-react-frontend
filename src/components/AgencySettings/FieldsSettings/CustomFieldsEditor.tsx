import React from 'react';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';

import { Button } from '@/components/base/Button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/base/Select';
import { Input } from '@components/base/Input';

const FIELD_TYPES = ['Text', 'Date', 'Phone', 'File', 'Select'];

export interface CustomFieldDefinition {
  Name: string;
  Type: string;
}

interface CustomFieldsEditorProps {
  label: string;
  fields: CustomFieldDefinition[];
  onFieldChange: (
    idx: number,
    prop: keyof CustomFieldDefinition,
    value: string,
  ) => void;
  onAddField: () => void;
  onRemoveField: (idx: number) => void;
  loading?: boolean;
}

const CustomFieldsEditor: React.FC<CustomFieldsEditorProps> = ({
  label,
  fields,
  onFieldChange,
  onAddField,
  onRemoveField,
  loading,
}) => (
  <div className="flex gap-4">
    <div className="w-72">{label}</div>
    <div className="flex flex-col">
      <hr className="border border-secondary" />
      <div className="flex flex-col divide-y divide-secondary w-[520px]">
        {fields.length === 0 && (
          <div className="text-slate-400 py-2.5">No fields</div>
        )}
        {fields.map((field, idx) => (
          <div className="flex justify-between items-center py-2.5" key={idx}>
            <Input
              className="border-none"
              value={field.Name}
              placeholder="Field Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange(idx, 'Name', e.target.value)
              }
              disabled={loading}
            />
            <Select
              value={field.Type}
              onValueChange={(value) => onFieldChange(idx, 'Type', value)}
              disabled={loading}
            >
              <SelectTrigger className="body2-regular border-none rounded px-2 py-1 w-1/4 mr-2 shadow-none">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem value={type} key={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="ml-2"
              onClick={() => onRemoveField(idx)}
              disabled={loading}
              variant="ghost"
              aria-label="Remove field"
            >
              <MinusCircleIcon className="size-5 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
      <hr className="border border-secondary" />
      <Button
        variant="ghost"
        className="text-blue-500 hover:text-blue-600 w-fit mt-2"
        onClick={onAddField}
        disabled={loading}
      >
        <PlusIcon className="size-4.5" />
        Add field
      </Button>
    </div>
  </div>
);

export default CustomFieldsEditor;
