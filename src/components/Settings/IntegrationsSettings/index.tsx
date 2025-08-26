import React, { Dispatch, SetStateAction } from 'react';
import chunk from 'lodash.chunk';
import { ArrowTopRightOnSquareIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

import { Integration } from '@/containers/Settings/index.types';

import Switch from '@/components/base/Switch';
import ConnectionModal from './ConnectionModal';
import DisconnectModal from './DisconnectModal';

interface IntegrationSettingsProps {
  integrations: Integration[];
  integrationName: string;
  setIntegrationName: Dispatch<SetStateAction<string>>;
  showConnectIntegration: boolean;
  setShowConnectIntegration: Dispatch<SetStateAction<boolean>>;
  showDisconnectIntegration: boolean;
  setShowDisconnectIntegration: Dispatch<SetStateAction<boolean>>;
}

const IntegrationsSettings: React.FC<IntegrationSettingsProps> = ({
  integrations,
  integrationName,
  setIntegrationName,
  showConnectIntegration,
  setShowConnectIntegration,
  showDisconnectIntegration,
  setShowDisconnectIntegration,
}: IntegrationSettingsProps) => {
  return <div className="flex flex-col gap-4 grow">
    <div className='flex flex-col gap-2'>
      <h4 className="text-slate-950">
        Integrations
      </h4>
      <div className='body2-regular text-slate-500'>Connect and manage third-party integrations </div>
    </div>
    <hr className='border border-secondary' />
    {
      chunk(integrations, 3).map((integrationArr: Integration[]) => <div className='w-full flex flex-row gap-4'>
        {
          integrationArr.map((integration: Integration) => <div className='flex flex-col grow w-0 rounded-sm border border-secondary' key={integration.name}>
            <div className='flex flex-col gap-4 p-4 border-b border-secondary grow'>
              <div className='flex flex-row justify-between items-center'>
                <img src={integration.logo} className='w-8 h-8' alt='Not Found' />
                <div className='flex flex-row items-center gap-2 text-slate-700'>
                  <a href={integration.link} target='_blank' className='underline underline-offset-3'>{integration.link.substring(8)}</a>
                  <ArrowTopRightOnSquareIcon className='size-4' />
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='body1-medium text-primary'>{integration.name}</div>
                <div className='body2-regular text-slate-500'>{integration.description}</div>
              </div>
            </div>
            <div className='flex flex-row justify-between p-4'>
              <div className='flex flex-row gap-2.5'>
                {
                  ['Active', 'Inactive', 'Connection Failed', 'Error'].includes(integration.status) && <button className='rounded-[3px] border border-slate-500 px-3 py-2 body3-semibold leading-[1.0] text-slate-700 cursor-pointer' onClick={() => {
                    setShowDisconnectIntegration(true);
                    setIntegrationName(integration.name);
                  }}>Disconnect</button>
                }
                {
                  integration.status === 'Connection Failed' && <button className='rounded-[3px] bg-orange-500 text-white px-3 py-2 body3-semibold leading-[1.0] cursor-pointer'>Retry</button>
                }
                {
                  integration.status === 'Authentication Required' && <button className='rounded-[3px] bg-orange-500 text-white px-3 py-2 body3-semibold leading-[1.0] cursor-pointer'>Reconnect</button>
                }
                {
                  !integration.status && <button className='rounded-[3px] bg-blue-500 text-white px-3 py-2 flex flex-row gap-2 items-center body3-semibold leading-[1.0] cursor-pointer' onClick={() => {
                    setShowConnectIntegration(true);
                    setIntegrationName(integration.name);
                  }}>Connect<ArrowTopRightOnSquareIcon className='size-3.5' /></button>
                }
              </div>
              <div className='flex flex-row gap-2.5'>
                <div className={'flex flex-row items-center gap-1.5 body2-regular ' + (integration.status === 'Inactive' ? 'text-disabled' : 'text-slate-700')}>
                  {integration.status === 'Active' && <div className='w-2 h-2 rounded-sm bg-green-500' />}
                  {integration.status === 'Inactive' && <div className='w-2 h-2 rounded-sm bg-gray-400' />}
                  {['Connection Failed', 'Error'].includes(integration.status) && <XCircleIcon className='size-3.5 text-red-500' />}
                  {integration.status === 'Authentication Required' && <ExclamationTriangleIcon className='size-3.5 text-yellow-400' />}
                  {integration.status}
                </div>
                {
                  integration.status === 'Active' && <Switch
                    checked={true}
                    onChange={() => console.log('Remove Check')}
                  />
                }
                {
                  integration.status === 'Inactive' && <Switch
                    checked={false}
                    onChange={() => console.log('Remove Check')}
                  />
                }
              </div>
            </div>
          </div>)
        }
      </div>)
    }
    {
      showConnectIntegration && <ConnectionModal
        name={integrationName}
        onSubmit={() => setShowConnectIntegration(false)}
        onClose={() => setShowConnectIntegration(false)}
      />
    }
    {
      showDisconnectIntegration && <DisconnectModal
        name={integrationName}
        onSubmit={() => setShowDisconnectIntegration(false)}
        onClose={() => setShowDisconnectIntegration(false)}
      />
    }
  </div>;
};

export default IntegrationsSettings;