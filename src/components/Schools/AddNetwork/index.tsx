import React from 'react';

// import * as DialogPrimitive from '@radix-ui/react-dialog'; // No longer needed
// import { XMarkIcon } from '@heroicons/react/24/outline'; // No longer needed

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
import { Dropdown } from '@/components/base/Dropdown';
import type { ValidationErrors } from '@/utils/validation';
import { Network } from '@/store/slices/schoolsSlice';

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

interface AddNetworkProps {
  open: boolean;
  onClose: () => void;
  formData: Omit<Network, 'id'>;
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

export const AddNetwork: React.FC<AddNetworkProps> = ({
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
        className="sm:max-w-[515px] h-[560px] bg-white p-0 flex flex-col gap-0 rounded-[8px]"
        showClose={true}
      >
        <DialogHeader className="p-4 border-b border-slate-200">
          <DialogTitle className="text-base font-semibold">
            Create Network
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {' '}
          {/* Form content wrapper */}
          <form
            id="createNetworkForm"
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <CustomInput
              label="Network Name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Enter a network name"
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

            {formData.custom_fields &&
              Object.keys(formData.custom_fields).length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-medium mb-4">Custom Fields</h3>
                  <div className="flex flex-col gap-4">
                    {Object.entries(formData.custom_fields || {}).map(
                      ([fieldName, fieldValue]) => {
                        const fieldType = 'Text'; // Assuming Text, adjust if type info is available
                        return (
                          <div
                            key={fieldName}
                            className="grid grid-cols-1 gap-2"
                          >
                            <CustomInput
                              label={fieldName} // You might want to format this (e.g., startCase)
                              value={fieldValue as string}
                              onChange={(e) =>
                                onCustomFieldChange(
                                  fieldName,
                                  e.target.value,
                                  fieldType,
                                )
                              }
                              placeholder={`Enter ${fieldName.toLowerCase()}`}
                              type={'text'} // Assuming text, adjust if type info is available
                              error={
                                validationErrors.custom_fields?.[fieldName]
                              }
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
              Create another network after this one
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
              form="createNetworkForm"
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-[3px] p-[8px_12px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Network'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
