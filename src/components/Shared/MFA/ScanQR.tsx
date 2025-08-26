import React, { useState } from 'react';
import {
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

import { CustomInput } from '@/components/base/CustomInput';
import { Button } from '@/components/base/Button';

interface ScanQRProps {
  open: boolean;
  code: string;
  qrCode: string;
  onSubmit: () => void;
  onClose: () => void;
  gotoMethodPage?: () => void;
}

const ScanQR: React.FC<ScanQRProps> = ({
  open,
  code,
  qrCode,
  onSubmit,
  onClose,
  gotoMethodPage,
}: ScanQRProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      toast.success('Secret code copied to clipboard');
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error('Failed to copy secret code');
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex justify-center items-center"
      hidden={!open}
      onClick={onClose}
    >
      <div
        className="w-[680px] bg-white rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-slate-700">Set Up Multi-Step Authentication</h3>
          <XMarkIcon
            className="w-6 h-6 cursor-pointer"
            onClick={() => onClose()}
          />
        </div>
        <div className="p-6 flex flex-col gap-4 min-h-[400px]">
          <h5 className="text-slate-950">
            Scan the QR code below with your two-factor authentication app.
          </h5>
          <div className="flex flex-row gap-6 items-center">
            <div className="border-2 border-slate-200">
              <img
                src={`data:image/svg+xml;base64,${qrCode}`}
                alt="MFA QR Code"
                className="w-[200px] h-[200px] max-w-[200px]"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="body1-regular">
                If you're unable to scan the QR code, you can enter the code
                below instead
              </div>
              <div className="flex items-center relative">
                <CustomInput
                  placeholder="QRCode"
                  required
                  defaultValue={code}
                  className="w-full"
                  readOnly
                />
                {isCopied ? (
                  <Button
                    variant="ghost"
                    className="absolute right-0 h-[42px] px-3 hover:bg-transparent"
                    onClick={handleCopyCode}
                  >
                    <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-500" />
                    <span className="sr-only">Copied</span>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="absolute right-0 h-[42px] px-3 hover:bg-transparent hover:text-blue-500"
                    onClick={handleCopyCode}
                  >
                    <ClipboardDocumentListIcon className="w-6 h-6" />
                    <span className="sr-only">Copy code</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse p-4 gap-2 justify-between border-t border-beige-300 bg-beige-50 rounded-b-lg">
          <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
              onClick={() => onSubmit()}
            >
              Next
            </Button>
          </div>
          {gotoMethodPage && (
            <Button
              variant="ghost"
              className="hover:bg-transparent text-blue-500 hover:text-blue-600"
              onClick={gotoMethodPage}
            >
              Choose a different method
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
