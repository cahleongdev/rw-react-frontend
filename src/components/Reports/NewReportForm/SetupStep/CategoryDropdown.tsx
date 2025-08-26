import React, { useState, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid';

import { Badge } from '@/components/base/Badge';
import { Button } from '@/components/base/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/base/Popover';

import { cn } from '@/utils/tailwind';
import { getCategoryColors } from '@/utils/categoryColors';

import { Category } from '@/containers/Reports/index.types';

import AddCategoryDialog from './AddCategoryDialog';

interface CategoryDropdownProps {
  options: Category[];
  selectedCategories: string[];
  label?: string;
  onChange: (selected: string[]) => void;
  className?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  allowAddNew?: boolean;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  options,
  selectedCategories,
  label,
  onChange,
  className,
  error,
  helperText,
  required = false,
  // allowAddNew = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (categoryValue: Category) => {
    const newSelection = selectedCategories.includes(categoryValue.id)
      ? selectedCategories.filter((item) => item !== categoryValue.id)
      : [...selectedCategories, categoryValue.id];
    onChange(newSelection);
  };

  const removeCategory = (categoryValue: string) => {
    onChange(selectedCategories.filter((item) => item !== categoryValue));
  };

  const addNewCategory = (categoryName: Category) => {
    if (
      categoryName &&
      !options.some((opt) => opt.id === categoryName.id) &&
      !selectedCategories.includes(categoryName.id)
    ) {
      onChange([...selectedCategories, categoryName.id]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="body2-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            ref={containerRef}
            className={cn(
              'flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer bg-white',
              error
                ? 'border-red-500'
                : 'border-slate-300 hover:border-slate-400',
              className,
            )}
          >
            <div className="flex flex-wrap gap-2">
              {selectedCategories.length > 0 ? (
                selectedCategories.map((categoryValue) => {
                  const category = options.find((c) => c.id === categoryValue);
                  const colors = category
                    ? getCategoryColors(category.color)
                    : getCategoryColors('slate');
                  return (
                    <Badge
                      key={categoryValue}
                      variant="outline"
                      className={cn(
                        'text-slate-700 hover:bg-slate-100 cursor-pointer',
                        colors.background,
                        colors.border,
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCategory(categoryValue);
                      }}
                    >
                      {category?.name}
                      <XMarkIcon className="ml-1 h-3 w-3" />
                    </Badge>
                  );
                })
              ) : (
                <span className="text-slate-500 text-sm">
                  Select categories
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              {selectedCategories.length > 0 && (
                <span className="text-sm">+{selectedCategories.length}</span>
              )}
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg"
          style={{ width: containerRef.current?.offsetWidth }}
        >
          <div className="flex flex-col">
            {options.map((option) => {
              const isSelected = selectedCategories.includes(option.id);
              const colors = getCategoryColors(option.color);

              return (
                <div
                  key={option.id}
                  className={cn(
                    'flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0',
                    isSelected && 'bg-slate-50',
                  )}
                  onClick={() => toggleCategory(option)}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-[3px] mr-3',
                      colors.background,
                      colors.border,
                      'border',
                    )}
                  />
                  <span className="text-sm font-medium">{option.name}</span>
                </div>
              );
            })}

            <div className="border-t border-slate-200 p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                onClick={() => {
                  setIsOpen(false);
                  setIsAddDialogOpen(true);
                }}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add category
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <AddCategoryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddCategory={addNewCategory}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default CategoryDropdown;
