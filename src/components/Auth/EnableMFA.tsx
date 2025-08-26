import React from 'react';

const EnableMFA: React.FC = () => {
  return (
    <div className="flex h-full">
      <div className="flex h-full w-1/2 px-10 justify-center items-center">
        <div className="w-[640px] flex flex-col items-center">
          <div className="title text-slate-950 mb-2">
            Enable Multi-Factor Authentication (MFA)
          </div>
          <div className="h5 mb-6 text-slate-700 text-center">
            Enabling MFA is one of the most effective ways to secure your
            account against phishing, breaches, and credential theft.
            <br />
            <br />
            All users are required to activate MFA.
          </div>
          <button className="rounded-[3px] w-[320px] py-2.5 body2-semibold text-white bg-blue-500 cursor-pointer border border-slate-500">
            Enable MFA
          </button>
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

export default EnableMFA;
