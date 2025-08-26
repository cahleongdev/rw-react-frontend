import React from 'react';

import { Input } from '@/components/base/Input';

import { cn } from '@/utils/tailwind';

interface DateInputProps {
  id?: string;
  value: string;
  onChange: (date: string) => void;
  className?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  id,
  value = '',
  onChange,
  className = '',
  placeholder = 'Select a date',
  disabled,
}) => {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[38px]"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export { DateInput };
