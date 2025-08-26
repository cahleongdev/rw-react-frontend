import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import authService from '@api/user';
import ResetPasswordComponent from '@/components/Auth/LogIn/ResetPassword';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const rules = [
    { text: 'At least 8 characters', valid: password.length >= 8 },
    {
      text: 'Upper and lower case letters',
      valid: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    { text: 'At least one number', valid: /[0-9]/.test(password) },
    {
      text: 'At least one special character',
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const validateToken = async () => {
      try {
        await authService.validateResetToken(token);
      } catch (error) {
        console.error('Error validating reset token:', error);
        navigate('/login');
      }
    };

    validateToken();
  }, [token, navigate]);

  const handleResetPassword = async () => {
    if (!token) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!rules.every((rule) => rule.valid)) {
      setError('Please ensure all password requirements are met');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(token, password);
      navigate('/reset-password-complete');
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetPasswordComponent
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      rules={rules}
      error={error}
      loading={loading}
      onSubmit={handleResetPassword}
    />
  );
};

export default ResetPassword;
