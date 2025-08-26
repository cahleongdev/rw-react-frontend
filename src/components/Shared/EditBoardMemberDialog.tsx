import React from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { CustomInput } from '@/components/base/CustomInput';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';

interface EditBoardMemberDialogProps {
  open: boolean;
  onClose: () => void;
  boardMemberName?: string;
  formData: Partial<SchoolUser>;
  isSubmitting: boolean;
  error?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditBoardMemberDialog: React.FC<EditBoardMemberDialogProps> = ({
  open,
  onClose,
  boardMemberName,
  formData,
  isSubmitting,
  error,
  onInputChange,
  onSubmit,
}) => {
  const dialogTitle = boardMemberName
    ? `Edit ${boardMemberName}`
    : 'Edit Board Member';

  // Helper to format date for input type='date' (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | undefined | null) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      // Removed _e
      return ''; // Return empty if date is invalid
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[515px] bg-white p-0 flex flex-col gap-0 rounded-[8px]">
        <div className="flex-none">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              {dialogTitle}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-slate-500 hover:text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form
            id="editBoardMemberForm"
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

            {/* Role is typically fixed for Board Member, so not editable here */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInput
                label="Start Term"
                name="start_term"
                type="date"
                value={formatDateForInput(formData.start_term)}
                onChange={onInputChange}
                placeholder="MM/DD/YYYY"
              />
              <CustomInput
                label="End Term"
                name="end_term"
                type="date"
                value={formatDateForInput(formData.end_term)}
                onChange={onInputChange}
                placeholder="MM/DD/YYYY"
              />
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="editBoardMemberForm"
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-[3px] p-[8px_16px]"
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
