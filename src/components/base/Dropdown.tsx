import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select';

import { cn } from '@/utils/tailwind';

interface Option {
  value: string;
  label: string;
  color?: string;
  disabled?: boolean;
  hidden?: boolean;
}

interface DropdownProps {
  label?: string;
  required?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  required = false,
  value,
  onValueChange,
  options,
  placeholder = '',
  error,
  helperText,
  className = '',
  triggerClassName = '',
  disabled,
}) => {
  return (
    <div className={cn('flex flex-col gap-1 w-full', className)}>
      {label && (
        <label className="body2-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            'border-slate-300 overflow-hidden w-full',
            error ? 'border-red-500 focus-visible:ring-red-500' : '',
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              hidden={option.hidden}
            >
              {option.color && (
                <div
                  className={cn(`w-4 h-4 rounded-sm bg-${option.color}-400`)}
                />
              )}
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* {error && <p className="text-sm text-red-500">{error}</p>} */}
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export { Dropdown };
