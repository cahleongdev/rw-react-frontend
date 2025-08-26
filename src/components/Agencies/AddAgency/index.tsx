import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { CustomInput } from '@/components/base/CustomInput';
import { Dropdown } from '@/components/base/Dropdown';
import { DateInput } from '@/components/base/DateInput';
import Switch from '@/components/base/Switch';
import { Label } from '@/components/base/Label';
import { Agency } from '@/store/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Using Partial<Agency> for form values. Add specific fields if not in Agency or need different type for form.
// For example, if API expects numbers but form inputs are strings initially.
// For now, we assume fields in the form are a subset of Agency or can be cast.

// Define the options based on backend requirements
const JURISDICTION_OPTIONS = [
  { value: 'State', label: 'State' },
  { value: 'City', label: 'City' },
  { value: 'Country', label: 'Country' }, // Assuming 'Country' is intended, not 'County' as a typo
  { value: 'Other', label: 'Other' },
];

const AUTHORIZE_TYPE_OPTIONS = [
  { value: 'University', label: 'University' },
  { value: 'County', label: 'County' }, // Changed from backend "Country" label to "County" to match value, assuming typo
  { value: 'District', label: 'District' },
  { value: 'State-Wide', label: 'State-Wide' },
];

interface AddAgencyProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Agency>) => void;
  isLoading?: boolean;
}

const AddAgency: React.FC<AddAgencyProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  // Initialize with fields present in the form
  const initialFormValues: Partial<Agency> = {
    title: '',
    jurisdiction: '',
    authorize_type: '',
    number_of_schools: undefined,
    calendar_year: '',
    domain: '',
    annual_budget: undefined,
    number_of_impacted_students: undefined,
    access_school: false,
    years_operation: '',
  };

  const [formValues, setFormValues] = useState<Partial<Agency>>({
    title: '',
    home_url: '',
    // Initialize other fields from Agency type as needed
    jurisdiction: '', // Ensure jurisdiction is part of formValues
    authorize_type: '', // Ensure authorize_type is part of formValues
    access_school: false,
    status: 'active', // Default status to active or as per backend requirement
  });

  useEffect(() => {
    if (open) {
      setFormValues(initialFormValues);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Specific handler for DateInput
  const handleDateChange = (name: keyof Agency, date: string) => {
    setFormValues((prev) => ({ ...prev, [name]: date }));
  };

  const handleDropdownChange = (name: keyof Agency, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (newCheckedState: boolean) => {
    setFormValues((prev) => ({ ...prev, access_school: newCheckedState }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure numeric fields are numbers if they were input as strings
    const processedValues: Partial<Agency> = {
      ...formValues,
      number_of_schools: formValues.number_of_schools
        ? Number(formValues.number_of_schools)
        : undefined,
      annual_budget: formValues.annual_budget
        ? String(formValues.annual_budget)
        : undefined,
      number_of_impacted_students: formValues.number_of_impacted_students
        ? Number(formValues.number_of_impacted_students)
        : undefined,
    };
    onSubmit(processedValues);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[515px] bg-white p-0 flex flex-col gap-0 rounded-[8px]">
        <div className="flex-none">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Add New Agency
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <XMarkIcon className="w-6 h-6 text-slate-500 hover:text-slate-700" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form
            id="addAgencyForm"
            onSubmit={handleSubmit}
            className="p-6 space-y-4"
          >
            <CustomInput
              label="Agency Title"
              id="title"
              name="title"
              value={formValues.title || ''}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <Dropdown
                label="Jurisdiction"
                value={formValues.jurisdiction || ''}
                options={JURISDICTION_OPTIONS}
                onValueChange={(value) =>
                  handleDropdownChange('jurisdiction', value)
                }
                placeholder="Select Jurisdiction"
              />
              <Dropdown
                label="Authorize Type"
                value={formValues.authorize_type || ''}
                options={AUTHORIZE_TYPE_OPTIONS}
                onValueChange={(value) =>
                  handleDropdownChange('authorize_type', value)
                }
                placeholder="Select Authorize Type"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <CustomInput
                label="Number of Schools"
                id="number_of_schools"
                name="number_of_schools"
                type="number"
                value={String(formValues.number_of_schools || '')}
                onChange={handleChange}
              />
              <div className="flex flex-col gap-1">
                <Label htmlFor="calendar_year_input">Calendar Year</Label>
                <DateInput
                  id="calendar_year_input"
                  value={formValues.calendar_year || ''}
                  onChange={(date) => handleDateChange('calendar_year', date)}
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <CustomInput
                label="Domain"
                id="domain"
                name="domain"
                value={formValues.domain || ''}
                onChange={handleChange}
              />
              <CustomInput
                label="Annual Budget"
                id="annual_budget"
                name="annual_budget"
                type="text"
                value={String(formValues.annual_budget || '')}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 items-center">
              <CustomInput
                label="Number of Impacted Students"
                id="number_of_impacted_students"
                name="number_of_impacted_students"
                type="number"
                value={String(formValues.number_of_impacted_students || '')}
                onChange={handleChange}
              />
              <CustomInput
                label="Years of Operation"
                id="years_operation"
                name="years_operation"
                value={formValues.years_operation || ''}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                checked={formValues.access_school || false}
                onChange={handleSwitchChange}
              />
              <Label htmlFor="access_school_switch_label" className="mb-0">
                Access to Schools
              </Label>
            </div>
          </form>
        </div>

        <div className="flex-none border-t border-slate-200 bg-slate-50">
          <DialogFooter className="flex justify-end gap-3 p-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-[3px] border-slate-400 hover:border-slate-500 text-slate-700 hover:text-slate-800 p-[8px_16px]"
              type="button"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="addAgencyForm"
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-[3px] p-[8px_16px]"
              disabled={isLoading}
            >
              {isLoading ? 'Adding Agency...' : 'Add Agency'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAgency;
