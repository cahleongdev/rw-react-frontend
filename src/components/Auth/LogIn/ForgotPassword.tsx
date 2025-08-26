import React, { SetStateAction, Dispatch } from 'react';

import { CustomInput } from '@/components/base/CustomInput';
import { Button } from '@/components/base/Button';

interface ForgotPasswordProps {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  error?: string;
  onSubmit: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  email,
  setEmail,
  error,
  onSubmit,
}: ForgotPasswordProps) => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="flex flex-col items-center w-[320px]">
          <div className="title text-slate-950 mb-6">Password reset</div>
          <CustomInput
            placeholder="Email"
            label="Enter your account's email"
            required
            value={email}
            className="w-full mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <div className="text-red-500 text-sm w-full mb-4">{error}</div>
          )}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSubmit}
          >
            Send a reset link
          </Button>
        </div>
      </div>
      <div className="flex h-full w-1/2 p-4">
        <div className="w-full rounded-[10px] bg-[linear-gradient(180deg,_#F97316,_#f973161a)]">
          <div className="flex flex-col gap-4 justify-center items-center h-full">
            <img
              src="/assets/images/logos/reportwell-border.svg"
              alt="Reportwell Logo"
              width={200}
              height={178}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
