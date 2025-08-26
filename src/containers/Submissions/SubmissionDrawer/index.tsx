import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '@/api/axiosInstance'; // Import axios
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { RootState, AppDispatch } from '@/store'; // Import RootState and AppDispatch
// Import necessary types
import {
  Submission,
  SubmissionFile,
  SubmissionStatus, // Import SubmissionStatus
  updateSubmissionDetails, // Import the thunk
} from '@/store/slices/submissionsSlice'; // Adjust path
import { SchoolUser } from '@/store/slices/schoolUsersSlice'; // Import from slice
import { SubmissionMessage } from '@/store/types'; // Import the new message type
import { ReportResponse } from '@/containers/Reports/index.types'; // Corrected import for ReportResponse and related types

// Import the fetchUsers thunk
import { fetchUsers } from '@/store/slices/usersSlice';

// Import the presentational component
import { SubmissionDrawerComponent } from '@/components/Submissions/SubmissionDrawer'; // Adjust path
import { getSubmissionFileDownload } from '@api/submission';

// Import the useSubmissionsAssignment hook
import { useSubmissionsAssignment } from '@/hooks/useSubmissionsAssignment';

// Remove mock data as it's causing type errors and only used for example
/*
const mockUsers: SchoolUser[] = [
  // ... mock users ...
];
*/

interface SubmissionDrawerProps {
  open: boolean;
  onClose: () => void;
  submission: Submission | null;
  onNavigate: (direction: 'next' | 'prev') => void;
  totalSubmissions: number;
  currentIndex: number;
  onSubmissionUpdated: (updatedSubmission: Partial<Submission>) => void;
  allSchools: any[];
  allSchoolUsers: SchoolUser[];
  isAssigningRef?: React.MutableRefObject<boolean>;
}

export const SubmissionDrawer: React.FC<SubmissionDrawerProps> = ({
  open,
  onClose,
  submission,
  onNavigate,
  totalSubmissions,
  currentIndex,
  onSubmissionUpdated,
  allSchools,
  allSchoolUsers,
  isAssigningRef,
}) => {
  const dispatch = useDispatch<AppDispatch>(); // Add AppDispatch type to useDispatch
  // Get current user ID from auth state
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const allUsers = useSelector(
    (state: RootState) => state.users.users || [], // Changed from schoolUsers.schoolUsers to users.users
  );

  const [editingDueDate, setEditingDueDate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Add loading state for updates
  const [updateError, setUpdateError] = useState<string | null>(null); // Add error state
  const [isAssigning, setIsAssigning] = useState(false); // Add state to track assignment operations

  // State for messages
  const [messages, setMessages] = useState<SubmissionMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const allReports = useSelector((state: RootState) => state.reports.reports);
  const isLoadingUsers = useSelector(
    (state: RootState) => state.users.isLoading,
  );

  // --- Integrate useSubmissionsAssignment hook ---
  const {
    dropdownAnchorEl,
    dropdownTarget,
    dropdownSearchText,
    filteredDropdownUsers,
    isAssigning: hookIsAssigning, // Rename to avoid conflict with local state
    handleOpenUserDropdown,
    handleCloseUserDropdown,
    handleDropdownSearchChange,
    handleAssignUser,
    handleRemoveAssignee,
  } = useSubmissionsAssignment();

  // --- Fetch users if not already loaded ---
  useEffect(() => {
    if (open && allUsers.length === 0 && !isLoadingUsers) {
      dispatch(fetchUsers());
    }
  }, [open, allUsers, isLoadingUsers, dispatch]);

  // --- Fetching Logic ---
  const fetchMessages = useCallback(async () => {
    if (!submission?.id) {
      setMessages([]);
      setMessagesError(null);
      return;
    }

    setLoadingMessages(true);
    setMessagesError(null);
    try {
      const response = await axiosInstance.get<SubmissionMessage[]>(
        `/submissions/messages/${submission.id}/`,
      );
      setMessages(response.data || []); // Ensure it defaults to empty array
    } catch (err) {
      setMessagesError(
        err instanceof Error ? err.message : 'Failed to load messages',
      );
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [submission?.id]);

  // Effect to fetch messages when drawer opens or submission changes
  useEffect(() => {
    if (open && submission?.id) {
      fetchMessages();
    } else {
      // Clear messages when drawer closes or submission is null
      setMessages([]);
      setMessagesError(null);
    }
  }, [open, submission?.id, fetchMessages]);
  // ----------------------

  // Reset state when submission changes or drawer closes
  useEffect(() => {
    if (!open) {
      // Reset fields when closing
      setEditingDueDate(false);
      setIsUpdating(false);
      setUpdateError(null);
      setIsAssigning(false); // Reset assignment state when drawer closes
      handleCloseUserDropdown(); // Close dropdown if open
      // Messages state is cleared by the other useEffect
    }
  }, [open, handleCloseUserDropdown]);

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

  // Event Handlers
  const handleSendMessage = async (content: string) => {
    if (!submission?.id || !content.trim() || isUpdating) return;

    setIsUpdating(true);
    setUpdateError(null); // Clear previous errors

    try {
      await axiosInstance.post(`/submissions/messages/${submission.id}/`, {
        content: content.trim(),
      });
      // Success - refetch messages to show the new one
      await fetchMessages();
      // TODO: Need a way to tell MessageInput to clear itself
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'Failed to send message',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileDownload = async (file: SubmissionFile) => {
    const a = document.createElement('a');
    const response = await getSubmissionFileDownload(file.file_id);
    a.href = URL.createObjectURL(response.data);
    a.download = file.file_name;
    a.target = '_blank';
    a.click();
    a.remove();
  };

  // const handleFileDelete = (fileUrl: string) => {
  //   console.log('Deleting file:', fileUrl);
  //   // TODO: Implement actual file delete API call and update state/UI
  //   alert(`Delete action triggered for file URL: ${fileUrl}`);
  // };

  // --- Status Update Handler ---
  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    if (!submission || isUpdating) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updatedSubmission = await dispatch(
        updateSubmissionDetails({
          submissionId: submission.id,
          data: { status: newStatus },
        }),
      ).unwrap();
      onSubmissionUpdated(updatedSubmission);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'Failed to update status',
      );
    } finally {
      setIsUpdating(false);
    }
  };
  // ----------------------------

  // --- Other Update Handlers (Example: Due Date) ---
  const handleDueDateSave = async (newDate: string) => {
    if (!submission || isUpdating) return;
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updatedSubmission = await dispatch(
        updateSubmissionDetails({
          submissionId: submission.id,
          data: { due_date: newDate },
        }),
      ).unwrap();
      onSubmissionUpdated(updatedSubmission);
      setEditingDueDate(false);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'Failed to update due date',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Create a wrapper for onClose that prevents closing during assignment operations
  const handleDrawerClose = () => {
    // Prevent closing if assignment operations are in progress
    if (
      isAssigning ||
      hookIsAssigning ||
      (isAssigningRef && isAssigningRef.current)
    ) {
      return;
    }
    onClose();
  };

  // Render the presentational component only if open and submission exists
  if (!open || !submission) {
    return null;
  }

  return (
    <SubmissionDrawerComponent
      open={open}
      onClose={handleDrawerClose} // Use the wrapper instead of direct onClose
      submission={submission}
      onNavigate={onNavigate}
      totalSubmissions={totalSubmissions}
      currentIndex={currentIndex}
      // Pass message state and current user ID
      messages={messages}
      loadingMessages={loadingMessages}
      messagesError={messagesError}
      currentUserId={currentUserId}
      // Pass relevant state
      editingDueDate={editingDueDate}
      preventClose={
        isAssigning ||
        hookIsAssigning ||
        (isAssigningRef && isAssigningRef.current)
      } // Prevent closing during assignment operations
      // Props for new user assignment dropdown
      assigneeDropdownAnchorEl={dropdownAnchorEl}
      assigneeDropdownSearchText={dropdownSearchText}
      assigneeFilteredDropdownUsers={filteredDropdownUsers}
      onOpenAssigneeDropdown={(event: React.MouseEvent<HTMLButtonElement>) => {
        if (submission) {
          handleOpenUserDropdown(event, { type: 'single', submission });
        }
      }}
      onCloseAssigneeDropdown={handleCloseUserDropdown}
      onAssigneeDropdownSearchChange={handleDropdownSearchChange}
      onAssignUser={async (userToAssign: SchoolUser) => {
        if (submission) {
          setIsUpdating(true);
          setUpdateError(null);
          setIsAssigning(true); // Set assignment state
          if (isAssigningRef) isAssigningRef.current = true;
          try {
            await handleAssignUser(userToAssign);
            const updatedSub = {
              ...submission,
              assigned_member: userToAssign.id,
            };
            onSubmissionUpdated(updatedSub);
          } catch (error) {
            setUpdateError(
              error instanceof Error
                ? error.message
                : 'Failed to assign member',
            );
          } finally {
            setIsUpdating(false);
            setIsAssigning(false); // Reset assignment state
            if (isAssigningRef) isAssigningRef.current = false;
          }
        }
      }}
      onRemoveAssignee={async () => {
        if (submission) {
          setIsUpdating(true);
          setUpdateError(null);
          setIsAssigning(true); // Set assignment state
          if (isAssigningRef) isAssigningRef.current = true;
          try {
            if (dropdownTarget) {
              await handleRemoveAssignee();
              const updatedSub = { ...submission, assigned_member: null };
              onSubmissionUpdated(updatedSub);
            } else {
              // For direct unassignment without dropdown, just update locally
              // The parent component will handle the Redux update
              const updatedSub = { ...submission, assigned_member: null };
              onSubmissionUpdated(updatedSub);
            }
          } catch (error) {
            setUpdateError(
              error instanceof Error
                ? error.message
                : 'Failed to remove assignee',
            );
          } finally {
            setIsUpdating(false);
            setIsAssigning(false); // Reset assignment state
            if (isAssigningRef) isAssigningRef.current = false;
          }
        }
      }}
      // Pass relevant handlers
      onEditingDueDateChange={setEditingDueDate}
      onSendMessage={handleSendMessage}
      onFileDownload={handleFileDownload}
      onStatusChange={handleStatusChange}
      onDueDateSave={handleDueDateSave}
      error={updateError}
      // Pass foundReport props
      reportNameDisplay={
        foundReport ? foundReport.name : submission.report_schedule
      }
      reportSubmissionInstruction={foundReport?.submission_instruction}
      reportUseScoring={foundReport?.use_scoring || false}
      reportScoringObject={foundReport?.scoring}
      allSchools={allSchools}
      allSchoolUsers={allSchoolUsers}
    />
  );
};

export default SubmissionDrawer;
