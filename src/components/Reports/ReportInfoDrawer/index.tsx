import React, { Dispatch, SetStateAction, RefObject } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckIcon, EyeIcon, PencilIcon, UserIcon, X } from 'lucide-react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

import AgencyReportPreview from '@/containers/Reports/ReportPreview/AgencyAdmin';
import SchoolReportPreview from '@/containers/Reports/ReportPreview/SchoolAdmin';
import AssignSchoolDialog from '@/containers/Reports/ReportInfoDrawer/AssignSchoolDialog/AgencyAdmin';
import { ReportResponse } from '@/containers/Reports/index.types';
import { Category } from '@/containers/Reports/index.types';

import { ActivityLog } from '@/store/slices/activityLogSlice';

import { SchoolResponse } from '@/store/slices/schoolsSlice';

import { USER_ROLES } from '@/constants/userRoles';

import { Badge } from '@/components/base/Badge';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/Table';
import { Drawer } from '@/components/base/Drawer';
import { Tabs, TabsContainer, TabsContent } from '@/components/base/Tabs';
import { ScrollArea } from '@/components/base/ScrollArea';
import MessageInput from '@/components/Messaging/MessageInput';

interface Tab {
  id: string;
  label: string;
}

interface ReportInfoDrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
  setCurrentTab: Dispatch<SetStateAction<string>>;
  report: ReportResponse;
  onPreviewOpen: () => void;
  setIsAssignSchoolsOpen: Dispatch<SetStateAction<boolean>>;
  dropdownRef: RefObject<HTMLDivElement>;
  setShowApproveDropdown: Dispatch<SetStateAction<boolean>>;
  showApproveDropdown: boolean;
  handleApproveAndAssignSchools: () => void;
  handleApproveAndClose: () => void;
  tabs: Tab[];
  currentTab: string;
  handleEditDetails: () => void;
  categoryOptions: Category[];
  handleEditSchedule: () => void;
  reportNames: Record<string, string>;
  handleReportNameChange: (date: string, name: string) => void;
  handleResetName: (date: string) => void;
  handleEditSubmission: () => void;
  handleEditScoring: () => void;
  loadingActivity: boolean;
  activityLogs: ActivityLog[];
  handleSendMessage: (content: string) => void;
  loadingSchools: boolean;
  schoolsData: SchoolResponse[];
  isPreviewOpen: boolean;
  setIsPreviewOpen: Dispatch<SetStateAction<boolean>>;
  reportId: string;
  isAssignSchoolsOpen: boolean;
  fetchSchoolsData: () => void;
  role: string | undefined;
}

const ReportInfoDrawer: React.FC<ReportInfoDrawerProps> = ({
  open,
  handleDrawerClose,
  setCurrentTab,
  report,
  onPreviewOpen,
  setIsAssignSchoolsOpen,
  dropdownRef,
  setShowApproveDropdown,
  showApproveDropdown,
  handleApproveAndAssignSchools,
  handleApproveAndClose,
  tabs,
  currentTab,
  handleEditDetails,
  categoryOptions,
  handleEditSchedule,
  reportNames,
  handleReportNameChange,
  handleResetName,
  handleEditSubmission,
  handleEditScoring,
  loadingActivity,
  activityLogs,
  handleSendMessage,
  loadingSchools,
  schoolsData,
  isPreviewOpen,
  reportId,
  setIsPreviewOpen,
  isAssignSchoolsOpen,
  fetchSchoolsData,
  role,
}) => {
  return (
    <Drawer
      open={open}
      onClose={handleDrawerClose}
      width="600px"
      side="right"
      hideCloseButton
    >
      <div className="flex flex-col h-full overflow-hidden">
        <TabsContainer
          defaultTab="details"
          className="flex flex-col h-full"
          onTabChange={(tabId) => {
            setCurrentTab(tabId);
          }}
        >
          <div className="flex flex-col p-[16px_16px_0_16px] gap-2">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1 flex gap-2 items-center">
                <h4 className="text-wrap break-words max-w-full">
                  {report.name || '[Report Name]'}
                </h4>
                <Badge variant="outline">{'DRAFT'}</Badge>
              </div>
              <div className="flex gap-4 shrink-0 mt-2 sm:mt-0">
                <Link to={`/reports/preview/${reportId}`}>
                  <Button
                    variant="outline"
                    className="flex gap-2 h-[36px] p-[8px_12px] border-slate-700"
                    onClick={() => onPreviewOpen()}
                  >
                    Preview
                    <EyeIcon className="w-4 h-4 text-slate-700" />
                  </Button>
                </Link>

                {report.approved ? (
                  <Button
                    variant="outline"
                    className="flex gap-2 h-[36px] p-[8px_12px] border-blue-500 text-blue-500"
                    onClick={() => setIsAssignSchoolsOpen(true)}
                  >
                    <UserIcon className="w-4 h-4 text-blue-500" />
                    Assign
                  </Button>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <Button
                      variant="outline"
                      className="flex gap-2 h-[36px] p-[8px_12px] border-blue-500 text-blue-500 hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowApproveDropdown(!showApproveDropdown);
                      }}
                    >
                      <CheckIcon className="w-4 h-4 text-blue-500" />
                      Approve
                    </Button>
                    {showApproveDropdown && (
                      <div className="absolute flex flex-col right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md p-[10px_4px] z-50 whitespace-nowrap">
                        <div
                          className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                          onClick={handleApproveAndAssignSchools}
                        >
                          Approve and Assign Schools
                        </div>
                        <div
                          className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                          onClick={handleApproveAndClose}
                        >
                          Approve and Close
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Tabs
            tabs={tabs}
            activeTab={currentTab}
            onTabChange={(tabId) => {
              setCurrentTab(tabId);
            }}
            className="border-b border-slate-300 px-4"
            tabClassName="body1-medium"
          />

          <TabsContent
            tabId="details"
            activeTab={currentTab}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div className="flex flex-col gap-6 h-full flex-1 overflow-hidden px-6 py-4">
              <ScrollArea className="h-full">
                <div className="flex gap-2 flex-col">
                  <div className="flex items-center gap-2">
                    <h5 className="flex-1">Report Details</h5>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEditDetails}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex gap-4 flex-col">
                    <div className="flex flex-col">
                      <span className="body2-medium">Report Name</span>
                      <span className="body1-regular">{report.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="body2-medium">Categories</span>
                      <div className="flex gap-2">
                        {(report.categories &&
                          report.categories.map((category) => (
                            <Badge key={category} variant="outline">
                              {
                                categoryOptions.find((c) => c.id === category)
                                  ?.name
                              }
                            </Badge>
                          ))) || (
                          <span className="body1-regular">[Categories]</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="body2-medium">Description</span>
                      <span className="body1-regular">
                        {parse(DOMPurify.sanitize(report.description))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="body1-bold">Steps</span>
                  <div className="flex flex-col">
                    <span className="body2-medium">
                      {report.content?.step1.title || '[Step 1 Title]'}
                    </span>
                    <span className="body1-regular">
                      {parse(
                        DOMPurify.sanitize(
                          report.content?.step1.description ||
                            '[Step 1 Description]',
                        ),
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="body2-medium">
                      {report.content?.step2.title || '[Step 2 Title]'}
                    </span>
                    <span className="body1-regular">
                      {parse(
                        DOMPurify.sanitize(
                          report.content?.step2.description ||
                            '[Step 2 Description]',
                        ),
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="body2-medium">
                      {report.content?.step3.title || '[Step 3 Title]'}
                    </span>
                    <span className="body1-regular">
                      {parse(
                        DOMPurify.sanitize(
                          report.content?.step3.description ||
                            '[Step 3 Description]',
                        ),
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="body1-bold">Video</span>
                  <div className="flex gap-4 items-end">
                    <div className="w-[85px] h-[47px] p-2 rounded-[6px] bg-blue-50">
                      <span className="body2-medium">Thumbnail</span>
                    </div>
                    <span className="link1-regular">
                      {report.video_url || '[Video Link]'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h5>Resource Files</h5>
                  <div className="space-y-2">
                    {report.file_urls && report.file_urls.length > 0 ? (
                      report.file_urls.map((file, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-slate-50 p-3 rounded-md"
                        >
                          <span className="text-sm font-medium text-slate-800">
                            {file.file_name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">
                        No resource files
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <span className="body1-bold flex-1">Schedule</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative w-8 h-8"
                      onClick={handleEditSchedule}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  {report.schedules && report.schedules.length > 0 && (
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="text-left text-slate-700 font-medium">
                            DATE
                          </TableHead>
                          <TableHead className="text-left text-slate-700 font-medium">
                            NAME
                          </TableHead>
                          <TableHead className="w-16"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.schedules.map((schedule, index) => {
                          const dateObj = new Date(schedule.schedule_time);

                          return (
                            <TableRow
                              key={index}
                              className="border-t border-slate-200"
                            >
                              <TableCell className="text-slate-700">
                                {format(dateObj, 'MMMM dd, yyyy')}
                              </TableCell>
                              <TableCell className="text-slate-700">
                                <Input
                                  value={
                                    reportNames[schedule.schedule_time] || ''
                                  }
                                  onChange={(e) =>
                                    handleReportNameChange(
                                      schedule.schedule_time,
                                      e.target.value,
                                    )
                                  }
                                  className="border-none h-8"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() =>
                                      handleResetName(schedule.schedule_time)
                                    }
                                    title="Reset to default name"
                                  >
                                    <PencilIcon className="h-4 w-4 text-slate-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <h5 className="flex-1">Submission Instructions</h5>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEditSubmission}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="body2-medium">{'Name'}</span>
                      <span className="body1-regular">{'[Name]'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="body2-medium">{'Description'}</span>
                      <span className="body1-regular">{'[Description]'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <h5 className="flex-1">Scoring</h5>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEditScoring}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  {
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-teal-500 rounded"></div>
                        <span className="body2-medium py-3">
                          {'Meets Standard'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-500 rounded"></div>
                        <span className="body2-medium py-3">
                          {'Exceeds Standard'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-yellow-400 rounded"></div>
                        <span className="body2-medium py-3">
                          {'Approaching Standard'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-500 rounded"></div>
                        <span className="body2-medium py-3">
                          {'Does Not Meet Standard'}
                        </span>
                      </div>
                    </div>
                  }
                </div>
                <div className="flex flex-col gap-2">
                  <h5>Activity</h5>
                  <div className="space-y-4">
                    {loadingActivity ? (
                      <div className="flex justify-center py-4">
                        <span>Loading activity...</span>
                      </div>
                    ) : activityLogs.length === 0 ? (
                      <div className="text-slate-500 text-center py-4">
                        No activity logs available
                      </div>
                    ) : (
                      activityLogs.map((log, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-slate-800">
                              {log.user.first_name + ' ' + log.user.last_name ||
                                'User'}
                            </span>
                            <span className="text-sm text-slate-500">
                              {log.created_at
                                ? format(new Date(log.created_at), 'M/d/yyyy')
                                : ''}
                            </span>
                          </div>
                          <div className="text-slate-700">{log.content}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
            <MessageInput onSendMessage={handleSendMessage} />
          </TabsContent>

          <TabsContent
            tabId="schools"
            activeTab={currentTab}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div className="flex flex-col gap-6 h-full flex-1 overflow-hidden px-6 py-4">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-4">
                  {loadingSchools ? (
                    <div className="flex justify-center py-4">
                      <span>Loading schools...</span>
                    </div>
                  ) : schoolsData.length === 0 ? (
                    <div className="text-slate-500 flex flex-col items-center justify-center">
                      <img
                        src="/assets/images/files/no-document.svg"
                        alt="No Document"
                        className="w-[100.5px] h-[100.5px]"
                      />
                      <div className="flex flex-col gap-6 items-center">
                        <div className="flex flex-col gap-6 items-center">
                          <span className="body1-medium">
                            No Schools Assigned
                          </span>
                          <span className="body2-regular">
                            Click the button below to assign this report to
                            schools.
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          className="bg-blue-500 text-white flex h-[38px] p-[10px_20px]"
                          onClick={() => setIsAssignSchoolsOpen(true)}
                        >
                          Assign Schools
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {schoolsData.map((school) => (
                        <div
                          key={school.id}
                          className="border-b border-slate-200 pb-4 last:border-b-0"
                        >
                          <div className="font-medium text-slate-800">
                            {school.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            Assigned on 3/2/2024 | Due on [Date(s)]
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </TabsContainer>
      </div>
      {isPreviewOpen &&
        (role === USER_ROLES.School_Admin ? (
          <SchoolReportPreview
            reportId={reportId}
            onClose={() => setIsPreviewOpen(false)}
          />
        ) : (
          <AgencyReportPreview
            reportId={reportId}
            onClose={() => setIsPreviewOpen(false)}
          />
        ))}
      <AssignSchoolDialog
        open={isAssignSchoolsOpen}
        onOpenChange={setIsAssignSchoolsOpen}
        reportId={reportId}
        onSubmit={() => {
          // Force refresh of schools data
          fetchSchoolsData();
        }}
      />
    </Drawer>
  );
};

export default ReportInfoDrawer;
