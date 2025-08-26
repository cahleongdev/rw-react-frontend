import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import axios from '@/api/axiosInstance';

import { bulkDeleteReports } from '@/store/slices/reportsSlice';

import { MultiDeleteReportDialogProps } from './index.types';

import MultiDeleteReportDialogComponent from '@/components/Reports/MultiDeleteReportDialog';

const MultiDeleteReportDialog: React.FC<MultiDeleteReportDialogProps> = ({
  open,
  onClose,
  selectedRows,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      // Use the bulk delete API endpoint
      const {
        data: { deleted_reports },
      } = await axios.delete('/reports/bulk/delete/', {
        data: { report_ids: selectedRows },
      });

      console.log(deleted_reports, selectedRows);
      // Update Redux store with a single action
      dispatch(bulkDeleteReports(deleted_reports || selectedRows));

      toast.success('Reports deleted successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to delete reports');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MultiDeleteReportDialogComponent
      open={open}
      onClose={onClose}
      isLoading={isLoading}
      handleDelete={handleDelete}
    />
  );
};

export default MultiDeleteReportDialog;
