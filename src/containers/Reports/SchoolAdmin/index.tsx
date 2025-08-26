import React, { useEffect, useState, useCallback, useMemo } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

import {
  // setReports,
  // setLoading,
  fetchReportsForAgency,
} from '@/store/slices/reportsSlice';
import { RootState, AppDispatch } from '@/store';
import { EditedBy, ReportResponse, Schedule } from '../index.types'; // Relative import OK if in same feature folder
import {
  Submission,
  fetchSubmissions,
  assignUserToSubmissions,
} from '@/store/slices/submissionsSlice';
import {
  SchoolUser,
  fetchAllSchoolUsers,
} from '@/store/slices/schoolUsersSlice'; // Import fetchAllSchoolUsers
import ReportsComponent from '@/components/Reports/SchoolAdmin';

// Remove unused mock data
/*
const mockSchools = [
  // ...
];
*/

/*
const mockUsers = [
  // ...
];
*/

const Reports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { report_id } = useParams<{ report_id: string }>();

  const [isDeleteReportDialogOpen, setIsDeleteReportDialogOpen] =
    useState(false);
  const [selectedRow] = useState<string>('');
  const [isSubmissionDrawerOpen, setIsSubmissionDrawerOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  // Get reports data from Redux
  const { reports, loading } = useSelector((state: RootState) => ({
    reports: state.reports.reports,
    loading: state.reports.loading,
  }));

  const { categories } = useSelector((state: RootState) => state.categories);

  // Local state
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [category, setCategory] = useState<string>('All');
  const [teamMember, setTeamMember] = useState<string>('All');
  const [year, setYear] = useState<string>('All');
  const [teamMemberOptions, setTeamMemberOptions] = useState<EditedBy[]>([]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<
    string | null | undefined
  >(report_id);
  const [selectedSubmissionIdForPreview, setSelectedSubmissionIdForPreview] =
    useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(!!report_id);
  const [isDuplicateReportDialogOpen, setIsDuplicateReportDialogOpen] =
    useState(false);
  const [isMultiDeleteReportDialogOpen, setIsMultiDeleteReportDialogOpen] =
    useState(false);

  // Get submissions from Redux
  const submissions = useSelector(
    (state: RootState) => state.submissions.submissions,
  );

  // Get all school users (needed for UserClickDropdown and Owner column)
  const allSchoolUsers = useSelector(
    (state: RootState) => state.schoolUsers.schoolUsers,
  );

  // Get selected school ID for admin from UI state
  const selectedSchoolId = useSelector(
    (state: RootState) => state.uiState.selectedSchoolIdForAdmin,
  );

  // Fetch data using the thunk
  const fetchData = useCallback(() => {
    dispatch(fetchReportsForAgency());
    dispatch(fetchAllSchoolUsers());
    dispatch(fetchSubmissions());
  }, [dispatch]);

  // useEffect to derive teamMemberOptions and yearOptions when reports change
  useEffect(() => {
    if (reports && reports.length > 0) {
      const newMembers: EditedBy[] = [];
      reports.forEach((report) => {
        if (report.edited_by) {
          const { id } = report.edited_by;
          if (!newMembers.find((member) => member.id === id)) {
            newMembers.push(report.edited_by);
          }
        }
      });
      setTeamMemberOptions([...newMembers]);

      const newYearOptions: string[] = [];
      reports.forEach((report) =>
        report.schedules.forEach((schedule: Schedule) => {
          const yearValue = schedule.schedule_time.substring(0, 4);
          if (!newYearOptions.includes(yearValue)) {
            newYearOptions.push(yearValue);
          }
        }),
      );
      setYearOptions([...newYearOptions]);
    } else {
      setTeamMemberOptions([]);
      setYearOptions([]);
    }
  }, [reports]);

  // Create action buttons for each report
  const createActionButtons = () => (
    <div className="flex justify-end gap-2">
      <button
        className="rounded-md hover:bg-slate-100"
        onClick={(e) => {
          e.stopPropagation();
          setIsPreviewOpen(true);
        }}
      >
        <ChatBubbleLeftIcon className="h-6 w-6" />
      </button>
    </div>
  );

  // Handle row selection
  const toggleSelectAll = () => {
    if (selectedRows.length === submissions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(submissions.map((submission) => submission.id));
    }
  };

  const handleRowClick = (report: ReportResponse) => {
    navigate(`/reports/${report.id}`);
    setSelectedReport(report.id);
    setSelectedSubmissionIdForPreview(null);
    setIsPreviewOpen(true);
  };

  const handleSubmissionRowClick = (submission: Submission) => {
    const parentReport = reports.find((r) =>
      r.schedules.some((s) => s.id === submission.report_schedule),
    );
    if (parentReport) {
      setSelectedReport(parentReport.id);
      setSelectedSubmissionIdForPreview(submission.id);
      setIsPreviewOpen(true);
    } else {
      console.error('Could not find parent report for submission:', submission);
    }
  };

  const handleAssignSchedules = (user: SchoolUser | null) => {
    if (selectedRows.length > 0) {
      dispatch(
        assignUserToSubmissions({
          userToAssign: user,
          submission_ids: selectedRows,
        }),
      );
      setSelectedRows([]); // Clear selection after assignment
    }
  };

  const handleAssignUserToSingleSubmission = (
    submissionId: string,
    userToAssign: SchoolUser | null,
  ) => {
    dispatch(
      assignUserToSubmissions({ userToAssign, submission_ids: [submissionId] }),
    );
    // Optionally, clear row-specific dropdown state if it were managed here,
    // but it's managed in the child component, which is fine.
  };

  // Fetch data on component mount or when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get the filtered reports based on active tab
  const filteredReports = useMemo(() => {
    if (!reports || !selectedSchoolId) return [];
    return reports
      .map((report) => ({
        ...report,
        // Only keep schedules if this report is assigned to the selected school
        schedules: report.schedules,
        assigned_schools: report.assigned_schools.filter(
          (school) => school.id === selectedSchoolId,
        ),
      }))
      .filter((report) => report.assigned_schools.length > 0);
  }, [reports, selectedSchoolId]);

  const filteredSubmissions = useMemo(() => {
    if (!submissions || !selectedSchoolId) return [];
    return submissions.filter((sub) => sub.school === selectedSchoolId);
  }, [submissions, selectedSchoolId]);

  return (
    <ReportsComponent
      isPreviewOpen={isPreviewOpen}
      setIsPreviewOpen={setIsPreviewOpen}
      selectedReport={selectedReport}
      selectedSubmissionId={selectedSubmissionIdForPreview}
      selectedRows={selectedRows}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      categories={categories}
      category={category}
      setCategory={setCategory}
      teamMemberOptions={teamMemberOptions}
      teamMember={teamMember}
      setTeamMember={setTeamMember}
      yearOptions={yearOptions}
      year={year}
      setYear={setYear}
      searchText={searchText}
      setSearchText={setSearchText}
      loading={loading}
      reports={filteredReports}
      submissions={filteredSubmissions}
      toggleSelectAll={toggleSelectAll}
      filteredReports={filteredReports}
      handleRowClick={handleRowClick}
      handleSubmissionRowClick={handleSubmissionRowClick}
      setSelectedRows={setSelectedRows}
      createActionButtons={createActionButtons}
      isDeleteReportDialogOpen={isDeleteReportDialogOpen}
      setIsDeleteReportDialogOpen={setIsDeleteReportDialogOpen}
      selectedRow={selectedRow}
      isDuplicateReportDialogOpen={isDuplicateReportDialogOpen}
      setIsDuplicateReportDialogOpen={setIsDuplicateReportDialogOpen}
      fetchData={fetchData}
      isMultiDeleteReportDialogOpen={isMultiDeleteReportDialogOpen}
      setIsMultiDeleteReportDialogOpen={setIsMultiDeleteReportDialogOpen}
      isSubmissionDrawerOpen={isSubmissionDrawerOpen}
      setIsSubmissionDrawerOpen={setIsSubmissionDrawerOpen}
      selectedSubmission={selectedSubmission}
      setSelectedSubmission={setSelectedSubmission}
      allSchoolUsers={allSchoolUsers}
      handleAssignSchedules={handleAssignSchedules}
      onAssignUserToSingleSubmission={handleAssignUserToSingleSubmission}
    />
  );
};

export default Reports;
