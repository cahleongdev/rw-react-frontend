import React from 'react';

import { FilterType } from '@/containers/Notifications/index.types';

interface FilterButtonsProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
};

const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <div className="flex">
      {(['All', 'Unread', 'Read'] as FilterType[]).map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`
            px-4 py-2 
            rounded-lg 
            text-sm font-mediumh
            transition-colors
            ${activeFilter === filter
              ? 'bg-blue-50 text-blue-500 hover:bg-blue-50'
              : 'bg-transparent text-black hover:bg-neutral-100'
            }
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
