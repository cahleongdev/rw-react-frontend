import React, { Dispatch, SetStateAction } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { CustomInput } from '@/components/base/CustomInput';
import { PhoneVerificationMethod } from '@/containers/Auth/index.types';
import { Button } from '@/components/base/Button';

interface PhoneVerificationProps {
  open: boolean;
  phoneNumber: string;
  phoneMethod: PhoneVerificationMethod;
  setPhoneMethod: Dispatch<SetStateAction<PhoneVerificationMethod>>;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  onClose: () => void;
  gotoMethodPage?: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  open,
  phoneNumber,
  phoneMethod,
  setPhoneMethod,
  setPhoneNumber,
  onSubmit,
  onClose,
  gotoMethodPage,
}: PhoneVerificationProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="min-w-[680px] p-0 gap-0 bg-white"
        showClose={false}
      >
        <DialogTitle hidden />
        <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-slate-700">Set Up Multi-Step Authentication</h3>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>
        <div className="p-6 flex flex-col gap-4 min-h-[400px]">
          <h5 className="text-slate-950">Enter your phone number below:</h5>
          <div className="flex flex-col gap-1">
            <CustomInput
              placeholder="Enter your phone number"
              required
              value={phoneNumber}
              className="w-[275px]"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="font-h5 text-slate-950">
            How would you like to receive your code?
          </div>
          <div className="flex flex-row gap-4">
            <div
              className="flex items-center gap-2 px-4 py-4.5 border border-slate-200 rounded-md cursor-pointer w-[200px]"
              onClick={() => setPhoneMethod(PhoneVerificationMethod.SMS)}
            >
              <div
                className={
                  'flex items-center justify-center w-4 h-4 rounded-full mr-2 ' +
                  (phoneMethod === PhoneVerificationMethod.SMS
                    ? 'bg-white border-5 border-orange-500'
                    : 'bg-gray-100 border-1 border-gray-200')
                }
              ></div>
              <span
                className={
                  'body2-regular ' +
                  (phoneMethod === PhoneVerificationMethod.SMS
                    ? 'text-slate-700'
                    : 'text-slate-500')
                }
              >
                Text message
              </span>
            </div>
          </div>
        </div>
        <DialogFooter
          className={`flex flex-row p-4 gap-2 border-t border-beige-300 bg-beige-50 rounded-b-lg ${
            gotoMethodPage ? 'sm:justify-between' : 'justify-end'
          }`}
        >
          <Button
            variant="ghost"
            className="hover:bg-transparent text-blue-500 hover:text-blue-600"
            hidden={!gotoMethodPage}
            onClick={gotoMethodPage}
          >
            Choose a different method
          </Button>
          <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
              onClick={onSubmit}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneVerification;
