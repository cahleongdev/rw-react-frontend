import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/base/Button';

import { ResetMethod } from '@/containers/Auth/index.types';

interface ResetLinkSentProps {
  method: ResetMethod;
  contactInfo: {
    email?: string;
    phone?: string;
  };
}

const ResetLinkSent: React.FC<ResetLinkSentProps> = ({
  method,
  contactInfo,
}: ResetLinkSentProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="flex flex-col items-center w-[320px]">
          <div className="title text-slate-950 mb-2">Reset link sent</div>
          <h5 className="text-slate-700 mb-6 text-center">
            We've sent a password reset link to your{' '}
            {method === ResetMethod.SMS ? 'phone' : 'email'} at{' '}
            {method === ResetMethod.SMS ? contactInfo.phone : contactInfo.email}
          </h5>
          <Button
            className="w-full text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Back to Sign in
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

export default ResetLinkSent;
