import { cn } from '@/utils/tailwind';

interface TabProps<T extends string> {
  labels: T[];
  active: T;
  onTabChange: (newTab: T) => void;
}

const TabHeader = <T extends string>({
  labels,
  active,
  onTabChange,
}: TabProps<T>) => {
  return (
    <div className="flex flex-row">
      {labels.map((label) => (
        <div
          className={cn(
            'px-6 py-3 body1-regular cursor-pointer',
            active === label
              ? 'text-orange-500 border-b-4 border-orange-500'
              : 'text-slate-500',
          )}
          key={label}
          onClick={() => (active !== label ? onTabChange(label) : '')}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default TabHeader;
