import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import ScanQR from '@/components/Shared/MFA/ScanQR';
import PhoneVerification from '@/components/Shared/MFA/PhoneVerification';
import EmailVerification from '@/components/Shared/MFA/EmailVerification';
import VerificationCode from '@/components/Shared/MFA/VerificationCode';
import BackUpCode from '@/components/Shared/MFA/BackUpCode';
import { Loading } from '@/components/base/Loading';

import {
  MFAMethod,
  PhoneVerificationMethod,
  MFAPage,
  MFAPMethod,
} from '@/containers/Auth/index.types';
import { MFAService } from '@/api/MFA';
import { setCurrentUser } from '@store/slices/authSlice';
import { RootState } from '@store/index';

interface SetUpMFAProps {
  setupMethod: MFAPMethod | null;
  onClose: () => void;
}

const SetUpMFA = ({ setupMethod, onClose }: SetUpMFAProps) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState<MFAPage | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneMethod, setPhoneMethod] = useState<PhoneVerificationMethod>(
    PhoneVerificationMethod.SMS,
  );
  const [qrCode, setQrCode] = useState(''); // base64 string
  const [secret, setSecret] = useState(''); // TOTP secret
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationMethod, setVerificationMethod] = useState<MFAMethod>(
    MFAMethod.TOTP,
  );

  const handleGenerateTOTP = async () => {
    const res = await MFAService.generateTOTP(MFAMethod.TOTP);
    setQrCode(res.qr_code);
    setSecret(res.secret);
  };

  const handleRegenerateBackupCodes = async () => {
    const res = await MFAService.generateBackupCodes();
    setBackupCodes(res.backup_codes);
  };

  const handleSendMFACode = async (method: MFAMethod) => {
    try {
      await MFAService.sendMFACode({
        method,
        phone: phoneNumber,
        email: user?.email,
        phone_method: phoneMethod,
      });
      setVerificationMethod(method);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleVerifyCode = async (verificationCode: string) => {
    try {
      const response = await MFAService.verifyMFACode(
        verificationCode,
        verificationMethod,
      );
      if (user && response?.mfa_method) {
        dispatch(
          setCurrentUser({
            user: { ...user, mfa_method: response.mfa_method },
          }),
        );
      }
      setBackupCodes(response.backup_codes);
      setPage(MFAPage.BACKUP_CODES);
      toast.success(response.message);
    } catch (error) {
      console.error(error);
      toast.error('Invalid verification code');
    }
  };

  const handleResendCode = async () => {
    try {
      await handleSendMFACode(verificationMethod);
      toast.success('Verification code has been resent');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleSendPhoneCode = async () => {
    try {
      await handleSendMFACode(phoneMethod as unknown as MFAMethod);
      setPage(MFAPage.VERIFICATION_CODE);
      toast.success('Verification code has been sent');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleSendEmailCode = async () => {
    try {
      await handleSendMFACode(MFAMethod.EMAIL);
      setPage(MFAPage.VERIFICATION_CODE);
      toast.success('Verification code has been sent');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleSubmitFromQR = () => {
    setVerificationMethod(MFAMethod.TOTP);
    setPage(MFAPage.VERIFICATION_CODE);
  };

  const handleClose = () => {
    setPage(null);
    onClose();
  };

  useEffect(() => {
    if (page === MFAPage.QR_VERIFICATION) {
      handleGenerateTOTP();
    }
  }, [page]);

  useEffect(() => {
    if (setupMethod === MFAPMethod.SCAN_QR) {
      setPage(MFAPage.QR_VERIFICATION);
    } else if (setupMethod === MFAPMethod.PHONE) {
      setPage(MFAPage.PHONE_VERIFICATION);
    } else if (setupMethod === MFAPMethod.EMAIL) {
      setPage(MFAPage.EMAIL_VERIFICATION);
    } else {
      setPage(null);
    }
  }, [setupMethod]);

  if (!user) return <Loading />;

  return (
    <>
      <ScanQR
        open={page === MFAPage.QR_VERIFICATION}
        onClose={handleClose}
        onSubmit={handleSubmitFromQR}
        code={secret}
        qrCode={qrCode}
      />
      <PhoneVerification
        open={page === MFAPage.PHONE_VERIFICATION}
        onClose={handleClose}
        onSubmit={handleSendPhoneCode}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        phoneMethod={phoneMethod}
        setPhoneMethod={setPhoneMethod}
      />
      <EmailVerification
        open={page === MFAPage.EMAIL_VERIFICATION}
        onClose={handleClose}
        onSubmit={handleSendEmailCode}
        email={user?.email}
      />
      <VerificationCode
        open={page === MFAPage.VERIFICATION_CODE}
        onClose={handleClose}
        onSubmit={handleVerifyCode}
        method={verificationMethod}
        resendCode={handleResendCode}
      />
      <BackUpCode
        open={page === MFAPage.BACKUP_CODES}
        onClose={handleClose}
        codes={backupCodes}
        onRegenerate={handleRegenerateBackupCodes}
      />
    </>
  );
};

export default SetUpMFA;
