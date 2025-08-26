import React from 'react';

const AccountSetup: React.FC = () => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full w-1/2 justify-center items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col gap-2 items-center">
            <div className="title text-slate-950 mb-2">Account setup</div>
            <h5 className="text-slate-700">
              Sign in with SSO or sign in manually
            </h5>
          </div>
          <div className='w-[320px] flex flex-col gap-4'>
            <button
              className="rounded-[3px] w-full py-2.5 body2-semibold text-slate-700 cursor-pointer flex justify-center items-center border border-slate-500"
            >
              <img src='https://google.com/favicon.ico' width={18} height={18} alt='Not Found' className='mr-3' />Sign in with Google
            </button>
            <button className="rounded-[3px] w-full py-2.5 body2-semibold text-white bg-blue-500 cursor-pointer border border-slate-500">
              Sign in manually
            </button>
            <button className="w-full py-2.5 body2-semibold text-slate-700 cursor-pointer">
              Back
            </button>
          </div>
        </div>
      </div>
      <div className="flex h-full w-1/2 h-full p-4">
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

export default AccountSetup;
