import React from 'react';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { CustomInput } from '@/components/base/CustomInput';
import { Button } from '@/components/base/Button';

interface EmailVerificationProps {
  open: boolean;
  email: string;
  onSubmit: () => void;
  onClose: () => void;
  gotoMethodPage?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  open,
  email,
  onSubmit,
  onClose,
  gotoMethodPage,
}: EmailVerificationProps) => {
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
          <h5 className="text-slate-950">Enter your email below:</h5>
          <div className="flex flex-col gap-1">
            <CustomInput
              placeholder="Enter your email"
              value={email}
              className="w-[275px] cursor-not-allowed"
              disabled
            />
            <span className="text-slate-500 text-sm flex flex-row gap-1 items-center">
              <ExclamationCircleIcon className="w-5 h-5" />
              You can't change your email. Please contact support if you need to
              update your email.
            </span>
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

export default EmailVerification;
