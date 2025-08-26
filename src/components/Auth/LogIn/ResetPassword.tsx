import React, { SetStateAction, Dispatch, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

import { CustomInput } from '@/components/base/CustomInput';
import { Button } from '@/components/base/Button';

interface ValidationRule {
  text: string;
  valid: boolean;
}

interface ResetPasswordProps {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  rules: ValidationRule[];
  error?: string;
  loading?: boolean;
  onSubmit: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  rules,
  error,
  loading,
  onSubmit,
}: ResetPasswordProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="title text-slate-950 mb-6">Create a new password</div>
        <div className="flex flex-col items-center w-[320px] gap-4">
          <CustomInput
            placeholder="Password"
            label="Password"
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            className="w-full"
            adornment={
              <div onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-slate-400 absolute top-2 right-3 cursor-pointer" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-slate-400 absolute top-2 right-3 cursor-pointer" />
                )}
              </div>
            }
            onChange={(e) => setPassword(e.target.value)}
          />
          <CustomInput
            placeholder="Password"
            label="Confirm password"
            required
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            className="w-full"
            adornment={
              <div onClick={() => setShowConfirmPassword(!confirmPassword)}>
                {confirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-slate-400 absolute top-2 right-3 cursor-pointer" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-slate-400 absolute top-2 right-3 cursor-pointer" />
                )}
              </div>
            }
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm w-full">{error}</div>}
          <div className="bg-teal-50 rounded-md w-full p-4 flex flex-col gap-2.5">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="flex flex-row gap-3 items-center body2-medium text-slate-700"
              >
                {rule.valid ? (
                  <CheckCircleIcon className="w-4.5 h-4.5 text-green-500" />
                ) : (
                  <XMarkIcon className="w-4.5 h-4.5 text-red-400" />
                )}
                {rule.text}
              </div>
            ))}
          </div>

          <Button
            className="w-full text-white bg-blue-500 hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-slate-700 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Back to Login
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

export default ResetPassword;
