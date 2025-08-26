import React, { useRef, KeyboardEvent, ClipboardEvent } from 'react';

import { Button } from '@/components/base/Button';
import { MFAMethod } from '@/containers/Auth/index.types';

interface MFACodeVerificationProps {
  selectedMethod: string;
  code: string[];
  codeSent: boolean;
  mfaLoading: boolean;
  onCodeChange: (code: string[]) => void;
  onVerifyCode: () => void;
  onSendCode: () => void;
  onBack: () => void;
  onBackToLogin: () => void;
}

const MFACodeVerification: React.FC<MFACodeVerificationProps> = ({
  selectedMethod,
  code,
  codeSent,
  mfaLoading,
  onCodeChange,
  onVerifyCode,
  onSendCode,
  onBack,
  onBackToLogin,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    onCodeChange(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      onCodeChange(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const getMethodDisplayName = (method: string) => {
    switch (method) {
      case MFAMethod.TOTP:
        return 'Authenticator App';
      case MFAMethod.SMS:
        return 'Text Message';
      case MFAMethod.EMAIL:
        return 'Email';
      case MFAMethod.VOICE:
        return 'Voice Call';
      default:
        return method;
    }
  };

  const getInstructionText = () => {
    switch (selectedMethod) {
      case MFAMethod.TOTP:
        return 'Enter the 6-digit code from your authenticator app';
      case MFAMethod.SMS:
        return 'Enter the 6-digit code sent to your phone';
      case MFAMethod.EMAIL:
        return 'Enter the 6-digit code sent to your email';
      case MFAMethod.VOICE:
        return 'Enter the 6-digit code from the voice call';
      default:
        return 'Enter the 6-digit verification code';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-[680px] bg-white rounded-lg shadow-md p-0">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-700">
            Enter Verification Code
          </h2>
        </div>

        <div className="flex flex-col gap-4 min-h-[400px] justify-center items-center p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-600 mb-2">
              Verification method:{' '}
              <span className="font-medium text-slate-900">
                {getMethodDisplayName(selectedMethod)}
              </span>
            </p>
            <p className="text-sm text-slate-600">{getInstructionText()}</p>
          </div>

          {/* Show sending status for non-TOTP methods */}
          {selectedMethod !== MFAMethod.TOTP && !codeSent && mfaLoading && (
            <div className="text-center">
              <p className="text-sm text-blue-600">
                Sending verification code...
              </p>
            </div>
          )}

          {/* Code Input */}
          {codeSent && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center space-x-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <React.Fragment key={index}>
                    {index === 3 && (
                      <div className="flex items-center text-slate-400 text-lg">
                        -
                      </div>
                    )}
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={code[index] || ''}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className="w-[74px] h-[96px] text-center text-2xl font-semibold border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      disabled={mfaLoading}
                    />
                  </React.Fragment>
                ))}
              </div>

              {/* Resend Code Button for non-TOTP methods */}
              {selectedMethod !== MFAMethod.TOTP && (
                <div className="flex gap-2">
                  <Button
                    onClick={onSendCode}
                    disabled={mfaLoading}
                    variant="ghost"
                    className="text-blue-500 hover:text-blue-600 hover:bg-transparent"
                  >
                    Resend Code
                  </Button>
                  <Button
                    onClick={onBack}
                    disabled={mfaLoading}
                    variant="ghost"
                    className="text-blue-500 hover:text-blue-600 hover:bg-transparent"
                  >
                    Try another method
                  </Button>
                </div>
              )}

              {/* For TOTP, only show "Try another method" button */}
              {selectedMethod === MFAMethod.TOTP && (
                <Button
                  onClick={onBack}
                  disabled={mfaLoading}
                  variant="ghost"
                  className="text-blue-500 hover:text-blue-600 hover:bg-transparent"
                >
                  Try another method
                </Button>
              )}
            </div>
          )}
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

          {codeSent && (
            <Button
              onClick={onVerifyCode}
              disabled={mfaLoading || code.join('').length !== 6}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              {mfaLoading ? 'Verifying...' : 'Verify & Login'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MFACodeVerification;
