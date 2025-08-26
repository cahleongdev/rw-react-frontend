import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/base/Button';

interface CheckInboxProps {
  email?: string;
}

const CheckInbox: React.FC<CheckInboxProps> = ({ email }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="flex flex-col items-center w-[500px]">
          <div className="title text-slate-950 mb-2">Check Your Inbox</div>
          <h5 className="text-slate-700 mb-6 text-center">
            We've sent a new Invitation link to your email. Please check your
            inbox and click the link to continue.
          </h5>

          {email && (
            <p className="text-slate-600 text-sm mb-6 text-center">
              Email sent to: <span className="font-medium">{email}</span>
            </p>
          )}

          <div className="text-slate-600 text-sm mb-6 text-center">
            <p>Didn't receive the email?</p>
            <ul className="mt-2 text-left">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure the email address is correct</li>
              <li>• Wait a few minutes for delivery</li>
            </ul>
          </div>

          <Button
            className="text-white bg-blue-500 hover:bg-blue-600 cursor-pointer mb-3 w-[320px]"
            onClick={() => navigate('/login')}
          >
            Back to Sign in
          </Button>

          <Button
            variant="ghost"
            className="w-full text-blue-500 hover:text-blue-600 hover:bg-transparent"
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

export default CheckInbox;
