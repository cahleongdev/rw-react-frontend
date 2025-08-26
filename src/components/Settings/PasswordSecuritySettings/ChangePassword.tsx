import React from 'react';
import { FieldErrors, Control, Controller } from 'react-hook-form';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

import { Dialog, DialogContent, DialogTitle } from '@/components/base/Dialog';
import { CustomInput } from '@/components/base/CustomInput';
import { Button } from '@/components/base/Button';

interface ValidationRule {
  text: string;
  valid: boolean;
}

export interface ChangePasswordForm {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

interface ChangePasswordComponentProps {
  open: boolean;
  onClose: () => void;
  control: Control<ChangePasswordForm>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => void;
  errors: FieldErrors<ChangePasswordForm>;
  isSubmitting: boolean;
  validationRules: ValidationRule[];
}

const ChangePasswordComponent = ({
  open,
  onClose,
  control,
  handleSubmit,
  errors,
  isSubmitting,
  validationRules,
}: ChangePasswordComponentProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[520px] bg-white rounded-lg p-0 gap-0"
        showClose={false}
      >
        <DialogTitle className="hidden" />
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
            <h3 className="text-slate-700">Change Password</h3>
            <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
          </div>
          <div className="p-6 flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-col gap-1 w-full">
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="Current Password"
                    required
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...field}
                    error={errors.currentPassword?.message as string}
                    className="w-full"
                    adornment={
                      <div
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeSlashIcon className="w-5 h-5 text-slate-400 absolute top-2 right-3 cursor-pointer" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-slate-400 absolute top-2 right-3 cursor-pointer" />
                        )}
                      </div>
                    }
                  />
                )}
              />
              {errors.currentPassword && (
                <div className="body2-regular text-red-700">
                  {errors.currentPassword.message as string}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="New Password"
                    required
                    type={showNewPassword ? 'text' : 'password'}
                    {...field}
                    error={errors.password?.message as string}
                    className="w-full"
                    adornment={
                      <div onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? (
                          <EyeSlashIcon className="w-5 h-5 text-slate-400 absolute top-2 right-3 cursor-pointer" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-slate-400 absolute top-2 right-3 cursor-pointer" />
                        )}
                      </div>
                    }
                  />
                )}
              />
              {errors.password && (
                <div className="body2-regular text-red-700">
                  {errors.password.message as string}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="Confirm New Password"
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...field}
                    error={errors.confirmPassword?.message as string}
                    className="w-full"
                    adornment={
                      <div
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="w-5 h-5 text-slate-400 absolute top-2 right-3 cursor-pointer" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-slate-400 absolute top-2 right-3 cursor-pointer" />
                        )}
                      </div>
                    }
                  />
                )}
              />
              {errors.confirmPassword && (
                <div className="body2-regular text-red-700">
                  {errors.confirmPassword.message as string}
                </div>
              )}
            </div>
            <div className="rounded-sm p-4 bg-teal-50 flex flex-col gap-2 w-full">
              {validationRules.map((rule) => (
                <div
                  className="flex flex-row items-center gap-2 body2-medium text-slate-700"
                  key={rule.text}
                >
                  {rule.valid ? (
                    <CheckCircleIcon className="w-4.5 h-4.5 text-green-500" />
                  ) : (
                    <XMarkIcon className="w-4.5 h-4.5 text-red-400" />
                  )}
                  {rule.text}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row p-4 gap-2 justify-end border-t border-beige-300 bg-beige-50 rounded-b-lg">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
              type="submit"
              disabled={isSubmitting}
            >
              Update Password
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordComponent;
