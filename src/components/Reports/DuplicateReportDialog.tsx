import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';

interface DuplicateReportDialogProps {
  isLoading: boolean;
  handleDuplicate: () => void;
  open: boolean;
  onClose: () => void;
}

const DuplicateReportDialog: React.FC<DuplicateReportDialogProps> = ({
  isLoading,
  handleDuplicate,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col sm:max-w-[423px] p-0 gap-0 h-[300px] bg-white">
        <DialogHeader className="flex flex-row justify-between p-4 border-b border-slate-200">
          <h3>Duplicate Report?</h3>
        </DialogHeader>
        <div className="p-6 flex-1">
          <p className="body1-regular text-slate-600">
            This will create a new report with the same information. You'll be
            taken through the new report process to verify the information.
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
            variant="default"
            onClick={handleDuplicate}
            disabled={isLoading}
            className="bg-blue-500 text-white h-[34px] w-[140px] rounded-[6px]"
          >
            {isLoading ? 'Creating...' : 'Create from Copy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateReportDialog;
