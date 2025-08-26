import React, { SetStateAction, Dispatch } from 'react';

import { Button } from '@/components/base/Button';

import { ResetMethod, ContactInfoType } from '@/containers/Auth/index.types';

interface ResetMethodProps {
  method: ResetMethod;
  setMethod: Dispatch<SetStateAction<ResetMethod>>;
  contactInfo: ContactInfoType;
  error?: string;
  loading?: boolean;
  sendResetLink: () => void;
}

const ResetMethodComponent: React.FC<ResetMethodProps> = ({
  method,
  setMethod,
  contactInfo,
  error,
  loading,
  sendResetLink,
}: ResetMethodProps) => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="flex flex-col items-center w-[500px]">
          <div className="title text-slate-950 mb-2">Password reset</div>
          <h5 className="text-slate-700 mb-8 text-center">
            Select how you want to receive a reset link using your account
            information below:
          </h5>
          {error && (
            <div className="text-red-500 text-sm w-full text-center mb-4">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-4 mb-4">
            {contactInfo.phone && (
              <div
                className="flex items-center gap-2 px-4 py-4.5 border border-slate-200 rounded-md cursor-pointer"
                onClick={() => setMethod(ResetMethod.SMS)}
              >
                <div
                  className={`
                  flex items-center justify-center
                  w-4 h-4 rounded-full mr-2
                  ${
                    method === ResetMethod.SMS
                      ? 'bg-white border-5 border-orange-500'
                      : 'bg-gray-100 border-1 border-gray-200'
                  }
                `}
                ></div>
                <span
                  className={`body2-regular ${method === ResetMethod.SMS ? 'text-slate-700' : 'text-slate-500'}`}
                >
                  Text message at {contactInfo.phone}
                </span>
              </div>
            )}
            {contactInfo.email && (
              <div
                className="flex items-center gap-2 px-4 py-4.5 border border-slate-200 rounded-md cursor-pointer"
                onClick={() => setMethod(ResetMethod.EMAIL)}
              >
                <div
                  className={`
                  flex items-center justify-center
                  w-4 h-4 rounded-full mr-2
                  ${
                    method === ResetMethod.EMAIL
                      ? 'bg-white border-5 border-orange-500'
                      : 'bg-gray-100 border-1 border-gray-200'
                  }
                `}
                ></div>
                <span
                  className={`body2-regular ${method === ResetMethod.EMAIL ? 'text-slate-700' : 'text-slate-500'}`}
                >
                  Email at {contactInfo.email}
                </span>
              </div>
            )}
            <Button
              className="w-full leading-none text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={sendResetLink}
              disabled={loading}
            >
              {loading ? 'Sending reset link...' : 'Send a reset link'}
            </Button>
          </div>
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

export default ResetMethodComponent;
