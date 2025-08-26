import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';

import { Loading } from '@/components/base/Loading';

import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { UserClickDropdown } from '@/components/base/UserClickDropdown';
import { Submission, SubmissionStatus } from '@/store/slices/submissionsSlice';

// Import the new table components using absolute paths for clarity
import { SubmissionsBySchoolTable } from '@/components/Submissions/SubmissionsBySchoolTable';
import { SubmissionsByReportTable } from '@/components/Submissions/SubmissionsByReportTable';
import { RootState } from '@/store';

import { Category, ReportResponse } from '@/containers/Reports/index.types';

export interface GroupedData {
  id: string;
  name: string;
  submissions: Submission[];
  gradeserved?: string[];
  categories?: Category[];
}

export interface SubmissionsComponentProps {
  loading: boolean;
  selectedRows: string[];
  setSelectedRows: Dispatch<SetStateAction<string[]>>;
  expandedRows: string[];
  toggleSelectAll: () => void;
  toggleRowExpansion: (id: string) => void;
  groupedData: GroupedData[];
  renderProgressBar: (submissions: Submission[]) => JSX.Element | null;
  handleSubmissionClick: (submission: Submission) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  selectedSubmission: Submission | null;
  handleNavigate: (direction: 'next' | 'prev') => void;
  totalSubmissions: number;
  totalSubmissionsCount: number;
  error: string | null;
  dropdownAnchorEl: HTMLElement | null;
  dropdownTarget:
    | {
        type: 'single';
        submission: Submission;
      }
    | {
        type: 'bulk';
        group: GroupedData;
        groupType: 'report' | 'school';
      }
    | null;
  dropdownSearchText: string;
  filteredDropdownUsers: SchoolUser[];
  handleOpenUserDropdown: (
    event: React.MouseEvent<HTMLButtonElement>,
    targetData: NonNullable<SubmissionsComponentProps['dropdownTarget']>,
  ) => void;
  handleCloseUserDropdown: () => void;
  handleAssignUser: (user: SchoolUser) => Promise<void>;
  handleRemoveAssignee: () => Promise<void>;
  handleDropdownSearchChange: (text: string) => void;
  allReports: ReportResponse[];
  handleReportGroupFileDownload: (reportGroup: GroupedData) => void;
  handleSchoolGroupFileDownload: (schoolGroup: GroupedData) => void;
  handleSubmissionFileDownload: (submission: Submission) => void;
}

const isBySchoolData = (
  data: GroupedData[],
): data is Array<GroupedData & { gradeserved: string[] }> => {
  return (
    data.length > 0 &&
    Object.prototype.hasOwnProperty.call(data[0], 'gradeserved')
  );
};

export const Submissions: React.FC<SubmissionsComponentProps> = ({
  loading,
  selectedRows,
  setSelectedRows,
  expandedRows,
  toggleRowExpansion,
  groupedData,
  renderProgressBar,
  handleSubmissionClick,
  error,
  dropdownAnchorEl,
  dropdownSearchText,
  filteredDropdownUsers,
  handleOpenUserDropdown,
  handleCloseUserDropdown,
  handleAssignUser,
  handleRemoveAssignee,
  handleDropdownSearchChange,
  allReports,
  handleReportGroupFileDownload,
  handleSchoolGroupFileDownload,
  handleSubmissionFileDownload,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allSchools = useSelector((state: RootState) => state.schools.schools);
  const allSchoolUsers = useSelector(
    (state: RootState) => state.schoolUsers.schoolUsers,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownAnchorEl &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !dropdownAnchorEl.contains(event.target as Node)
      ) {
        handleCloseUserDropdown();
      }
    };

    const handleScroll = (event: Event) => {
      if (dropdownAnchorEl) {
        if (
          dropdownRef.current &&
          dropdownRef.current.contains(event.target as Node)
        ) {
          return;
        }
        handleCloseUserDropdown();
      }
    };

    if (dropdownAnchorEl) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [dropdownAnchorEl, dropdownRef, containerRef, handleCloseUserDropdown]);

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'incompleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const renderTableContent = () => {
    if (!groupedData || groupedData.length === 0) {
      return (
        <div className="p-4 text-center text-slate-500">
          No submissions found.
        </div>
      );
    }
    if (isBySchoolData(groupedData)) {
      return (
        <SubmissionsBySchoolTable
          groupedData={groupedData}
          expandedRows={expandedRows}
          selectedRows={selectedRows}
          toggleRowExpansion={toggleRowExpansion}
          setSelectedRows={setSelectedRows}
          handleSubmissionClick={handleSubmissionClick}
          renderProgressBar={renderProgressBar}
          handleOpenUserDropdown={handleOpenUserDropdown}
          getStatusColor={getStatusColor}
          allReports={allReports}
          allSchools={allSchools}
          allSchoolUsers={allSchoolUsers}
          handleSchoolGroupFileDownload={handleSchoolGroupFileDownload}
          handleSubmissionFileDownload={handleSubmissionFileDownload}
        />
      );
    } else {
      return (
        <SubmissionsByReportTable
          groupedData={groupedData}
          expandedRows={expandedRows}
          selectedRows={selectedRows}
          toggleRowExpansion={toggleRowExpansion}
          setSelectedRows={setSelectedRows}
          handleSubmissionClick={handleSubmissionClick}
          renderProgressBar={renderProgressBar}
          handleOpenUserDropdown={handleOpenUserDropdown}
          getStatusColor={getStatusColor}
          allSchools={allSchools}
          allSchoolUsers={allSchoolUsers}
          handleReportGroupFileDownload={handleReportGroupFileDownload}
          handleSubmissionFileDownload={handleSubmissionFileDownload}
        />
      );
    }
  };

  return (
    <div className="flex flex-col h-full relative" ref={containerRef}>
      {selectedRows.length > 0 && (
        <div className="flex w-full gap-4 h-[56px] items-center p-[0px_24px] border-b-[1px] border-beige-300 bg-orange-50">
          <div className="flex items-center gap-2">
            <h5>{selectedRows.length} items selected</h5>
          </div>
        </div>
      )}

      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200 text-red-700 text-sm flex items-center gap-2">
          <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
          <span>Error loading submissions: {error}</span>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="py-4 flex-1 flex flex-col overflow-hidden">
          {renderTableContent()}
        </div>
      )}

      {dropdownAnchorEl && containerRef.current && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top:
              dropdownAnchorEl.getBoundingClientRect().bottom -
              containerRef.current.getBoundingClientRect().top +
              containerRef.current.scrollTop,
            left:
              dropdownAnchorEl.getBoundingClientRect().right -
              containerRef.current.getBoundingClientRect().left +
              containerRef.current.scrollLeft,
            transform: 'translateX(-100%)',
            zIndex: 1050,
          }}
        >
          <UserClickDropdown
            users={filteredDropdownUsers}
            searchText={dropdownSearchText}
            onSearchChange={handleDropdownSearchChange}
            onClose={handleCloseUserDropdown}
            onUserChange={handleAssignUser}
            onRemoveAssigneeClick={handleRemoveAssignee}
          />
        </div>
      )}
    </div>
  );
};

export default Submissions;
