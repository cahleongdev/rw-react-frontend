import React from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { CustomInput } from '@/components/base/CustomInput';
import { Dropdown } from '@/components/base/Dropdown';
import { School } from '@/store/slices/schoolsSlice'; // Assuming School type is here

// Re-use state and grade options (can be moved to constants file later)
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

const gradeOptions = [
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

interface EditSchoolProps {
  open: boolean;
  onClose: () => void;
  schoolName: string; // Just pass the name for the title
  formData: School;
  isSubmitting: boolean;
  error: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDropdownChange: (name: keyof School, value: string | string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditSchool: React.FC<EditSchoolProps> = ({
  open,
  onClose,
  schoolName,
  formData,
  isSubmitting,
  error,
  onInputChange,
  onDropdownChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {' '}
      {/* Use onClose directly */}
      <DialogContent className="sm:max-w-[515px] bg-white p-0 flex flex-col gap-0 rounded-[8px]">
        <div className="flex-none">
          <h3 className="border-slate-200 p-4 border-b border-slate-200">
            Edit {schoolName || 'School'}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form
            id="editSchoolForm"
            onSubmit={onSubmit}
            className="p-6 flex flex-col gap-4"
          >
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            <CustomInput
              label="School Name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Enter a school name"
              required
            />

            <CustomInput
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={onInputChange}
              placeholder="Enter street address"
              required
            />

            <div className="grid grid-cols-3 gap-4">
              <CustomInput
                label="City"
                name="city"
                value={formData.city}
                onChange={onInputChange}
                placeholder="Enter city name"
                required
              />
              <Dropdown
                label="State"
                value={formData.state}
                onValueChange={(value) => onDropdownChange('state', value)}
                options={stateOptions}
                required
              />
              <CustomInput
                label="ZIP Code"
                name="zipcode"
                value={formData.zipcode}
                onChange={onInputChange} // Add validation in container if needed
                placeholder="Enter ZIP code"
                required
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
              <Dropdown
                label="Grades Served"
                value={formData.gradeserved[0] || ''} // Assuming single select for now
                onValueChange={(value) =>
                  onDropdownChange('gradeserved', [value])
                }
                options={gradeOptions}
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
          </form>
        </div>

        <div className="flex-none border-t border-slate-200 bg-beige-50">
          <DialogFooter className="flex justify-end gap-3 p-4">
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
                form="editSchoolForm"
                className="bg-blue-500 text-white hover:bg-blue-600 rounded-[3px] p-[8px_12px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
