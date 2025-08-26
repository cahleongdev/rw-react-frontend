import React from 'react';

interface ConnectionModalProps {
  name: string;
  onSubmit: () => void;
  onClose: () => void;
};

const ConnectionModal: React.FC<ConnectionModalProps> = ({ name, onSubmit, onClose }: ConnectionModalProps) => {
  return <div className='fixed top-0 left-0 w-screen h-screen bg-[#00000040] flex justify-center items-center'>
    <div className='w-[420px] bg-white rounded-lg flex flex-col gap-4 p-6'>
      <div className='flex flex-col gap-2'>
        <h4 className='text-slate-700'>You're about to connect to {name}</h4>
        <div className='body2-regular text-slate-500'>
          To complete the integration with {name}, you'll be redirected to their website.
          <br />
          <br />
          You'll be brought back here once everything's set.
        </div>
      </div>
      <div className='flex flex-row gap-2 justify-end rounded-b-lg'>
        <button className='rounded-sm border px-5 py-2.5 border-slate-500 body2-semibold text-slate-700 leading-[1.0] cursor-pointer' onClick={() => onClose()}>
          Cancel
        </button>
        <button className='rounded-sm px-5 py-2.5 bg-blue-500 body2-semibold text-white leading-[1.0] cursor-pointer' onClick={() => onSubmit()}>Connect</button>
      </div>
    </div>
  </div>;
};

export default ConnectionModal;