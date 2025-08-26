import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@components/base/Button';

interface RequestNewMagicLinkProps {
  email: string;
  isRequestingNewLink: boolean;
}

const RequestNewMagicLink: React.FC<RequestNewMagicLinkProps> = ({
  email,
  isRequestingNewLink,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="flex flex-col items-center w-[500px]">
          <div className="title text-slate-950 mb-2">
            Request New Invitation Link
          </div>
          {isRequestingNewLink ? (
            <div className="mb-6">
              <div className="text-slate-700 mb-4 text-center">
                Sending a new Invitation link to your email:{' '}
                <span className="font-medium">{email}</span>.
              </div>
            </div>
          ) : (
            <div className="text-slate-700 mb-6 text-center">
              We'll send a new Invitation link to your email:{' '}
              <span className="font-medium">{email}</span>.
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full text-blue-500 hover:text-blue-600 hover:bg-transparent"
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

export default RequestNewMagicLink;
