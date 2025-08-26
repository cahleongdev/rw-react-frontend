import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Category } from '@/containers/Reports/index.types';

import { getCategoryColors } from '@/utils/categoryColors';

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select';

import { cn } from '@/utils/tailwind';

import { addCategory } from '@/store/slices/categoriesSlice';

import axios from '@/api/axiosInstance';

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (category: Category) => void;
}

const COLORS = [
  { value: 'green', label: 'Green' },
  { value: 'orange', label: 'Orange' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'purple', label: 'Purple' },
  { value: 'yellow', label: 'Yellow' },
];

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  open,
  onOpenChange,
  onAddCategory,
}) => {
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('green');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!categoryName.trim()) return;

    setIsLoading(true);

    try {
      // Make API call to create a new category
      const response = await axios.post(
        '/reports/categories/report_category/',
        {
          name: categoryName.trim(),
          color: selectedColor,
        },
      );

      // Create a category object with the response data
      const newCategory: Category = {
        id: response.data.id,
        name: categoryName.trim(),
        color: selectedColor,
      };

      // Update Redux store
      dispatch(addCategory(newCategory));

      // Call the onAddCategory callback
      onAddCategory(newCategory);

      // Reset form and close dialog
      setCategoryName('');
      setSelectedColor('green');
      onOpenChange(false);

      // Show success toast
      toast.success('Category created successfully');
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error('Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white" showClose={true}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create custom category
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              placeholder="Value"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-color">Color</Label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger id="category-color" className="w-[140px]">
                <SelectValue placeholder="Select a color">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        'w-4 h-4 rounded-sm mr-2',
                        getCategoryColors(selectedColor).background,
                      )}
                    />
                    <span className="capitalize">{selectedColor}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COLORS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center">
                      <div
                        className={cn(
                          'w-4 h-4 rounded-sm mr-2',
                          getCategoryColors(color.value).background,
                        )}
                      />
                      <span className="capitalize">{color.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!categoryName.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
