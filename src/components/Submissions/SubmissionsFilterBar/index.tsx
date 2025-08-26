import React from 'react';
import { EyeIcon, FunnelIcon } from '@heroicons/react/24/outline';

import { SearchBar } from '@/components/base/SearchBar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/base/Select';
import {
  LocalSubmissionFilters,
  FilterOptions,
} from '@/store/slices/submissionsSlice';

// Props for the filter bar component
export interface SubmissionsFilterBarProps {
  filters: LocalSubmissionFilters;
  filterOptions: FilterOptions;
  currentView: 'by-report' | 'by-school';
  onFilterChange: (key: keyof LocalSubmissionFilters, value: string) => void;
  onViewChange: (newView: 'by-report' | 'by-school') => void;
  searchText: string;
  onSearchTextChange: (text: string) => void;
}

export const SubmissionsFilterBar: React.FC<SubmissionsFilterBarProps> = ({
  filters,
  filterOptions,
  currentView,
  onFilterChange,
  onViewChange,
  searchText,
  onSearchTextChange,
}) => {
  return (
    <div className="flex border-beige-400 border-b-[1px] justify-between items-center">
      {/* Left side: View and Other Filters */}
      <div className="flex items-center">
        {/* View Filter */}
        <div className="flex items-center gap-1 bg-orange-50 border-r-[1px] border-beige-300 px-4 py-2 body3-regular">
          <EyeIcon className="h-4 w-4" />
          <span>View:</span>
          <Select
            value={currentView}
            onValueChange={(value) => {
              onViewChange(value as 'by-report' | 'by-school');
            }}
          >
            <SelectTrigger className="border-0 p-0 h-auto shadow-none hover:bg-transparent">
              <span className="body3-regular">
                {filterOptions.view.find((o) => o.value === currentView)?.label}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filterOptions.view.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Other Filters */}
        <div className="flex items-center gap-2 py-2 px-6 h-[56px] body3-regular flex-wrap flex-grow">
          {/* Category Filter - Label might depend on view */}
          <div className="flex items-center gap-1">
            <FunnelIcon className="h-4 w-4" />
            {/* Label could be dynamic: currentView === 'by-school' ? 'Report:' : 'Category:' */}
            <span>{currentView === 'by-school' ? 'Report:' : 'Category:'}</span>
            <Select
              value={filters.category}
              onValueChange={(value) => onFilterChange('category', value)}
            >
              <SelectTrigger className="border-0 p-0 h-auto shadow-none hover:bg-transparent min-w-[50px]">
                <span className="body3-regular">
                  {
                    filterOptions.category.find(
                      (o) => o.value === filters.category,
                    )?.label
                  }
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filterOptions.category.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Team Member Filter */}
          <div className="flex items-center gap-1">
            <span>Team Member:</span>
            <Select
              value={filters.teamMember}
              onValueChange={(value) => onFilterChange('teamMember', value)}
            >
              <SelectTrigger className="border-0 p-0 h-auto shadow-none hover:bg-transparent min-w-[50px]">
                <span className="body3-regular">
                  {
                    filterOptions.teamMember.find(
                      (o) => o.value === filters.teamMember,
                    )?.label
                  }
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filterOptions.teamMember.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* School Filter */}
          <div className="flex items-center gap-1">
            {/* Label could be dynamic: currentView === 'by-school' ? 'School Group:' : 'School:' */}
            <span>School:</span>
            <Select
              value={filters.school}
              onValueChange={(value) => onFilterChange('school', value)}
            >
              <SelectTrigger className="border-0 p-0 h-auto shadow-none hover:bg-transparent min-w-[50px]">
                <span className="body3-regular">
                  {
                    filterOptions.school.find((o) => o.value === filters.school)
                      ?.label
                  }
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filterOptions.school.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span>Status:</span>
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange('status', value)}
            >
              <SelectTrigger className="border-0 p-0 h-auto shadow-none hover:bg-transparent min-w-[50px]">
                <span className="body3-regular">
                  {
                    filterOptions.status.find((o) => o.value === filters.status)
                      ?.label
                  }
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filterOptions.status.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Year Filter */}
          <div className="flex items-center gap-1">
            <span>Year:</span>
            <Select
              value={filters.year}
              onValueChange={(value) => onFilterChange('year', value)}
            >
              <SelectTrigger className="border-0 p-0 h-auto shadow-none hover:bg-transparent min-w-[50px]">
                <span className="body3-regular">
                  {
                    filterOptions.year.find((o) => o.value === filters.year)
                      ?.label
                  }
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filterOptions.year.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Right side: SearchBar - Replaces Clear Filters Button */}
      <div className="py-2 px-6 flex-shrink-0">
        <SearchBar
          placeholder="Search submissions..."
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          className="w-[300px]"
        />
      </div>
    </div>
  );
};
