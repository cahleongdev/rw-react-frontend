import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/base/Button';

interface LinkExpiredProps {
  email?: string;
  handleRequestNewLink: () => void;
  isRequestingNewLink: boolean;
}

const LinkExpired: React.FC<LinkExpiredProps> = ({
  email,
  handleRequestNewLink,
  isRequestingNewLink,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="flex flex-col items-center w-[500px]">
          <div className="title text-slate-950 mb-2">Link Expired</div>
          <h5 className="text-slate-700 mb-6 text-center">
            Your invitation link has expired. Please request a new one to
            continue.
          </h5>
          {email && (
            <>
              <div className="w-full mb-4 text-center text-slate-600">
                <span>Email: {email}</span>
              </div>
              <Button
                className="w-[320px] text-white bg-blue-500 hover:bg-blue-600 cursor-pointer mb-3"
                onClick={handleRequestNewLink}
                disabled={isRequestingNewLink || !email}
              >
                {isRequestingNewLink ? 'Sending...' : 'Request New Link'}
              </Button>
            </>
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

export default LinkExpired;
