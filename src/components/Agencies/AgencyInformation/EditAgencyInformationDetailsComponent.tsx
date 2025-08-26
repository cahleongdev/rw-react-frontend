import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { CustomInput } from '@/components/base/CustomInput';
import { Button } from '@/components/base/Button';
import { Dropdown } from '@/components/base/Dropdown';
import { DateInput } from '@/components/base/DateInput';
import Switch from '@/components/base/Switch';
import { Label } from '@/components/base/Label';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Options for dropdowns - consider moving to a shared constants file if used elsewhere
const JURISDICTION_OPTIONS = [
  { value: 'State', label: 'State' },
  { value: 'City', label: 'City' },
  { value: 'Country', label: 'Country' },
  { value: 'Other', label: 'Other' },
];

const AUTHORIZE_TYPE_OPTIONS = [
  { value: 'University', label: 'University' },
  { value: 'County', label: 'County' },
  { value: 'District', label: 'District' },
  { value: 'State-Wide', label: 'State-Wide' },
];

const schema = z.object({
  agencyName: z.string().min(1, 'You must enter an Agency name'),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  county: z.string().optional(),
  yearsOperation: z.string().optional(),
  jurisdiction: z.string().optional(),
  authorize_type: z.string().optional(),
  number_of_schools: z.number().optional(),
  calendar_year: z.string().optional(), // Assuming YYYY-MM-DD format
  domain: z.string().optional(),
  annual_budget: z.string().optional(), // Storing as string, conversion handled in container
  number_of_impacted_students: z.number().optional(),
  access_school: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditAgencyInformationDetailsProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  initialValues: FormValues;
  isLoading?: boolean; // Added for submit button state
}

const EditAgencyInformationDetailsComponent: React.FC<
  EditAgencyInformationDetailsProps
> = ({ open, onClose, onSubmit, initialValues, isLoading = false }) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    if (open) {
      reset(initialValues);
    }
  }, [open, initialValues, reset]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[520px] bg-white rounded-lg p-0 gap-0"
        showClose={false}
      >
        <DialogTitle className="hidden" />
        <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-slate-700">Edit Agency Information</h3>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} id="editAgencyInformationForm">
          <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            {/* Existing Fields */}
            <Controller
              control={control}
              name="agencyName"
              render={({ field, fieldState }) => (
                <CustomInput
                  placeholder="Agency Name"
                  label="Agency Name"
                  required
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="streetAddress"
              render={({ field, fieldState }) => (
                <CustomInput
                  placeholder="Street Address"
                  label="Street Address"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="city"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="City"
                    label="City"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="state"
                render={({ field, fieldState }) => (
                  <CustomInput
                    placeholder="State"
                    label="State"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <Controller
              control={control}
              name="county"
              render={({ field, fieldState }) => (
                <CustomInput
                  placeholder="County"
                  label="County"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="yearsOperation"
              render={({ field, fieldState }) => (
                <CustomInput
                  placeholder="Years in Operation"
                  label="Years in Operation"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            {/* New Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="jurisdiction"
                render={({ field }) => (
                  <Dropdown
                    label="Jurisdiction"
                    value={field.value || ''}
                    options={JURISDICTION_OPTIONS}
                    onValueChange={field.onChange}
                    placeholder="Select Jurisdiction"
                    // error={fieldState.error?.message} // Dropdown might not have error prop
                  />
                )}
              />
              <Controller
                control={control}
                name="authorize_type"
                render={({ field }) => (
                  <Dropdown
                    label="Authorize Type"
                    value={field.value || ''}
                    options={AUTHORIZE_TYPE_OPTIONS}
                    onValueChange={field.onChange}
                    placeholder="Select Authorize Type"
                    // error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="number_of_schools"
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Number of Schools"
                    type="number"
                    placeholder="e.g., 10"
                    error={fieldState.error?.message}
                    {...field}
                    value={field.value === undefined ? '' : String(field.value)} // Handle number input value
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name="calendar_year"
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`calendar_year_input_${field.name}`}>
                      Calendar Year
                    </Label>
                    <DateInput
                      id={`calendar_year_input_${field.name}`}
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="YYYY-MM-DD"
                      // error={fieldState.error?.message} // DateInput might not have error prop
                    />
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="domain"
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Domain"
                    placeholder="example.com"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="annual_budget"
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Annual Budget"
                    placeholder="e.g., 100000"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>

            <Controller
              control={control}
              name="number_of_impacted_students"
              render={({ field, fieldState }) => (
                <CustomInput
                  label="Number of Impacted Students"
                  type="number"
                  placeholder="e.g., 500"
                  error={fieldState.error?.message}
                  {...field}
                  value={field.value === undefined ? '' : String(field.value)} // Handle number input value
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />
              )}
            />

            <div className="flex items-center space-x-2 pt-2">
              <Controller
                control={control}
                name="access_school"
                render={({ field }) => (
                  <Switch
                    checked={field.value || false}
                    onChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="access_school_switch" className="mb-0">
                Access to Schools
              </Label>
            </div>
          </div>
          <div className="flex-none border-t border-slate-200 bg-slate-50 rounded-b-lg">
            <DialogFooter className="flex justify-end gap-3 p-4">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="editAgencyInformationForm"
                className="bg-blue-500 body3-semibold text-white leading-[1.0] hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgencyInformationDetailsComponent;
