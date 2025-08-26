import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { loginUser } from '@/store/slices/authSlice';
import { selectAuthLoading, selectAuthError } from '@/store/types';
import { AppDispatch, RootState } from '@/store';

import LogInComponent from '@/components/Auth/LogIn/LogIn';
import { MFAMethod } from '../index.types';

const LogIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const { mfaRequired, mfaMethods } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleSubmit = async () => {
    await dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Navigate to MFA verification page if required
  useEffect(() => {
    if (mfaRequired) {
      // Get the first available method and navigate directly to verification
      const uniqueMethods = [...new Set(mfaMethods)];
      const methodOrder = [
        MFAMethod.TOTP,
        MFAMethod.SMS,
        MFAMethod.EMAIL,
        MFAMethod.VOICE,
      ];
      const sortedMethods = methodOrder.filter((method) =>
        uniqueMethods.includes(method as string),
      );
      const firstMethod = sortedMethods[0];
      navigate('/mfa-code-verification', {
        state: { selectedMethod: firstMethod },
      });
    }
  }, [mfaRequired, mfaMethods, navigate]);

  return (
    <LogInComponent
      isLoading={isLoading}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      showPrivacy={showPrivacy}
      setShowPrivacy={setShowPrivacy}
      handleSubmit={handleSubmit}
    />
  );
};

export default LogIn;
