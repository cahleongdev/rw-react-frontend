import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { Button } from '@/components/base/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/DropdownMenu';

interface SchoolsHeaderProps {
  activeTab: 'schools' | 'users';
  onTabChange: (tab: 'schools' | 'users') => void;
  onCreateSchool: () => void;
  onCreateNetwork: () => void;
  onCreateUser: () => void;
  onBulkImport: () => void;
}

const SchoolsHeader: React.FC<SchoolsHeaderProps> = ({
  activeTab,
  onTabChange,
  onCreateSchool,
  onCreateNetwork,
  onCreateUser,
  onBulkImport,
}) => {
  const navigate = useNavigate();
  const tabLabels = [
    { key: 'schools' as const, label: 'Schools and Networks' },
    { key: 'users' as const, label: 'Users' },
  ];

  return (
    <div className="flex justify-between items-center py-4 px-6 border-b-[1px] border-beige-300 bg-beige-100 flex-shrink-0 gap-4">
      <h3 className="text-slate-900 font-semibold">
        {activeTab === 'schools' ? 'Schools' : 'Users'}
      </h3>
      <div className="flex flex-1">
        {tabLabels.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              px-4 py-2 
              rounded-[5px]
              text-sm font-medium
              transition-colors
              ${
                activeTab === tab.key
                  ? 'bg-blue-50 text-blue-500 hover:bg-blue-50'
                  : 'bg-transparent text-slate-500 hover:bg-neutral-100'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          className="cursor-pointer rounded-[6px] h-[36px] px-3 py-2 border-slate-700"
          variant="outline"
          size="icon"
          onClick={() => navigate('/agency-settings/fields')}
          title="Custom Fields"
        >
          <span
            title="Edit custom fields"
            className="button2-semibold flex items-center gap-2"
          >
            <SquaresPlusIcon className="h-4 w-4" />
          </span>
        </Button>
        <DropdownMenu>
          <Button
            className="cursor-pointer bg-blue-500 rounded-[6px] hover:bg-blue-600 h-[36px] px-3 py-2"
            asChild
          >
            <DropdownMenuTrigger>
              <span className="text-white button2-semibold flex items-center gap-2">
                Create new
                <ChevronDownIcon className="h-4 w-4" />
              </span>
            </DropdownMenuTrigger>
          </Button>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onSelect={onCreateSchool}>
              School
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCreateNetwork}>
              Network
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCreateUser}>User</DropdownMenuItem>
            <DropdownMenuItem onSelect={onBulkImport}>
              Import...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SchoolsHeader;
