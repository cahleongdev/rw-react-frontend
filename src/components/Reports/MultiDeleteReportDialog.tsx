import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';

interface MultiDeleteReportDialogProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  handleDelete: () => void;
}

const MultiDeleteReportDialog: React.FC<MultiDeleteReportDialogProps> = ({
  open,
  onClose,
  isLoading,
  handleDelete
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col sm:max-w-[423px] p-0 gap-0 h-[300px]">
        <DialogHeader className="flex flex-row justify-between p-4 border-b border-slate-200">
          <h3>Delete Reports?</h3>
        </DialogHeader>
        <div className="p-6 flex-1">
          <p className="body1-regular text-slate-600">
            This will remove the reports from all users. Are you sure you want
            to delete?
          </p>
        </div>
        <DialogFooter className="p-4 border-t border-beige-300 bg-beige-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-700 h-[34px] w-[72px] rounded-[6px] border-slate-700"
          >
            <span className="button3-semibold text-slate-700">Cancel</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isLoading}
            className="border-red-500 text-red-500 h-[34px] w-[72px] rounded-[6px] border-red-500"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MultiDeleteReportDialog;
