import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import axios from '@/api/axiosInstance';

import { RootState, AppDispatch } from '@/store';
import { updateReport } from '@/store/slices/reportsSlice';
import { School, setSchools, setTotalItems } from '@/store/slices/schoolsSlice';
import {
  setLoading,
  setError,
  setActivityLogs,
  addActivityLog,
  ActivityLog,
} from '@/store/slices/activityLogSlice';
import { setLoading as setReportLoading } from '@/store/slices/reportsSlice';

import { SchoolResponse } from '@/store/slices/schoolsSlice';

import ReportInfoDrawerComponent from '@/components/Reports/ReportInfoDrawer';

interface ReportInfoDrawerProps {
  reportId: string;
  open: boolean;
  onClose: () => void;
  onPreviewOpen: () => void;
  onEditSection?: (
    reportId: string,
    section: 'details' | 'schedule' | 'submission' | 'scoring',
  ) => void;
}

const ReportInfoDrawer: React.FC<ReportInfoDrawerProps> = ({
  reportId,
  open,
  onClose,
  onPreviewOpen,
  onEditSection,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAssignSchoolsOpen, setIsAssignSchoolsOpen] = useState(false);
  const [reportNames, setReportNames] = useState<Record<string, string>>({});
  const [showApproveDropdown, setShowApproveDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [currentTab, setCurrentTab] = useState('details');

  const categoryOptions = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const storeSchools = useSelector((state: RootState) => state.schools.schools);
  const report = useSelector((state: RootState) =>
    state.reports.reports.find((report) => report.id === reportId),
  );

  const [schoolsData, setSchoolsData] = useState<SchoolResponse[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  const { logs: allActivityLogs, loading: loadingActivity } = useSelector(
    (state: RootState) => state.activityLogs,
  );

  const activityLogs = allActivityLogs[reportId] || [];

  const { user } = useSelector((state: RootState) => state.auth);

  const fetchReportActivityLogs = useCallback(async () => {
    if (!reportId) return;

    // Check if we already have logs for this report
    if (activityLogs.length > 0) {
      return; // Skip fetching if we already have logs
    }

    dispatch(setLoading(true));
    try {
      const response = await axios.get<ActivityLog[]>(
        `/reports/activities/?report_id=${reportId}`,
      );
      dispatch(setActivityLogs({ reportId, logs: response.data }));
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      dispatch(setError('Failed to fetch activity logs'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [reportId, dispatch, activityLogs.length]);

  const fetchSchoolsData = useCallback(async () => {
    if (!reportId) return;

    try {
      setLoadingSchools(true);

      let schools = storeSchools;
      if (schools.length === 0) {
        const schoolsResponse = await axios.get<School[]>(
          '/schools/agency_admin/',
        );
        schools = schoolsResponse.data;

        dispatch(setSchools(schools));
        dispatch(setTotalItems(schools.length));
      }

      const assignedSchools = schools.filter(
        (school: SchoolResponse) =>
          report?.assigned_schools &&
          report.assigned_schools.some(
            (assignedSchool: School) => assignedSchool.id === school.id,
          ),
      );

      setSchoolsData(assignedSchools);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoadingSchools(false);
    }
  }, [report, storeSchools, dispatch, reportId]);

  useEffect(() => {
    if (report && currentTab === 'schools') {
      fetchSchoolsData();
    }
  }, [report, currentTab, fetchSchoolsData]);

  useEffect(() => {
    if (report && currentTab === 'details') {
      fetchReportActivityLogs();
    }
  }, [report, currentTab, fetchReportActivityLogs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowApproveDropdown(false);
      }
    };

    if (showApproveDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showApproveDropdown]);

  if (!report) return null;

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'schools', label: 'Schools' },
  ];

  const handleReportNameChange = (date: string, name: string) => {
    setReportNames((prev) => ({
      ...prev,
      [date]: name,
    }));
  };

  const handleResetName = (date: string) => {
    const newReportNames = { ...reportNames };
    delete newReportNames[date];
    setReportNames(newReportNames);
  };

  const handleApproveAndAssignSchools = async () => {
    try {
      dispatch(setReportLoading(true));
      // Make API request to approve the report
      await axios.put(`/reports/${report.id}/`, {
        approved: true,
      });

      // Update the report in Redux store
      dispatch(
        updateReport({
          id: report.id,
          updates: { approved: true },
        }),
      );

      // Close dropdown and open assign schools dialog
      setShowApproveDropdown(false);
      setIsAssignSchoolsOpen(true);
    } catch (error) {
      console.error('Error approving report:', error);
      toast.error('Failed to approve report');
    }
    dispatch(setReportLoading(false));
  };

  const handleApproveAndClose = async () => {
    try {
      dispatch(setReportLoading(true));
      // Make API request to approve the report
      await axios.put(`/reports/${report.id}/`, {
        approved: true,
      });

      dispatch(
        updateReport({
          id: report.id,
          updates: { approved: true },
        }),
      );

      // Close the dropdown and drawer
      setShowApproveDropdown(false);
      onClose();
      dispatch(setReportLoading(false));
    } catch (error) {
      // Handle error
      console.error('Error approving report:', error);
      // You could add error notification here
    }
    dispatch(setReportLoading(false));
  };

  // Add this to prevent drawer from closing when dialog is open
  const handleDrawerClose = () => {
    if (!isAssignSchoolsOpen) {
      onClose();
    }
  };

  // Update the edit buttons to call onEditSection with the appropriate section
  const handleEditDetails = () => {
    if (report && onEditSection) {
      onEditSection(report.id, 'details');
    }
  };

  // For Schedule section
  const handleEditSchedule = () => {
    if (report && onEditSection) {
      onEditSection(report.id, 'schedule');
    }
  };

  // For Submission Instructions section
  const handleEditSubmission = () => {
    if (report && onEditSection) {
      onEditSection(report.id, 'submission');
    }
  };

  // For Scoring section
  const handleEditScoring = () => {
    if (report && onEditSection) {
      onEditSection(report.id, 'scoring');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!reportId || !content.trim()) return;

    try {
      // Send the message to the API
      const response = await axios.post<ActivityLog>('/reports/activities/', {
        report: reportId,
        content: content.trim(),
      });

      // Update the Redux store with the new log
      dispatch(addActivityLog({ reportId, log: response.data }));
    } catch (error) {
      console.error('Error sending activity message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <ReportInfoDrawerComponent
      open={open}
      handleDrawerClose={handleDrawerClose}
      setCurrentTab={setCurrentTab}
      report={report}
      onPreviewOpen={onPreviewOpen}
      setIsAssignSchoolsOpen={setIsAssignSchoolsOpen}
      dropdownRef={dropdownRef}
      setShowApproveDropdown={setShowApproveDropdown}
      showApproveDropdown={showApproveDropdown}
      handleApproveAndAssignSchools={handleApproveAndAssignSchools}
      handleApproveAndClose={handleApproveAndClose}
      tabs={tabs}
      currentTab={currentTab}
      handleEditDetails={handleEditDetails}
      categoryOptions={categoryOptions}
      handleEditSchedule={handleEditSchedule}
      reportNames={reportNames}
      handleReportNameChange={handleReportNameChange}
      handleResetName={handleResetName}
      handleEditSubmission={handleEditSubmission}
      handleEditScoring={handleEditScoring}
      loadingActivity={loadingActivity}
      activityLogs={activityLogs}
      handleSendMessage={handleSendMessage}
      loadingSchools={loadingSchools}
      schoolsData={schoolsData}
      isPreviewOpen={isPreviewOpen}
      reportId={reportId}
      setIsPreviewOpen={setIsPreviewOpen}
      isAssignSchoolsOpen={isAssignSchoolsOpen}
      fetchSchoolsData={fetchSchoolsData}
      role={user?.role}
    />
  );
};

export default ReportInfoDrawer;
