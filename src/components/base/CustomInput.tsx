import React from 'react';

import { Input } from '@/components/base/Input';

import { cn } from '@/utils/tailwind';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  inputClassName?: string;
  adornment?: JSX.Element;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  required = false,
  error,
  helperText,
  className,
  inputClassName,
  onChange,
  id,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="body2-medium text-slate-700" htmlFor={id ?? label}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Input
        id={id ?? label}
        onChange={onChange}
        className={cn(
          'border-slate-300 bg-white',
          inputClassName,
          error ? 'border-red-500 focus-visible:ring-red-500' : '',
        )}
        {...props}
      />
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export { CustomInput };
