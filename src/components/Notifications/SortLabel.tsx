import React from 'react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/base/Select';

interface SortLabelProps {
  value: 'newest' | 'oldest';
  onSort: (value: 'newest' | 'oldest') => void;
};

const SortLabel: React.FC<SortLabelProps> = ({ value, onSort }) => {
  return (
    <Select value={value} onValueChange={onSort}>
      <SelectTrigger className="text-slate-700 border-0 p-0 h-auto shadow-none">
        <div className="flex items-center gap-2">
          <ArrowsUpDownIcon className="w-4 h-4" />
          <div className="flex gap-1">
            <span className="body3-regular text-slate-700">Sort: </span>
            <span className="body3-medium text-slate-700">
              {value === 'newest' ? 'Newest First' : 'Oldest First'}
            </span>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SortLabel;
