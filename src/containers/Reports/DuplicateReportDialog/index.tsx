import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { createReportOnServer } from '@/store/slices/reportsSlice';

import { DuplicateReportDialogProps } from './index.types';

import DuplicateReportDialogComponent from '@/components/Reports/DuplicateReportDialog';

import { AppDispatch, RootState } from '@store/index';

const DuplicateReportDialog: React.FC<DuplicateReportDialogProps> = ({
  open,
  onClose,
  selectedRow,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get reports data from Redux, to reuse report details and make copy
  const { reports } = useSelector((state: RootState) => ({
    reports: state.reports.reports,
  }));

  const handleDuplicate = async () => {
    setIsLoading(true);

    try {
      // Create a new report with the same data as the selected report
      const reportDetails = reports.find((report) => report.id === selectedRow);

      if (!reportDetails) return;

      const { name } = reportDetails;
      const copyName = `Copy of ${name}`;

      // Add the new report to the Redux store
      dispatch(
        createReportOnServer({
          report: {
            ...reportDetails,
            name: copyName,
          },
          agency: user?.agency,
        }),
      );

      onClose();
      onSuccess?.();
      toast.success('Report duplicated successfully');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to duplicate report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DuplicateReportDialogComponent
      open={open}
      onClose={onClose}
      isLoading={isLoading}
      handleDuplicate={handleDuplicate}
    />
  );
};

export default DuplicateReportDialog;
