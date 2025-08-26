import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { Dialog, DialogContent, DialogTitle } from '@/components/base/Dialog';
import { CustomInput } from '@/components/base/CustomInput';
import { Dropdown } from '@/components/base/Dropdown';
import { Button } from '@/components/base/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/Table';
import { CustomFieldDefinition } from '@/store/slices/customFieldDefinitionsSlice';
import { FileUploadInput } from '@/components/base/FileUploadInput';

const roleOptions = [
  { value: 'Agency_Admin', label: 'Agency Admin' },
  { value: 'Agency_User', label: 'Agency User' },
];

const features = [
  'Submissions',
  'Schools',
  'Reports',
  'Applications',
  'Complaints',
  'Accountability',
  'Reportwell University',
  'Transparency',
];

interface CreateNewUserDialogProps {
  open: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  control: Control<any>;
  errors: FieldErrors<any>;
  handleCreateUser: (e?: React.BaseSyntheticEvent) => void;
  handleCreateAndInviteUser: (e?: React.BaseSyntheticEvent) => void;
  customFieldDefinitions: CustomFieldDefinition[];
  permissions: Record<string, string>;
  onPermissionChange: (feature: string, value: string) => void;
  customFields: Record<string, string>;
  onCustomFieldChange: (field: string, value: string) => void;
  profileImage: string;
  onAvatarChange: (file: File | null) => void;
}

const CreateNewUserDialog: React.FC<CreateNewUserDialogProps> = ({
  open,
  onClose,
  isSubmitting,
  control,
  errors,
  handleCreateUser,
  handleCreateAndInviteUser,
  customFieldDefinitions,
  permissions,
  onPermissionChange,
  customFields,
  onCustomFieldChange,
  profileImage,
  onAvatarChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="min-w-[520px] p-0 gap-0 bg-white"
        showClose={false}
      >
        <DialogTitle hidden />
        <form onSubmit={handleCreateUser}>
          <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
            <h3 className="text-slate-700">Create New User</h3>
            <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
          </div>
          <div className="flex p-6 flex-col gap-4 items-center max-h-[440px] h-fit overflow-auto">
            <div className="flex flex-row gap-4 w-full">
              <Controller
                name="first_name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    placeholder="First Name"
                    className="w-full"
                    label="First Name"
                    required
                    error={errors.first_name?.message as string}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="last_name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    placeholder="Last Name"
                    label="Last Name"
                    className="w-full"
                    required
                    error={errors.last_name?.message as string}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="flex flex-row gap-4 w-full">
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    placeholder="Email"
                    label="Email"
                    className="w-full"
                    required
                    error={errors.email?.message as string}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    placeholder="(555) 555-5555"
                    label="Phone"
                    className="w-full"
                    error={errors.phone?.message as string}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="flex flex-row gap-4 w-full">
              <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    placeholder="Title"
                    label="Title"
                    className="flex flex-col gap-1 w-full"
                    error={errors.title?.message as string}
                    onChange={field.onChange}
                  />
                )}
              />
              <div className="flex flex-col gap-1 w-full">
                <Controller
                  name="role"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Dropdown
                      label="Role"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={roleOptions}
                      required
                      error={errors.role?.message as string}
                    />
                  )}
                />
              </div>
            </div>
            {/* Avatar Upload */}
            <div className="w-full">
              <FileUploadInput
                label="Profile Photo"
                allowedTypes={['.png', '.jpg', '.jpeg', '.gif']}
                multiple={false}
                onFilesSelected={(files: File[]) =>
                  onAvatarChange(files[0] || null)
                }
                className="w-full"
              />
              {profileImage && (
                <div className="flex flex-col items-center mt-2">
                  <img
                    src={profileImage}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-md object-cover"
                  />
                </div>
              )}
            </div>
            {/* Platform Permissions */}
            <div className="w-full">
              <h3 className="text-base font-medium mb-4">
                Platform Permissions
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Features</TableHead>
                    <TableHead className="text-center">Hidden</TableHead>
                    <TableHead className="text-center">View</TableHead>
                    <TableHead className="text-center">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((feature) => (
                    <TableRow key={feature}>
                      <TableCell>{feature}</TableCell>
                      {['hidden', 'view', 'edit'].map((perm) => (
                        <TableCell className="text-center" key={perm}>
                          <input
                            type="radio"
                            className="text-red-500"
                            name={`perm-${feature}`}
                            value={perm}
                            checked={permissions[feature] === perm}
                            onChange={() => onPermissionChange(feature, perm)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Custom Fields */}
            {customFieldDefinitions.length > 0 && (
              <div className="w-full flex flex-col gap-2">
                <h3 className="text-base font-medium mb-2">Custom Fields</h3>
                {customFieldDefinitions.map((def) => (
                  <CustomInput
                    key={def.Name}
                    label={def.Name}
                    value={customFields[def.Name] || ''}
                    onChange={(e) =>
                      onCustomFieldChange(def.Name, e.target.value)
                    }
                    required={false}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-row p-4 gap-2 justify-end border-t border-beige-300 bg-beige-50 rounded-b-lg w-full">
            <Button
              variant="outline"
              className="text-slate-700"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating User...' : 'Create User'}
            </Button>
            <Button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isSubmitting}
              onClick={handleCreateAndInviteUser}
            >
              {isSubmitting ? 'Creating and Inviting...' : 'Create and Invite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewUserDialog;
