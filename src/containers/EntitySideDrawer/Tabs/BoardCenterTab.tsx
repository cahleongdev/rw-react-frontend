import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { RootState, AppDispatch } from '@/store';
import {
  deleteBoardDocumentFromParent,
  updateBoardDocumentInParent,
  addBoardDocumentToParent,
  setLoadingBoardDocs,
} from '@/store/slices/entityDocumentsSlice';
import {
  BoardMemberBase,
  fetchAllBoardMembers,
} from '@/store/slices/schoolUsersSlice';
import { updateSchool } from '@/store/slices/schoolsSlice';
import {
  fetchSchoolBoardMemberList,
  assignBoardMemberToSchool,
} from '@/store/slices/schoolSlice';
import { updateSchoolBoardMeetings } from '@/api/schoolsApi';
import axiosInstance from '@/api/axiosInstance';

import { BoardDocumentsSection } from '@/components/EntitySideDrawer/BoardCenter/BoardDocumentsSection';
import { BoardMeetingDatesSection } from '@/components/EntitySideDrawer/BoardCenter/BoardMeetingDatesSection';
import { BoardMembersSection } from '@/components/EntitySideDrawer/BoardCenter/BoardMembersSection';
import { DataLoading } from '@/components/base/Loading';

import { EntitySideDrawerTabIds, EntityType } from '../index.types';

interface BoardCenterTabContainerProps {
  entityId: string;
  pushView?: (
    entityId: string,
    entityType: EntityType,
    tabId: EntitySideDrawerTabIds,
  ) => void;
}

const BoardCenterTab: React.FC<BoardCenterTabContainerProps> = ({
  entityId,
  pushView,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Get State from Redux
  const allBoardMembers = useSelector(
    (state: RootState) => state.schoolUsers.allBoardMembers,
  );
  const boardMembers = useSelector(
    (state: RootState) => state.school.boardMembers,
  );
  const isLoadingBoardMembers = useSelector(
    (state: RootState) => state.school.loading,
  );

  // Local State
  const [isAddingBoardMember, setIsAddingBoardMember] = useState(false);
  const [boardMemberSearchQuery, setBoardMemberSearchQuery] = useState('');
  const [boardMemberSearchResults, setBoardMemberSearchResults] = useState<
    BoardMemberBase[]
  >([]);
  const [initialBoardMemberSuggestions, setInitialBoardMemberSuggestions] =
    useState<BoardMemberBase[]>([]);

  // Suggestions logic
  const handleAddBoardMemberClick = (): void => {
    // Show suggestions: all board members not already assigned
    const assignedIds = new Set(boardMembers.map((bm) => bm.id));
    const suggestions = allBoardMembers.filter((bm) => !assignedIds.has(bm.id));
    setInitialBoardMemberSuggestions(suggestions);
    setIsAddingBoardMember(true);
    setBoardMemberSearchQuery('');
    setBoardMemberSearchResults([]);
  };

  const handleClearState = (): void => {
    setIsAddingBoardMember(false);
    setBoardMemberSearchQuery('');
    setBoardMemberSearchResults([]);
    setInitialBoardMemberSuggestions([]);
  };

  const handleCancelAddBoardMember = (): void => {
    handleClearState();
  };

  useEffect(() => {
    if (entityId) {
      dispatch(fetchAllBoardMembers());
      dispatch(fetchSchoolBoardMemberList(entityId));
    }
  }, [entityId, dispatch]);

  const handleBoardMemberSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const query = e.target.value;
    setBoardMemberSearchQuery(query);
    if (!query.trim()) {
      setBoardMemberSearchResults([]);
      return;
    }

    const assignedIds = new Set(boardMembers.map((bm) => bm.id));
    const results = allBoardMembers.filter(
      (bm) =>
        !assignedIds.has(bm.id) &&
        `${bm.first_name} ${bm.last_name}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
    setBoardMemberSearchResults(results);
  };

  const handleBoardMemberSelect = (userId: string) => {
    handleClearState();
    dispatch(
      assignBoardMemberToSchool({ boardMemberId: userId, schoolId: entityId }),
    );
  };
  const handleTriggerAddBoardMemberDialog = (): void => {
    // Optionally open a modal to create a new board member
    // Not implemented here
  };

  // Board Meeting Dates Section
  const entity = useSelector((state: RootState) =>
    state.schools.schools.find((s) => s.id === entityId),
  );
  const [meetingDates, setMeetingDates] = useState<string[]>(
    entity?.board_meetings || [],
  );
  const [editingMeetingDate, setEditingMeetingDate] = useState<string | null>(
    null,
  );
  const [isAddingMeetingDate, setIsAddingMeetingDate] = useState(false);
  const [newMeetingDate, setNewMeetingDate] = useState('');

  useEffect(() => {
    setMeetingDates(entity?.board_meetings || []);
  }, [entity?.board_meetings]);

  const handleAddMeetingDateClick = () => {
    setIsAddingMeetingDate(true);
    setEditingMeetingDate(null);
  };
  const handleCancelAddMeetingDate = () => {
    setIsAddingMeetingDate(false);
    setNewMeetingDate('');
  };
  const handleSetEditingMeetingDate = (date: string | null) => {
    setEditingMeetingDate(date);
    setIsAddingMeetingDate(false);
  };
  const handleCancelEditMeetingDate = () => {
    setEditingMeetingDate(null);
  };

  const handleSaveNewMeetingDate = async () => {
    if (!newMeetingDate) return;
    const updatedDates = [...meetingDates, newMeetingDate];
    try {
      await updateSchoolBoardMeetings(entityId, updatedDates);
      dispatch(
        updateSchool({
          id: entityId,
          updates: { board_meetings: updatedDates },
        }),
      );
      setIsAddingMeetingDate(false);
      setNewMeetingDate('');
      toast.success('Meeting date added');
    } catch {
      toast.error('Failed to add meeting date');
    }
  };

  const handleUpdateMeetingDate = async (oldDate: string, newDate: string) => {
    if (!newDate) return;
    const updatedDates = meetingDates.map((d) => (d === oldDate ? newDate : d));
    try {
      await updateSchoolBoardMeetings(entityId, updatedDates);
      dispatch(
        updateSchool({
          id: entityId,
          updates: { board_meetings: updatedDates },
        }),
      );
      setEditingMeetingDate(null);
      toast.success('Meeting date updated');
    } catch {
      toast.error('Failed to update meeting date');
    }
  };
  const handleNewMeetingDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewMeetingDate(e.target.value);
  };

  // Board Documents Section
  const boardDocuments = useSelector(
    (state: RootState) =>
      state.entityDocuments.boardDocumentsByParentId[entityId] || [],
  );
  const [editingBoardExpiresDocId, setEditingBoardExpiresDocId] = useState<
    string | null
  >(null);
  const [boardUploadingFiles, setBoardUploadingFiles] = useState<
    {
      tempId: string;
      name: string;
      file: File;
      progress: number;
      status: 'uploading' | 'error' | 'complete' | 'cancelled';
      year: string;
    }[]
  >([]);
  const boardFileInputRef = React.useRef<HTMLInputElement>(null);

  // Wrapper for onViewUser to determine if user is a board member
  const onViewUser = (boardMemberId: string) => {
    if (pushView) {
      pushView(
        boardMemberId,
        EntityType.BoardMember,
        EntitySideDrawerTabIds.Details,
      );
    }
  };

  const onAddBoardDocumentsClick = () => {
    boardFileInputRef.current?.click();
  };

  const onBoardDocFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;
    const newUploads = Array.from(files).map((file, i) => ({
      tempId: `board-${Date.now()}-${i}`,
      file,
      name: file.name.replace(/\.[^/.]+$/, ''),
      progress: 0,
      status: 'uploading' as const,
      year: 'Board Documents',
    }));
    setBoardUploadingFiles((prev) => [...prev, ...newUploads]);
    if (boardFileInputRef.current) {
      boardFileInputRef.current.value = '';
    }
    for (const upload of newUploads) {
      try {
        // S3 upload skipped
        const placeholderS3Key = `s3_upload_skipped/${upload.file.name}`;
        setBoardUploadingFiles((prev) =>
          prev.map((f) =>
            f.tempId === upload.tempId ? { ...f, progress: 50 } : f,
          ),
        );
        const payload = {
          name: upload.name,
          file_url: placeholderS3Key,
          type: upload.file.type,
          parent_type: 'board',
          parent_id: entityId,
        };
        const confirmationResponse = await axiosInstance.post(
          '/documents/',
          payload,
        );
        setBoardUploadingFiles((prev) =>
          prev.map((f) =>
            f.tempId === upload.tempId
              ? { ...f, progress: 100, status: 'complete' }
              : f,
          ),
        );
        dispatch(
          addBoardDocumentToParent({
            parentId: entityId,
            document: confirmationResponse.data,
          }),
        );
        setBoardUploadingFiles((prev) =>
          prev.filter((f) => f.tempId !== upload.tempId),
        );
      } catch {
        setBoardUploadingFiles((prev) =>
          prev.map((f) =>
            f.tempId === upload.tempId
              ? { ...f, status: 'error', progress: 0 }
              : f,
          ),
        );
      }
    }
  };

  const onBoardDocNameSave = async (docId: string, newName: string | File) => {
    if (typeof newName !== 'string') return;
    dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: true }));
    try {
      await axiosInstance.put(`/documents/${docId}/`, { name: newName });
      dispatch(
        updateBoardDocumentInParent({
          parentId: entityId,
          documentId: docId,
          updates: { name: newName },
        }),
      );
    } finally {
      dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: false }));
    }
  };

  const onBoardDocExpiresChange = async (docId: string, dateValue: string) => {
    const expires = dateValue
      ? new Date(dateValue).toISOString().split('T')[0]
      : null;
    dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: true }));
    try {
      await axiosInstance.put(`/documents/${docId}/`, {
        expiration_date: expires,
      });
      dispatch(
        updateBoardDocumentInParent({
          parentId: entityId,
          documentId: docId,
          updates: { expiration_date: expires },
        }),
      );
      setEditingBoardExpiresDocId(null);
    } finally {
      dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: false }));
    }
  };

  const onDeleteBoardDocument = async (docId: string) => {
    dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: true }));
    try {
      await axiosInstance.delete(`/documents/${docId}/`);
      dispatch(
        deleteBoardDocumentFromParent({
          parentId: entityId,
          documentId: docId,
        }),
      );
    } finally {
      dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: false }));
    }
  };

  const onCancelBoardDocUpload = (tempId: string) => {
    setBoardUploadingFiles((prev) =>
      prev.filter((file) => file.tempId !== tempId),
    );
  };

  if (!entity) return <DataLoading />;

  return (
    <div className="flex flex-col gap-6 h-full flex-1 overflow-hidden py-4">
      <BoardMembersSection
        boardMembers={boardMembers}
        isLoadingBoardMembers={isLoadingBoardMembers}
        isAddingBoardMember={isAddingBoardMember}
        boardMemberSearchQuery={boardMemberSearchQuery}
        boardMemberSearchResults={boardMemberSearchResults}
        initialBoardMemberSuggestions={initialBoardMemberSuggestions}
        onAddBoardMemberClick={handleAddBoardMemberClick}
        onCancelAddBoardMember={handleCancelAddBoardMember}
        onBoardMemberSearchChange={handleBoardMemberSearchChange}
        onBoardMemberSelect={handleBoardMemberSelect}
        onTriggerAddBoardMemberDialog={handleTriggerAddBoardMemberDialog}
        onViewUser={onViewUser}
        entity={entity}
      />
      <BoardMeetingDatesSection
        meetingDates={meetingDates}
        editingMeetingDate={editingMeetingDate}
        isAddingMeetingDate={isAddingMeetingDate}
        newMeetingDate={newMeetingDate}
        onAddMeetingDateClick={handleAddMeetingDateClick}
        onCancelAddMeetingDate={handleCancelAddMeetingDate}
        onSetEditingMeetingDate={handleSetEditingMeetingDate}
        onCancelEditMeetingDate={handleCancelEditMeetingDate}
        onSaveNewMeetingDate={handleSaveNewMeetingDate}
        onUpdateMeetingDate={handleUpdateMeetingDate}
        onNewMeetingDateChange={handleNewMeetingDateChange}
      />
      <BoardDocumentsSection
        boardDocuments={boardDocuments}
        editingBoardExpiresDocId={editingBoardExpiresDocId}
        setEditingBoardExpiresDocId={setEditingBoardExpiresDocId}
        onBoardDocNameSave={onBoardDocNameSave}
        onBoardDocExpiresChange={onBoardDocExpiresChange}
        onAddBoardDocumentsClick={onAddBoardDocumentsClick}
        onDeleteBoardDocument={onDeleteBoardDocument}
        boardUploadingFiles={boardUploadingFiles}
        onCancelBoardDocUpload={onCancelBoardDocUpload}
      />
      <input
        type="file"
        multiple
        ref={boardFileInputRef}
        onChange={onBoardDocFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default BoardCenterTab;
