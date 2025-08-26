import React from 'react';

interface PlatformPermissionProps {
  label: string;
  value: string;
}

const PlatformPermission: React.FC<PlatformPermissionProps> = ({ label, value }: PlatformPermissionProps) => {
  return <div className='flex flex-row border-b border-slate-200'>
    <div className='grow body2-medium text-slate-500 py-3'>{label}</div>
    <div className='w-16 body2-medium text-slate-500 text-center py-3 flex flex-row justify-center items-center'><div
      className={`
                flex items-center justify-center
                w-4 h-4 rounded-full mr-2 bg-white
                ${value === 'hidden'
          ? 'border-5 border-orange-500'
          : 'border-1 border-gray-200'
        }
              `}
    ></div></div>
    <div className='w-16 body2-medium text-slate-500 text-center py-3 flex flex-row justify-center items-center'><div
      className={`
                flex items-center justify-center
                w-4 h-4 rounded-full mr-2 bg-white
                ${value === 'view'
          ? 'border-5 border-orange-500'
          : 'border-1 border-gray-200'
        }
              `}
    ></div></div>
    <div className='w-16 body2-medium text-slate-500 text-center py-3 flex flex-row justify-center items-center'><div
      className={`
                flex items-center justify-center
                w-4 h-4 rounded-full mr-2 bg-white
                ${value === 'edit'
          ? 'border-5 border-orange-500'
          : 'border-1 border-gray-200'
        }
              `}
    ></div></div>
  </div>;
};

export default PlatformPermission;