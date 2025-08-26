import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import axios from '@/api/axiosInstance';

import { deleteReport } from '@/store/slices/reportsSlice';

import { DeleteReportDialogProps } from './index.types';

import DeleteReportDialogComponent from '@/components/Reports/DeleteReportDialog';

const DeleteReportDialog: React.FC<DeleteReportDialogProps> = ({
  open,
  onClose,
  selectedRow,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await axios.delete(`/reports/${selectedRow}/`);

      dispatch(deleteReport(selectedRow));
      console.log(selectedRow);
      onClose();
      toast.success('Report deleted successfully');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to delete report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DeleteReportDialogComponent
      open={open}
      onClose={onClose}
      isLoading={isLoading}
      handleDelete={handleDelete}
    />
  );
};

export default DeleteReportDialog;