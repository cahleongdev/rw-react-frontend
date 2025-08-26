import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';

import ReportPreviewComponent from '@/components/Reports/ReportPreview/AgencyAdmin';

interface ReportPreviewProps {
  reportId: string;
  onClose: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ reportId, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [selectedFile, setSelectedFile] = useState<{
    file_url: string;
    file_name: string;
  } | null>(null);
  const { categories } = useSelector((state: RootState) => state.categories);

  const report = useSelector((state: RootState) =>
    state.reports.reports.find((report) => report.id === reportId),
  );

  if (!report) return null;

  const onUpdate = (
    updatedFileUrls: {
      file_url: string;
      file_name: string;
    }[],
  ) => {
    console.log(updatedFileUrls);
  };

  return (
    <ReportPreviewComponent
      report={report}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      categories={categories}
      selectedFile={selectedFile}
      setSelectedFile={setSelectedFile}
      onUpdate={onUpdate}
      onClose={onClose}
    />
  );
};

export default ReportPreview;
