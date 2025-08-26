import React, { useState, useMemo } from 'react';
import { Complaint } from '@/store/slices/complaintsSlice'; // For the sub-table
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon as CheckCircleSolidIcon,
  MinusCircleIcon,
  UserCircleIcon,
  FunnelIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon, // For sorting indicator
  ArrowUpIcon, // For sort direction
  ArrowDownIcon,
  ArrowTopRightOnSquareIcon, // For sort direction
} from '@heroicons/react/24/solid';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/base/Table';
import { Avatar, AvatarFallback } from '@/components/base/Avatar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/base/Select';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input'; // Using base Input for search consistency
import { parseISO, format } from 'date-fns';
import { cn } from '@/utils/tailwind';
import { Loading } from '@/components/base/Loading'; // Keep Loading
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; // Keep Error icon
import ComplaintFormSettingsModal from '@/components/Complaints/ComplaintFormSettingsModal'; // Placeholder import

// Types imported from the CONTAINER
import {
  ComplaintViewType,
  ComplaintStatusType,
  ComplaintPageFilters,
  PageFilterOptions as ComplaintsViewFilterOptions, // Alias to match original intent for prop name
  ComplaintSchoolSummary,
  ComplaintStatusSummary,
  ComplaintAssigneeSummary,
  SortDirection, // Import SortDirection type from container
} from '@/containers/Complaints/AgencyAdmin';

// Define the props this component expects
interface ComplaintsViewProps {
  summaryData:
    | ComplaintSchoolSummary[]
    | ComplaintStatusSummary[]
    | ComplaintAssigneeSummary[];
  allFilteredComplaints: Complaint[];
  currentView: ComplaintViewType;
  loading: boolean;
  error: string | null;
  filters: ComplaintPageFilters;
  filterOptions: ComplaintsViewFilterOptions;
  handleFilterChange: (key: keyof ComplaintPageFilters, value: string) => void;
  handleViewChange: (view: ComplaintViewType) => void;
  clearFilters: () => void;
  searchText: string;
  onSearchChange: (text: string) => void;
  sortColumnKey: string | null;
  sortDirection: SortDirection;
  handleSort: (key: string) => void;
}

const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  summaryData,
  allFilteredComplaints,
  currentView,
  loading,
  error,
  filters,
  filterOptions,
  handleFilterChange,
  handleViewChange,
  clearFilters,
  searchText,
  onSearchChange,
  sortColumnKey,
  sortDirection,
  handleSort,
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [isComplaintFormModalOpen, setIsComplaintFormModalOpen] =
    useState(false);

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const getComplaintsForExpandedItem = (itemId: string): Complaint[] => {
    if (currentView === 'bySchool') {
      const school = (summaryData as ComplaintSchoolSummary[]).find(
        (s) => s.id === itemId,
      );
      return school
        ? allFilteredComplaints.filter(
            (c) => c.schoolName === school.schoolName,
          )
        : [];
    } else if (currentView === 'byStatus') {
      const statusSummary = (summaryData as ComplaintStatusSummary[]).find(
        (s) => s.status === itemId,
      );
      return statusSummary
        ? allFilteredComplaints.filter((c) => c.status === statusSummary.status)
        : [];
    } else if (currentView === 'byAssignee') {
      const assigneeSummary = (summaryData as ComplaintAssigneeSummary[]).find(
        (a) => a.assigneeId === itemId,
      );
      return assigneeSummary
        ? allFilteredComplaints.filter(
            (c) =>
              (c.assignee?.id || 'unassigned') === assigneeSummary.assigneeId,
          )
        : [];
    }
    return [];
  };

  const getStatusBadgeCustomClasses = (status: ComplaintStatusType): string => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 ring-blue-600/20';
      case 'Open':
        return 'bg-orange-100 text-orange-800 ring-orange-600/20';
      case 'Resolved':
        return 'bg-green-100 text-green-800 ring-green-600/20';
      default:
        return 'bg-slate-100 text-slate-800 ring-slate-600/20';
    }
  };

  const mainTableHeaders = useMemo(() => {
    if (currentView === 'bySchool') {
      return [
        {
          key: 'schoolName',
          label: 'School Name',
          className: 'w-3/5 pl-10',
          sortable: true,
        },
        {
          key: 'totalComplaints',
          label: 'Total',
          className: 'w-1/5 text-right',
          sortable: true,
        },
        {
          key: 'unassignedComplaints',
          label: 'Unassigned',
          className: 'w-1/5 text-right pr-4',
          sortable: true,
        },
      ];
    } else if (currentView === 'byStatus') {
      return [
        {
          key: 'status',
          label: 'Status',
          className: 'w-3/5 pl-10',
          sortable: false,
        },
        {
          key: 'totalComplaints',
          label: 'Total',
          className: 'w-1/5 text-right',
          sortable: true,
        },
        {
          key: 'unassignedComplaints',
          label: 'Unassigned',
          className: 'w-1/5 text-right pr-4',
          sortable: true,
        },
      ];
    } else if (currentView === 'byAssignee') {
      return [
        {
          key: 'assigneeName',
          label: 'Assignee',
          className: 'w-4/5 pl-10',
          sortable: true,
        },
        {
          key: 'totalComplaints',
          label: 'Total Complaints',
          className: 'w-1/5 text-right pr-4',
          sortable: true,
        },
      ];
    }
    return [];
  }, [currentView]);

  const detailTableHeaders = useMemo(() => {
    const headers = [];
    if (currentView !== 'bySchool')
      headers.push({
        key: 'schoolName',
        label: 'School Name',
        className: 'w-1/4 pl-10',
        sortable: true,
      });
    headers.push({
      key: 'assignee',
      label: 'Assignee',
      className: 'w-1/5 pl-4',
      sortable: true,
    });
    headers.push({
      key: 'complainant',
      label: 'Complainant',
      className: 'w-1/4',
      sortable: true,
    });
    if (currentView !== 'byStatus')
      headers.push({
        key: 'status',
        label: 'Status',
        className: 'w-[15%]',
        sortable: true,
      });
    headers.push({
      key: 'followUp',
      label: 'Follow Up',
      className: 'w-[10%] text-center',
      sortable: true,
    });
    headers.push({
      key: 'dateOpened',
      label: 'Date Opened',
      className: 'w-[15%]',
      sortable: true,
    });
    headers.push({
      key: 'dateResolved',
      label: 'Date Resolved',
      className: 'w-[15%] pr-4',
      sortable: true,
    });
    return headers;
  }, [currentView]);

  const renderExpandedComplaintsTableBody = (
    complaints: Complaint[],
    parentKey: string,
  ) => {
    if (complaints.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={detailTableHeaders.length}
            className="text-center py-8 text-slate-500 italic"
          >
            No complaints found for this item.
          </TableCell>
        </TableRow>
      );
    }
    return complaints.map((complaint) => {
      return (
        <TableRow
          key={`${parentKey}-${complaint.id}`}
          className="hover:bg-beige-100/50 border-t border-beige-300"
        >
          {detailTableHeaders.map((header) => {
            let cellContent: React.ReactNode = '-';
            const cellClassName = cn(
              'py-4 px-4 body1-regular align-top',
              header.className,
            );
            switch (header.key) {
              case 'schoolName':
                cellContent = complaint.schoolName;
                break;
              case 'assignee':
                cellContent = complaint.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className={cn('w-6 h-6 text-xs')}>
                      <AvatarFallback>
                        {complaint.assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span>{complaint.assignee.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <UserCircleIcon className="w-6 h-6 text-slate-400" />
                    <span>Unassigned</span>
                  </div>
                );
                break;
              case 'complainant':
                cellContent = (
                  <>
                    <span className="font-medium">
                      {complaint.complainant.name}
                    </span>
                    <br />
                    <span className="text-xs text-slate-500">
                      {complaint.complainant.email}
                    </span>
                  </>
                );
                break;
              case 'status':
                cellContent = (
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset capitalize',
                      getStatusBadgeCustomClasses(complaint.status),
                    )}
                  >
                    {complaint.status}
                  </span>
                );
                break;
              case 'followUp':
                cellContent = complaint.followUp ? (
                  <CheckCircleSolidIcon
                    className="w-5 h-5 text-green-500 mx-auto"
                    title="Follow Up Required"
                  />
                ) : (
                  <MinusCircleIcon
                    className="w-5 h-5 text-slate-400 mx-auto"
                    title="No Follow Up Required"
                  />
                );
                break;
              case 'dateOpened':
                cellContent = format(
                  parseISO(complaint.dateOpened),
                  'MM/dd/yyyy',
                );
                break;
              case 'dateResolved':
                cellContent = complaint.dateResolved
                  ? format(parseISO(complaint.dateResolved), 'MM/dd/yyyy')
                  : '-';
                break;
            }
            return (
              <TableCell key={header.key} className={cellClassName}>
                {cellContent}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  const renderSelectFilter = (
    label: string,
    filterKey: keyof ComplaintPageFilters,
    options: { value: string; label: string }[],
    icon?: React.ElementType,
  ) => {
    const IconComponent = icon || FunnelIcon;
    const selectedLabel =
      options.find((o) => o.value === filters[filterKey])?.label || 'All';
    const isSelected = selectedLabel !== 'All';
    return (
      <div className="flex items-center gap-1">
        <IconComponent className="h-4 w-4 text-slate-400 flex-shrink-0" />
        <span className="body3-regular text-slate-600 whitespace-nowrap">
          {label}:
        </span>
        <Select
          value={filters[filterKey]}
          onValueChange={(value) => handleFilterChange(filterKey, value)}
        >
          <SelectTrigger
            className={cn(
              'border-0 p-0 h-auto shadow-none hover:bg-transparent focus:ring-0 min-w-[40px] body3-regular',
              isSelected ? 'text-blue-600 font-medium' : 'text-slate-700',
            )}
          >
            <span>{selectedLabel}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-sm"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderViewSelect = () => {
    const selectedLabel = filterOptions.view.find(
      (o) => o.value === currentView,
    )?.label;
    return (
      <div className="flex items-center gap-1 bg-orange-50 border-r-[1px] border-slate-200 px-4 py-2 body3-regular">
        <EyeIcon className="h-4 w-4 text-slate-500" />
        <span>View:</span>
        <Select
          value={currentView}
          onValueChange={(value) =>
            handleViewChange(value as ComplaintViewType)
          }
        >
          <SelectTrigger className="border-0 p-0 h-auto shadow-none hover:bg-transparent focus:ring-0">
            <span className="body3-regular font-medium text-slate-700">
              {selectedLabel}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filterOptions.view.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-sm"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="m-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 rounded-md flex-shrink-0">
        <ExclamationTriangleIcon
          className="h-5 w-5 flex-shrink-0"
          aria-hidden="true"
        />
        <span>Error: {error}</span>
      </div>
    );

  return (
    <div className="flex flex-col h-full relative bg-slate-50">
      <div className="flex justify-between items-center py-4 px-6 border-b-[1px] h-[72px] border-beige-400 bg-beige-100 flex-shrink-0">
        <h3 className="text-slate-900 font-semibold text-xl">Complaints</h3>
        <Button
          variant="default"
          className="flex items-center gap-3 h-9 bg-blue-500 text-white hover:bg-blue-600 rounded-[3px]"
          onClick={() => setIsComplaintFormModalOpen(true)}
        >
          Complaint Form
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex border-b border-beige-400 bg-white h-[56px]">
        {renderViewSelect()}
        <div className="flex items-center gap-2 py-2 px-6 body3-regular flex-wrap">
          {renderSelectFilter('School', 'school', filterOptions.school)}
          {renderSelectFilter('Status', 'status', filterOptions.status)}
          {renderSelectFilter('Follow Up', 'followUp', filterOptions.followUp)}
        </div>
        <div className="ml-auto flex items-center pr-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="body3-regular text-slate-700 hover:text-blue-600"
          >
            Clear All
          </Button>
          <div className="relative w-full max-w-xs sm:w-64 ml-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
            </div>
            <Input
              type="text"
              placeholder="Search complaints..."
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 pl-9 w-full"
            />
          </div>
        </div>
      </div>

      <div className="py-4 flex-1 flex flex-col overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 bg-slate-50 z-10 shadow-sm">
            <TableRow className="border-b border-slate-300">
              {mainTableHeaders.map((header) => (
                <TableCell
                  key={header.key}
                  className={cn(
                    'py-3 px-4 text-xs uppercase tracking-wider text-slate-500 font-semibold whitespace-nowrap',
                    header.className,
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-1',
                      header.sortable && 'cursor-pointer hover:text-slate-700',
                    )}
                    onClick={
                      header.sortable ? () => handleSort(header.key) : undefined
                    }
                  >
                    <span>{header.label}</span>
                    {header.sortable &&
                      (sortColumnKey === header.key ? (
                        sortDirection === 'asc' ? (
                          <ArrowUpIcon className="w-3 h-3 text-slate-700" />
                        ) : (
                          <ArrowDownIcon className="w-3 h-3 text-slate-700" />
                        )
                      ) : (
                        <ArrowsUpDownIcon className="w-3 h-3 text-slate-400" />
                      ))}
                  </div>
                </TableCell>
              ))}
              <TableCell className="w-16 pr-4"></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm text-slate-700 divide-y divide-slate-200 bg-white">
            {summaryData.length === 0 && !loading ? (
              <TableRow>
                <TableCell
                  colSpan={mainTableHeaders.length + 1}
                  className="text-center py-10 text-slate-500 italic"
                >
                  No complaints found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              summaryData.map((item, index) => {
                let itemId: string;
                let summaryCells: React.ReactNode[];

                // Type guard functions - Use 'unknown' instead of 'any'
                const isSchoolSummary = (
                  data: unknown,
                ): data is ComplaintSchoolSummary =>
                  typeof data === 'object' &&
                  data !== null &&
                  currentView === 'bySchool' &&
                  'schoolName' in data;
                const isStatusSummary = (
                  data: unknown,
                ): data is ComplaintStatusSummary =>
                  typeof data === 'object' &&
                  data !== null &&
                  currentView === 'byStatus' &&
                  'status' in data;
                const isAssigneeSummary = (
                  data: unknown,
                ): data is ComplaintAssigneeSummary =>
                  typeof data === 'object' &&
                  data !== null &&
                  currentView === 'byAssignee' &&
                  'assigneeId' in data;

                // Use type guards to determine structure and types
                if (isSchoolSummary(item)) {
                  itemId = item.id;
                  summaryCells = [
                    <TableCell
                      key="name"
                      className="pl-10 py-4 px-4 body1-regular"
                    >
                      {item.schoolName}
                    </TableCell>,
                    <TableCell
                      key="total"
                      className="py-4 px-4 text-right body1-regular"
                    >
                      {item.totalComplaints}
                    </TableCell>,
                    <TableCell
                      key="unassigned"
                      className="py-4 px-4 text-right body1-regular"
                    >
                      {item.unassignedComplaints}
                    </TableCell>,
                  ];
                } else if (isStatusSummary(item)) {
                  itemId = item.status;
                  summaryCells = [
                    <TableCell
                      key="status"
                      className="pl-10 py-4 px-4 body1-regular"
                    >
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset capitalize',
                          getStatusBadgeCustomClasses(item.status),
                        )}
                      >
                        {item.status}
                      </span>
                    </TableCell>,
                    <TableCell
                      key="total"
                      className="py-4 px-4 text-right body1-regular"
                    >
                      {item.totalComplaints}
                    </TableCell>,
                    <TableCell
                      key="unassigned"
                      className="py-4 px-4 text-right body1-regular"
                    >
                      {item.unassignedComplaints}
                    </TableCell>,
                  ];
                } else if (isAssigneeSummary(item)) {
                  itemId = item.assigneeId;
                  summaryCells = [
                    <TableCell
                      key="assignee"
                      className="pl-10 py-4 px-4 body1-regular"
                    >
                      {item.assigneeName}
                    </TableCell>,
                    <TableCell
                      key="total"
                      className="py-4 px-4 text-right body1-regular"
                    >
                      {item.totalComplaints}
                    </TableCell>,
                  ];
                } else {
                  itemId = `unknown-${index}`;
                  summaryCells = [
                    <TableCell key="error" colSpan={mainTableHeaders.length}>
                      Error
                    </TableCell>,
                  ];
                }
                const isExpanded = expandedItems[itemId];
                const complaintsForDetails = isExpanded
                  ? getComplaintsForExpandedItem(itemId)
                  : [];

                return (
                  <React.Fragment key={itemId}>
                    <TableRow
                      className="hover:bg-beige-50/50 group bg-white cursor-pointer border-b border-beige-300"
                      onClick={() => toggleItemExpansion(itemId)}
                    >
                      {summaryCells}
                      <TableCell className="py-4 px-4 w-16 text-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {isExpanded ? (
                            <ChevronUpIcon className="w-4 h-4 text-slate-500 mx-auto" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-slate-500 mx-auto" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-beige-50">
                        <TableCell
                          colSpan={mainTableHeaders.length + 1}
                          className="p-0 pl-8"
                        >
                          <Table className="min-w-full">
                            {complaintsForDetails.length > 0 && (
                              <TableHeader className="bg-beige-100">
                                <TableRow className="hover:bg-transparent border-y border-beige-300">
                                  {detailTableHeaders.map((th) => (
                                    <TableCell
                                      key={th.key}
                                      className={cn(
                                        'py-2 px-4 body2-medium text-slate-500 whitespace-nowrap',
                                        th.className,
                                      )}
                                    >
                                      <div className="flex items-center gap-1 cursor-pointer">
                                        <span>{th.label}</span>
                                        {th.sortable && (
                                          <ArrowsUpDownIcon className="w-3 h-3 text-slate-400" />
                                        )}
                                      </div>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHeader>
                            )}
                            <TableBody>
                              {renderExpandedComplaintsTableBody(
                                complaintsForDetails,
                                itemId,
                              )}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {isComplaintFormModalOpen && (
        <ComplaintFormSettingsModal
          isOpen={isComplaintFormModalOpen}
          onClose={() => setIsComplaintFormModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ComplaintsView;
