import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import MFACodeVerificationComponent from '@/components/Auth/LogIn/MFACodeVerification';
import MFABackupCodeVerificationComponent from '@/components/Auth/LogIn/MFABackupCodeVerification';
import {
  clearMFAState,
  verifyMFALogin,
  sendMFALoginCode,
} from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import { MFAMethod } from '@/containers/Auth/index.types';

const MFACodeVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { mfaLoading } = useSelector((state: RootState) => state.auth);

  const selectedMethod = location.state?.selectedMethod;
  const isBackupCode = selectedMethod === MFAMethod.BACKUP_CODE;

  // Use different code lengths for backup codes (8) vs regular codes (6)
  const codeLength = isBackupCode ? 8 : 6;
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(''));
  const [codeSent, setCodeSent] = useState(
    selectedMethod === MFAMethod.TOTP || isBackupCode,
  );

  // Redirect to method selection if no method is selected
  useEffect(() => {
    if (!selectedMethod) {
      navigate('/mfa-method-selection');
    }
  }, [selectedMethod, navigate]);

  const handleSendCode = useCallback(async () => {
    if (selectedMethod === MFAMethod.TOTP || isBackupCode) {
      setCodeSent(true);
      return;
    }

    try {
      await dispatch(sendMFALoginCode(selectedMethod)).unwrap();
      setCodeSent(true);
      toast.success('Verification code sent');
    } catch (error) {
      toast.error(error as string);
    }
  }, [selectedMethod, dispatch, isBackupCode]);

  // Auto-send code for non-TOTP and non-backup-code methods when component mounts
  useEffect(() => {
    if (selectedMethod !== MFAMethod.TOTP && !isBackupCode && !codeSent) {
      handleSendCode();
    }
  }, [selectedMethod, codeSent, handleSendCode, isBackupCode]);

  const handleVerifyCode = async () => {
    const verificationCode = isBackupCode
      ? code.join('') // Format as 8-character string for backup codes
      : code.join(''); // Regular format for other codes

    const expectedLength = isBackupCode ? 8 : 6;
    if (code.filter((c) => c).length !== expectedLength) {
      toast.error(`Please enter a ${expectedLength}-character code`);
      return;
    }

    // Temporary debugging for backup codes
    if (isBackupCode) {
      console.log('Debug - Backup code verification:');
      console.log('- Raw code array:', code);
      console.log('- Formatted code:', verificationCode);
      console.log('- Code length:', verificationCode.length);
      console.log('- Method:', selectedMethod);
    }

    try {
      await dispatch(
        verifyMFALogin({ code: verificationCode, method: selectedMethod }),
      ).unwrap();
      toast.success('Login successful');
    } catch (error) {
      console.error('MFA verification error:', error);
      toast.error(error as string);
      // Clear the code on error
      setCode(Array(codeLength).fill(''));
    }
  };

  const handleBack = () => {
    navigate('/mfa-method-selection');
  };

  const handleBackToLogin = () => {
    dispatch(clearMFAState());
    navigate('/login');
  };

  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
  };

  if (!selectedMethod) {
    return null; // Will redirect in useEffect
  }

  // Render backup code component for backup codes
  if (isBackupCode) {
    return (
      <MFABackupCodeVerificationComponent
        code={code}
        mfaLoading={mfaLoading}
        onCodeChange={handleCodeChange}
        onVerifyCode={handleVerifyCode}
        onBack={handleBack}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  // Render regular MFA code component for other methods
  return (
    <MFACodeVerificationComponent
      selectedMethod={selectedMethod}
      code={code}
      codeSent={codeSent}
      mfaLoading={mfaLoading}
      onCodeChange={handleCodeChange}
      onVerifyCode={handleVerifyCode}
      onSendCode={handleSendCode}
      onBack={handleBack}
      onBackToLogin={handleBackToLogin}
    />
  );
};

export default MFACodeVerification;
