import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/base/Select';

export enum FilterSelectValues {
  All = 'All',
  Unread = 'Unread',
  Read = 'Read',
}

interface FilterSelectProps {
  label: string;
  value: string;
  labels: string[];
  values: string[];
  onChange: (value: FilterSelectValues) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  labels,
  values,
  onChange,
}) => {
  const index = values.findIndex((v) => v === value);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="text-slate-700 border-0 p-0 h-auto shadow-none">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4" />
          <div className="flex gap-1">
            <span className="body3-regular text-slate-700">{label}: </span>
            <span className="body3-medium text-slate-700">{labels[index]}</span>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {labels.map((label, index) => (
            <SelectItem value={values[index]} key={index}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export { FilterSelect };
