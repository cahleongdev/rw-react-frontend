import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { confirm } from '@/components/base/Confirmation';
import { RootState, AppDispatch } from '@/store';
import {
  assignUserToSubmissions,
  updateSubmissionDetails,
  Submission,
} from '@/store/slices/submissionsSlice';
import { fetchUsers } from '@/store/slices/usersSlice';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { SubmissionsComponentProps } from '@/components/Submissions/AgencyAdmin';
import { GroupedData } from '@/components/Submissions/AgencyAdmin';

interface UseSubmissionsAssignmentReturn {
  dropdownAnchorEl: HTMLElement | null;
  dropdownTarget: SubmissionsComponentProps['dropdownTarget'] | null;
  dropdownSearchText: string;
  availableTeamMembers: SchoolUser[];
  filteredDropdownUsers: SchoolUser[];
  isAssigning: boolean;
  handleOpenUserDropdown: (
    event: React.MouseEvent<HTMLButtonElement>,
    targetData: NonNullable<SubmissionsComponentProps['dropdownTarget']>,
  ) => void;
  handleCloseUserDropdown: () => void;
  handleDropdownSearchChange: (text: string) => void;
  handleAssignUser: (userToAssign: SchoolUser) => Promise<void>;
  handleRemoveAssignee: () => Promise<void>;
}

export const useSubmissionsAssignment = (): UseSubmissionsAssignmentReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const availableTeamMembers = useSelector(
    (state: RootState) => state.users.users,
  );
  const isLoadingTeamMembers = useSelector(
    (state: RootState) => state.users.isLoading,
  );
  const allSchools = useSelector((state: RootState) => state.schools.schools);

  const [dropdownAnchorEl, setDropdownAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [dropdownTarget, setDropdownTarget] = useState<
    | null
    | { type: 'single'; submission: Submission }
    | { type: 'bulk'; group: GroupedData; groupType: 'report' | 'school' }
  >(null);
  const [dropdownSearchText, setDropdownSearchText] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (availableTeamMembers.length === 0 && !isLoadingTeamMembers) {
      dispatch(fetchUsers());
    }
  }, [dispatch, availableTeamMembers, isLoadingTeamMembers]);

  const handleOpenUserDropdown = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement>,
      targetData: NonNullable<SubmissionsComponentProps['dropdownTarget']>,
    ) => {
      setDropdownAnchorEl(event.currentTarget);
      setDropdownTarget(targetData as any);
    },
    [],
  );

  const handleCloseUserDropdown = useCallback(() => {
    setDropdownAnchorEl(null);
    setDropdownTarget(null);
  }, []);

  const handleDropdownSearchChange = useCallback((text: string) => {
    setDropdownSearchText(text);
  }, []);

  const filteredDropdownUsers = useMemo(() => {
    if (!dropdownSearchText) return availableTeamMembers || [];
    return (availableTeamMembers || []).filter(
      (user) =>
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(dropdownSearchText.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(dropdownSearchText.toLowerCase())),
    );
  }, [availableTeamMembers, dropdownSearchText]);

  const handleAssignUser = useCallback(
    async (userToAssign: SchoolUser) => {
      if (!dropdownTarget || isAssigning) return;

      setIsAssigning(true);

      const isBulk = dropdownTarget.type === 'bulk';
      const confirmTitle = 'Confirm Assignment';
      let confirmMessage = '';

      const submissionsToUpdate: Submission[] = isBulk
        ? (dropdownTarget as { type: 'bulk'; group: GroupedData }).group
            .submissions
        : [
            (dropdownTarget as { type: 'single'; submission: Submission })
              .submission,
          ];
      const submissionIdsToUpdate = submissionsToUpdate.map((sub) => sub.id);

      if (isBulk) {
        const groupName = (
          dropdownTarget as { type: 'bulk'; group: GroupedData }
        ).group.name;
        const groupTypeLabel =
          (dropdownTarget as { type: 'bulk'; groupType: 'report' | 'school' })
            .groupType === 'report'
            ? 'report schedule'
            : 'school group';
        confirmMessage = `Assign ${userToAssign.first_name} ${userToAssign.last_name} to all ${submissionIdsToUpdate.length} submissions in ${groupTypeLabel} '${groupName}'?`;
      } else {
        const submission = (
          dropdownTarget as { type: 'single'; submission: Submission }
        ).submission;
        let itemIdentifier = `ID: ${submission.id}`;
        const schoolObj = allSchools.find((s) => s.id === submission.school);
        if (schoolObj && submission.report_schedule) {
          itemIdentifier = `submission for ${schoolObj.name} (Schedule: ${submission.report_schedule})`;
        }
        confirmMessage = `Assign ${userToAssign.first_name} ${userToAssign.last_name} to ${itemIdentifier}?`;
      }

      confirm({
        title: confirmTitle,
        message: confirmMessage,
        confirmText: 'Assign',
        onConfirm: async () => {
          try {
            handleCloseUserDropdown();
            await dispatch(
              assignUserToSubmissions({
                userToAssign: userToAssign,
                submission_ids: submissionIdsToUpdate,
              }),
            ).unwrap();
          } catch (err) {
            console.error('Error assigning user to submissions:', err);
          } finally {
            setIsAssigning(false);
          }
        },
        onCancel: () => {
          handleCloseUserDropdown();
          setIsAssigning(false);
        },
      });
    },
    [
      dispatch,
      dropdownTarget,
      handleCloseUserDropdown,
      allSchools,
      isAssigning,
    ],
  );

  const handleRemoveAssignee = useCallback(async () => {
    if (!dropdownTarget || isAssigning) return;

    setIsAssigning(true);

    const isBulk = dropdownTarget.type === 'bulk';
    const confirmTitle = 'Confirm Removal';
    let confirmMessage = '';

    const submissionsToRemoveFrom: Submission[] = isBulk
      ? (dropdownTarget as { type: 'bulk'; group: GroupedData }).group
          .submissions
      : [
          (dropdownTarget as { type: 'single'; submission: Submission })
            .submission,
        ];

    if (isBulk) {
      const groupName = (dropdownTarget as { type: 'bulk'; group: GroupedData })
        .group.name;
      const groupTypeLabel =
        (dropdownTarget as { type: 'bulk'; groupType: 'report' | 'school' })
          .groupType === 'report'
          ? 'report schedule'
          : 'school group';
      confirmMessage = `Remove assignees from all ${submissionsToRemoveFrom.length} submissions in ${groupTypeLabel} '${groupName}'?`;
    } else {
      const submission = (
        dropdownTarget as { type: 'single'; submission: Submission }
      ).submission;
      let itemIdentifier = `ID: ${submission.id}`;
      const schoolObj = allSchools.find((s) => s.id === submission.school);
      if (schoolObj && submission.report_schedule) {
        itemIdentifier = `submission for ${schoolObj.name} (Schedule: ${submission.report_schedule})`;
      }
      confirmMessage = `Remove assignee from ${itemIdentifier}?`;
    }

    confirm({
      title: confirmTitle,
      message: confirmMessage,
      confirmText: 'Remove',
      confirmButtonStyle: 'bg-red-500 hover:bg-red-600 text-white',
      onConfirm: async () => {
        try {
          handleCloseUserDropdown();
          const updatePromises = submissionsToRemoveFrom.map((sub) =>
            dispatch(
              updateSubmissionDetails({
                submissionId: sub.id,
                data: { assigned_member: null },
              }),
            )
              .unwrap()
              .catch((err) =>
                console.error(
                  `Error removing assignee from submission ${sub.id}:`,
                  err,
                ),
              ),
          );
          await Promise.all(updatePromises);
        } catch (err) {
          console.error(
            'Error during bulk removal (via individual updates):',
            err,
          );
        } finally {
          setIsAssigning(false);
        }
      },
      onCancel: () => {
        handleCloseUserDropdown();
        setIsAssigning(false);
      },
    });
  }, [
    dispatch,
    dropdownTarget,
    handleCloseUserDropdown,
    allSchools,
    isAssigning,
  ]);

  return {
    dropdownAnchorEl,
    dropdownTarget,
    dropdownSearchText,
    availableTeamMembers,
    filteredDropdownUsers,
    isAssigning,
    handleOpenUserDropdown,
    handleCloseUserDropdown,
    handleDropdownSearchChange,
    handleAssignUser,
    handleRemoveAssignee,
  };
};
