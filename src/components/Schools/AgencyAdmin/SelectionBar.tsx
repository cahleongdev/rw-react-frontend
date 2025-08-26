import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/base/Button';

interface SelectionBarProps {
  selectedCount: number;
  activeTab: 'schools' | 'users';
  onDelete?: () => void;
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  activeTab,
  onDelete,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex w-full gap-4 h-[56px] items-center p-[0px_24px] border-b-[1px] border-beige-300 bg-orange-50">
      <div className="flex items-center gap-2">
        <h5>
          {selectedCount} {activeTab === 'schools' ? 'schools' : 'users'}{' '}
          selected
        </h5>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="border-slate-500 h-[36px] p-[10px]"
          onClick={onDelete}
        >
          <TrashIcon className="h-6 w-6 text-slate-500" />
        </Button>
      </div>
    </div>
  );
};

export default SelectionBar;
