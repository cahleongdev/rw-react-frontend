import React from 'react';

import { ChevronDownIcon } from '@heroicons/react/24/outline';

import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { Checkbox } from '@/components/base/Checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/base/Popover';
import { ScrollArea } from '@/components/base/ScrollArea';
import { CustomInput } from '@/components/base/CustomInput';
import { Dropdown } from '@/components/base/Dropdown';
import { cn } from '@/utils/tailwind';
import type { ValidationErrors } from '@/utils/validation';
import { School } from '@/store/slices/schoolsSlice';
import { formatGradeRange, GradeOption } from '@utils/gradeFormatting';

// All US states with full names and abbreviations
const stateOptions = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

const gradeOptions: GradeOption[] = [
  { value: 'K', label: 'Kindergarten' },
  { value: '1', label: '1st Grade' },
  { value: '2', label: '2nd Grade' },
  { value: '3', label: '3rd Grade' },
  { value: '4', label: '4th Grade' },
  { value: '5', label: '5th Grade' },
  { value: '6', label: '6th Grade' },
  { value: '7', label: '7th Grade' },
  { value: '8', label: '8th Grade' },
  { value: '9', label: '9th Grade' },
  { value: '10', label: '10th Grade' },
  { value: '11', label: '11th Grade' },
  { value: '12', label: '12th Grade' },
];

const typeOptions = [
  { value: 'Public', label: 'Public School' },
  { value: 'Local', label: 'Local School' },
  { value: 'Charter', label: 'Charter School' },
];

interface AddSchoolProps {
  open: boolean;
  onClose: () => void;
  formData: Omit<School, 'id'>;
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
  onDropdownChange: (name: string, value: string) => void;
  onGradesChange: (gradeValue: string, isChecked: boolean) => void;
}

export const AddSchool: React.FC<AddSchoolProps> = ({
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
  onDropdownChange,
  onGradesChange,
}) => {
  // Helper to display selected grades
  const getSelectedGradesLabel = () => {
    if (!formData.gradeserved || formData.gradeserved.length === 0) {
      return 'Select grades...';
    }
    return formatGradeRange(formData.gradeserved, gradeOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[515px] h-[560px] bg-white p-0 flex flex-col gap-0 rounded-[8px]"
        showClose={true}
      >
        <DialogHeader className="p-4 border-b border-slate-200">
          <DialogTitle className="text-base font-semibold">
            Create School
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <form
            id="createSchoolForm"
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <CustomInput
              label="School Name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Enter a school name"
              required
              error={validationErrors.name}
            />

            <CustomInput
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={onInputChange}
              placeholder="Enter street address"
              required
              error={validationErrors.address}
            />

            <div className="grid grid-cols-3 gap-4">
              <CustomInput
                label="City"
                name="city"
                value={formData.city}
                onChange={onInputChange}
                placeholder="Enter city name"
                required
                error={validationErrors.city}
              />
              <Dropdown
                label="State"
                value={formData.state}
                onValueChange={(value) =>
                  onInputChange({
                    target: { name: 'state', value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                options={stateOptions}
                required
              />
              <CustomInput
                label="ZIP Code"
                name="zipcode"
                value={formData.zipcode}
                onChange={onInputChange}
                placeholder="Enter ZIP code"
                required
                error={validationErrors.zipcode}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Dropdown
                label="Type"
                value={formData.type || ''}
                onValueChange={(value) => onDropdownChange('type', value)}
                options={typeOptions}
                required
              />

              {/* Grades Served Multi-Select Popover */}
              <div className="flex flex-col gap-2">
                <label className="body2-medium text-slate-700">
                  Grades Served <span className="text-red-500">*</span>
                </label>
                <Popover>
                  <PopoverTrigger className="w-full">
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between border-slate-300 font-normal',
                        !formData.gradeserved ||
                          (formData.gradeserved.length === 0 &&
                            'text-muted-foreground'),
                      )}
                      type="button"
                    >
                      <span className="truncate">
                        {getSelectedGradesLabel()}
                      </span>
                      <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[240px] max-h-[--radix-popover-content-available-height] p-0 z-[110] overflow-hidden">
                    <ScrollArea>
                      <div className="p-2 space-y-1">
                        {gradeOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center gap-2 p-1 rounded hover:bg-slate-100"
                          >
                            <Checkbox
                              id={`grade-${option.value}`}
                              checked={formData.gradeserved.includes(
                                option.value,
                              )}
                              onCheckedChange={(checked) => {
                                onGradesChange(option.value, !!checked);
                              }}
                            />
                            <label
                              htmlFor={`grade-${option.value}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                {typeof validationErrors.gradeserved === 'string' && (
                  <p className="text-sm text-red-500">
                    {validationErrors.gradeserved}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="County"
                name="county"
                value={formData.county}
                onChange={onInputChange}
                placeholder="Enter county"
              />
              <CustomInput
                label="District"
                name="district"
                value={formData.district}
                onChange={onInputChange}
                placeholder="Enter district"
              />
            </div>

            {/* Check if custom_fields exists and has keys */}
            {formData.custom_fields &&
              Object.keys(formData.custom_fields).length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-medium mb-4">Custom Fields</h3>
                  <div className="flex flex-col gap-4">
                    {/* Iterate over object entries for custom fields */}
                    {Object.entries(formData.custom_fields).map(
                      ([fieldName, fieldValue]) => {
                        // Find field definition to get type (assuming passed down or defined elsewhere)
                        // const fieldDefinition = sharedCustomFields.find(f => f.field_name === fieldName);
                        // const fieldType = fieldDefinition?.field_type || 'Text'; // Example: Need to get actual type
                        const fieldType = 'Text'; // Placeholder: Assuming text for now

                        return (
                          <div
                            key={fieldName}
                            className="grid grid-cols-1 gap-2"
                          >
                            <CustomInput
                              label={fieldName}
                              value={fieldValue}
                              onChange={(e) =>
                                onCustomFieldChange(
                                  fieldName,
                                  e.target.value,
                                  fieldType,
                                )
                              }
                              placeholder={`Enter ${fieldName.toLowerCase()}`}
                              type={'text'}
                              error={validationErrors.custom_fields[fieldName]}
                            />
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
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
              Create another school after this one
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-[3px] border-slate-500 p-[8px_12px]"
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="createSchoolForm"
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-[3px] p-[8px_12px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create School'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
