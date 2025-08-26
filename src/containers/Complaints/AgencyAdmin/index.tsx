import React, { useMemo, useState, useCallback } from 'react';
// import { Helmet } from 'react-helmet'; // Helmet is in the page component
import { useSelector } from 'react-redux'; // useDispatch might not be needed if no actions are dispatched from here now
import { RootState } from '@/store';

import {
  // setComplaintsData, // No longer importing as initial dispatch is removed
  selectComplaintsByStatus,
  selectComplaintsLoading,
  selectComplaintsError,
  Complaint,
} from '@/store/slices/complaintsSlice';

import ComplaintsView from '@/components/Complaints/AgencyAdmin';
// REMOVED self-import of types: import { ComplaintSchoolSummary, ComplaintStatusSummary, ComplaintAssigneeSummary } from './index';

// Types are defined and exported here, to be imported by ComplaintsView.tsx
export type ComplaintViewType = 'bySchool' | 'byStatus' | 'byAssignee';
export type ComplaintStatusType = 'New' | 'Open' | 'Resolved';
export type FollowUpStatusType = 'Yes' | 'No' | 'All';
export type SortDirection = 'asc' | 'desc'; // Added sort type

export interface ComplaintPageFilters {
  school: string;
  status: ComplaintStatusType | 'All';
  followUp: FollowUpStatusType;
}

export interface PageFilterOptions {
  view: { value: ComplaintViewType; label: string }[];
  school: { value: string; label: string }[];
  status: { value: ComplaintStatusType | 'All'; label: string }[];
  followUp: { value: FollowUpStatusType; label: string }[];
}

export interface ComplaintSchoolSummary {
  id: string;
  schoolName: string;
  totalComplaints: number;
  unassignedComplaints: number;
}
export interface ComplaintStatusSummary {
  status: ComplaintStatusType;
  totalComplaints: number;
  unassignedComplaints: number;
}
export interface ComplaintAssigneeSummary {
  assigneeId: string;
  assigneeName: string;
  totalComplaints: number;
}

const ComplaintsPageContainer: React.FC = () => {
  // const dispatch = useDispatch(); // Comment out if not used
  const complaintsByStatusFromStore = useSelector(selectComplaintsByStatus);
  const isLoading = useSelector(selectComplaintsLoading);
  const error = useSelector(selectComplaintsError);
  const allSchoolsFromStore = useSelector(
    (state: RootState) => state.schools.schools,
  );

  const [currentView, setCurrentView] = useState<ComplaintViewType>('bySchool');
  const [filters, setFilters] = useState<ComplaintPageFilters>({
    school: 'all',
    status: 'All',
    followUp: 'All',
  });
  const [searchText, setSearchText] = useState('');
  // --- Add Sorting State ---
  const [sortColumnKey, setSortColumnKey] = useState<string | null>(null); // Key of the column being sorted
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // REMOVED: useEffect(() => { dispatch(setComplaintsData(mockComplaintData)); }, [dispatch]);

  const allComplaintsFlat: Complaint[] = useMemo(
    () => complaintsByStatusFromStore.flatMap((group) => group.complaints),
    [complaintsByStatusFromStore],
  );

  const filterOptions = useMemo((): PageFilterOptions => {
    const viewOptions: { value: ComplaintViewType; label: string }[] = [
      { value: 'bySchool', label: 'By School' },
      { value: 'byStatus', label: 'By Status' },
      { value: 'byAssignee', label: 'By Assignee' },
    ];
    const schoolOptions = [
      { value: 'all', label: 'All' },
      ...allSchoolsFromStore
        .map((s) => ({ value: s.id, label: s.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    ];
    const statusOptions: {
      value: ComplaintStatusType | 'All';
      label: string;
    }[] = [
      { value: 'All', label: 'All' },
      { value: 'New', label: 'New' },
      { value: 'Open', label: 'Open' },
      { value: 'Resolved', label: 'Resolved' },
    ];
    const followUpOptions: { value: FollowUpStatusType; label: string }[] = [
      { value: 'All', label: 'All' },
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ];
    return {
      view: viewOptions,
      school: schoolOptions,
      status: statusOptions,
      followUp: followUpOptions,
    };
  }, [allSchoolsFromStore]);

  const handleFilterChange = useCallback(
    (key: keyof ComplaintPageFilters, value: string) => {
      setFilters((prev) => {
        let typedValue:
          | string
          | ComplaintStatusType
          | FollowUpStatusType
          | 'All' = value;
        if (key === 'status') {
          typedValue = value as ComplaintStatusType | 'All';
        } else if (key === 'followUp') {
          typedValue = value as FollowUpStatusType;
        }
        // 'school' remains string
        return {
          ...prev,
          [key]: typedValue,
        };
      });
      setSearchText('');
      setSortColumnKey(null);
    },
    [],
  );
  const handleViewChange = useCallback((view: ComplaintViewType) => {
    setCurrentView(view);
    setSearchText('');
    setSortColumnKey(null); // Reset sort when view changes
  }, []);
  const clearFiltersAndSearch = useCallback(() => {
    setFilters({ school: 'all', status: 'All', followUp: 'All' });
    setSearchText('');
    setSortColumnKey(null); // Reset sort on clear
  }, []);
  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  // --- Sorting Handler ---
  const handleSort = useCallback(
    (key: string) => {
      setSortDirection((prevDirection) => {
        // If same column clicked, toggle direction; otherwise, default to 'asc'
        if (sortColumnKey === key) {
          return prevDirection === 'asc' ? 'desc' : 'asc';
        }
        return 'asc';
      });
      setSortColumnKey(key);
    },
    [sortColumnKey],
  ); // Dependency on sortColumnKey to check if same column clicked

  const filteredComplaints = useMemo(() => {
    let complaintsToFilter = allComplaintsFlat;
    complaintsToFilter = complaintsToFilter.filter((complaint) => {
      const schoolMatch =
        filters.school === 'all' ||
        allSchoolsFromStore.find((s) => s.id === filters.school)?.name ===
          complaint.schoolName;
      const statusMatch =
        filters.status === 'All' || complaint.status === filters.status;
      const followUpMatch =
        filters.followUp === 'All' ||
        (filters.followUp === 'Yes' && complaint.followUp) ||
        (filters.followUp === 'No' && !complaint.followUp);
      return schoolMatch && statusMatch && followUpMatch;
    });
    if (searchText.trim() !== '') {
      const lowerSearchText = searchText.toLowerCase();
      complaintsToFilter = complaintsToFilter.filter(
        (complaint) =>
          complaint.schoolName.toLowerCase().includes(lowerSearchText) ||
          complaint.complainant.name.toLowerCase().includes(lowerSearchText) ||
          complaint.complainant.email.toLowerCase().includes(lowerSearchText) ||
          (complaint.assignee &&
            complaint.assignee.name.toLowerCase().includes(lowerSearchText)) ||
          complaint.reportName?.toLowerCase().includes(lowerSearchText),
      );
    }
    return complaintsToFilter;
  }, [allComplaintsFlat, filters, allSchoolsFromStore, searchText]);

  const summaryDataForView = useMemo(():
    | ComplaintSchoolSummary[]
    | ComplaintStatusSummary[]
    | ComplaintAssigneeSummary[] => {
    let processedData: (
      | ComplaintSchoolSummary
      | ComplaintStatusSummary
      | ComplaintAssigneeSummary
    )[] = [];

    // --- Grouping logic ---
    if (currentView === 'bySchool') {
      const schoolsSummary: Record<
        string,
        { total: number; unassigned: number; id: string }
      > = {};
      filteredComplaints.forEach((c) => {
        const schoolId =
          allSchoolsFromStore.find((s) => s.name === c.schoolName)?.id ||
          c.schoolName;
        if (!schoolsSummary[c.schoolName])
          schoolsSummary[c.schoolName] = {
            id: schoolId,
            total: 0,
            unassigned: 0,
          };
        schoolsSummary[c.schoolName].total += 1;
        if (!c.assignee) schoolsSummary[c.schoolName].unassigned += 1;
      });
      processedData = Object.entries(schoolsSummary).map(
        ([schoolName, data]) => ({
          id: data.id,
          schoolName: schoolName,
          totalComplaints: data.total,
          unassignedComplaints: data.unassigned,
        }),
      );
    } else if (currentView === 'byStatus') {
      const statusMap =
        filters.status === 'All'
          ? { New: true, Open: true, Resolved: true }
          : { [filters.status]: true };
      processedData = (Object.keys(statusMap) as ComplaintStatusType[])
        .map((statusKey) => ({
          status: statusKey,
          totalComplaints: filteredComplaints.filter(
            (c) => c.status === statusKey,
          ).length,
          unassignedComplaints: filteredComplaints.filter(
            (c) => c.status === statusKey && !c.assignee,
          ).length,
        }))
        .filter((group) => group.totalComplaints > 0);
    } else if (currentView === 'byAssignee') {
      const assigneeSummary: Record<string, { name: string; total: number }> =
        {};
      filteredComplaints.forEach((c) => {
        const key = c.assignee?.id || 'unassigned';
        const name = c.assignee?.name || 'Unassigned';
        if (!assigneeSummary[key])
          assigneeSummary[key] = { name: name, total: 0 };
        assigneeSummary[key].total += 1;
      });
      processedData = Object.entries(assigneeSummary).map(([id, data]) => ({
        assigneeId: id,
        assigneeName: data.name,
        totalComplaints: data.total,
      }));
    }

    // --- Apply Sorting with Type Safety ---
    if (sortColumnKey) {
      processedData.sort((a, b) => {
        let aValue: string | number | undefined;
        let bValue: string | number | undefined;

        // Type-safe access based on view and sort key
        if (
          currentView === 'bySchool' &&
          'schoolName' in a &&
          'schoolName' in b &&
          (sortColumnKey === 'schoolName' ||
            sortColumnKey === 'totalComplaints' ||
            sortColumnKey === 'unassignedComplaints')
        ) {
          aValue = a[sortColumnKey as keyof ComplaintSchoolSummary];
          bValue = b[sortColumnKey as keyof ComplaintSchoolSummary];
        } else if (
          currentView === 'byStatus' &&
          'status' in a &&
          'status' in b &&
          (sortColumnKey === 'totalComplaints' ||
            sortColumnKey === 'unassignedComplaints')
        ) {
          // Note: status itself is not usually sorted
          aValue = a[sortColumnKey as keyof ComplaintStatusSummary];
          bValue = b[sortColumnKey as keyof ComplaintStatusSummary];
        } else if (
          currentView === 'byAssignee' &&
          'assigneeName' in a &&
          'assigneeName' in b &&
          (sortColumnKey === 'assigneeName' ||
            sortColumnKey === 'totalComplaints')
        ) {
          aValue = a[sortColumnKey as keyof ComplaintAssigneeSummary];
          bValue = b[sortColumnKey as keyof ComplaintAssigneeSummary];
        }

        // Comparison logic (handles undefined safely)
        let comparison = 0;
        if (aValue === undefined || aValue === null)
          comparison = bValue === undefined || bValue === null ? 0 : -1;
        else if (bValue === undefined || bValue === null) comparison = 1;
        else if (typeof aValue === 'string' && typeof bValue === 'string')
          comparison = aValue.localeCompare(bValue);
        else if (typeof aValue === 'number' && typeof bValue === 'number')
          comparison = aValue - bValue;

        return sortDirection === 'asc' ? comparison : comparison * -1;
      });
    }

    // Return typed data based on the current view
    if (currentView === 'bySchool')
      return processedData as ComplaintSchoolSummary[];
    if (currentView === 'byStatus')
      return processedData as ComplaintStatusSummary[];
    if (currentView === 'byAssignee')
      return processedData as ComplaintAssigneeSummary[];
    return []; // Should not be reached if currentView is always one of the above
  }, [
    filteredComplaints,
    currentView,
    filters.status,
    allSchoolsFromStore,
    sortColumnKey,
    sortDirection,
  ]);

  return (
    <ComplaintsView
      summaryData={summaryDataForView}
      allFilteredComplaints={filteredComplaints}
      currentView={currentView}
      loading={isLoading}
      error={error}
      filters={filters}
      filterOptions={filterOptions}
      handleFilterChange={handleFilterChange}
      handleViewChange={handleViewChange}
      clearFilters={clearFiltersAndSearch}
      searchText={searchText}
      onSearchChange={handleSearchChange}
      // --- Pass sort props ---
      sortColumnKey={sortColumnKey}
      sortDirection={sortDirection}
      handleSort={handleSort}
    />
  );
};

export default ComplaintsPageContainer;
