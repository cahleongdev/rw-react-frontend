import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { Input } from '@/components/base/Input';

import { cn } from '@/utils/tailwind';

interface SearchBarProps {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string;
}

const SearchBar = ({
  placeholder = 'Search',
  onChange = () => {},
  className = '',
  value = '',
}: SearchBarProps) => {
  return (
    <div className={cn('relative flex items-center rounded-[6px]', className)}>
      {/* Search Icon */}
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-1" />

      {/* Input Field */}
      <Input
        type="text"
        placeholder={placeholder}
        className={cn(
          'pl-10 py-3 border border-slate-300 bg-white text-slate-500 text-xs',
          className,
        )}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export { SearchBar };
