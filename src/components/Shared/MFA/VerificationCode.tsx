import React, { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { MFAMethod } from '@containers/Auth/index.types';

interface VerificationCodeProps {
  open: boolean;
  method: MFAMethod;
  onSubmit: (code: string) => void;
  onClose: () => void;
  gotoMethodPage?: () => void;
  resendCode: () => void;
}

const VerificationCode: React.FC<VerificationCodeProps> = ({
  open,
  method,
  onSubmit,
  onClose,
  gotoMethodPage,
  resendCode,
}: VerificationCodeProps) => {
  const [code, setCode] = useState('');
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const focusNextInput = (currentIndex: number) => {
    if (currentIndex < 5) {
      inputRefs[currentIndex + 1].current?.focus();
    }
  };

  const focusPrevInput = (currentIndex: number) => {
    if (currentIndex > 0) {
      inputRefs[currentIndex - 1].current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index]) {
      e.preventDefault();
      focusPrevInput(index);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (pastedData) {
      setCode(pastedData);
      // Focus the last input if the pasted data fills all inputs
      if (pastedData.length === 6) {
        inputRefs[5].current?.focus();
      } else {
        // Focus the next empty input
        inputRefs[pastedData.length]?.current?.focus();
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    const newValue = value.replace(/\D/g, '').slice(0, 1);

    if (newValue || value === '') {
      const newCode = code.split('');
      newCode[index] = newValue;
      setCode(newCode.join(''));

      if (newValue) {
        focusNextInput(index);
      }
    }
  };

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
        <div className="flex flex-col gap-2 min-h-[400px] justify-center items-center">
          <div className="body1-regular flex flex-row text-primary">
            6 digit code{' '}
            <div className="body3-regular text-[#F73B3B] ml-1">*</div>
          </div>
          <div className="flex flex-row gap-1 items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <React.Fragment key={index}>
                {index === 3 && <div className="body1-regular">-</div>}
                <input
                  ref={inputRefs[index]}
                  className="w-[74px] h-[96px] border border-slate-300 rounded-[5px] text-center focus:border-blue-500 focus:outline-none text-2xl"
                  value={code[index] || ''}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  inputMode="numeric"
                  maxLength={1}
                />
              </React.Fragment>
            ))}
          </div>
          <div className="body3-regular text-slate-400">
            Enter the 6-digit code from your authenticator app
          </div>

          {method !== MFAMethod.TOTP && (
            <Button
              variant="ghost"
              className="text-blue-500 hover:text-blue-600 hover:bg-transparent"
              onClick={resendCode}
            >
              Resend Code
            </Button>
          )}
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
              onClick={() => onSubmit(code)}
              disabled={code.length !== 6}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationCode;
