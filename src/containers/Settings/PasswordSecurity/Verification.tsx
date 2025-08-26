import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

import VerificationCodeComponent from '@/components/Settings/PasswordSecuritySettings/VerificationCode';
import VerificationMethod from '@/components/Settings/PasswordSecuritySettings/VerificationMethod';
import BackUpCode from '@/components/Settings/PasswordSecuritySettings/BackUpCode';

import { MFAService } from '@/api/MFA';

import { MFAMethod } from '@/containers/Auth/index.types';
import { VerificationContact } from '../index.types';
import { RootState } from '@/store/index';
import { setCurrentUser } from '@/store/slices/authSlice';

interface VerificationProps {
  open: boolean;
  method: MFAMethod;
  onSuccess: () => void;
  onClose: () => void;
  verificationContact: Partial<VerificationContact>;
}

const Verification: React.FC<VerificationProps> = ({
  open,
  method,
  onSuccess,
  onClose,
  verificationContact,
}: VerificationProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [verificationCodeOpen, setVerificationCodeOpen] =
    useState<boolean>(open);
  const [verificationMethodOpen, setVerificationMethodOpen] =
    useState<boolean>(false);
  const [backUpCodeOpen, setBackUpCodeOpen] = useState<boolean>(false);
  const [verificationMethod, setVerificationMethod] =
    useState<MFAMethod>(method);

  const handleSendCode = async (selectedMethod: MFAMethod) => {
    try {
      if (selectedMethod === MFAMethod.TOTP) {
        setVerificationCodeOpen(true);
        setVerificationMethodOpen(false);
        return;
      }
      if (selectedMethod === MFAMethod.BACKUP_CODE) {
        setBackUpCodeOpen(true);
        setVerificationMethodOpen(false);
        return;
      }
      const data = { method: selectedMethod };

      setVerificationMethod(selectedMethod);
      setVerificationCodeOpen(true);
      setVerificationMethodOpen(false);
      await MFAService.sendMFACode(data);
    } catch {
      toast.error('Failed to send verification code');
    }
  };

  const handleResendCode = async (selectedMethod: MFAMethod) => {
    try {
      await MFAService.sendMFACode({ method: selectedMethod });
      toast.success('Verification code has been resent');
    } catch {
      toast.error('Failed to resend verification code');
    }
  };

  const handleVerifyBackupCode = async (code: string) => {
    try {
      await MFAService.verifyBackupCode(code);
      onSuccess();
    } catch {
      toast.error('Invalid backup code');
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      const response = await MFAService.verifyMFACode(code, verificationMethod);
      if (user && response?.mfa_method) {
        dispatch(
          setCurrentUser({
            user: { ...user, mfa_method: response.mfa_method },
          }),
        );
      }
      onSuccess();
    } catch {
      toast.error('Invalid verification code');
    }
  };

  const handleGotoMethodPage = () => {
    setVerificationCodeOpen(false);
    setVerificationMethodOpen(true);
    setBackUpCodeOpen(false);
  };

  const handleClose = () => {
    setVerificationCodeOpen(false);
    setVerificationMethodOpen(false);
    setBackUpCodeOpen(false);
    onClose();
  };

  useEffect(() => {
    if (open) {
      handleSendCode(method);
    }

    setVerificationCodeOpen(open);
    setVerificationMethod(method);
  }, [method, open]);

  if (!user) {
    return null;
  }

  return (
    <>
      <VerificationCodeComponent
        open={verificationCodeOpen}
        method={verificationMethod}
        onSubmit={handleVerifyCode}
        onClose={handleClose}
        gotoMethodPage={handleGotoMethodPage}
        verificationContact={verificationContact}
        resendCode={handleResendCode}
      />
      <VerificationMethod
        open={verificationMethodOpen}
        availableMethods={(user.mfa_method as MFAMethod[]) ?? []}
        onSubmit={handleSendCode}
        onClose={handleClose}
        verificationContact={verificationContact}
      />
      <BackUpCode
        open={backUpCodeOpen}
        onSubmit={handleVerifyBackupCode}
        onClose={handleClose}
        gotoMethodPage={handleGotoMethodPage}
      />
    </>
  );
};

export default Verification;
