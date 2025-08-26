import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { CustomInput } from '@/components/base/CustomInput';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';

interface AddSubFolderProps {
  open: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  setEditValue: (value: string) => void;
}

const AddSubFolder: React.FC<AddSubFolderProps> = ({
  open,
  onSubmit,
  onClose,
  setEditValue,
}: AddSubFolderProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogContent className="bg-white rounded-[8px] p-0" showClose={false}>
          <DialogHeader className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
            <DialogTitle className="text-xl">Add Sub Folder</DialogTitle>
            <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
            <DialogDescription className="text-sm hidden">
              Add a sub folder to the selected folder
            </DialogDescription>
          </DialogHeader>
          <div className="px-4">
            <div className="flex flex-col gap-2">
              <CustomInput
                name="name"
                placeholder="Sub Folder Name"
                label="Sub Folder Name"
                onChange={(e) => setEditValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="p-4 border-t border-slate-200 bg-beige-100">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
              }}
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddSubFolder;
