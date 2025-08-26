import React from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/utils/tailwind';
import {
  CloudArrowDownIcon,
  XMarkIcon,
  UserPlusIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/24/solid';

import { Badge } from '@/components/base/Badge';
import { Button } from '@/components/base/Button';
import { ScrollArea } from '@/components/base/ScrollArea';
import { Drawer } from '@/components/base/Drawer';
import { Input } from '@/components/base/Input';
import MessageInput from '@/components/Messaging/MessageInput';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/base/Select';
import { Loading } from '@/components/base/Loading';

// Import UserClickDropdown
import { UserClickDropdown } from '@/components/base/UserClickDropdown';

import {
  Question as QuestionType,
  SubmissionInstruction,
  Scoring,
} from '@/containers/Reports/index.types'; // Added SubmissionInstruction, Scoring

// Adjust import path based on where types are defined
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import {
  Submission as SubmissionType,
  SubmissionFile,
  SubmissionStatus,
} from '@/store/slices/submissionsSlice';
import { SubmissionMessage } from '@/store/types'; // Import message type
import { School } from '@/store/slices/schoolsSlice';

// Custom Drawer component that respects assignment operations
interface AssignmentAwareDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  side?: 'left' | 'right';
  hideCloseButton?: boolean;
  preventCloseWhen?: boolean; // New prop to prevent closing
}

const AssignmentAwareDrawer: React.FC<AssignmentAwareDrawerProps> = ({
  open,
  onClose,
  children,
  width = '600px',
  side = 'right',
  hideCloseButton = false,
  preventCloseWhen = false,
}) => {
  // Create a conditional close handler
  const handleClose = () => {
    if (preventCloseWhen) {
      return; // Don't close if we should prevent it
    }
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      width={width}
      side={side}
      hideCloseButton={hideCloseButton}
    >
      {children}
    </Drawer>
  );
};

// Helper to format answers
type QuestionAnswer =
  | string
  | string[]
  | { file_id: string; file_url: string; file_name?: string }
  | undefined
  | null;

export enum QuestionTypeEnum {
  TEXT = 'text',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  DOCUMENT = 'document',
}

const formatAnswer = (
  answer: QuestionAnswer,
  type: QuestionTypeEnum | string, // Allow string for flexibility with API data
): React.ReactNode => {
  if (answer == null || answer === '')
    return <span className="italic text-slate-400">(No answer provided)</span>;
  if (type === QuestionTypeEnum.MULTIPLE_CHOICE && Array.isArray(answer)) {
    return answer.length > 0 ? (
      answer.join(', ')
    ) : (
      <span className="italic text-slate-400">(No answer provided)</span>
    );
  }
  if (
    type === QuestionTypeEnum.DOCUMENT &&
    answer &&
    typeof answer === 'object' &&
    'file_id' in answer
  ) {
    return (
      <a
        href={answer.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {answer.file_name || 'Download'}
      </a>
    ) as React.ReactNode;
  }
  return answer as React.ReactNode;
};

// Define props for the component
export interface SubmissionDrawerComponentProps {
  open: boolean;
  onClose: () => void;
  submission: SubmissionType; // Assume submission is always non-null when open
  onNavigate: (direction: 'next' | 'prev') => void;
  totalSubmissions: number;
  currentIndex: number;

  // Report details passed from container
  reportNameDisplay: string;
  reportSubmissionInstruction: SubmissionInstruction | null | undefined;
  reportUseScoring: boolean;
  reportScoringObject: Scoring | null | undefined; // Renamed to avoid conflict with a component named Scoring if any

  editingDueDate: boolean;
  onEditingDueDateChange: (isEditing: boolean) => void;
  onSendMessage: (content: string) => void;
  onFileDownload: (file: SubmissionFile) => void;
  onStatusChange: (newStatus: SubmissionStatus) => void;
  onDueDateSave: (newDate: string) => void;
  error: string | null;

  // Add message-related props
  messages: SubmissionMessage[];
  loadingMessages: boolean;
  messagesError: string | null;
  currentUserId: string | undefined; // User ID from auth state

  allSchools: School[];
  allSchoolUsers: SchoolUser[];

  // Props for new user assignment dropdown
  assigneeDropdownAnchorEl: HTMLElement | null;
  assigneeDropdownSearchText: string;
  assigneeFilteredDropdownUsers: SchoolUser[];
  onOpenAssigneeDropdown: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCloseAssigneeDropdown: () => void;
  onAssigneeDropdownSearchChange: (text: string) => void;
  onAssignUser: (userToAssign: SchoolUser) => Promise<void>;
  onRemoveAssignee: () => Promise<void>;

  // Add prop to prevent closing during operations
  preventClose?: boolean;
  isSchoolAdminView?: boolean; // New prop
}

export const SubmissionDrawerComponent: React.FC<
  SubmissionDrawerComponentProps
> = ({
  open,
  onClose,
  submission,
  onNavigate,
  totalSubmissions,
  currentIndex,
  reportNameDisplay,
  reportSubmissionInstruction,
  editingDueDate,
  onEditingDueDateChange,
  onSendMessage,
  onFileDownload,
  onStatusChange,
  onDueDateSave,
  error,
  messages,
  loadingMessages,
  messagesError,
  currentUserId,
  allSchools,
  allSchoolUsers,
  assigneeDropdownAnchorEl,
  assigneeDropdownSearchText,
  assigneeFilteredDropdownUsers,
  onOpenAssigneeDropdown,
  onCloseAssigneeDropdown,
  onAssigneeDropdownSearchChange,
  onAssignUser,
  onRemoveAssignee,
  preventClose = false,
  isSchoolAdminView,
}) => {
  const getStatusClasses = (status: SubmissionStatus | null | undefined) => {
    switch (status) {
      case 'completed':
        return {
          badge: 'bg-green-100 text-green-800 border-green-300',
          text: 'text-green-800',
        };
      case 'returned':
        return {
          badge: 'bg-orange-100 text-orange-800 border-orange-300',
          text: 'text-orange-800',
        };
      case 'pending':
        return {
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          text: 'text-yellow-800',
        };
      case 'incompleted':
        return {
          badge: 'bg-red-100 text-red-800 border-red-300',
          text: 'text-red-800',
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
          text: 'text-slate-800',
        };
    }
  };

  const statusOptions: { value: SubmissionStatus; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'incompleted', label: 'Incomplete' },
    { value: 'returned', label: 'Returned' },
    { value: 'completed', label: 'Completed' },
  ];

  const currentStatusLabel =
    statusOptions.find((opt) => opt.value === submission.status)?.label ||
    submission.status;

  const school = allSchools.find((s) => s.id === submission.school);
  const assignedMember = allSchoolUsers.find(
    (u) => u.id === submission.assigned_member,
  );

  return (
    <AssignmentAwareDrawer
      open={open}
      onClose={onClose}
      preventCloseWhen={preventClose}
      width="600px"
      side="right"
      hideCloseButton
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 h-[96px]">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 justify-between">
              <h3>Review submission</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>
            <h4 className="text-slate-600">{reportNameDisplay}</h4>
          </div>
        </div>

        {!isSchoolAdminView && ( // Conditionally render navigation controls
          <>
            {/* Navigation */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-slate-200 bg-slate-50">
              <div className="body2-medium flex-1">
                {school ? school.name : 'N/A'}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600">
                  {currentIndex + 1} of {totalSubmissions}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate('prev')}
                  disabled={currentIndex === 0}
                  className={cn(
                    'w-8 h-8 p-0 hover:bg-slate-200 rounded-full transition-colors',
                    currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : '',
                  )}
                >
                  <ArrowUpCircleIcon
                    className={cn(
                      'w-full h-full text-slate-700',
                      currentIndex === 0 ? 'opacity-50' : '',
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate('next')}
                  disabled={currentIndex === totalSubmissions - 1}
                  className={cn(
                    'w-8 h-8 p-0 hover:bg-slate-200 rounded-full transition-colors',
                    currentIndex === totalSubmissions - 1
                      ? 'opacity-50 cursor-not-allowed'
                      : '',
                  )}
                >
                  <ArrowDownCircleIcon
                    className={cn(
                      'w-full h-full text-slate-700',
                      currentIndex === totalSubmissions - 1 ? 'opacity-50' : '',
                    )}
                  />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Error Display Area */}
        {error && (
          <div className="px-6 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm">
            Error: {error}
          </div>
        )}

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 flex flex-col gap-4 py-4">
            {/* Submission Details */}
            <div className="flex flex-col gap-4">
              <h5>Submission Details</h5>
              <table className="w-full border-collapse">
                <tbody>
                  {/* Status Row - Now a Select dropdown */}
                  <tr className="border-b border-slate-100">
                    <td className="py-3 body2-bold text-slate-950 w-[200px]">
                      Status
                    </td>
                    <td className="py-3">
                      <Select
                        value={submission.status}
                        onValueChange={(value) =>
                          onStatusChange(value as SubmissionStatus)
                        }
                        disabled={isSchoolAdminView} // Disable if school admin view
                      >
                        <SelectTrigger
                          className={`w-[180px] h-9 border-none shadow-none p-0 focus:ring-0 ${getStatusClasses(submission.status).text} ${isSchoolAdminView ? 'cursor-not-allowed opacity-70' : ''}`}
                        >
                          <Badge
                            className={cn(
                              getStatusClasses(submission.status).badge,
                              'border rounded-[50px] p-[6px_12px] body2-bold w-full justify-start',
                            )}
                          >
                            {currentStatusLabel}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {statusOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>

                  {/* Reviewer Row - Use assigned_member */}
                  <tr className="border-b border-slate-100">
                    <td className="py-3 body2-bold text-slate-950 w-[200px]">
                      Assigned Team Member
                    </td>
                    <td className="py-3">
                      {/* Wrapper for positioning the dropdown */}
                      <div className="relative flex items-center gap-2">
                        {assignedMember ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-sm">
                                {assignedMember.first_name?.charAt(0)}
                                {assignedMember.last_name?.charAt(0)}
                              </span>
                            </div>
                            <span>
                              {assignedMember.first_name}{' '}
                              {assignedMember.last_name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onOpenAssigneeDropdown}
                              title="Change assignee"
                            >
                              <UserPlusIcon className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="text-slate-500 italic">
                              Unassigned
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={onOpenAssigneeDropdown}
                              title="Assign member"
                            >
                              <UserPlusIcon className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                            </Button>
                          </>
                        )}
                        {/* UserClickDropdown positioned absolutely within the relative wrapper */}
                        {assigneeDropdownAnchorEl && (
                          <div className="absolute top-full right-0 mt-1 z-50 w-64">
                            {' '}
                            {/* Basic positioning, adjust as needed */}
                            <UserClickDropdown
                              users={assigneeFilteredDropdownUsers}
                              onUserChange={onAssignUser} // onAssignUser from props, which calls hook's handleAssignUser
                              onClose={onCloseAssigneeDropdown} // from props, which calls hook's handleCloseUserDropdown
                              onRemoveAssigneeClick={onRemoveAssignee} // from props, which calls hook's handleRemoveAssignee
                              searchText={assigneeDropdownSearchText} // from props
                              onSearchChange={onAssigneeDropdownSearchChange} // from props
                              showSearchBar={true}
                              // onCreateNewUser can be omitted if not needed here
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Due Date Row - Use due_date */}
                  <tr className="border-b border-slate-100">
                    <td className="py-3 body2-bold text-slate-950 w-[200px]">
                      Due Date
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {editingDueDate ? (
                          <Input
                            type="date"
                            defaultValue={
                              submission.due_date
                                ? format(
                                    parseISO(submission.due_date),
                                    'yyyy-MM-dd',
                                  )
                                : ''
                            }
                            onBlur={(e) => onDueDateSave(e.target.value)}
                            className="h-8 w-[150px] text-sm"
                            autoFocus
                          />
                        ) : (
                          <>
                            {submission.due_date
                              ? format(parseISO(submission.due_date), 'P')
                              : '-'}
                            <CalendarIcon
                              className="h-5 w-5 cursor-pointer hover:text-blue-500"
                              onClick={() => onEditingDueDateChange(true)}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Submission Date Row - Use school_submission_date */}
                  <tr className="border-b border-slate-100">
                    <td className="py-3 body2-bold text-slate-950 w-[200px]">
                      Submission Date
                    </td>
                    <td className="py-3">
                      {submission.school_submission_date
                        ? format(
                            parseISO(submission.school_submission_date),
                            'Pp',
                          )
                        : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Files - Use file_urls */}
            {reportSubmissionInstruction?.type !== 'CERTIFICATE_ONLY' && (
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
                <h5>Files</h5>
                <div className="space-y-2">
                  {submission.file_urls?.map((file: SubmissionFile) => (
                    <div
                      key={file.file_url}
                      className="flex items-center bg-slate-50 justify-between p-[8px_16px] border border-slate-400 rounded"
                    >
                      <span className="text-slate-600 p-[10px]">
                        {file.file_name}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onFileDownload(file)}
                        >
                          <CloudArrowDownIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(submission.file_urls?.length === 0 ||
                    !submission.file_urls) && (
                    <p className="text-slate-500 italic">No files submitted.</p>
                  )}
                </div>
              </div>
            )}

            {/* Submission Questions (always show if questions exist) */}
            {Array.isArray(reportSubmissionInstruction?.questions) &&
              reportSubmissionInstruction.questions.length > 0 && (
                <div className="flex flex-col gap-4 pt-4 border-b border-slate-200">
                  <h5>Submission Questions</h5>
                  <div className="space-y-6">
                    {reportSubmissionInstruction.questions.map(
                      (question: QuestionType, idx: number) => (
                        <div key={question.id} className="space-y-2">
                          <h6 className="font-medium">
                            {`Question ${idx + 1}:`} {question.question}{' '}
                            <span className="text-xs text-slate-500">
                              ({question.type})
                            </span>
                          </h6>
                          <div className="text-slate-700 p-2 border rounded bg-slate-50">
                            {formatAnswer(
                              submission.submission_content?.[
                                `question_${idx}`
                              ],
                              question.type,
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Messaging Section */}
            <div className="flex flex-col gap-4 pt-4 border-t border-slate-200">
              <h5>Messages</h5>
              <div className="h-60 bg-slate-50 border border-slate-200 rounded p-4 space-y-3 overflow-y-auto flex flex-col-reverse">
                {loadingMessages && <Loading />}
                {messagesError && (
                  <div className="text-red-600 text-sm flex items-center gap-1 justify-center p-2">
                    <ExclamationTriangleIcon className="h-4 w-4" /> Error
                    loading messages.
                  </div>
                )}
                {!loadingMessages &&
                  !messagesError &&
                  messages.length === 0 && (
                    <p className="text-slate-400 italic text-center py-4">
                      No messages yet.
                    </p>
                  )}
                {!loadingMessages &&
                  !messagesError &&
                  messages.map((message) => {
                    const isCurrentUser = message.sender.id === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'p-3 rounded-lg max-w-[80%]',
                          isCurrentUser
                            ? 'bg-blue-100 self-end'
                            : 'bg-slate-100 self-start',
                        )}
                      >
                        <p className="text-sm text-slate-900">
                          {message.content}
                        </p>
                        <div
                          className={cn(
                            'text-xs text-slate-500 mt-1',
                            isCurrentUser ? 'text-right' : 'text-left',
                          )}
                        >
                          <span>
                            {message.sender.first_name}{' '}
                            {message.sender.last_name}
                          </span>
                          <span className="mx-1">·</span>
                          <span>
                            {format(
                              parseISO(message.created_at),
                              'MMM d, hh:mm a',
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <MessageInput onSendMessage={onSendMessage} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </AssignmentAwareDrawer>
  );
};

export default SubmissionDrawerComponent;
