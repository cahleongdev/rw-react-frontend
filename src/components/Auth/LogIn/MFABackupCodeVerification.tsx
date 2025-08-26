import React, { useRef, KeyboardEvent, ClipboardEvent } from 'react';

import { Button } from '@/components/base/Button';

interface MFABackupCodeVerificationProps {
  code: string[];
  mfaLoading: boolean;
  onCodeChange: (code: string[]) => void;
  onVerifyCode: () => void;
  onBack: () => void;
  onBackToLogin: () => void;
}

const MFABackupCodeVerification: React.FC<MFABackupCodeVerificationProps> = ({
  code,
  mfaLoading,
  onCodeChange,
  onVerifyCode,
  onBack,
  onBackToLogin,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    // Allow alphanumeric characters (letters and numbers)
    if (!/^[A-Za-z0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.toUpperCase(); // Convert to uppercase to match backend format
    onCodeChange(newCode);

    // Auto-focus next input
    if (value && index < 7) {
      const nextIndex = index + 1;
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevIndex = index - 1;
      inputRefs.current[prevIndex]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/[^A-Za-z0-9]/g, '') // Remove non-alphanumeric characters
      .toUpperCase()
      .slice(0, 8);

    if (pastedData.length === 8) {
      const newCode = pastedData.split('');
      onCodeChange(newCode);
      inputRefs.current[7]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-[680px] bg-white rounded-lg shadow-md p-0">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-700">
            Enter Backup Code
          </h2>
        </div>

        <div className="flex flex-col gap-4 min-h-[400px] justify-center items-center p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-600 mb-2">
              Verification method:{' '}
              <span className="font-medium text-slate-900">Backup Code</span>
            </p>
            <p className="text-sm text-slate-600 mb-2">
              Enter one of your backup codes (8 characters)
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Each backup code can only be used once
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center items-center space-x-2">
              {/* 8 character inputs */}
              {Array.from({ length: 8 }).map((_, index) => (
                <React.Fragment key={index}>
                  {index === 4 && (
                    <div className="flex items-center text-slate-400 text-lg">
                      -
                    </div>
                  )}
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={code[index] || ''}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-[70px] h-[90px] text-center text-2xl font-semibold border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none uppercase"
                    disabled={mfaLoading}
                    placeholder=""
                  />
                </React.Fragment>
              ))}
            </div>

            <Button
              onClick={onBack}
              disabled={mfaLoading}
              variant="ghost"
              className="text-blue-500 hover:text-blue-600 hover:bg-transparent"
            >
              Try another method
            </Button>
          </div>
        </div>

        <div className="flex justify-between p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
          <Button
            onClick={onBackToLogin}
            variant="ghost"
            className="text-blue-500 hover:text-blue-600 hover:bg-transparent"
            disabled={mfaLoading}
          >
            Back to Login
          </Button>

          <Button
            onClick={onVerifyCode}
            disabled={mfaLoading || code.filter((c) => c).length !== 8}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
          >
            {mfaLoading ? 'Verifying...' : 'Verify & Login'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MFABackupCodeVerification;
