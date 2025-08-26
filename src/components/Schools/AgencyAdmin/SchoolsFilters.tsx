import React from 'react';

import { SearchBar } from '@/components/base/SearchBar';
import { FilterSelect } from '@/components/base/FilterSelect';
import SortLabel from './SortLabel';

interface SchoolsFiltersProps {
  activeTab: 'schools' | 'users';
  searchText: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'a-z' | 'z-a';
  onSortChange: (value: 'a-z' | 'z-a') => void;
  type: string;
  onTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

const SchoolsFilters: React.FC<SchoolsFiltersProps> = ({
  activeTab,
  searchText,
  onSearchChange,
  sortOrder,
  onSortChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
}) => {
  // Define filter options based on active tab
  const getTypeOptions = () => {
    if (activeTab === 'schools') {
      return {
        labels: ['All', 'Network', 'School'],
        values: ['All', 'Network', 'School'],
      };
    }
    return null; // Users tab doesn't have type filter
  };

  const getStatusOptions = () => {
    if (activeTab === 'schools') {
      return {
        labels: ['All', 'Active', 'Inactive'],
        values: ['All', 'Active', 'Inactive'],
      };
    } else {
      return {
        labels: ['All', 'Active', 'Inactive', 'Pending'],
        values: ['All', 'Active', 'Inactive', 'Pending'],
      };
    }
  };

  const typeOptions = getTypeOptions();
  const statusOptions = getStatusOptions();

  return (
    <div className="flex h-[56px] items-center p-4 border-b-[1px] border-beige-300 justify-between w-full">
      <div className="flex gap-2">
        <div className="flex p-2">
          <SortLabel value={sortOrder} onSort={onSortChange} />
        </div>

        {/* Type filter - only for schools tab */}
        {typeOptions && (
          <div className="flex p-2">
            <FilterSelect
              label="Type"
              labels={typeOptions.labels}
              values={typeOptions.values}
              value={type}
              onChange={onTypeChange}
            />
          </div>
        )}

        {/* Status filter - for both tabs */}
        <div className="flex p-2">
          <FilterSelect
            label="Status"
            labels={statusOptions.labels}
            values={statusOptions.values}
            value={status}
            onChange={onStatusChange}
          />
        </div>
      </div>

      <SearchBar
        placeholder={
          activeTab === 'schools' ? 'Search for schools' : 'Search for users'
        }
        className="w-[365px]"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SchoolsFilters;
