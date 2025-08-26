import React from 'react';

import { Button } from '@/components/base/Button';
import { MFAMethod } from '@/containers/Auth/index.types';

interface MFAMethodSelectionProps {
  allMethods: string[];
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const MFAMethodSelection: React.FC<MFAMethodSelectionProps> = ({
  allMethods,
  selectedMethod,
  onMethodChange,
  onBack,
  onContinue,
}) => {
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
      case MFAMethod.BACKUP_CODE:
        return 'Backup Code';
      default:
        return method;
    }
  };

  const getMethodDescription = (method: string) => {
    switch (method) {
      case MFAMethod.TOTP:
        return 'Use your authenticator app to generate a verification code';
      case MFAMethod.SMS:
        return 'Receive a verification code via text message';
      case MFAMethod.EMAIL:
        return 'Receive a verification code via email';
      case MFAMethod.VOICE:
        return 'Receive a verification code via voice call';
      case MFAMethod.BACKUP_CODE:
        return 'Use one of your saved backup codes';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-[680px] bg-white rounded-lg shadow-md p-0">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-700">
            Choose Verification Method
          </h2>
        </div>

        <div className="flex flex-col gap-4 min-h-[400px] max-h-[400px] overflow-y-auto p-6">
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-4">
              Select how you'd like to receive your verification code:
            </p>
            <div className="space-y-3">
              {allMethods.map((method) => (
                <label
                  key={method}
                  className="flex items-start p-4 border border-slate-200 rounded-lg cursor-pointer transition-colors hover:border-orange-500 hover:bg-orange-50"
                >
                  <div className="relative mr-3 mt-0.5">
                    <input
                      type="radio"
                      name="mfaMethod"
                      value={method}
                      checked={selectedMethod === method}
                      onChange={(e) => onMethodChange(e.target.value)}
                      className="peer sr-only"
                    />
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        selectedMethod === method
                          ? 'border-orange-500 border-[4px]'
                          : 'border-slate-300'
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">
                      {getMethodDisplayName(method)}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      {getMethodDescription(method)}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-blue-500 hover:text-blue-600 hover:bg-transparent"
          >
            Back to Login
          </Button>

          <Button
            onClick={onContinue}
            disabled={!selectedMethod}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MFAMethodSelection;
