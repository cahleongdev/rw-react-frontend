import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '@/components/base/Button';
import SecureMethod from '@components/Shared/MFA/SecureMethod';
import ScanQR from '@components/Shared/MFA/ScanQR';
import VerificationCode from '@components/Shared/MFA/VerificationCode';
import PhoneVerification from '@components/Shared/MFA/PhoneVerification';
import EmailVerification from '@components/Shared/MFA/EmailVerification';
import BackUpCode from '@components/Shared/MFA/BackUpCode';

import { RootState } from '@store/index';
import {
  MFAMethod,
  MFAPage,
  PhoneVerificationMethod,
} from '@/containers/Auth/index.types';

import { MFAService } from '@api/MFA';

const EnableMFA = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigator = useNavigate();

  const [page, setPage] = useState<MFAPage | null>(null);
  const [method, setMethod] = useState<MFAMethod>(MFAMethod.TOTP);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [phoneMethod, setPhoneMethod] = useState<PhoneVerificationMethod>(
    PhoneVerificationMethod.SMS,
  );

  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleGenerateTOTP = async () => {
    try {
      if (method === MFAMethod.TOTP) {
        const response = await MFAService.generateTOTP(method);
        setQrCode(response.qr_code);
        setSecret(response.secret);
        setPage(MFAPage.QR_VERIFICATION);
      } else {
        setPage(
          method === MFAMethod.EMAIL
            ? MFAPage.EMAIL_VERIFICATION
            : MFAPage.PHONE_VERIFICATION,
        );
      }
    } catch (error) {
      console.error(error);
      // toast.error('Failed to generate MFA setup');
    }
  };

  const handleVerifyCode = async (verificationCode: string) => {
    try {
      const response = await MFAService.verifyMFACode(verificationCode, method);
      setBackupCodes(response.backup_codes);
      setPage(MFAPage.BACKUP_CODES);
      toast.success(response.message);
    } catch (error) {
      console.error(error);
      toast.error('Invalid verification code');
    }
  };

  const handleSendMFACode = async () => {
    try {
      if (method !== MFAMethod.EMAIL && !phoneNumber) {
        toast.error('Please enter a phone number');
        return;
      }

      if (method !== MFAMethod.EMAIL) {
        const isValid =
          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
            phoneNumber.replace(/\s/g, ''),
          );
        if (!isValid) {
          toast.error('Please enter a valid phone number');
          return;
        }
      }

      const data =
        method === MFAMethod.EMAIL
          ? { method, email }
          : { method, phone: phoneNumber, phone_method: phoneMethod };

      const response = await MFAService.sendMFACode(data);
      setPage(MFAPage.VERIFICATION_CODE);
      toast.success(response.message);
    } catch (error) {
      console.error(error);
      toast.error('Failed to send verification code');
    }
  };

  const gotoMethodPage = () => {
    setPage(MFAPage.MFA_METHOD);
  };

  const handleRegenerateBackupCodes = async () => {
    try {
      const response = await MFAService.generateBackupCodes();
      setBackupCodes(response.backup_codes);
    } catch (error) {
      console.error(error);
      toast.error('Failed to regenerate backup codes');
    }
  };

  useEffect(() => {
    setPhoneNumber(user?.phone_number || '');
    setEmail(user?.email || '');
  }, [user]);

  return (
    <div className="flex h-full">
      <div className="flex h-full w-1/2 px-10 justify-center items-center">
        <div className="w-[640px] flex flex-col items-center">
          <div className="title text-slate-950 mb-2 text-center">
            Enable Multi-Factor Authentication (MFA)
          </div>
          <div className="h5 mb-6 text-slate-700 text-center">
            Enabling MFA is one of the most effective ways to secure your
            account against phishing, breaches, and credential theft.
            <br />
            <br />
            All users are required to activate MFA.
          </div>
          <Button
            className="w-[320px] text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
            onClick={() => setPage(MFAPage.MFA_METHOD)}
          >
            Enable MFA
          </Button>
        </div>
      </div>
      <div className="flex h-full w-1/2 p-4">
        <div className="w-full rounded-[10px] bg-[linear-gradient(180deg,_#F97316,_#f973161a)]">
          <div className="flex flex-col gap-4 justify-center items-center h-full">
            <img
              src="/assets/images/logos/reportwell-border.svg"
              alt="Reportwell Logo"
              width={200}
              height={178}
            />
          </div>
        </div>
      </div>
      <SecureMethod
        open={page === MFAPage.MFA_METHOD}
        method={method}
        setMethod={setMethod}
        onSubmit={handleGenerateTOTP}
        onClose={() => setPage(null)}
      />
      <ScanQR
        open={page === MFAPage.QR_VERIFICATION}
        code={secret}
        qrCode={qrCode}
        onSubmit={() => setPage(MFAPage.VERIFICATION_CODE)}
        onClose={() => setPage(null)}
        gotoMethodPage={gotoMethodPage}
      />
      <PhoneVerification
        open={page === MFAPage.PHONE_VERIFICATION}
        onSubmit={handleSendMFACode}
        onClose={() => setPage(null)}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        phoneMethod={phoneMethod}
        setPhoneMethod={setPhoneMethod}
        gotoMethodPage={gotoMethodPage}
      />
      <EmailVerification
        open={page === MFAPage.EMAIL_VERIFICATION}
        email={email}
        onSubmit={handleSendMFACode}
        onClose={() => setPage(null)}
        gotoMethodPage={gotoMethodPage}
      />
      <VerificationCode
        open={page === MFAPage.VERIFICATION_CODE}
        method={method}
        onSubmit={handleVerifyCode}
        onClose={() => setPage(null)}
        resendCode={handleSendMFACode}
        gotoMethodPage={gotoMethodPage}
      />
      <BackUpCode
        open={page === MFAPage.BACKUP_CODES}
        codes={backupCodes}
        onClose={() => navigator('/home')}
        onRegenerate={handleRegenerateBackupCodes}
      />
    </div>
  );
};

export default EnableMFA;
