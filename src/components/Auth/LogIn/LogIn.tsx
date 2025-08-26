import React, { SetStateAction, Dispatch, useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { CustomInput } from '@/components/base/CustomInput';
import { Checkbox } from '@/components/base/Checkbox';
import { Button } from '@/components/base/Button';
import PrivacyPolicy from '@/components/Auth/PrivacyPolicy';
interface LogInProps {
  isLoading: boolean;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  rememberMe: boolean;
  setRememberMe: Dispatch<SetStateAction<boolean>>;
  showPrivacy: boolean;
  setShowPrivacy: Dispatch<SetStateAction<boolean>>;
  handleSubmit: () => void;
}

const LogIn: React.FC<LogInProps> = ({
  isLoading,
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  showPrivacy,
  setShowPrivacy,
  handleSubmit,
}: LogInProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const passwordInput = document.getElementById(
        'password',
      ) as HTMLInputElement;
      passwordInput?.focus();
    }
  };

  const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && email && password) {
      handleSubmit();
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="flex flex-col items-center w-[320px] gap-4">
          <div className="title text-slate-950 mb-2">Login to Reportwell</div>
          {/* <div className="font-normal text-lg text-slate-950 mb-8">
            Don't have an account?{' '}
            <Link to="/signup" className="underline underline-offset-4">
              Sign up now
            </Link>
            .
          </div> */}
          <CustomInput
            placeholder="Email"
            label="Enter your email"
            required
            value={email}
            className="w-full"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEmailKeyDown}
          />
          <CustomInput
            id="password"
            placeholder="Password"
            label="Enter your password"
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
            onKeyDown={handlePasswordKeyDown}
          />
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row gap-2 items-center cursor-pointer">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                className="border-slate-700 bg-white data-[state=checked]:border-none"
                onCheckedChange={() => setRememberMe(!rememberMe)}
              />
              <label
                htmlFor="rememberMe"
                onClick={() => setRememberMe(!rememberMe)}
                className="body2-regular text-slate-700"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="body3-semibold text-blue-500 mr-3"
            >
              Forgot Password
            </Link>
          </div>
          <Button
            className="w-full text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
            onClick={() => handleSubmit()}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          {/* <hr className="border border-[#E9EAEB] w-full" />
          <div className="body2-medium text-tertiary">Or continue with:</div>
          <button
            className="rounded-[3px] w-full py-2.5 body2-semibold text-slate-700 cursor-pointer flex justify-center items-center border border-slate-500"
            disabled={isLoading}
          >
            <img src='https://google.com/favicon.ico' width={18} height={18} alt='Not Found' className='mr-3' />Google
          </button>
          <button
            className="rounded-[3px] w-full py-2.5 body2-semibold text-slate-700 mb-6 cursor-pointer flex justify-center items-center border border-slate-500"
            disabled={isLoading}
          >
            <img src='https://microsoft.com/favicon.ico' width={18} height={18} alt='Not Found' className='mr-3' />Microsoft
          </button> */}
        </div>
        <div className="body3-regular text-slate-700 flex flex-row mt-4 items-center">
          © 2025 Reportwell, Inc. All rights reserved
          <div className="mx-2">|</div>
          <Button
            variant="ghost"
            className="font-medium px-0 text-blue-500 hover:text-blue-600 hover:bg-transparent cursor-pointer"
            onClick={() => setShowPrivacy(true)}
          >
            Privacy Policy
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
      <PrivacyPolicy
        showAccept={false}
        showPrivacy={showPrivacy}
        setShowPrivacy={setShowPrivacy}
      />
    </div>
  );
};

export default LogIn;
