import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';

interface AddFileFormatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (format: string) => void;
  existingFormats: string[];
}

const AddFileFormatDialog: React.FC<AddFileFormatDialogProps> = ({
  open,
  onOpenChange,
  onAdd,
  existingFormats,
}) => {
  const [format, setFormat] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validate format
    if (!format) {
      setError('Please enter a file format');
      return;
    }

    // Remove any leading dots and convert to lowercase
    const cleanFormat = format.toLowerCase().replace(/^\./, '');

    // Basic validation for file extension format
    if (!/^[a-z0-9]+$/.test(cleanFormat)) {
      setError('File format should only contain letters and numbers');
      return;
    }

    // Check if format already exists (case insensitive)
    if (existingFormats.some((f) => f.toLowerCase() === `.${cleanFormat}`)) {
      setError('This file format already exists');
      return;
    }

    // Add the format and close dialog
    onAdd(`.${cleanFormat}`);
    setFormat('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white p-0 gap-0">
        <DialogHeader className="border-b-[1px] border-slate-200 p-4">
          <DialogTitle>
            <h3 className="text-slate-700 body1-medium">Add File Format</h3>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="format" className="text-sm text-slate-700">
              File Extension
            </label>
            <Input
              id="format"
              value={format}
              onChange={(e) => {
                setFormat(e.target.value);
                setError('');
              }}
              placeholder="Enter file extension (e.g. jpg)"
              className={error ? 'border-red-500' : ''}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-slate-200">
          <Button
            variant="outline"
            className="border-slate-500 bg-white rounded-[3px] w-[72px] h-[34px]"
            onClick={() => {
              setFormat('');
              setError('');
              onOpenChange(false);
            }}
          >
            <span className="text-slate-700 button3">Cancel</span>
          </Button>
          <Button
            className="bg-blue-500 rounded-[3px] w-[72px] h-[34px]"
            onClick={handleSubmit}
          >
            <span className="text-white button3">Add</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFileFormatDialog;
