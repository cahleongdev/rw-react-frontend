import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JSZip from 'jszip';
import axios from 'axios';

import * as XLSX from 'xlsx';

import { getContentTypeFromFilename } from '@/utils/file';

import { RootState, AppDispatch } from '@/store';
import {
  Submission,
  SubmissionStatus,
  fetchSubmissions,
  LocalSubmissionFilters,
  FilterOptions,
  SubmissionFile,
} from '@/store/slices/submissionsSlice';
import { Category } from '@/containers/Reports/index.types';
import { fetchReportsForAgency } from '@/store/slices/reportsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import {
  Submissions as SubmissionsComponent,
  SubmissionsComponentProps,
} from '@/components/Submissions/AgencyAdmin';
import { SubmissionDrawer } from '@/containers/Submissions/SubmissionDrawer';
import {
  SubmissionsFilterBar,
  SubmissionsFilterBarProps,
} from '@/components/Submissions/SubmissionsFilterBar';
import { useSubmissionsAssignment } from '@/hooks/useSubmissionsAssignment';
import { cn } from '@/utils/tailwind';
import { fetchAllSchoolsForAgencyAdmin } from '@/store/slices/schoolsSlice';
import { fetchAllSchoolUsers } from '@/store/slices/schoolUsersSlice';
import { GroupedData } from '@/components/Submissions/AgencyAdmin';
import {
  getSubmissionsForReportDownload,
  getSubmissionsForSchoolDownload,
  getSubmissionForDownload,
  SubmissionApiResponse,
} from '@/api/submission';

// Define new types for client-side grouped data
export interface GroupedBySchool {
  id: string; // School ID
  name: string; // School Name
  submissions: Submission[]; // Array of full submission objects
  // Add other school properties if needed for display (e.g., gradeserved)
  gradeserved?: string[];
}

export interface GroupedByReportSchedule {
  id: string; // Report Schedule ID
  name: string; // Report Schedule Name (or ID if name not available directly)
  submissions: Submission[]; // Array of full submission objects
  // Add other report schedule properties if needed for display (e.g., categories, actual report name)
  // This might require looking up report details from another slice using report_schedule ID
  categories?: Category[]; // Placeholder, ideally Category[] from report details
  reportName?: string; // Placeholder
}

interface SubmissionsContainerProps {
  initialView: 'by-report' | 'by-school';
  initialFilters?: Partial<LocalSubmissionFilters>;
  onFiltersChangeForURL?: (
    newFilters: LocalSubmissionFilters,
    newView: 'by-report' | 'by-school',
  ) => void;
}

export const SubmissionsContainer: React.FC<SubmissionsContainerProps> = ({
  initialView,
  initialFilters,
  onFiltersChangeForURL,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [currentView, setCurrentView] = useState<'by-report' | 'by-school'>(
    initialView,
  );
  const {
    submissions: rawSubmissionsFromStore,
    loadingSubmissions,
    errorSubmissions,
  } = useSelector((state: RootState) => state.submissions);

  const allReports = useSelector((state: RootState) => state.reports.reports);
  const loadingReports = useSelector(
    (state: RootState) => state.reports.loading,
  );

  const allAvailableCategories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const loadingCategories = useSelector(
    (state: RootState) => state.categories.loading,
  );

  const allSchools = useSelector((state: RootState) => state.schools.schools);
  const loadingSchools = useSelector(
    (state: RootState) => state.schools.loading,
  );

  const allSchoolUsers = useSelector(
    (state: RootState) => state.schoolUsers.schoolUsers,
  );

  const schoolUsersLoaded = useSelector(
    (state: RootState) => state.schoolUsers.schoolUsers.length > 0,
  );

  const isLoading =
    loadingSubmissions || loadingReports || loadingCategories || loadingSchools;
  const currentError = errorSubmissions;

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<LocalSubmissionFilters>({
    category: initialFilters?.category || 'all',
    teamMember: initialFilters?.teamMember || 'all',
    school: initialFilters?.school || 'all',
    status: initialFilters?.status || 'All',
    year: initialFilters?.year || 'all',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [detailedSubmission, setDetailedSubmission] =
    useState<Submission | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const assignmentHookResult = useSubmissionsAssignment();

  // Add ref to track assignment operations
  const isAssigningRef = useRef<boolean>(false);

  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  useEffect(() => {
    dispatch(fetchSubmissions());
    if (!allReports || allReports.length === 0) {
      if (!loadingReports) {
        dispatch(fetchReportsForAgency());
      }
    }
    if (!allAvailableCategories || allAvailableCategories.length === 0) {
      if (!loadingCategories) {
        dispatch(fetchCategories());
      }
    }
    if (!allSchools || allSchools.length === 0) {
      if (!loadingSchools) dispatch(fetchAllSchoolsForAgencyAdmin());
    }
  }, [
    dispatch,
    allReports,
    loadingReports,
    allAvailableCategories,
    loadingCategories,
    allSchools,
    loadingSchools,
  ]);

  useEffect(() => {
    onFiltersChangeForURL?.(filters, currentView);
  }, [filters, currentView, onFiltersChangeForURL]);

  useEffect(() => {
    if (!isDrawerOpen) {
      setDetailedSubmission(null);
      setDetailError(null);
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!schoolUsersLoaded) {
      dispatch(fetchAllSchoolUsers());
    }
  }, [schoolUsersLoaded, dispatch]);

  const handleSubmissionClick = useCallback(
    async (submissionIdentifier: { id: string }) => {
      if (detailLoading) return;
      setDetailLoading(true);
      setDetailError(null);
      setDetailedSubmission(null);
      try {
        const foundSubmission = rawSubmissionsFromStore.find(
          (s) => s.id === submissionIdentifier.id,
        );
        if (foundSubmission) {
          setDetailedSubmission(foundSubmission);
          setIsDrawerOpen(true);
        } else {
          console.warn(
            `Submission with ID ${submissionIdentifier.id} not found in the main list.`,
          );
          throw new Error(
            `Submission details for ${submissionIdentifier.id} not available locally.`,
          );
        }
      } catch (err) {
        console.error('Error setting submission details for drawer:', err);
        const message =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while loading submission details.';
        setDetailError(message);
        setIsDrawerOpen(false);
      } finally {
        setDetailLoading(false);
      }
    },
    [detailLoading, rawSubmissionsFromStore],
  );

  const handleFilterChange = useCallback(
    (key: keyof LocalSubmissionFilters, value: string) => {
      const statusValue =
        key === 'status' && value === 'All'
          ? 'All'
          : (value as SubmissionStatus);
      setFilters((prev) => ({ ...prev, [key]: statusValue }));
      setSelectedRows([]);
      setIsDrawerOpen(false);
      setDetailedSubmission(null);
    },
    [],
  );

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
    setSelectedRows([]);
    setIsDrawerOpen(false);
    setDetailedSubmission(null);
  }, []);

  const handleViewChange = useCallback((newView: 'by-report' | 'by-school') => {
    setCurrentView(newView);
    setFilters({
      category: 'all',
      teamMember: 'all',
      school: 'all',
      status: 'All',
      year: 'all',
    });
    setSelectedRows([]);
    setExpandedRows([]);
    setIsDrawerOpen(false);
    setDetailedSubmission(null);
  }, []);

  const submissions = useMemo(() => {
    return rawSubmissionsFromStore || [];
  }, [rawSubmissionsFromStore]);

  const filteredGroupedData = useMemo(() => {
    if (!submissions || submissions.length === 0) return [];

    const globallyFilteredSubmissions = submissions.filter((sub) => {
      // Team member filter
      let teamMemberMatch = true;
      if (filters.teamMember !== 'all') {
        if (filters.teamMember === 'unassigned') {
          teamMemberMatch = sub.assigned_member === null;
        } else {
          const userObj = allSchoolUsers.find(
            (u) => u.id === sub.assigned_member,
          );
          teamMemberMatch =
            !!userObj &&
            `${userObj.first_name} ${userObj.last_name}` === filters.teamMember;
        }
      }
      // Status, year
      return (
        (filters.status === 'All' || sub.status === filters.status) &&
        (filters.year === 'all' ||
          (sub.due_date && sub.due_date.startsWith(filters.year))) &&
        teamMemberMatch === true
      );
    });

    if (currentView === 'by-school') {
      const schoolsMap = new Map<string, GroupedBySchool>();
      globallyFilteredSubmissions.forEach((sub) => {
        const schoolObj = allSchools.find((s) => s.id === sub.school);
        if (!schoolObj) return;
        if (
          filters.school !== 'all' &&
          !schoolObj.name.toLowerCase().includes(filters.school.toLowerCase())
        ) {
          return;
        }
        let scheduleName = sub.report_schedule;
        if (filters.category !== 'all') {
          const report = allReports?.find((r) => r.id === sub.report);
          if (report) {
            const specificSchedule = report.schedules.find(
              (sch) => sch.id === sub.report_schedule,
            );
            if (specificSchedule && specificSchedule.report_name) {
              scheduleName = specificSchedule.report_name;
            }
          }
          if (
            !scheduleName
              .toLowerCase()
              .includes(filters.category.toLowerCase()) &&
            sub.report_schedule !== filters.category
          ) {
            return;
          }
        }
        if (!schoolsMap.has(schoolObj.id)) {
          schoolsMap.set(schoolObj.id, {
            id: schoolObj.id,
            name: schoolObj.name,
            gradeserved: schoolObj.gradeserved,
            submissions: [],
          });
        }
        schoolsMap.get(schoolObj.id)!.submissions.push(sub);
      });
      return Array.from(schoolsMap.values()).filter(
        (group) => group.submissions.length > 0,
      );
    } else {
      const reportSchedulesMap = new Map<string, GroupedByReportSchedule>();
      globallyFilteredSubmissions.forEach((sub) => {
        const schoolObj = allSchools.find((s) => s.id === sub.school);
        if (!schoolObj) return;
        if (
          filters.school !== 'all' &&
          !schoolObj.name.toLowerCase().includes(filters.school.toLowerCase())
        ) {
          return;
        }
        const scheduleId = sub.report_schedule;
        let scheduleDisplayName = `Schedule ID: ${scheduleId}`;
        let resolvedCategories: Category[] = [];
        const report = allReports?.find((r) => r.id === sub.report);
        if (report) {
          const specificSchedule = report.schedules.find(
            (sch) => sch.id === scheduleId,
          );
          if (specificSchedule && specificSchedule.report_name) {
            scheduleDisplayName = specificSchedule.report_name;
          }
          if (report.categories && allAvailableCategories) {
            resolvedCategories = report.categories
              .map((catId) =>
                allAvailableCategories.find(
                  (availCat) => availCat.id === catId,
                ),
              )
              .filter((cat) => cat !== undefined) as Category[];
          }
        }
        if (filters.category !== 'all') {
          const matchesCategory = resolvedCategories.some(
            (cat) =>
              cat.id === filters.category ||
              cat.name.toLowerCase().includes(filters.category.toLowerCase()),
          );
          const matchesScheduleName = scheduleDisplayName
            .toLowerCase()
            .includes(filters.category.toLowerCase());
          if (!matchesCategory && !matchesScheduleName) {
            return;
          }
        }
        if (!reportSchedulesMap.has(scheduleId)) {
          reportSchedulesMap.set(scheduleId, {
            id: scheduleId,
            name: scheduleDisplayName,
            submissions: [],
            categories: resolvedCategories,
            reportName: report?.name,
          });
        }
        reportSchedulesMap.get(scheduleId)!.submissions.push(sub);
      });
      return Array.from(reportSchedulesMap.values()).filter(
        (group) => group.submissions.length > 0,
      );
    }
  }, [
    submissions,
    currentView,
    filters,
    allReports,
    allAvailableCategories,
    allSchools,
    allSchoolUsers,
    searchText,
  ]);

  useEffect(() => {
    if (filteredGroupedData && filteredGroupedData.length > 0) {
      const isAnyFilterActive =
        filters.category.toLowerCase() !== 'all' ||
        filters.teamMember.toLowerCase() !== 'all' ||
        filters.school.toLowerCase() !== 'all' ||
        filters.status !== 'All' ||
        filters.year.toLowerCase() !== 'all';

      if (isAnyFilterActive) {
        const allGroupIds = filteredGroupedData.map((group) => group.id);
        const currentExpandedSet = new Set(expandedRows);

        let allCurrentlyVisibleGroupsExpanded = true;
        for (const groupId of allGroupIds) {
          if (!currentExpandedSet.has(groupId)) {
            allCurrentlyVisibleGroupsExpanded = false;
            break;
          }
        }

        if (!allCurrentlyVisibleGroupsExpanded) {
          setExpandedRows(allGroupIds);
        }
      }
    } else {
      setExpandedRows([]);
    }
  }, [filteredGroupedData, filters, expandedRows]);

  const filterOptions = useMemo(() => {
    const options: FilterOptions = {
      view: [
        { value: 'by-report', label: 'By Report Schedule' },
        { value: 'by-school', label: 'By School' },
      ],
      category: [],
      teamMember: [{ value: 'all', label: 'All Team Members' }],
      school: [{ value: 'all', label: 'All Schools' }],
      status: [
        { value: 'All', label: 'All Statuses' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'returned', label: 'Returned' },
        { value: 'incompleted', label: 'Incompleted' },
      ],
      year: [{ value: 'all', label: 'All Years' }],
    };

    const schoolNames = new Set<string>();
    const teamMemberNames = new Set<string>();
    const dueYears = new Set<string>();
    const reportScheduleFilterOptions = new Set<{
      value: string;
      label: string;
    }>();
    const categoryFilterOptions = new Set<{ value: string; label: string }>();

    submissions.forEach((sub) => {
      const schoolObj = allSchools.find((s) => s.id === sub.school);
      if (schoolObj) {
        schoolNames.add(schoolObj.name);
      }
      if (sub.assigned_member) {
        const userObj = allSchoolUsers.find(
          (u) => u.id === sub.assigned_member,
        );
        if (userObj) {
          teamMemberNames.add(`${userObj.first_name} ${userObj.last_name}`);
        }
      }
      if (sub.due_date) {
        dueYears.add(sub.due_date.substring(0, 4));
      }
    });

    options.school = [
      { value: 'all', label: 'All Schools' },
      ...Array.from(schoolNames)
        .sort()
        .map((name) => ({ value: name, label: name })),
    ];
    options.teamMember = [
      { value: 'all', label: 'All Team Members' },
      ...Array.from(teamMemberNames)
        .sort()
        .map((name) => ({ value: name, label: name })),
    ];
    options.year = [
      { value: 'all', label: 'All Years' },
      ...Array.from(dueYears)
        .sort((a, b) => parseInt(b) - parseInt(a))
        .map((year) => ({ value: year, label: year })),
    ];

    if (
      allReports &&
      allReports.length > 0 &&
      submissions &&
      submissions.length > 0
    ) {
      submissions.forEach((sub) => {
        const scheduleId = sub.report_schedule;
        let scheduleLabel = `Schedule ID: ${scheduleId}`;
        const report = allReports.find((r) => r.id === sub.report);
        if (report) {
          const specificSchedule = report.schedules.find(
            (sch) => sch.id === scheduleId,
          );
          if (specificSchedule && specificSchedule.report_name) {
            scheduleLabel = specificSchedule.report_name;
          }
          if (report.categories && allAvailableCategories) {
            report.categories.forEach((catId) => {
              const foundCat = allAvailableCategories.find(
                (availCat) => availCat.id === catId,
              );
              if (foundCat) {
                categoryFilterOptions.add({
                  value: foundCat.id,
                  label: foundCat.name,
                });
              }
            });
          }
        }
        reportScheduleFilterOptions.add({
          value: scheduleId,
          label: scheduleLabel,
        });
      });
    }
    const sortedScheduleOptions = Array.from(reportScheduleFilterOptions).sort(
      (a, b) => a.label.localeCompare(b.label),
    );
    const sortedCategoryOptions = Array.from(categoryFilterOptions).sort(
      (a, b) => a.label.localeCompare(b.label),
    );

    if (currentView === 'by-school') {
      options.category = [
        { value: 'all', label: 'All Reports (Schedules)' },
        ...sortedScheduleOptions,
      ];
    } else {
      options.category = [
        { value: 'all', label: 'All Categories' },
        ...sortedCategoryOptions,
      ];
    }
    return options;
  }, [submissions, currentView, allReports, allAvailableCategories]);

  const toggleSelectAll = useCallback(() => {
    const allSubmissionIdsInView: string[] = [];
    (
      filteredGroupedData as Array<GroupedBySchool | GroupedByReportSchedule>
    ).forEach((group) => {
      group.submissions.forEach((sub) => allSubmissionIdsInView.push(sub.id));
    });

    if (
      selectedRows.length === allSubmissionIdsInView.length &&
      allSubmissionIdsInView.length > 0
    ) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allSubmissionIdsInView);
    }
  }, [filteredGroupedData, selectedRows]);

  const toggleRowExpansion = useCallback(
    (id: string) =>
      setExpandedRows((p) =>
        p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
      ),
    [],
  );

  const renderProgressBar = useCallback((groupSubmissions: Submission[]) => {
    const total = groupSubmissions.length;
    if (total === 0) return null;
    const statusCounts: Record<SubmissionStatus, number> = {
      completed: 0,
      returned: 0,
      pending: 0,
      incompleted: 0,
    };
    groupSubmissions.forEach((submission) => {
      const status = submission.status as SubmissionStatus;
      if (status && statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });
    const orderedStatuses: SubmissionStatus[] = [
      'incompleted',
      'pending',
      'returned',
      'completed',
    ];
    return (
      <div className="flex h-6 w-full rounded-[4px] overflow-hidden bg-slate-200">
        {orderedStatuses.map((status) => {
          if (statusCounts[status] === 0) return null;
          const percentage = Math.round((statusCounts[status] / total) * 100);
          const colorClass =
            {
              completed: 'bg-green-500',
              returned: 'bg-orange-500',
              pending: 'bg-yellow-500',
              incompleted: 'bg-red-500',
            }[status] || 'bg-slate-500';
          return (
            <div
              key={status}
              className={cn(
                'h-full relative flex items-center justify-center',
                colorClass,
              )}
              style={{ width: `${percentage}%` }}
              title={`${status}: ${statusCounts[status]} (${percentage}%)`}
            >
              <span className="text-white text-xs font-medium px-1 truncate">
                {percentage > 5 ? `${percentage}%` : ''}
              </span>
            </div>
          );
        })}
      </div>
    );
  }, []);

  const handleNavigate = useCallback(
    (_direction: 'next' | 'prev') => {
      if (!detailedSubmission || !filteredGroupedData) return;
      const allVisibleSubmissions: Submission[] = [];
      (
        filteredGroupedData as Array<GroupedBySchool | GroupedByReportSchedule>
      ).forEach((group) => {
        allVisibleSubmissions.push(...group.submissions);
      });

      const currentIndex = allVisibleSubmissions.findIndex(
        (sub) => sub.id === detailedSubmission.id,
      );
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (_direction === 'next') {
        nextIndex = (currentIndex + 1) % allVisibleSubmissions.length;
      } else {
        nextIndex =
          (currentIndex - 1 + allVisibleSubmissions.length) %
          allVisibleSubmissions.length;
      }
      const nextSubmission = allVisibleSubmissions[nextIndex];
      if (nextSubmission) {
        setDetailedSubmission(nextSubmission);
      }
    },
    [detailedSubmission, filteredGroupedData],
  );

  const handleSubmissionUpdated = useCallback(
    (updatedSubmissionData: Partial<Submission>) => {
      if (!detailedSubmission || !detailedSubmission.id) {
        console.error('Cannot update submission without a valid ID.');
        return;
      }
      setDetailedSubmission((prev) =>
        prev ? { ...prev, ...updatedSubmissionData } : null,
      );
    },
    [detailedSubmission],
  );
  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-CA');
  };

  const handleReportGroupFileDownload = useCallback(
    async (reportGroup: GroupedData) => {
      const zip = new JSZip();

      const submissions: SubmissionApiResponse[] =
        await getSubmissionsForReportDownload(reportGroup.id);

      // Flatten all file URLs from all submissions
      const allFileDownloads = submissions.flatMap((submission) => {
        return submission.file_urls.map((fileUrlObj) => ({
          url: fileUrlObj.file_url,
          fileName: fileUrlObj.file_name,
          submission: submission,
        }));
      });

      // Download all files in parallel
      await Promise.all(
        allFileDownloads.map(async ({ submission, url, fileName }) => {
          const response = await axios.get(url, {
            responseType: 'blob',
          });

          const contentType =
            response.headers['content-type'] ||
            getContentTypeFromFilename(response.headers['content-disposition']);
          const blob = new Blob([response.data], { type: contentType });

          const folderStructure = `${submission.report.name}/${submission.school.name}`;
          const downloadName = `${submission.report.name}.${submission.school.name}.${formatDate(submission.due_date)}.${fileName}`;

          zip.file(`${folderStructure}/${downloadName}`, blob);
        }),
      );

      for (const submission of submissions) {
        const folderStructure = `${submission.report.name}/${submission.school.name}`;
        const downloadName = `${submission.report.name}.${submission.school.name}.${formatDate(submission.due_date)}.submission.xlsx`;

        zip.file(
          `${folderStructure}/${downloadName}`,
          handleXLSXDownload(submission),
        );
      }

      zip
        .generateAsync({
          type: 'blob',
          mimeType: 'application/zip',
        })
        .then((content) => {
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${reportGroup.name}.zip`;
          a.click();

          // Clean up the object URL to prevent memory leaks
          URL.revokeObjectURL(url);
        });
    },
    [],
  );

  const handleSchoolGroupFileDownload = useCallback(
    async (schoolGroup: GroupedData) => {
      const zip = new JSZip();

      const submissions: SubmissionApiResponse[] =
        await getSubmissionsForSchoolDownload(schoolGroup.id);

      // Flatten all file URLs from all submissions
      const allFileDownloads = submissions.flatMap((submission) => {
        return submission.file_urls.map((fileUrlObj) => ({
          url: fileUrlObj.file_url,
          fileName: fileUrlObj.file_name,
          submission: submission,
        }));
      });

      // Download all files in parallel
      await Promise.all(
        allFileDownloads.map(async ({ submission, url, fileName }) => {
          const response = await axios.get(url, {
            responseType: 'blob',
          });

          const contentType =
            response.headers['content-type'] ||
            getContentTypeFromFilename(response.headers['content-disposition']);
          const blob = new Blob([response.data], { type: contentType });

          const folderStructure = `${submission.school.name}/${submission.report.name}`;
          const downloadName = `${submission.school.name}.${submission.report.name}.${formatDate(submission.due_date)}.${fileName}`;

          zip.file(`${folderStructure}/${downloadName}`, blob);
        }),
      );

      for (const submission of submissions) {
        const folderStructure = `${submission.school.name}/${submission.report.name}`;
        const downloadName = `${submission.school.name}.${submission.report.name}.${formatDate(submission.due_date)}.submission.xlsx`;

        zip.file(
          `${folderStructure}/${downloadName}`,
          handleXLSXDownload(submission),
        );
      }

      zip
        .generateAsync({
          type: 'blob',
          mimeType: 'application/zip',
        })
        .then((content) => {
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${schoolGroup.name}.zip`;
          a.click();

          // Clean up the object URL to prevent memory leaks
          URL.revokeObjectURL(url);
        });
    },
    [],
  );

  const handleSubmissionFileDownload = useCallback(
    async (submission: Submission) => {
      const zip = new JSZip();

      const submissionData = await getSubmissionForDownload(submission.id);

      await Promise.all(
        submissionData.file_urls.map(async (fileUrl: SubmissionFile) => {
          const response = await axios.get(fileUrl.file_url, {
            responseType: 'blob',
          });

          const contentType =
            response.headers['content-type'] ||
            getContentTypeFromFilename(response.headers['content-disposition']);
          const blob = new Blob([response.data], { type: contentType });

          zip.file(fileUrl.file_name, blob);
        }),
      );

      zip.file('submission.xlsx', handleXLSXDownload(submissionData));

      zip
        .generateAsync({
          type: 'blob',
          mimeType: 'application/zip',
        })
        .then((content) => {
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${submissionData.report.name}.${submissionData.school.name}.${formatDate(submissionData.due_date)}.zip`;
          a.click();

          // Clean up the object URL to prevent memory leaks
          URL.revokeObjectURL(url);
        });
    },
    [],
  );

  const handleXLSXDownload = (submissionData: SubmissionApiResponse): Blob => {
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(
      Object.entries(submissionData.submission_content),
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submission');

    // Convert workbook to binary data instead of writing to file
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    return new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  };

  const totalSubmissionsCount = useMemo(
    () =>
      (
        filteredGroupedData as Array<GroupedBySchool | GroupedByReportSchedule>
      ).reduce((acc, group) => acc + group.submissions.length, 0),
    [filteredGroupedData],
  );

  const totalSubmissionsInCurrentGroup = useMemo(() => {
    if (!detailedSubmission) return 0;
    const group = (
      filteredGroupedData as Array<GroupedBySchool | GroupedByReportSchedule>
    ).find((g) => g.submissions.some((s) => s.id === detailedSubmission.id));
    return group ? group.submissions.length : 0;
  }, [detailedSubmission, filteredGroupedData]);

  const filterBarProps: SubmissionsFilterBarProps = {
    filters,
    filterOptions,
    currentView,
    onFilterChange: handleFilterChange,
    onViewChange: handleViewChange,
    searchText,
    onSearchTextChange: handleSearchTextChange,
  };

  const submissionsComponentProps: SubmissionsComponentProps = {
    loading: isLoading,
    error: currentError || detailError,
    groupedData: filteredGroupedData as Array<
      GroupedBySchool | GroupedByReportSchedule
    >,
    selectedRows,
    setSelectedRows,
    expandedRows,
    toggleRowExpansion,
    toggleSelectAll,
    renderProgressBar,
    handleSubmissionClick: (sub: Submission | { id: string }) =>
      handleSubmissionClick({ id: sub.id }),
    isDrawerOpen,
    setIsDrawerOpen,
    selectedSubmission: null,
    handleNavigate,
    totalSubmissions: totalSubmissionsInCurrentGroup,
    totalSubmissionsCount,
    allReports,
    ...assignmentHookResult,
    handleReportGroupFileDownload,
    handleSchoolGroupFileDownload,
    handleSubmissionFileDownload,
  };

  // Create a wrapper for drawer close that prevents closing during assignment operations
  const handleDrawerClose = useCallback(() => {
    // Prevent closing if assignment operations are in progress
    if (isAssigningRef.current) {
      return;
    }
    setIsDrawerOpen(false);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center py-4 px-6 border-b-[1px] h-[72px] border-beige-400 bg-beige-100 flex-shrink-0">
        <h3 className="text-slate-900 font-semibold">Submissions</h3>
      </div>
      {/* This is getting rerendered a bunch of times */}
      <SubmissionsFilterBar {...filterBarProps} />
      <SubmissionsComponent {...submissionsComponentProps} />
      <SubmissionDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        submission={detailedSubmission}
        onNavigate={handleNavigate}
        totalSubmissions={totalSubmissionsInCurrentGroup}
        currentIndex={
          detailedSubmission && totalSubmissionsInCurrentGroup > 0
            ? ((
                filteredGroupedData as Array<
                  GroupedBySchool | GroupedByReportSchedule
                >
              )
                .find((g) =>
                  g.submissions.some((s) => s.id === detailedSubmission.id),
                )
                ?.submissions.findIndex(
                  (s) => s.id === detailedSubmission.id,
                ) ?? -1)
            : -1
        }
        onSubmissionUpdated={handleSubmissionUpdated}
        allSchools={allSchools}
        allSchoolUsers={allSchoolUsers}
        isAssigningRef={isAssigningRef}
      />
    </div>
  );
};
