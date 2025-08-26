import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

import ChangePassword from '@/containers/Settings/PasswordSecurity/ChangePassword';
import Verification from '@/containers/Settings/PasswordSecurity/Verification';
import SetUpMFA from '@/containers/Settings/PasswordSecurity/SetUpMFA';
import { DataLoading } from '@/components/base/Loading';
import { Button } from '@/components/base/Button';

import { MFAService } from '@/api/MFA';

import { MFAMethod, MFAPMethod } from '@/containers/Auth/index.types';
import { RootState } from '@/store/index';
import { VerificationContact, SecurityPageEventTypes } from '../index.types';
import { setCurrentUser } from '@/store/slices/authSlice';

const PasswordSecuritySettings: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [setupMethod, setSetupMethod] = useState<MFAPMethod | null>(null);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [mfaContact, setMFAContact] = useState<Partial<VerificationContact>>(
    {},
  );

  const [stackEvent, setStackEvent] = useState<SecurityPageEventTypes>(
    SecurityPageEventTypes.NONE,
  );

  const handleGetMFAContact = async () => {
    setIsLoading(true);
    const response = await MFAService.getMFAContact();
    setMFAContact(response);
    setIsLoading(false);
  };

  const handleRemoveMFA = async (method: string) => {
    if (!user) {
      return;
    }
    try {
      const response = await MFAService.removeMFA(method);
      if (response && response.mfa_method) {
        dispatch(
          setCurrentUser({
            user: { ...user, mfa_method: response.mfa_method },
          }),
        );
      }
      toast.success('MFA removed successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove MFA');
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerification(false);
    if (stackEvent === SecurityPageEventTypes.NONE) {
      return;
    }
    switch (stackEvent) {
      case SecurityPageEventTypes.CHANGE_PASSWORD:
        setShowChangePassword(true);
        break;
      case SecurityPageEventTypes.APP_MFA_REMOVE:
        handleRemoveMFA(MFAMethod.TOTP);
        break;
      case SecurityPageEventTypes.PHONE_MFA_REMOVE:
        handleRemoveMFA(MFAMethod.SMS);
        break;
      case SecurityPageEventTypes.EMAIL_MFA_REMOVE:
        handleRemoveMFA(MFAMethod.EMAIL);
        break;
      case SecurityPageEventTypes.APP_MFA_EDIT:
        handleRemoveMFA(MFAMethod.TOTP);
        setSetupMethod(MFAPMethod.SCAN_QR);
        break;
      case SecurityPageEventTypes.PHONE_MFA_EDIT:
        handleRemoveMFA(MFAMethod.SMS);
        setSetupMethod(MFAPMethod.PHONE);
        break;
      case SecurityPageEventTypes.EMAIL_MFA_EDIT:
        handleRemoveMFA(MFAMethod.EMAIL);
        setSetupMethod(MFAPMethod.EMAIL);
        break;
      default:
        break;
    }
    setStackEvent(SecurityPageEventTypes.NONE);
  };

  // Reset all states
  const handleClose = () => {
    setShowChangePassword(false);
    setShowVerification(false);
    setSetupMethod(null);
    setStackEvent(SecurityPageEventTypes.NONE);
  };

  useEffect(() => {
    handleGetMFAContact();
  }, []);

  useEffect(() => {
    if (
      stackEvent === SecurityPageEventTypes.CHANGE_PASSWORD &&
      user?.mfa_method?.length === 0
    ) {
      setShowChangePassword(true);
      return;
    }

    if (stackEvent !== SecurityPageEventTypes.NONE) {
      setShowVerification(true);
    } else {
      setShowVerification(false);
    }
  }, [stackEvent, user]);

  if (!user || isLoading) {
    return <DataLoading />;
  }

  return (
    <div className="flex flex-col gap-6 grow">
      <h4 className="text-slate-950">Privacy & Security Settings</h4>
      <hr className="border border-secondary" />
      <div className="flex flex-row gap-4">
        <div className="body2-medium text-slate-700 w-[280px]">
          Change Password
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row w-[512px] justify-between">
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">Password</div>
              <div className="body2-regular text-slate-500">
                ***************
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setStackEvent(SecurityPageEventTypes.CHANGE_PASSWORD)
              }
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>
      <hr className="border border-secondary" />
      <div className="flex flex-row gap-4">
        <div className="body2-medium text-slate-700 w-[280px]">
          Multi-Step Authentication
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row w-[512px] justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">
                Authenticator app
              </div>
              {user.mfa_method?.includes(MFAMethod.TOTP) ? (
                <div className="body2-regular text-slate-500">Active</div>
              ) : (
                <div className="body2-regular text-slate-500">Disabled</div>
              )}
            </div>
            {user.mfa_method?.includes(MFAMethod.TOTP) ? (
              <div className="flex flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setStackEvent(SecurityPageEventTypes.APP_MFA_EDIT)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:text-red-600 hover:bg-red-600/10"
                  onClick={() =>
                    setStackEvent(SecurityPageEventTypes.APP_MFA_REMOVE)
                  }
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setSetupMethod(MFAPMethod.SCAN_QR);
                }}
              >
                Set Up
              </Button>
            )}
          </div>
          <hr className="border border-secondary" />
          <div className="flex flex-row w-[512px] justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">Phone</div>
              {user.mfa_method?.includes(MFAMethod.SMS) ||
              user.mfa_method?.includes(MFAMethod.VOICE) ? (
                <div className="body2-regular text-slate-500">
                  Active
                  <br />
                  {mfaContact.phone}
                </div>
              ) : (
                <div className="body2-regular text-slate-500">Disabled</div>
              )}
            </div>
            {user.mfa_method?.includes(MFAMethod.SMS) ||
            user.mfa_method?.includes(MFAMethod.VOICE) ? (
              <div className="flex flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setStackEvent(SecurityPageEventTypes.PHONE_MFA_EDIT)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:text-red-600 hover:bg-red-600/10"
                  onClick={() =>
                    setStackEvent(SecurityPageEventTypes.PHONE_MFA_REMOVE)
                  }
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setSetupMethod(MFAPMethod.PHONE);
                }}
              >
                Set Up
              </Button>
            )}
          </div>
          <hr className="border border-secondary" />
          <div className="flex flex-row w-[512px] justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="body2-medium text-slate-700">Email</div>
              {user.mfa_method?.includes(MFAMethod.EMAIL) ? (
                <div className="body2-regular text-slate-500">
                  Active
                  <br />
                  {mfaContact.email}
                </div>
              ) : (
                <div className="body2-regular text-slate-500">Disabled</div>
              )}
            </div>
            {user.mfa_method?.includes(MFAMethod.EMAIL) ? (
              <div className="flex flex-row gap-2">
                {/* We don't edit email MFA */}
                {/* <Button
                  variant="outline"
                  onClick={() =>
                    setStackEvent(SecurityPageEventTypes.EMAIL_MFA_EDIT)
                  }
                >
                  Edit
                </Button> */}
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:text-red-600 hover:bg-red-600/10"
                  onClick={() =>
                    setStackEvent(SecurityPageEventTypes.EMAIL_MFA_REMOVE)
                  }
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setSetupMethod(MFAPMethod.EMAIL);
                }}
              >
                Set Up
              </Button>
            )}
          </div>
        </div>
      </div>
      <hr className="border border-secondary" />
      <ChangePassword open={showChangePassword} onClose={handleClose} />
      <Verification
        open={showVerification}
        method={
          !user.mfa_method || user.mfa_method?.includes(MFAMethod.TOTP)
            ? MFAMethod.TOTP
            : user.mfa_method[0]
        }
        verificationContact={mfaContact}
        onClose={handleClose}
        onSuccess={handleVerificationSuccess}
      />
      <SetUpMFA setupMethod={setupMethod} onClose={handleClose} />
    </div>
  );
};

export default PasswordSecuritySettings;
