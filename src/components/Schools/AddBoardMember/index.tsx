import React from 'react';

// import * as DialogPrimitive from '@radix-ui/react-dialog'; // No longer needed

import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/base/Dialog'; // Import base components
import { Button } from '@/components/base/Button';
import { Checkbox } from '@/components/base/Checkbox';
import { CustomInput } from '@/components/base/CustomInput';

// import { XMarkIcon } from '@heroicons/react/24/outline'; // No longer needed if base DialogContent handles close
import type { ValidationErrors } from '@/utils/validation';

import { CustomFieldDefinition } from '@/store/slices/customFieldDefinitionsSlice';

interface AddBoardMemberFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  title?: string;
  start_term?: string;
  end_term?: string;
  schools: string[];
  custom_fields: Record<string, string>;
}

interface AddBoardMemberProps {
  customFieldDefinitions: CustomFieldDefinition[];
  open: boolean;
  onClose: () => void;
  formData: AddBoardMemberFormData;
  validationErrors: ValidationErrors;
  error: string;
  isSubmitting: boolean;
  createAnother: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomFieldChange: (
    fieldName: string,
    value: string,
    fieldType?: string,
  ) => void;
  onCreateAnotherChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddBoardMember: React.FC<AddBoardMemberProps> = ({
  customFieldDefinitions,
  open,
  onClose,
  formData,
  validationErrors,
  error,
  isSubmitting,
  createAnother,
  onInputChange,
  onCustomFieldChange,
  onCreateAnotherChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[515px] h-[90vh] bg-white p-0 flex flex-col gap-0 rounded-[8px]"
        showClose={true}
      >
        <DialogHeader className="p-4 border-b border-slate-200">
          <DialogTitle className="text-base font-semibold">
            Add Board Member
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <form
            id="createBoardMemberForm"
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={onInputChange}
                placeholder="Enter first name"
                required
                error={validationErrors.first_name}
              />
              <CustomInput
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={onInputChange}
                placeholder="Enter last name"
                required
                error={validationErrors.last_name}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="Enter email"
                required
                error={validationErrors.email}
              />
              <CustomInput
                label="Phone"
                name="phone_number"
                value={formData.phone_number}
                onChange={onInputChange}
                placeholder="(555) 555-5555"
                error={validationErrors.phone_number}
              />
            </div>

            <CustomInput
              label="Title (optional)"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              placeholder="Enter title"
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Start Term"
                name="start_term"
                value={formData.start_term}
                onChange={onInputChange}
                type="date"
                placeholder="(MM/DD/YYYY)"
                required
                error={validationErrors.start_term as string}
              />
              <CustomInput
                label="End Term"
                name="end_term"
                value={formData.end_term}
                onChange={onInputChange}
                type="date"
                placeholder="(MM/DD/YYYY)"
                required
                error={validationErrors.end_term as string}
              />
            </div>

            <div className="mt-4">
              <h3 className="text-base font-medium mb-4">Custom Fields</h3>
              {customFieldDefinitions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {customFieldDefinitions.map((fieldDef) => (
                    <div key={fieldDef.Name} className="grid grid-cols-1 gap-2">
                      <CustomInput
                        label={fieldDef.Name}
                        value={formData.custom_fields[fieldDef.Name] || ''}
                        onChange={(e) =>
                          onCustomFieldChange(
                            fieldDef.Name,
                            e.target.value,
                            fieldDef.Type,
                          )
                        }
                        placeholder={`Enter ${fieldDef.Name.toLowerCase()}`}
                        type={fieldDef.Type === 'Date' ? 'date' : 'text'}
                        error={validationErrors.custom_fields[fieldDef.Name]}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No custom fields defined for board members.
                </p>
              )}
            </div>
          </form>
        </div>

        <DialogFooter className="flex justify-end gap-3 p-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Checkbox
              id="createAnother"
              checked={createAnother}
              onCheckedChange={(checked) =>
                onCreateAnotherChange(checked as boolean)
              }
            />
            <label
              htmlFor="createAnother"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Create another member after this one
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-500 p-[8px_12px]"
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="createBoardMemberForm"
              className="bg-blue-500 text-white hover:bg-blue-600 p-[8px_12px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Member'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
