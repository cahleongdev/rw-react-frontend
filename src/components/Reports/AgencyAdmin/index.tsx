import React, { Dispatch, SetStateAction } from 'react';
import { TrashIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

import ReportInfoDrawer from '@/containers/Reports/ReportInfoDrawer';
import ReportPreview from '@/containers/Reports/ReportPreview/AgencyAdmin';
import DeleteReportDialog from '@/containers/Reports/DeleteReportDialog';
import DuplicateReportDialog from '@/containers/Reports/DuplicateReportDialog';
import MultiDeleteReportDialog from '@/containers/Reports/MultiDeleteReportDialog';
import NewReportForm from '@/containers/Reports/NewReportForm';
import { EditedBy, ReportResponse } from '@/containers/Reports/index.types';
import { Category } from '@/containers/Reports/index.types';

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
import SortLabel from '@/components/Notifications/SortLabel';
import { FilterSelect } from '@/components/base/FilterSelect';
import { Loading } from '@/components/base/Loading';
import { SearchBar } from '@/components/base/SearchBar';
import { Badge } from '@/components/base/Badge';

import { cn } from '@/utils/tailwind';
import { getCategoryColors } from '@/utils/categoryColors';

interface ReportsProps {
  isPreviewOpen: boolean;
  setIsPreviewOpen: Dispatch<SetStateAction<boolean>>;
  selectedReport: string | null | undefined;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  wasDrawerOpenBeforePreview: boolean;
  setWasDrawerOpenBeforePreview: Dispatch<SetStateAction<boolean>>;
  isCreatingNewReport: boolean;
  setIsCreatingNewReport: Dispatch<SetStateAction<boolean>>;
  handlePreviewRequest: (report: ReportResponse) => void;
  isEditingReport: boolean;
  setIsEditingReport: Dispatch<SetStateAction<boolean>>;
  reportToEdit: ReportResponse | null;
  initialEditStep: number;
  handleTabChange: (newTab: string) => void;
  activeFilter: string;
  selectedRows: string[];
  setSelectedRows: Dispatch<SetStateAction<string[]>>;
  isMultiDeleteReportDialogOpen: boolean;
  setIsMultiDeleteReportDialogOpen: Dispatch<SetStateAction<boolean>>;
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
  toggleSelectAll: () => void;
  filteredReports: ReportResponse[];
  handleRowClick: (report: ReportResponse) => void;
  createActionButtons: (reportId: string) => JSX.Element;
  isDrawerOpen: boolean;
  handleEditSection: (
    reportId: string,
    section: 'details' | 'schedule' | 'submission' | 'scoring',
  ) => void;
  isDeleteReportDialogOpen: boolean;
  setIsDeleteReportDialogOpen: Dispatch<SetStateAction<boolean>>;
  selectedRow: string;
  isDuplicateReportDialogOpen: boolean;
  setIsDuplicateReportDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const Reports: React.FC<ReportsProps> = ({
  isPreviewOpen,
  selectedReport,
  setIsPreviewOpen,
  wasDrawerOpenBeforePreview,
  setIsDrawerOpen,
  setWasDrawerOpenBeforePreview,
  isCreatingNewReport,
  setIsCreatingNewReport,
  handlePreviewRequest,
  isEditingReport,
  reportToEdit,
  setIsEditingReport,
  initialEditStep,
  handleTabChange,
  activeFilter,
  selectedRows,
  isMultiDeleteReportDialogOpen,
  setIsMultiDeleteReportDialogOpen,
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
  toggleSelectAll,
  filteredReports,
  handleRowClick,
  setSelectedRows,
  createActionButtons,
  isDrawerOpen,
  handleEditSection,
  isDeleteReportDialogOpen,
  setIsDeleteReportDialogOpen,
  selectedRow,
  isDuplicateReportDialogOpen,
  setIsDuplicateReportDialogOpen,
}) => {
  // Calculate counts for each category
  const draftCount = reports.filter((report) => !report.approved).length;
  const readyCount = reports.filter(
    (report) =>
      report.approved &&
      (!report.assigned_schools || report.assigned_schools.length === 0),
  ).length;
  const assignedCount = reports.filter(
    (report) =>
      report.approved &&
      report.assigned_schools &&
      report.assigned_schools.length > 0,
  ).length;

  const tabLabels = [
    `Draft (${draftCount})`,
    `Ready (${readyCount})`,
    `Assigned (${assignedCount})`,
  ];

  return (
    <div className="flex flex-col h-full relative">
      {/* Show the preview as an overlay when isPreviewOpen is true */}
      {isPreviewOpen && (
        <div className="absolute inset-0 z-60">
          <ReportPreview
            reportId={selectedReport || ''}
            onClose={() => {
              setIsPreviewOpen(false);
              if (wasDrawerOpenBeforePreview) {
                setIsDrawerOpen(true);
                setWasDrawerOpenBeforePreview(false);
              }
            }}
          />
        </div>
      )}

      {/* The rest of your component */}
      {isCreatingNewReport ? (
        <NewReportForm
          onCancel={() => setIsCreatingNewReport(false)}
          onPreviewRequest={handlePreviewRequest}
        />
      ) : isEditingReport && reportToEdit ? (
        <NewReportForm
          onCancel={() => setIsEditingReport(false)}
          initialData={reportToEdit}
          initialStep={initialEditStep}
          onPreviewRequest={handlePreviewRequest}
        />
      ) : (
        <>
          {/* Header with filters and new report button */}
          <div className="flex justify-between items-center py-4 px-6 border-b-[1px] border-beige-300 bg-beige-100 flex-shrink-0 gap-4">
            <h3 className="text-slate-900 font-semibold">Report Templates</h3>
            <div className="flex flex-1">
              {tabLabels.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleTabChange(filter.split(' ')[0])}
                  className={`
                    px-4 py-2 
                    rounded-[5px]
                    text-sm font-medium
                    transition-colors
                    ${
                      activeFilter === filter.split(' ')[0]
                        ? 'bg-blue-50 text-blue-500 hover:bg-blue-50'
                        : 'bg-transparent text-slate-500 hover:bg-neutral-100'
                    }
                  `}
                >
                  {filter}
                </button>
              ))}
            </div>
            <Button
              className="cursor-pointer bg-blue-500 rounded-[6px] hover:bg-blue-600 h-[36px] px-3 py-2"
              onClick={() => setIsCreatingNewReport(true)}
            >
              <span className="text-white text-sm font-medium">New Report</span>
            </Button>
          </div>

          {/* Add this right after the sort and category filters div (around line 309) */}
          {selectedRows.length > 0 && (
            <div className="flex w-full gap-4 h-[56px] items-center p-[0px_24px] border-b-[1px] border-beige-300 bg-orange-50">
              <div className="flex items-center gap-2">
                <h5>{selectedRows.length} reports selected</h5>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-500 h-[36px] p-[10px]"
                  onClick={() => {
                    // Handle delete logic for multiple reports
                    setIsMultiDeleteReportDialogOpen(true);
                  }}
                >
                  <TrashIcon className="h-6 w-6 text-slate-500" />
                </Button>
              </div>
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
                  labels={[
                    'All',
                    ...categories.map((category) => category.name),
                  ]}
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
                  values={[
                    'All',
                    ...teamMemberOptions.map((member) => member.id),
                  ]}
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
                          selectedRows.length === reports.length &&
                          reports.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                        className="mr-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
                      />
                      <span className="body2-medium text-slate-500">Name</span>
                    </TableCell>
                    {activeFilter === 'Assigned' && (
                      <TableCell className="py-2 px-4">
                        <span className="body2-medium text-slate-500">
                          Schools
                        </span>
                      </TableCell>
                    )}
                    <TableCell className="py-2 px-4">
                      <span className="body2-medium text-slate-500">
                        Due Date
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      <span className="body2-medium text-slate-500">
                        Edited by
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      <span className="body2-medium text-slate-500">
                        Categories
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-4 flex justify-end">
                      <Cog6ToothIcon className="h-6 w-6 text-slate-500" />
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow
                      key={report.id}
                      className="border-b border-beige-500 hover:bg-beige-50/50 cursor-pointer bg-white"
                      onClick={() => handleRowClick(report)}
                    >
                      <TableCell
                        className={cn(
                          'py-4 px-4',
                          activeFilter === 'Assigned'
                            ? 'w-[30%] min-w-[100px]'
                            : 'w-[40%] min-w-[100px]',
                        )}
                      >
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedRows.includes(report.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRows([...selectedRows, report.id]);
                              } else {
                                setSelectedRows(
                                  selectedRows.filter((id) => id !== report.id),
                                );
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="mr-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
                          />
                          <span className="body1-regular">{report.name}</span>
                        </div>
                      </TableCell>
                      {activeFilter === 'Assigned' && (
                        <TableCell className="py-4 px-4 w-[10%] min-w-[70px]">
                          <div className="flex items-center relative">
                            <span className="body1-regular">
                              {report.assigned_schools.length}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="py-4 px-4 w-[15%] min-w-[100px]">
                        <div className="flex items-center relative">
                          <span className="body1-regular">
                            {report.schedules && report.schedules.length > 0 ? (
                              report.schedules.length === 1 ? (
                                new Date(
                                  report.schedules[0].schedule_time,
                                ).toLocaleDateString()
                              ) : (
                                <div className="relative group">
                                  <span>
                                    {new Date(
                                      report.schedules[0].schedule_time,
                                    ).toLocaleDateString()}{' '}
                                    + {report.schedules.length - 1} more
                                  </span>
                                  <div className="absolute left-0 top-full mt-1 bg-white shadow-md rounded-md p-2 z-20 hidden group-hover:block">
                                    {report.schedules.map((schedule, index) => (
                                      <div key={index} className="py-1 text-sm">
                                        {new Date(
                                          schedule.schedule_time,
                                        ).toLocaleDateString()}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            ) : (
                              'No due date'
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 w-[15%] min-w-[100px]">
                        <div className="flex items-center">
                          <span className="body1-regular">
                            {report.edited_by?.first_name &&
                              report.edited_by?.last_name &&
                              report.edited_by?.first_name +
                                ' ' +
                                report.edited_by?.last_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 w-[15%] min-w-[100px]">
                        <div className="flex items-center gap-2">
                          {report.categories &&
                            report.categories.map((categoryId) => {
                              if (!categoryId) return null;

                              const category = categories.find(
                                (c) => c.id === categoryId,
                              );
                              if (!category) return null;

                              // Get color object using category.color
                              const colors = getCategoryColors(
                                category.color || 'slate',
                              );

                              return (
                                <Badge
                                  key={category.id}
                                  // Apply colors to className using cn
                                  className={cn(
                                    colors.background,
                                    colors.border,
                                    'text-slate-700',
                                  )}
                                >
                                  {category.name}
                                </Badge>
                              );
                            })}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 w-[15%] min-w-[100px]">
                        <div className="flex justify-end gap-2">
                          {createActionButtons(report.id)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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

          {/* Report Info Drawer */}
          <ReportInfoDrawer
            reportId={selectedReport || ''}
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onPreviewOpen={() => {
              setWasDrawerOpenBeforePreview(true);
              setIsPreviewOpen(true);
              setIsDrawerOpen(false);
            }}
            onEditSection={handleEditSection}
          />
          <DeleteReportDialog
            open={isDeleteReportDialogOpen}
            onClose={() => setIsDeleteReportDialogOpen(false)}
            selectedRow={selectedRow}
          />
          <DuplicateReportDialog
            open={isDuplicateReportDialogOpen}
            onClose={() => setIsDuplicateReportDialogOpen(false)}
            selectedRow={selectedRow}
          />
          <MultiDeleteReportDialog
            open={isMultiDeleteReportDialogOpen}
            onClose={() => setIsMultiDeleteReportDialogOpen(false)}
            selectedRows={selectedRows}
            onSuccess={() => {
              setSelectedRows([]);
            }}
          />
        </>
      )}
    </div>
  );
};

export default Reports;
