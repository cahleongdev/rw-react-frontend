import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import ChangePasswordComponent from '@/components/Settings/PasswordSecuritySettings/ChangePassword';
import { changePasswordSchema } from '@/containers/Settings/index.types';
import authApi from '@/api/user';

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ open, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  // For live validation rules display
  const newPassword = watch('password', '');

  // Password rules for display
  const validationRules = [
    {
      text: 'At least 8 characters',
      valid: newPassword.length >= 8,
    },
    {
      text: 'Upper and lower case letter',
      valid: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword),
    },
    {
      text: 'At least one number',
      valid: /[0-9]/.test(newPassword),
    },
    {
      text: 'At least one special character',
      valid: /[^A-Za-z0-9]/.test(newPassword),
    },
  ];

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await authApi.changePassword(data.currentPassword, data.password);
      reset();
      onClose();
      toast.success('Your password has been changed');
    } catch (error) {
      console.log(error);
      toast.error('Failed to change password');
    }
  };

  return (
    <ChangePasswordComponent
      open={open}
      onClose={onClose}
      control={control}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
      isSubmitting={isSubmitting}
      validationRules={validationRules}
    />
  );
};

export default ChangePassword;
