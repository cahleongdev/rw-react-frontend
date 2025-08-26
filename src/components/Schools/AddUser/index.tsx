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
import { Dropdown } from '@/components/base/Dropdown';
import { Input } from '@/components/base/Input';

import {
  XCircleIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon as XIcon, // Keep XIcon if used elsewhere, though base dialog handles its own X
} from '@heroicons/react/24/outline';

import { SchoolResponse } from '@/store/slices/schoolsSlice';
import { CustomFieldDefinition } from '@/store/slices/customFieldDefinitionsSlice';

import type { ValidationErrors } from '@/utils/validation';

import { USER_ROLES } from '@/constants/userRoles';

const roleOptions = [
  { value: 'School_Admin', label: USER_ROLES.School_Admin },
  { value: 'School_User', label: USER_ROLES.School_User },
  { value: 'Board_Member', label: USER_ROLES.Board_Member }, // This was changed to View Only earlier
];

// const features = [ // This is no longer used
//  'Submissions',
//  'Schools',
//  'Reports',
//  'Applications',
//  'Complaints',
//  'Accountability',
//  'Reportwell University',
//  'Transparency',
// ];

export interface AddUserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  title: string;
  role: string;
  is_active: boolean;
  status: string;
  profile_image: string;
  view_only: boolean;
  schools: string[];
  custom_fields: Record<string, string>;
}

interface AddUserProps {
  open: boolean;
  onClose: () => void;
  formData: AddUserFormData;
  assignedSchoolDetails: SchoolResponse[];
  validationErrors: ValidationErrors;
  error: string;
  isSubmitting: boolean;
  createAnother: boolean;
  selectedFile: File | null;
  isAddingSchoolInline: boolean;
  schoolSearchQueryInline: string;
  searchResultsInline: SchoolResponse[];
  customFieldDefinitions: CustomFieldDefinition[];
  selectedSchoolInline: SchoolResponse | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomFieldChange: (
    fieldName: string,
    value: string,
    fieldType?: string,
  ) => void;
  onCreateAnotherChange: (checked: boolean) => void;
  onFileChange: (file: File | null) => void;
  onSchoolSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSchoolSelect: (school: SchoolResponse) => void;
  onConfirmAddSchool: () => void;
  onCancelAddSchool: () => void;
  onRemoveSchool: (schoolId: string) => void;
  onRoleChange: (value: string) => void;
  onViewOnlyChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddUser: React.FC<AddUserProps> = ({
  open,
  onClose,
  formData,
  assignedSchoolDetails,
  validationErrors,
  error,
  isSubmitting,
  createAnother,
  selectedFile,
  isAddingSchoolInline,
  schoolSearchQueryInline,
  searchResultsInline,
  customFieldDefinitions,
  selectedSchoolInline,
  onInputChange,
  onCustomFieldChange,
  onCreateAnotherChange,
  onFileChange,
  onSchoolSearchChange,
  onSchoolSelect,
  onConfirmAddSchool,
  onCancelAddSchool,
  onRemoveSchool,
  onRoleChange,
  onViewOnlyChange,
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
            Add User
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {' '}
          {/* Form content wrapper */}
          <form
            id="createUserForm"
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

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Title (optional)"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                placeholder="Enter title"
              />
              <Dropdown
                label="Role"
                value={formData.role}
                onValueChange={onRoleChange}
                options={roleOptions}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="viewOnly"
                checked={formData.view_only}
                onCheckedChange={onViewOnlyChange}
              />
              <label
                htmlFor="viewOnly"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                View only
              </label>
            </div>

            <div className="border border-dashed border-slate-300 rounded-lg p-4">
              <div className="flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onFileChange(file);
                  }}
                  accept="image/*"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={formData.profile_image}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <span className="text-sm text-blue-500">
                        Change image
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-blue-500">
                        Click to upload a profile image
                      </span>
                      <br />
                      or drag and drop
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-medium mb-4">Assigned Schools</h3>
              {assignedSchoolDetails.length > 0 && (
                <div className="flex flex-col gap-2 mb-2">
                  {assignedSchoolDetails.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center justify-between border-b border-slate-200 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{school.name}</span>
                          {school.type && (
                            <span className="text-sm text-slate-500">
                              {school.type}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 hover:text-red-500"
                        onClick={() => onRemoveSchool(school.id)}
                      >
                        <span className="sr-only">Remove school</span>
                        <XCircleIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {isAddingSchoolInline ? (
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search for school to add"
                      value={schoolSearchQueryInline}
                      onChange={onSchoolSearchChange}
                      className="w-full"
                    />
                    {searchResultsInline.length > 0 &&
                      !selectedSchoolInline && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {searchResultsInline.map((school) => (
                            <div
                              key={school.id}
                              className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
                              onClick={() => onSchoolSelect(school)}
                            >
                              {school.name}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  {selectedSchoolInline && (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={onConfirmAddSchool}
                        type="button"
                      >
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={onCancelAddSchool}
                        type="button"
                      >
                        <XIcon className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                  {!selectedSchoolInline && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 self-end"
                      onClick={onCancelAddSchool}
                      type="button"
                    >
                      <XIcon className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="flex text-blue-500 h-[38px] py-2 gap-2 w-[120px]"
                  onClick={() => onCancelAddSchool()}
                >
                  <PlusIcon className="w-4 h-4" />
                  Add school
                </Button>
              )}
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
                  No custom fields defined for users.
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
              Create another user after this one
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
              form="createUserForm"
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-[3px] p-[8px_12px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
