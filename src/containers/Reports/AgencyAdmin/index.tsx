import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  TrashIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  CloudArrowDownIcon,
} from '@heroicons/react/24/outline';

import NewReportForm from '@/containers/Reports/NewReportForm';

import { fetchReportsForAgency } from '@/store/slices/reportsSlice';
import { RootState, AppDispatch } from '@/store';

import { EditedBy, ReportResponse } from '../index.types';

import ReportsComponent from '@/components/Reports/AgencyAdmin';

const Reports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { report_id } = useParams<{ report_id: string }>();
  const { pathname } = useLocation();

  const [isDeleteReportDialogOpen, setIsDeleteReportDialogOpen] =
    useState(false);
  const [selectedRow, setSelectedRow] = useState<string>('');

  // Get reports data from Redux
  const { reports, loading } = useSelector((state: RootState) => ({
    reports: state.reports.reports,
    loading: state.reports.loading,
  }));

  const { categories } = useSelector((state: RootState) => state.categories);

  // Local state
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('Draft');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [category, setCategory] = useState<string>('All');
  const [teamMember, setTeamMember] = useState<string>('All');
  const [isCreatingNewReport, setIsCreatingNewReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<
    string | null | undefined
  >(report_id);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(
    pathname.startsWith('/reports/preview') && !!report_id,
  );
  const [isEditingReport, setIsEditingReport] = useState(
    pathname.startsWith('/reports/edit') && !!report_id,
  );
  const [reportToEdit, setReportToEdit] = useState<ReportResponse | null>(null);
  const [initialEditStep, setInitialEditStep] = useState<number>(1);
  const [isDuplicateReportDialogOpen, setIsDuplicateReportDialogOpen] =
    useState(false);
  const [isMultiDeleteReportDialogOpen, setIsMultiDeleteReportDialogOpen] =
    useState(false);
  const [teamMemberOptions, setTeamMemberOptions] = useState<EditedBy[]>([]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [year, setYear] = useState<string>('All');
  const [wasDrawerOpenBeforePreview, setWasDrawerOpenBeforePreview] =
    useState(false);

  // Fetch data using the thunk
  const fetchData = useCallback(() => {
    // The thunk will handle loading state and setting reports/totalItems.
    // It also checks for agencyId internally.
    dispatch(fetchReportsForAgency());
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
        report.schedules.forEach((schedule) => {
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

  const handleDeleteReport = (reportId: string) => {
    setSelectedRow(reportId);
    setIsDeleteReportDialogOpen(true);
  };

  // Create action buttons for each report
  const createActionButtons = (reportId: string) => (
    <div className="flex justify-end gap-2">
      <button
        className="rounded-md hover:bg-slate-100"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteReport(reportId);
        }}
      >
        <TrashIcon className="h-6 w-6" />
      </button>
      <Link
        to={`/reports/edit/${reportId}`}
        className="rounded-md hover:bg-slate-100"
      >
        <button
          className="rounded-md hover:bg-slate-100 mt-[3px]"
          onClick={() => {
            handleEditReport(reportId);
          }}
          type="button"
        >
          <PencilIcon className="h-6 w-6" />
        </button>
      </Link>
      <button
        className="rounded-md hover:bg-slate-100"
        onClick={(e) => {
          e.stopPropagation();
          handleDuplicateReport(reportId);
        }}
      >
        <DocumentDuplicateIcon className="h-6 w-6" />
      </button>
      <button
        className="rounded-md hover:bg-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <CloudArrowDownIcon className="h-6 w-6" />
      </button>
    </div>
  );

  // Handle row selection
  const toggleSelectAll = () => {
    if (selectedRows.length === reports.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(reports.map((report) => report.id));
    }
  };

  // Navigation handlers
  const handleEditReport = (reportId: string) => {
    // Find the report to edit
    const reportToEdit = reports.find((report) => report.id === reportId);
    if (reportToEdit) {
      setReportToEdit(reportToEdit);
      setIsEditingReport(true);
    }
  };

  const handleRowClick = (report: ReportResponse) => {
    setSelectedReport(report.id);
    setIsDrawerOpen(true);
  };

  const handleDuplicateReport = (reportId: string) => {
    setSelectedRow(reportId);
    setIsDuplicateReportDialogOpen(true);
  };

  // Fetch data on component mount or when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!!report_id && reports.length > 0) {
      handleEditReport(report_id);
    }
  }, [reports.length]);

  // Add a new function to handle section-specific editing
  const handleEditSection = (
    reportId: string,
    section: 'details' | 'schedule' | 'submission' | 'scoring',
  ) => {
    // Find the report to edit
    const reportToEdit = reports.find((report) => report.id === reportId);

    if (reportToEdit) {
      setReportToEdit(reportToEdit);

      // Set the initial step based on the section
      switch (section) {
        case 'details':
          setInitialEditStep(1); // Setup step
          break;
        case 'schedule':
          setInitialEditStep(2); // Schedule step
          break;
        case 'submission':
          setInitialEditStep(3); // Submission step
          break;
        case 'scoring':
          setInitialEditStep(4); // Scoring step
          break;
        default:
          setInitialEditStep(1);
      }

      setIsDrawerOpen(false); // Close the drawer
      setIsEditingReport(true); // Open the edit form
    }
  };

  const [filteredReports, setFilteredReports] = useState<ReportResponse[]>([]);

  // Use useEffect to update filteredReports whenever reports, activeFilter, searchText, or sortOrder changes
  useEffect(() => {
    // First filter by status (Draft, Ready, Assigned)
    let filtered = reports;
    switch (activeFilter) {
      case 'Draft':
        filtered = reports.filter((report) => !report.approved);
        break;
      case 'Ready':
        filtered = reports.filter(
          (report) =>
            report.approved &&
            (!report.assigned_schools || report.assigned_schools.length === 0),
        );
        break;
      case 'Assigned':
        filtered = reports.filter(
          (report) =>
            report.approved &&
            report.assigned_schools &&
            report.assigned_schools.length > 0,
        );
        break;
    }

    // Then filter by search text if provided
    if (searchText.trim()) {
      filtered = filtered.filter((report) =>
        report.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    filtered = filtered
      .filter(
        (report) => category === 'All' || report.categories.includes(category),
      )
      .filter(
        (report) =>
          teamMember === 'All' ||
          (!!report.edited_by && report.edited_by.id === teamMember),
      )
      .filter(
        (report) =>
          year === 'All' ||
          report.schedules.some(
            (schedule) => schedule.schedule_time.substring(0, 4) === year,
          ),
      );

    // Sort by due date (using the first schedule's date if available)
    filtered = filtered.sort((a, b) => {
      const getEarliestDate = (report: ReportResponse) => {
        if (!report.schedules || report.schedules.length === 0) return 0;

        return Math.min(
          ...report.schedules.map((schedule) =>
            new Date(schedule.schedule_time).getTime(),
          ),
        );
      };
      // Get the earliest due date from each report's schedules
      const aDate = getEarliestDate(a);
      const bDate = getEarliestDate(b);

      // Sort based on sortOrder
      if (aDate === bDate) {
        if (sortOrder === 'newest') {
          return a.id > b.id ? 1 : -1;
        } else {
          return b.id > a.id ? 1 : -1;
        }
      }
      return sortOrder === 'newest'
        ? bDate - aDate // For newest, larger timestamps (more recent) come first
        : aDate - bDate; // For oldest, smaller timestamps (less recent) come first
    });

    setFilteredReports(filtered);
  }, [
    reports,
    activeFilter,
    searchText,
    sortOrder,
    selectedRows,
    category,
    teamMember,
    year,
  ]);

  // Add a handler for preview requests
  const handlePreviewRequest = (report: ReportResponse) => {
    setSelectedReport(report.id);
    setIsPreviewOpen(true);
  };

  const handleTabChange = (newTab: string) => {
    setActiveFilter(newTab);
    setSelectedRows([]);
    setCategory('All');
    setTeamMember('All');
    setYear('All');
  };

  if (isCreatingNewReport && !isPreviewOpen) {
    return (
      <NewReportForm
        onCancel={() => setIsCreatingNewReport(false)}
        onPreviewRequest={handlePreviewRequest}
      />
    );
  }

  if (isEditingReport && reportToEdit && !isPreviewOpen) {
    return (
      <NewReportForm
        onCancel={() => setIsEditingReport(false)}
        initialData={reportToEdit}
        initialStep={initialEditStep}
        onPreviewRequest={handlePreviewRequest}
      />
    );
  }

  return (
    <ReportsComponent
      isPreviewOpen={isPreviewOpen}
      selectedReport={selectedReport}
      setIsPreviewOpen={setIsPreviewOpen}
      wasDrawerOpenBeforePreview={wasDrawerOpenBeforePreview}
      setIsDrawerOpen={setIsDrawerOpen}
      setWasDrawerOpenBeforePreview={setWasDrawerOpenBeforePreview}
      isCreatingNewReport={isCreatingNewReport}
      setIsCreatingNewReport={setIsCreatingNewReport}
      handlePreviewRequest={handlePreviewRequest}
      isEditingReport={isEditingReport}
      reportToEdit={reportToEdit}
      setIsEditingReport={setIsEditingReport}
      initialEditStep={initialEditStep}
      handleTabChange={handleTabChange}
      activeFilter={activeFilter}
      selectedRows={selectedRows}
      isMultiDeleteReportDialogOpen={isMultiDeleteReportDialogOpen}
      setIsMultiDeleteReportDialogOpen={setIsMultiDeleteReportDialogOpen}
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
      reports={reports}
      toggleSelectAll={toggleSelectAll}
      filteredReports={filteredReports}
      handleRowClick={handleRowClick}
      setSelectedRows={setSelectedRows}
      createActionButtons={createActionButtons}
      isDrawerOpen={isDrawerOpen}
      handleEditSection={handleEditSection}
      isDeleteReportDialogOpen={isDeleteReportDialogOpen}
      setIsDeleteReportDialogOpen={setIsDeleteReportDialogOpen}
      selectedRow={selectedRow}
      isDuplicateReportDialogOpen={isDuplicateReportDialogOpen}
      setIsDuplicateReportDialogOpen={setIsDuplicateReportDialogOpen}
    />
  );
};

export default Reports;
