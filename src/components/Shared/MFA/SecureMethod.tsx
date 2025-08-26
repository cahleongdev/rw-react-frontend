import React, { SetStateAction, Dispatch } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { MFAMethod } from '@/containers/Auth/index.types';

interface SecureMethodProps {
  open: boolean;
  method: MFAMethod;
  setMethod: Dispatch<SetStateAction<MFAMethod>>;
  onSubmit: () => void;
  onClose: () => void;
}

const SecureMethod: React.FC<SecureMethodProps> = ({
  open,
  method,
  setMethod,
  onSubmit,
  onClose,
}: SecureMethodProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="min-w-[680px] p-0 gap-0 bg-white">
        <DialogHeader>
          <DialogTitle className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
            <h3 className="text-slate-700">Set Up Multi-Step Authentication</h3>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col gap-4 min-h-[400px]">
          <h5 className="text-slate-950">
            Choose a method to secure your account:
          </h5>
          <div className="flex flex-col gap-4">
            <div
              className="flex flex-row items-center gap-2 cursor-pointer"
              onClick={() => setMethod(MFAMethod.TOTP)}
            >
              <div
                className={
                  'flex items-center justify-center w-4 h-4 rounded-full ' +
                  (method === MFAMethod.TOTP
                    ? 'bg-white border-5 border-orange-500'
                    : 'bg-white border-2 border-slate-300')
                }
              />
              <div className="body2-regular text-slate-700">
                Authenticator app (recommended)
              </div>
            </div>
            <div
              className="flex flex-row items-center gap-2 cursor-pointer"
              onClick={() => setMethod(MFAMethod.SMS)}
            >
              <div
                className={
                  'flex items-center justify-center w-4 h-4 rounded-full ' +
                  (method === MFAMethod.SMS
                    ? 'bg-white border-5 border-orange-500'
                    : 'bg-white border-2 border-slate-300')
                }
              />
              <div className="body2-regular text-slate-700">Text / phone</div>
            </div>
            <div
              className="flex flex-row items-center gap-2 cursor-pointer"
              onClick={() => setMethod(MFAMethod.EMAIL)}
            >
              <div
                className={
                  'flex items-center justify-center w-4 h-4 rounded-full ' +
                  (method === MFAMethod.EMAIL
                    ? 'bg-white border-5 border-orange-500'
                    : 'bg-white border-2 border-slate-300')
                }
              />
              <div className="body2-regular text-slate-700">Email</div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row p-4 gap-2 justify-end border-t border-beige-300 bg-beige-50 rounded-b-lg">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            onClick={onSubmit}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SecureMethod;
