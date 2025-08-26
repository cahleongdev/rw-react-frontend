import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { TransparencySubFolder } from '@containers/Transparency/index.types';

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

interface EditSubFolderProps {
  open: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  setEditValue: (value: string) => void;
  subFolder: TransparencySubFolder;
  editValue: string;
  deleteSubFolder: (subFolderId: string) => void;
}

const EditSubFolder: React.FC<EditSubFolderProps> = ({
  open,
  onSubmit,
  onClose,
  setEditValue,
  subFolder,
  editValue,
  deleteSubFolder,
}: EditSubFolderProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogContent className="bg-white rounded-[8px] p-0" showClose={false}>
          <DialogHeader className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
            <DialogTitle className="text-xl">Edit Sub Folder</DialogTitle>
            <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
            <DialogDescription className="text-sm hidden">
              Edit the name of the sub folder
            </DialogDescription>
          </DialogHeader>
          <div className="px-4">
            <div className="flex flex-col gap-2">
              <CustomInput
                name="name"
                placeholder={subFolder.name}
                label="Sub Folder Name"
                onChange={(e) => setEditValue(e.target.value)}
                value={editValue}
              />
            </div>
          </div>
          <DialogFooter className="p-4 border-t border-slate-200 bg-beige-100">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => deleteSubFolder(subFolder.id)}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
              <div className="flex flex-row gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={(e) => {
                    handleSubmit(
                      e as unknown as React.FormEvent<HTMLFormElement>,
                    );
                  }}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditSubFolder;
