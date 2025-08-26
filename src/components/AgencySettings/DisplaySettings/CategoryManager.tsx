import React from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/base/Button';
import ColorDropdown from '@/components/AgencySettings/DisplaySettings/ColorDropdown';
import { Input } from '@components/base/Input';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryManagerProps {
  categories: Category[];
  loading: boolean;
  edited: Record<string, string>;
  setEdited: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  deleted: Set<string>;
  setDeleted: React.Dispatch<React.SetStateAction<Set<string>>>;
  newCategories: { name: string; color: string }[];
  setNewCategories: React.Dispatch<
    React.SetStateAction<{ name: string; color: string }[]>
  >;
  saving: boolean;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  loading,
  edited,
  setEdited,
  deleted,
  setDeleted,
  newCategories,
  setNewCategories,
  saving,
}) => {
  const handleColorChange = (id: string, color: string) => {
    setEdited((prev) => ({ ...prev, [id]: color }));
  };

  const handleDelete = (id: string) => {
    setDeleted((prev) => new Set(prev).add(id));
  };

  const handleAddCategoryClick = () => {
    setNewCategories((prev) => [...prev, { name: '', color: 'blue' }]);
  };

  const handleRemoveNewCategory = (idx: number) => {
    setNewCategories((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleNewCategoryNameChange = (idx: number, name: string) => {
    setNewCategories((prev) =>
      prev.map((cat, i) => (i === idx ? { ...cat, name } : cat)),
    );
  };

  const handleNewCategoryColorChange = (idx: number, color: string) => {
    setNewCategories((prev) =>
      prev.map((cat, i) => (i === idx ? { ...cat, color } : cat)),
    );
  };

  return (
    <div className="flex gap-4">
      <div className="min-w-72">
        Categories
        <br />
        <span className="text-sm text-muted-foreground">
          Define report categories and colors
        </span>
      </div>
      <div className="flex flex-col rounded-sm border border-secondary divide-y divide-secondary min-w-[515px]">
        <div className="flex px-4 py-2">
          <div className="text-slate-500 min-w-[320px]">Name</div>
          <div className="text-slate-500 text-center flex-1">Color</div>
        </div>
        {loading ? (
          <div className="px-4 py-4 text-slate-400">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="px-4 py-4 text-slate-400">
            <div className="min-w-[320px]">
              <span className="pl-3">No categories found.</span>
            </div>
          </div>
        ) : (
          categories
            .filter((cat) => !deleted.has(cat.id))
            .map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between px-4 items-center"
              >
                <div className="min-w-[320px]">{cat.name}</div>
                <div className="flex items-center gap-4 py-2.5">
                  <ColorDropdown
                    value={edited[cat.id] ?? cat.color}
                    onChange={(color) => handleColorChange(cat.id, color)}
                    allowCustom={true}
                  />
                  <TrashIcon
                    className="size-5 cursor-pointer"
                    onClick={() => handleDelete(cat.id)}
                  />
                </div>
              </div>
            ))
        )}
        {newCategories.map((cat, idx) => (
          <div key={idx} className="flex justify-between px-4 items-center">
            <Input
              className="border-none"
              value={cat.name}
              placeholder="Field Name"
              onChange={(e) => handleNewCategoryNameChange(idx, e.target.value)}
              disabled={saving}
            />
            <div className="flex items-center gap-4 py-2.5">
              <ColorDropdown
                value={cat.color}
                onChange={(color) => handleNewCategoryColorChange(idx, color)}
                allowCustom={true}
              />
              <TrashIcon
                className="size-5 cursor-pointer"
                onClick={() => handleRemoveNewCategory(idx)}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-end px-4 py-2">
          <Button
            variant="ghost"
            className="text-blue-500 hover:text-blue-600 w-fit mt-2"
            onClick={handleAddCategoryClick}
          >
            <PlusIcon className="size-5" />
            Add Category
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
