import React from 'react';
import { cn } from '@/utils/tailwind';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloudArrowDownIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/base/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/base/Table';
import { Checkbox } from '@/components/base/Checkbox';
import { Submission, SubmissionStatus } from '@/store/slices/submissionsSlice';
import { format, parseISO } from 'date-fns';
import { SubmissionsComponentProps } from './AgencyAdmin';
import { GroupedData } from './AgencyAdmin';
import { formatGradeRange } from '@utils/gradeFormatting';
import { ReportResponse } from '@/containers/Reports/index.types';
import { School } from '@/store/slices/schoolsSlice';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';

// Props specific to this table component
export interface SubmissionsBySchoolTableProps {
  groupedData: GroupedData[];
  expandedRows: string[];
  selectedRows: string[];
  toggleRowExpansion: (id: string) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  handleSubmissionClick: (submission: Submission) => void;
  renderProgressBar: (submissions: Submission[]) => JSX.Element | null;
  handleOpenUserDropdown: (
    event: React.MouseEvent<HTMLButtonElement>,
    targetData: NonNullable<SubmissionsComponentProps['dropdownTarget']>,
  ) => void;
  getStatusColor: (status: SubmissionStatus) => string;
  allReports: ReportResponse[];
  allSchools: School[];
  allSchoolUsers: SchoolUser[];
  handleSchoolGroupFileDownload: (schoolGroup: GroupedData) => void;
  handleSubmissionFileDownload: (submission: Submission) => void;
}

export const SubmissionsBySchoolTable: React.FC<
  SubmissionsBySchoolTableProps
> = ({
  groupedData,
  expandedRows,
  selectedRows,
  toggleRowExpansion,
  setSelectedRows,
  handleSubmissionClick,
  renderProgressBar,
  handleOpenUserDropdown,
  getStatusColor,
  allReports,
  allSchools,
  allSchoolUsers,
  handleSchoolGroupFileDownload,
  handleSubmissionFileDownload,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>
            <Checkbox className="mr-2" />
            School
          </TableCell>
          <TableCell>Grades Served</TableCell>
          <TableCell className="w-[240px]">Status</TableCell>
          <TableCell className="w-[120px] text-right">Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groupedData.map((schoolGroup) => (
          <React.Fragment key={schoolGroup.id}>
            <TableRow
              className="cursor-pointer hover:bg-beige-50/50 border-b border-beige-500 bg-white"
              onClick={() => toggleRowExpansion(schoolGroup.id)}
            >
              <TableCell className="py-4 px-4">
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedRows.includes(schoolGroup.id)}
                    onCheckedChange={(checked) => {
                      const isChecked = !!checked;
                      if (isChecked) {
                        setSelectedRows((prev) => [...prev, schoolGroup.id]);
                      } else {
                        setSelectedRows((prev) =>
                          prev.filter((id) => id !== schoolGroup.id),
                        );
                      }
                    }}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    className="mr-2"
                  />
                  <span className="body1-regular">{schoolGroup.name}</span>
                </div>
              </TableCell>
              <TableCell className="py-4 px-4 body1-regular">
                {formatGradeRange(schoolGroup.gradeserved || [])}
              </TableCell>
              <TableCell className="p-0 h-full">
                {renderProgressBar(schoolGroup.submissions)}
              </TableCell>
              <TableCell className="py-4 px-4">
                <div className="flex justify-end gap-2">
                  {schoolGroup.submissions.some(
                    (submission) => submission.status !== 'incompleted',
                  ) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleSchoolGroupFileDownload(schoolGroup);
                      }}
                      title="Download"
                    >
                      <CloudArrowDownIcon className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleOpenUserDropdown(e, {
                        type: 'bulk',
                        group: schoolGroup,
                        groupType: 'school',
                      });
                    }}
                    title="Assign User"
                  >
                    <UserGroupIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      toggleRowExpansion(schoolGroup.id);
                    }}
                  >
                    {expandedRows.includes(schoolGroup.id) ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            {expandedRows.includes(schoolGroup.id) && (
              <TableRow className="bg-beige-50">
                <TableCell colSpan={4} className="p-0 pl-8">
                  <Table>
                    <TableHeader className="bg-beige-100">
                      <TableRow className="hover:bg-transparent border-y border-beige-300">
                        <TableCell className="py-2 px-4">
                          <span className="body2-medium text-slate-500">
                            Report (Schedule ID)
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          <span className="body2-medium text-slate-500">
                            School
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          <span className="body2-medium text-slate-500">
                            Due Date
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          <span className="body2-medium text-slate-500">
                            Submission Date
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          <span className="body2-medium text-slate-500">
                            Status
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-4">Team Member</TableCell>
                        <TableCell className="w-[100px]"></TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schoolGroup.submissions.map((submission: Submission) => {
                        const report = allReports.find(
                          (r) => r.id === submission.report,
                        );
                        const schedule = report?.schedules.find(
                          (sch) => sch.id === submission.report_schedule,
                        );
                        const scheduleName =
                          schedule?.report_name || submission.report_schedule;
                        const school = allSchools.find(
                          (s) => s.id === submission.school,
                        );
                        const assignedMember = allSchoolUsers.find(
                          (u) => u.id === submission.assigned_member,
                        );
                        return (
                          <TableRow
                            key={submission.id}
                            className="hover:bg-beige-100/50 cursor-pointer"
                            onClick={() => handleSubmissionClick(submission)}
                          >
                            <TableCell className="py-4 px-4 body1-regular">
                              {scheduleName}
                            </TableCell>
                            <TableCell className="py-4 px-4 body1-regular">
                              {school ? school.name : 'N/A'}
                            </TableCell>
                            <TableCell className="py-4 px-4 body1-regular">
                              {submission.due_date
                                ? format(
                                    parseISO(submission.due_date),
                                    'MM/dd/yyyy',
                                  )
                                : 'N/A'}
                            </TableCell>
                            <TableCell className="py-4 px-4 body1-regular">
                              <span
                                className={cn(
                                  'body1-regular',
                                  submission.school_submission_date &&
                                    submission.due_date &&
                                    new Date(
                                      submission.school_submission_date,
                                    ) > new Date(submission.due_date) &&
                                    'text-red-500',
                                )}
                              >
                                {submission.school_submission_date
                                  ? format(
                                      parseISO(
                                        submission.school_submission_date,
                                      ),
                                      'MM/dd/yyyy',
                                    )
                                  : '-'}
                              </span>
                            </TableCell>
                            <TableCell className="py-4 px-4 body1-regular">
                              <span
                                className={cn(
                                  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                  getStatusColor(submission.status),
                                )}
                              >
                                {submission.status
                                  ? submission.status.charAt(0).toUpperCase() +
                                    submission.status.slice(1)
                                  : 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell className="py-4 px-4 body1-regular">
                              <div className="flex items-center gap-2">
                                {assignedMember ? (
                                  <span>{`${assignedMember.first_name} ${assignedMember.last_name}`}</span>
                                ) : (
                                  <span className="text-slate-500 italic">
                                    Unassigned
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-4">
                              <div className="flex justify-end gap-1">
                                {submission.status !== 'incompleted' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      handleSubmissionFileDownload(submission);
                                    }}
                                    title="Download"
                                  >
                                    <CloudArrowDownIcon className="h-5 w-5" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    e.stopPropagation();
                                    handleOpenUserDropdown(e, {
                                      type: 'single',
                                      submission,
                                    });
                                  }}
                                  title="Assign User"
                                >
                                  <UserGroupIcon className="h-5 w-5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
