import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/base/Button';

const ResetPasswordComplete: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="title text-slate-950 mb-2 w-[320px]">
          Your password has been reset
        </div>
        <h5 className="text-slate-700 mb-6">
          Sign back in with your new password
        </h5>
        <Button
          className="text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
          onClick={() => navigate('/login')}
        >
          Back to Sign in
        </Button>
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

export default ResetPasswordComplete;
