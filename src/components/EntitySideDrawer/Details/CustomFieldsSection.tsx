import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

import { Table, TableBody, TableCell, TableRow } from '@/components/base/Table';
import { Button } from '@/components/base/Button';
import { InlineEditField } from '@/components/base/InlineEditField';

import { CustomFieldDefinition } from '@/store/slices/customFieldDefinitionsSlice';

interface CustomFieldsSectionProps {
  customFieldDefinitions: CustomFieldDefinition[];
  customFields: Record<string, string> | null;
  onCustomFieldSave: (fieldName: string, newValue: string | File) => void;
  onAddFieldClick: () => void;
  onCustomFieldFileUpload: (
    file: File,
    onProgress: (progress: number) => void,
  ) => Promise<string>;
}

export const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({
  customFieldDefinitions,
  customFields,
  onCustomFieldSave,
  onAddFieldClick,
  onCustomFieldFileUpload,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h5>Custom Fields</h5>
      {customFieldDefinitions.length > 0 ? (
        <Table>
          <TableBody>
            {customFieldDefinitions.map((field) => {
              const fieldValue = customFields?.[field.Name] ?? '';
              return (
                <TableRow
                  key={field.Name}
                  className="!border-b border-slate-200"
                >
                  <TableCell className="body2-bold w-[150px] py-2 px-0">
                    {field.Name}
                  </TableCell>
                  <TableCell className="body2-medium py-2 pr-2">
                    <InlineEditField
                      value={fieldValue as string}
                      fieldType={field.Type || 'Text'}
                      onSave={(newValue) =>
                        onCustomFieldSave(field.Name, newValue)
                      }
                      placeholder={`Enter ${field.Name}`}
                      className="body2-medium"
                      fileUploadConfig={
                        field.Type === 'File Upload'
                          ? { onFileUpload: onCustomFieldFileUpload }
                          : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <span className="body2-medium text-slate-500">
          No custom fields defined.
        </span>
      )}
      <Button
        variant="ghost"
        className="hover:bg-transparent text-blue-500 hover:text-blue-600 !pl-0 w-auto self-start"
        onClick={onAddFieldClick}
      >
        <PlusIcon className="w-4 h-4" /> Add field
      </Button>
    </div>
  );
};
