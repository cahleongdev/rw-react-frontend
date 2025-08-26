import React from 'react';

interface DisconnectModalProps {
  name: string;
  onSubmit: () => void;
  onClose: () => void;
};

const DisconnectModal: React.FC<DisconnectModalProps> = ({ name, onSubmit, onClose }: DisconnectModalProps) => {
  return <div className='fixed top-0 left-0 w-screen h-screen bg-[#00000040] flex justify-center items-center'>
    <div className='w-[420px] bg-white rounded-lg flex flex-col gap-4 p-4'>
      <div className='flex flex-col gap-2'>
        <h4 className='text-slate-700'>Disconnect Integration</h4>
        <div className='body2-regular text-slate-500'>
          Are you sure you want to disconnect this integration? This will stop any data syncing between Reportwell and {name}.
          <br />
          <br />
          You can reconnect it at anytime from the integrations page.
        </div>
      </div>
      <div className='flex flex-row gap-2 justify-end rounded-b-lg'>
        <button className='rounded-sm border px-5 py-2.5 border-slate-500 body2-semibold text-slate-700 leading-[1.0] cursor-pointer' onClick={() => onClose()}>
          Cancel
        </button>
        <button className='rounded-sm px-5 py-2.5 bg-red-700 body2-semibold text-white leading-[1.0] cursor-pointer' onClick={() => onSubmit()}>Disconnect</button>
      </div>
    </div>
  </div>;
};

export default DisconnectModal;