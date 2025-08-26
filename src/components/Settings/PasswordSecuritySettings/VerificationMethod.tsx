import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';

import { MFAMethod } from '@/containers/Auth/index.types';
import { VerificationContact } from '@/containers/Settings/index.types';

interface VerificationMethodProps {
  open: boolean;
  availableMethods: MFAMethod[];
  verificationContact: Partial<VerificationContact>;
  onSubmit: (method: MFAMethod) => void;
  onClose: () => void;
}

const VerificationMethod: React.FC<VerificationMethodProps> = ({
  availableMethods,
  onSubmit,
  onClose,
  open,
  verificationContact,
}: VerificationMethodProps) => {
  const [method, setMethod] = useState(MFAMethod.TOTP);

  const handleSubmit = () => {
    onSubmit(method);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="w-[680px] p-0 gap-0 bg-white" showClose={false}>
        <DialogTitle className="hidden" />
        <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-slate-700">Choose Verification Method</h3>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>
        <div className="flex flex-col gap-4 p-6 justify-center">
          <div className="body2-regular text-slate-500">
            You can verify your identity using one of the options below:
          </div>
          <div className="flex flex-col gap-4 mb-4">
            {availableMethods.includes(MFAMethod.TOTP) && (
              <div
                className="flex flex-row gap-1 cursor-pointer"
                onClick={() => setMethod(MFAMethod.TOTP)}
              >
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded-full mt-0.5 ${method === MFAMethod.TOTP ? 'bg-white border-5 border-orange-500' : 'bg-gray-100 border-1 border-gray-200'}`}
                ></div>
                <div className="flex flex-col gap-1">
                  <span className="body2-regular text-slate-700">
                    Authenticator App
                  </span>
                  <span className="body3-regular text-slate-500">
                    Use a 6-digit code from your authenticator app
                  </span>
                </div>
              </div>
            )}
            {availableMethods.includes(MFAMethod.SMS) && (
              <div
                className="flex flex-row gap-1 cursor-pointer"
                onClick={() => setMethod(MFAMethod.SMS)}
              >
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded-full mt-0.5 ${method === MFAMethod.SMS ? 'bg-white border-5 border-orange-500' : 'bg-gray-100 border-1 border-gray-200'}`}
                ></div>
                <div className="flex flex-col gap-1">
                  <span className="body2-regular text-slate-700">Text</span>
                  <span className="body3-regular text-slate-500">
                    Text a code to{' '}
                    {verificationContact?.phone || '(XXX) XXX-XXXX'}
                  </span>
                </div>
              </div>
            )}
            {availableMethods.includes(MFAMethod.VOICE) && (
              <div
                className="flex flex-row gap-1 cursor-pointer"
                onClick={() => setMethod(MFAMethod.VOICE)}
              >
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded-full mt-0.5 ${method === MFAMethod.VOICE ? 'bg-white border-5 border-orange-500' : 'bg-gray-100 border-1 border-gray-200'}`}
                ></div>
                <div className="flex flex-col gap-1">
                  <span className="body2-regular text-slate-700">
                    Voice Call
                  </span>
                  <span className="body3-regular text-slate-500">
                    Voice call a code to{' '}
                    {verificationContact?.phone || '(XXX) XXX-XXXX'}
                  </span>
                </div>
              </div>
            )}
            {availableMethods.includes(MFAMethod.EMAIL) && (
              <div
                className="flex flex-row gap-1 cursor-pointer"
                onClick={() => setMethod(MFAMethod.EMAIL)}
              >
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded-full mt-0.5 ${method === MFAMethod.EMAIL ? 'bg-white border-5 border-orange-500' : 'bg-gray-100 border-1 border-gray-200'}`}
                ></div>
                <div className="flex flex-col gap-1">
                  <span className="body2-regular text-slate-700">Email</span>
                  <span className="body3-regular text-slate-500">
                    Send a verification code to{' '}
                    {verificationContact?.email || 'j****@g****.com'}
                  </span>
                </div>
              </div>
            )}
            {availableMethods.length >= 1 && (
              <div
                className="flex flex-row gap-1 cursor-pointer"
                onClick={() => setMethod(MFAMethod.BACKUP_CODE)}
              >
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded-full mt-0.5 ${method === MFAMethod.BACKUP_CODE ? 'bg-white border-5 border-orange-500' : 'bg-gray-100 border-1 border-gray-200'}`}
                ></div>
                <div className="flex flex-col gap-1">
                  <span className="body2-regular text-slate-700">
                    Use a Backup Code
                  </span>
                  <span className="body3-regular text-slate-500">
                    Use one of your saved backup codes
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex flex-row p-4 gap-2 justify-end border-t border-beige-300 bg-beige-50 rounded-b-lg">
          <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
              onClick={handleSubmit}
              disabled={availableMethods.length === 0}
            >
              Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationMethod;
