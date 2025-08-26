import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Restore necessary imports from submissionsSlice
import {
  Submission,
  updateSubmissionDetails,
  SubmissionStatus,
  SubmissionFile,
} from '@/store/slices/submissionsSlice';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { RootState, AppDispatch } from '@/store';
import { fetchUsers } from '@/store/slices/usersSlice';
import { SubmissionMessage } from '@/store/types';

import { ReportResponse } from '@/containers/Reports/index.types';
import { SubmissionDrawerComponent } from '@/components/Submissions/SubmissionDrawer';
import { getSubmissionFileDownload } from '@api/submission';

interface SubmissionDrawerProps {
  open: boolean;
  onClose: () => void;
  submission: Submission | null;
  onNavigate: (direction: 'next' | 'prev') => void;
  totalSubmissions: number;
  currentIndex: number;
  onSubmissionUpdated?: (updatedSubmission: Submission) => void;
  isSchoolAdminView?: boolean;
}

export const SubmissionDrawer: React.FC<SubmissionDrawerProps> = ({
  open,
  onClose,
  submission,
  onNavigate,
  totalSubmissions,
  currentIndex,
  onSubmissionUpdated,
  isSchoolAdminView,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // State for the new assignee dropdown
  const [assigneeDropdownAnchorEl, setAssigneeDropdownAnchorEl] =
    useState<null | HTMLElement>(null);
  const [assigneeDropdownSearchText, setAssigneeDropdownSearchText] =
    useState('');

  const allReports = useSelector((state: RootState) => state.reports.reports);
  const allSchools = useSelector((state: RootState) => state.schools.schools);
  const allSchoolUsers = useSelector(
    (state: RootState) => state.schoolUsers.schoolUsers,
  );
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const [messages, setMessages] = useState<SubmissionMessage[]>([]);
  const [loadingMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  useEffect(() => {
    if (open && submission?.id) {
      // fetchMessages(); // Assuming a fetchMessages function exists and is called here
    } else {
      setMessages([]);
      setMessagesError(null);
    }
    if (!open || !submission) {
      setEditingDueDate(false);
      // setScore('meets-standard'); // Reset score if needed
      // setScoringNotes(''); // Reset notes if needed
    }
  }, [open, submission]);

  useEffect(() => {
    if (open) {
      dispatch(fetchUsers());
    }
  }, [open, dispatch]);

  const foundReport = useMemo<ReportResponse | null>(() => {
    if (!submission || !allReports || allReports.length === 0) return null;
    return (
      allReports.find((report) =>
        report.schedules?.some(
          (schedule) => schedule.id === submission.report_schedule,
        ),
      ) || null
    );
  }, [submission, allReports]);

  const assigneeFilteredDropdownUsers = useMemo(() => {
    if (!allSchoolUsers) return [];
    if (!assigneeDropdownSearchText) return allSchoolUsers; // Return all users if no search text
    return allSchoolUsers.filter(
      (user) =>
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(assigneeDropdownSearchText.toLowerCase()) ||
        user.email
          ?.toLowerCase()
          .includes(assigneeDropdownSearchText.toLowerCase()),
    );
  }, [assigneeDropdownSearchText, allSchoolUsers]);

  if (!open || !submission) {
    return null;
  }
  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    if (!submission) return;
    try {
      const updated = await dispatch(
        updateSubmissionDetails({
          submissionId: submission.id,
          data: { status: newStatus },
        }),
      ).unwrap();
      if (onSubmissionUpdated && updated) onSubmissionUpdated(updated);
    } catch (error) {
      console.error('Error updating status:', error);
      // TODO: set an error state to display in UI
    }
  };

  const handleSendMessageStub = (content: string) => {
    console.log('Message to send (stubbed):', content);
    // Actual implementation for sending messages would go here
  };

  const handleFileDownloadStub = async (file: SubmissionFile) => {
    const a = document.createElement('a');
    const response = await getSubmissionFileDownload(file.file_id);
    a.href = URL.createObjectURL(response.data);
    a.download = file.file_name;
    a.target = '_blank';
    a.click();
    a.remove();
  };

  const handleDueDateSave = async (newDate: string) => {
    if (!submission || !newDate) return;
    try {
      const updated = await dispatch(
        updateSubmissionDetails({
          submissionId: submission.id,
          data: { due_date: newDate },
        }),
      ).unwrap();
      if (onSubmissionUpdated && updated) onSubmissionUpdated(updated);
      setEditingDueDate(false);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'Failed to update due date',
      );
    }
  };

  const handleAssignUser = async (userToAssign: SchoolUser | null) => {
    if (!submission) return;
    setUpdateError(null);
    try {
      const updatedSubmission = await dispatch(
        updateSubmissionDetails({
          submissionId: submission.id,
          data: { assigned_member: userToAssign ? userToAssign.id : null },
        }),
      ).unwrap();
      if (onSubmissionUpdated) onSubmissionUpdated(updatedSubmission);
      console.log('Assigned member updated successfully', updatedSubmission);
      setAssigneeDropdownAnchorEl(null); // Close dropdown on assign
    } catch (error) {
      setUpdateError(
        error instanceof Error
          ? error.message
          : 'Failed to update assigned member',
      );
    }
  };

  const handleRemoveAssignee = async () => {
    if (!submission) return;
    setUpdateError(null);
    try {
      const updatedSubmission = await dispatch(
        updateSubmissionDetails({
          submissionId: submission.id,
          data: { assigned_member: null },
        }),
      ).unwrap();
      if (onSubmissionUpdated) onSubmissionUpdated(updatedSubmission);
      setAssigneeDropdownAnchorEl(null);
      setAssigneeDropdownSearchText(''); // Clear search text on close
      console.log('Assigned member removed successfully', updatedSubmission);
    } catch (error) {
      setUpdateError(
        error instanceof Error
          ? error.message
          : 'Failed to remove assigned member',
      );
    }
  };

  const handleOpenAssigneeDropdown = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAssigneeDropdownAnchorEl(event.currentTarget);
  };

  const handleCloseAssigneeDropdown = () => {
    setAssigneeDropdownAnchorEl(null);
    setAssigneeDropdownSearchText(''); // Clear search text on close
  };

  const handleAssigneeDropdownSearchChange = (text: string) => {
    setAssigneeDropdownSearchText(text);
  };

  return (
    <SubmissionDrawerComponent
      open={open}
      onClose={onClose}
      submission={submission}
      onNavigate={onNavigate}
      totalSubmissions={totalSubmissions}
      currentIndex={currentIndex}
      reportNameDisplay={
        foundReport ? foundReport.name : submission.report_schedule
      }
      reportSubmissionInstruction={foundReport?.submission_instruction}
      reportUseScoring={foundReport?.use_scoring || false}
      reportScoringObject={foundReport?.scoring}
      editingDueDate={editingDueDate}
      onEditingDueDateChange={setEditingDueDate}
      onSendMessage={handleSendMessageStub}
      onFileDownload={handleFileDownloadStub}
      onStatusChange={handleStatusChange}
      onDueDateSave={handleDueDateSave}
      error={updateError}
      messages={messages}
      loadingMessages={loadingMessages}
      messagesError={messagesError}
      currentUserId={currentUserId}
      allSchools={allSchools}
      allSchoolUsers={allSchoolUsers}
      // Assignee Dropdown Props
      assigneeDropdownAnchorEl={assigneeDropdownAnchorEl}
      assigneeDropdownSearchText={assigneeDropdownSearchText}
      assigneeFilteredDropdownUsers={assigneeFilteredDropdownUsers}
      onOpenAssigneeDropdown={handleOpenAssigneeDropdown}
      onCloseAssigneeDropdown={handleCloseAssigneeDropdown}
      onAssigneeDropdownSearchChange={handleAssigneeDropdownSearchChange}
      onAssignUser={handleAssignUser}
      onRemoveAssignee={handleRemoveAssignee}
      isSchoolAdminView={isSchoolAdminView}
    />
  );
};

export default SubmissionDrawer;
