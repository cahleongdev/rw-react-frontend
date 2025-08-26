import React, { Dispatch, SetStateAction } from 'react';
import {
  ChatBubbleLeftIcon,
  UserPlusIcon,
  CloudArrowDownIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';

import { Avatar, AvatarFallback } from '@/components/base/Avatar';

import ReportPreview from '@/containers/Reports/ReportPreview/SchoolAdmin';
import DeleteReportDialog from '@/containers/Reports/DeleteReportDialog';
import DuplicateReportDialog from '@/containers/Reports/DuplicateReportDialog';
import MultiDeleteReportDialog from '@/containers/Reports/MultiDeleteReportDialog';
import { Category } from '@/containers/Reports/index.types';
import { EditedBy, ReportResponse } from '@/containers/Reports/index.types';
import { SubmissionDrawer } from '@containers/Reports/SubmissionDrawer';

import { Submission } from '@/store/slices/submissionsSlice';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { UserClickDropdown } from '@/components/base/UserClickDropdown';

import {
  Table,
  TableBody,
  TableCell,
  // TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/Table';
import { Checkbox } from '@/components/base/Checkbox';
import { Button } from '@/components/base/Button';
import { Badge } from '@/components/base/Badge';
import SortLabel from '@/components/Notifications/SortLabel';
import { FilterSelect } from '@/components/base/FilterSelect';
import { Loading } from '@/components/base/Loading';
import { SearchBar } from '@/components/base/SearchBar';
import { RootState } from '@/store';

import { cn } from '@/utils/tailwind';
import { getCategoryColors } from '@/utils/categoryColors';

interface ReportsProps {
  isPreviewOpen: boolean;
  setIsPreviewOpen: Dispatch<SetStateAction<boolean>>;
  selectedReport: string | null | undefined;
  selectedSubmissionId?: string | null;
  selectedRows: string[];
  setSelectedRows: Dispatch<SetStateAction<string[]>>;
  sortOrder: 'newest' | 'oldest';
  setSortOrder: Dispatch<SetStateAction<'newest' | 'oldest'>>;
  categories: Category[];
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  teamMemberOptions: EditedBy[];
  teamMember: string;
  setTeamMember: Dispatch<SetStateAction<string>>;
  yearOptions: string[];
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  loading: boolean;
  reports: ReportResponse[];
  submissions: Submission[];
  toggleSelectAll: () => void;
  filteredReports: ReportResponse[];
  handleRowClick: (report: ReportResponse) => void;
  handleSubmissionRowClick?: (submission: Submission) => void;
  createActionButtons: () => JSX.Element;
  isDeleteReportDialogOpen: boolean;
  setIsDeleteReportDialogOpen: Dispatch<SetStateAction<boolean>>;
  selectedRow: string;
  isDuplicateReportDialogOpen: boolean;
  setIsDuplicateReportDialogOpen: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
  isMultiDeleteReportDialogOpen: boolean;
  setIsMultiDeleteReportDialogOpen: Dispatch<SetStateAction<boolean>>;
  isSubmissionDrawerOpen: boolean;
  setIsSubmissionDrawerOpen: Dispatch<SetStateAction<boolean>>;
  selectedSubmission: Submission | null;
  setSelectedSubmission: Dispatch<SetStateAction<Submission | null>>;
  allSchoolUsers: SchoolUser[];
  handleAssignSchedules: (user: SchoolUser | null) => void;
  onAssignUserToSingleSubmission: (
    submissionId: string,
    user: SchoolUser | null,
  ) => void;
}

// Utility functions
/* // Removing local cn function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
*/

const getStatusColor = (status: string) => {
  switch (status) {
    case 'complete':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'returned':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'incompleted':
      return 'bg-slate-100 text-slate-800 border-slate-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

const Reports: React.FC<ReportsProps> = ({
  isPreviewOpen,
  setIsPreviewOpen,
  selectedReport,
  selectedSubmissionId,
  selectedRows,
  setSelectedRows,
  sortOrder,
  setSortOrder,
  categories,
  category,
  setCategory,
  teamMemberOptions,
  teamMember,
  setTeamMember,
  yearOptions,
  year,
  setYear,
  searchText,
  setSearchText,
  loading,
  reports,
  submissions,
  toggleSelectAll,
  // filteredReports,
  handleRowClick,
  handleSubmissionRowClick,
  // createActionButtons,
  isDeleteReportDialogOpen,
  setIsDeleteReportDialogOpen,
  selectedRow,
  isDuplicateReportDialogOpen,
  setIsDuplicateReportDialogOpen,
  fetchData,
  isMultiDeleteReportDialogOpen,
  setIsMultiDeleteReportDialogOpen,
  isSubmissionDrawerOpen,
  setIsSubmissionDrawerOpen,
  selectedSubmission,
  setSelectedSubmission,
  allSchoolUsers,
  handleAssignSchedules,
  onAssignUserToSingleSubmission,
}) => {
  const allSchoolUsersFromSelector = useSelector(
    (state: RootState) => state.schoolUsers.schoolUsers,
  );

  // State for UserClickDropdown (batch assignment)
  const [dropdownAnchor, setDropdownAnchor] =
    React.useState<HTMLButtonElement | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);

  // State for row-specific UserClickDropdown
  const [selectedSubmissionForAssignment, setSelectedSubmissionForAssignment] =
    React.useState<Submission | null>(null);
  const [rowDropdownAnchor, setRowDropdownAnchor] =
    React.useState<HTMLButtonElement | null>(null);
  const [isRowUserDropdownOpen, setIsRowUserDropdownOpen] =
    React.useState(false);

  const handleAssignButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setDropdownAnchor(event.currentTarget);
    setIsUserDropdownOpen(true);
    setIsRowUserDropdownOpen(false); // Ensure other dropdown is closed
    setSelectedSubmissionForAssignment(null); // Clear single selection
    setRowDropdownAnchor(null);
  };

  const handleDropdownClose = () => {
    setIsUserDropdownOpen(false);
    setDropdownAnchor(null);
  };

  const handleUserSelectFromDropdown = (user: SchoolUser | null) => {
    handleAssignSchedules(user);
    handleDropdownClose();
  };

  // Handlers for row-specific assignment
  const handleRowAssignButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    submission: Submission,
  ) => {
    event.stopPropagation();
    setSelectedSubmissionForAssignment(submission);
    setRowDropdownAnchor(event.currentTarget);
    setIsRowUserDropdownOpen(true);
    // Ensure batch dropdown is closed
    setIsUserDropdownOpen(false);
    setDropdownAnchor(null);
  };

  const handleAssignUserForRow = (user: SchoolUser | null) => {
    if (selectedSubmissionForAssignment && onAssignUserToSingleSubmission) {
      onAssignUserToSingleSubmission(selectedSubmissionForAssignment.id, user);
    }
    setIsRowUserDropdownOpen(false);
    setRowDropdownAnchor(null);
    setSelectedSubmissionForAssignment(null);
  };

  const handleRowDropdownClose = () => {
    setIsRowUserDropdownOpen(false);
    setRowDropdownAnchor(null);
    setSelectedSubmissionForAssignment(null);
  };

  // Derived state for MultiDeleteReportDialog
  const reportIdsForMultiDelete = React.useMemo(() => {
    const reportIds = new Set<string>();
    if (selectedRows && submissions && reports) {
      selectedRows.forEach((subId) => {
        const submission = submissions.find((s) => s.id === subId);
        if (submission) {
          const parentReport = reports.find((report) =>
            report.schedules.some(
              (schedule) => schedule.id === submission.report_schedule,
            ),
          );
          if (parentReport) {
            reportIds.add(parentReport.id);
          }
        }
      });
    }
    return Array.from(reportIds);
  }, [selectedRows, submissions, reports]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Show the preview as an overlay when isPreviewOpen is true */}
      {isPreviewOpen && (
        <div className="absolute inset-0 z-50">
          <ReportPreview
            reportId={selectedReport || ''}
            submissionId={selectedSubmissionId || undefined}
            onClose={() => setIsPreviewOpen(false)}
          />
        </div>
      )}
      <div className="flex justify-between items-center py-4 px-6 border-b-[1px] border-beige-300 bg-beige-100 flex-shrink-0 gap-4">
        <h3 className="text-slate-900 font-semibold">Report Templates</h3>
      </div>

      {/* Add this right after the sort and category filters div (around line 309) */}
      {selectedRows.length > 0 && (
        <div className="flex w-full gap-4 h-[56px] items-center p-[0px_24px] border-b-[1px] border-beige-300 bg-orange-50">
          <div className="flex items-center gap-2">
            <h5>{selectedRows.length} schedules selected</h5>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-slate-500 flex gap-2 p-[8px_12px] rounded-[6px]"
              onClick={handleAssignButtonClick}
            >
              <UserPlusIcon className="h-6 w-6 text-slate-500" />
              <span className="button2-semibold text-slate-700">
                Assign schedules
              </span>
            </Button>
          </div>
        </div>
      )}

      {isUserDropdownOpen && dropdownAnchor && (
        <div
          style={{
            position: 'absolute',
            top: dropdownAnchor.offsetTop + dropdownAnchor.offsetHeight + 2, // Position below the button
            left: dropdownAnchor.offsetLeft, // Align with the button's left edge
            zIndex: 50, // Ensure it's above other elements
            width: '300px', // Set a reasonable width for the dropdown
          }}
        >
          <UserClickDropdown
            users={allSchoolUsers} // Use the prop passed down
            onUserChange={handleUserSelectFromDropdown}
            onClose={handleDropdownClose}
            onRemoveAssigneeClick={() => handleUserSelectFromDropdown(null)} // For unassigning
            // showSearchBar // Optionally enable search bar if many users
          />
        </div>
      )}

      {/* Row-specific User Assign Dropdown */}
      {isRowUserDropdownOpen &&
        rowDropdownAnchor &&
        selectedSubmissionForAssignment && (
          <div
            style={{
              position: 'fixed',
              top: `${rowDropdownAnchor.getBoundingClientRect().bottom + 2}px`,
              left: `${rowDropdownAnchor.getBoundingClientRect().right - 300}px`, // Align right edge of dropdown with right edge of button
              zIndex: 60,
              width: '300px',
            }}
          >
            <UserClickDropdown
              users={allSchoolUsers}
              onUserChange={handleAssignUserForRow}
              onClose={handleRowDropdownClose}
              onRemoveAssigneeClick={() => handleAssignUserForRow(null)}
              // currentAssigneeId={selectedSubmissionForAssignment.assigned_member} // Optional: if UserClickDropdown supports it
            />
          </div>
        )}

      {/* Sort and category filters */}
      <div className="flex w-full h-[56px] items-center p-4 border-b-[1px] border-beige-300 justify-between w-full">
        <div className="flex gap-2">
          <div className="flex p-2">
            <SortLabel value={sortOrder} onSort={setSortOrder} />
          </div>
          <div className="flex p-2">
            <FilterSelect
              label="Category"
              labels={['All', ...categories.map((category) => category.name)]}
              values={['All', ...categories.map((category) => category.id)]}
              value={category}
              onChange={setCategory}
            />
          </div>
          <div className="flex p-2">
            <FilterSelect
              label="Team Member"
              labels={[
                'All',
                ...teamMemberOptions.map(
                  (member) => `${member.first_name} ${member.last_name}`,
                ),
              ]}
              values={['All', ...teamMemberOptions.map((member) => member.id)]}
              value={teamMember}
              onChange={setTeamMember}
            />
          </div>
          <div className="flex p-2">
            <FilterSelect
              label="Year"
              labels={['All', ...yearOptions]}
              values={['All', ...yearOptions]}
              value={year}
              onChange={setYear}
            />
          </div>
        </div>
        <SearchBar
          placeholder="Search for reports"
          className="w-[365px]"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Main content */}
      {loading ? (
        <Loading />
      ) : (
        <div className="py-4 flex-1 flex flex-col overflow-hidden">
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-beige-100 z-10">
              <TableRow className="hover:bg-transparent">
                <TableCell className="py-2 px-4">
                  <Checkbox
                    checked={
                      submissions.length > 0 &&
                      selectedRows.length === submissions.length
                    }
                    onCheckedChange={toggleSelectAll}
                    className="mr-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
                  />
                  <span className="body2-medium text-slate-500">Name</span>
                </TableCell>
                <TableCell className="py-2 px-4">
                  <span className="body2-medium text-slate-500">
                    Categories
                  </span>
                </TableCell>
                <TableCell className="py-2 px-4">
                  <span className="body2-medium text-slate-500">Due Date</span>
                </TableCell>
                <TableCell className="py-2 px-4">
                  <span className="body2-medium text-slate-500">
                    Submission Date
                  </span>
                </TableCell>
                <TableCell className="py-2 px-4">
                  <span className="body2-medium text-slate-500">Owner</span>
                </TableCell>
                <TableCell className="py-2 px-4">
                  <span className="body2-medium text-slate-500">Status</span>
                </TableCell>
                <TableCell className="w-[150px] py-2 px-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <CogIcon className="h-5 w-5 text-slate-700" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {submissions.map((submission) => {
                // Find the parent report
                const parentReport = reports.find((report) =>
                  report.schedules.some(
                    (schedule) => schedule.id === submission.report_schedule,
                  ),
                );
                // Find the schedule object
                const schedule = parentReport?.schedules.find(
                  (sch) => sch.id === submission.report_schedule,
                );
                const userObj = allSchoolUsersFromSelector.find(
                  (u) => u.id === submission.assigned_member,
                );
                return (
                  <TableRow
                    key={submission.id}
                    className="border-b border-beige-500 hover:bg-beige-50/50 cursor-pointer bg-white"
                    onClick={() => {
                      if (handleSubmissionRowClick) {
                        handleSubmissionRowClick(submission);
                      } else if (parentReport && handleRowClick) {
                        // Fallback to old behavior if new handler isn't provided for some reason,
                        // or if we want to retain clicking the report part of the row
                        handleRowClick(parentReport);
                      }
                    }}
                  >
                    <TableCell className="py-4 px-4 w-[25%] min-w-[100px]">
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedRows.includes(submission.id)}
                          onCheckedChange={(checked) => {
                            const submissionId = submission.id;
                            if (checked) {
                              setSelectedRows([...selectedRows, submissionId]);
                            } else {
                              setSelectedRows(
                                selectedRows.filter(
                                  (id) => id !== submissionId,
                                ),
                              );
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mr-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
                        />
                        <span className="body1-regular">
                          {parentReport?.name || 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 w-[15%] min-w-[100px]">
                      <div className="flex items-center gap-2">
                        {parentReport?.categories &&
                          parentReport.categories.map((categoryId) => {
                            if (!categoryId) return null;

                            const categoryObject = categories.find(
                              (c) => c.id === categoryId,
                            );
                            if (!categoryObject) return null;

                            const colors = getCategoryColors(
                              categoryObject.color || 'slate',
                            );

                            return (
                              <Badge
                                key={categoryObject.id}
                                className={cn(
                                  colors.background,
                                  colors.border,
                                  'text-slate-700',
                                  'py-1 px-2',
                                )}
                              >
                                {categoryObject.name}
                              </Badge>
                            );
                          })}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 w-[15%] min-w-[100px]">
                      <span className="body1-regular">
                        {schedule?.schedule_time
                          ? format(parseISO(schedule.schedule_time), 'P')
                          : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 w-[15%] min-w-[100px]">
                      <span className="body1-regular">
                        {submission.school_submission_date
                          ? format(
                              parseISO(submission.school_submission_date),
                              'P',
                            )
                          : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 w-[15%] min-w-[100px]">
                      {(() => {
                        if (userObj) {
                          return (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 bg-orange-100 border border-orange-200 text-orange-600 text-xs">
                                <AvatarFallback>
                                  {userObj.first_name?.charAt(0).toUpperCase()}
                                  {userObj.last_name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="body1-regular">
                                {userObj.first_name} {userObj.last_name}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <span className="body1-regular text-red-500">
                            Unassigned
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="py-4 px-4 w-[10%] min-w-[100px]">
                      <Badge
                        variant="outline"
                        className={cn(
                          'border rounded-[50px] p-[6px_12px] body2-bold',
                          getStatusColor(submission.status || 'incompleted'),
                        )}
                      >
                        {submission.status === 'returned'
                          ? 'Returned'
                          : submission.status === 'completed'
                            ? 'Complete'
                            : submission.status === 'incompleted'
                              ? 'Incomplete'
                              : submission.status === 'pending'
                                ? 'Pending'
                                : 'Incomplete'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 w-[15%] min-w-[150px]">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement assign user logic for this specific submission
                            // For now, it can open the existing dropdown logic if a row selection mechanism is adapted
                            // or directly handle assignment for 'submission'
                            // console.log('Assign user for:', submission.id);
                            handleRowAssignButtonClick(e, submission); // Updated onClick
                          }}
                        >
                          <UserPlusIcon className="h-5 w-5 text-slate-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubmission(submission);
                            setIsSubmissionDrawerOpen(true);
                          }}
                        >
                          <ChatBubbleLeftIcon className="h-5 w-5 text-slate-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement download logic for this submission
                            console.log('Download for:', submission.id);
                          }}
                        >
                          <CloudArrowDownIcon className="h-5 w-5 text-slate-700" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination would go here */}
      {/* <CustomPagination
            totalItems={totalItems}
            itemsPerPageOptions={[6, 12, 18]}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            currentPage={page}
            itemsPerPage={itemsPerPage}
          /> */}

      {/* Delete dialog would go here */}
      {/* <DeleteReportDialog
            open={isDeleteReportDialogOpen}
            onClose={() => setIsDeleteReportDialogOpen(false)}
            selectedRow={selectedRow}
            onSubmit={() => {
              // Handle delete logic
              setIsDeleteReportDialogOpen(false);
            }}
          /> */}

      <DeleteReportDialog
        open={isDeleteReportDialogOpen}
        onClose={() => setIsDeleteReportDialogOpen(false)}
        selectedRow={selectedRow}
      />
      <DuplicateReportDialog
        open={isDuplicateReportDialogOpen}
        onClose={() => setIsDuplicateReportDialogOpen(false)}
        selectedRow={selectedRow}
        onSuccess={() => fetchData()}
      />
      <MultiDeleteReportDialog
        open={isMultiDeleteReportDialogOpen}
        onClose={() => setIsMultiDeleteReportDialogOpen(false)}
        selectedRows={reportIdsForMultiDelete}
        onSuccess={() => fetchData()}
      />

      {/* Submission Drawer */}
      {selectedSubmission && (
        <SubmissionDrawer
          open={isSubmissionDrawerOpen}
          onClose={() => {
            setIsSubmissionDrawerOpen(false);
            setSelectedSubmission(null);
          }}
          submission={selectedSubmission}
          onNavigate={() => {}} // Implement navigation logic if needed
          totalSubmissions={submissions.length}
          currentIndex={submissions.findIndex(
            (s) => s.id === selectedSubmission.id,
          )}
          isSchoolAdminView={true}
        />
      )}
    </div>
  );
};

export default Reports;
