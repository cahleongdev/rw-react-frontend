import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/base/Button';

interface AlreadyRegisteredProps {
  email?: string;
}

const AlreadyRegistered: React.FC<AlreadyRegisteredProps> = ({ email }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="flex flex-col items-center w-[500px]">
          <div className="title text-slate-950 mb-2">Already Registered</div>
          <h5 className="text-slate-700 mb-6 text-center">
            This email is already registered. Please sign in with your existing
            account.
          </h5>

          {email && (
            <p className="text-slate-600 text-sm mb-6 text-center">
              Email: <span className="font-medium">{email}</span>
            </p>
          )}

          <Button
            className="w-[320px] text-white bg-blue-500 hover:bg-blue-600 cursor-pointer mb-3"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>

          <Button
            variant="ghost"
            className="w-[320px] text-blue-500 hover:text-blue-600 hover:bg-transparent"
            onClick={() =>
              window.open('mailto:support@reportwell.io', '_blank')
            }
          >
            Contact Support
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

export default AlreadyRegistered;
