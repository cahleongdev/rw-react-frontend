import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/Dialog';

import { Button } from '@/components/base/Button';
import { CustomInput } from '@/components/base/CustomInput';
import { SchoolUser } from '@/store/slices/schoolUsersSlice'; // Assuming SchoolUser type

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  userName?: string; // For the dialog title, e.g., "Edit John Doe"
  formData: Partial<SchoolUser>; // Use Partial if not all fields are always present/editable
  isSubmitting: boolean;
  error?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onClose,
  userName,
  formData,
  isSubmitting,
  error,
  onInputChange,
  onSubmit,
}) => {
  const dialogTitle = userName ? `Edit ${userName}` : 'Edit User';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[515px] bg-white p-0 flex flex-col gap-0 rounded-lg"
        showClose={false}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {dialogTitle}
              </h3>
              <XMarkIcon
                className="w-6 h-6 text-slate-500 hover:text-slate-700 cursor-pointer"
                onClick={onClose}
              />
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <form
            id="editUserForm"
            onSubmit={onSubmit}
            className="p-6 flex flex-col gap-4"
          >
            {error && (
              <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-md mb-3">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInput
                label="First Name"
                name="first_name"
                value={formData.first_name || ''}
                onChange={onInputChange}
                placeholder="Enter first name"
                required
              />
              <CustomInput
                label="Last Name"
                name="last_name"
                value={formData.last_name || ''}
                onChange={onInputChange}
                placeholder="Enter last name"
                required
              />
            </div>

            <CustomInput
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={onInputChange}
              placeholder="Enter email"
              required
            />

            <CustomInput
              label="Phone"
              name="phone_number"
              type="tel"
              value={formData.phone_number || ''}
              onChange={onInputChange}
              placeholder="(555) 555-5555"
            />

            <CustomInput
              label="Title (optional)"
              name="title"
              value={formData.title || ''}
              onChange={onInputChange}
              placeholder="Enter title"
            />
          </form>
        </div>

        <div className="flex-none border-t border-slate-200 bg-slate-50">
          <DialogFooter className="flex justify-end gap-3 p-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-[3px] border-slate-400 hover:border-slate-500 text-slate-700 hover:text-slate-800 p-[8px_16px]"
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="editUserForm"
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-[3px] p-[8px_16px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
