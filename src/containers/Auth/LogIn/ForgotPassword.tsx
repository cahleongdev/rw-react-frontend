import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ForgotPasswordComponent from '@/components/Auth/LogIn/ForgotPassword';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    navigate('/reset-method', { state: { email } });
  };

  return (
    <ForgotPasswordComponent
      email={email}
      setEmail={setEmail}
      error={error}
      onSubmit={handleSubmit}
    />
  );
};

export default ForgotPassword;
