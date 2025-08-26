import React, { useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '@/store';
import {
  EntityDocument,
  setLoadingForParent,
  addDocumentToParent,
  updateDocumentInParent,
  deleteDocumentFromParent,
} from '@/store/slices/entityDocumentsSlice';
import EntityDocumentsSection from '@components/EntitySideDrawer/EntityDocumentsSection';
import useFileUpload from '@/hooks/useFileUpload';
import axiosInstance from '@/api/axiosInstance';
import { DataLoading } from '@/components/base/Loading';

import { STANDARD_DOCUMENT_SECTIONS } from '../index.constants';
import { UploadingFile } from '../index.types';
import { EntityType } from '../index.types';

interface DocumentsTabProps {
  entityId?: string;
  entityType: EntityType;
}

const getFolderKeyFromYear = (year: string) => {
  if (!year) return 'General Documents';
  if (/^\d{4}$/.test(year)) {
    const start = year;
    const end = (parseInt(year) + 1).toString();
    return `${start} - ${end}`;
  }
  return year;
};

const getApiYearFromFolderName = (folderName: string): string => {
  if (folderName === 'General Documents') {
    return 'General Documents';
  }
  const yearMatch = folderName.match(/^(\d{4}) - \d{4}$/);
  if (yearMatch && yearMatch[1]) {
    return yearMatch[1];
  }
  return folderName;
};

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  entityId,
  entityType,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { uploadFile } = useFileUpload();

  // Determine parentType and entity
  const parentType =
    entityType === EntityType.AgencyUser || entityType === EntityType.SchoolUser
      ? 'user'
      : entityType === EntityType.Network
        ? 'network'
        : 'school';

  // Always call both selectors
  const userEntity = useSelector((state: RootState) =>
    state.users.users.find((u) => u.id === entityId),
  );
  const schoolEntity = useSelector((state: RootState) =>
    state.schools.schools.find((s) => s.id === entityId),
  );

  // Pick the correct entity
  const entity =
    entityType === EntityType.AgencyUser || entityType === EntityType.SchoolUser
      ? userEntity
      : schoolEntity;

  const documentsByParentId = useSelector(
    (state: RootState) => state.entityDocuments.documentsByParentId,
  );
  const loadingByParentId = useSelector(
    (state: RootState) => state.entityDocuments.loadingByParentId,
  );

  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [editingExpiresDocId, setEditingExpiresDocId] = useState<string | null>(
    null,
  );
  const [targetUploadYear, setTargetUploadYear] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parentId = entityId;
  const entityDocuments = useMemo(() => {
    if (!parentId) return [];
    const docsByYear = documentsByParentId[parentId] || {};
    return Object.values(docsByYear).flat();
  }, [documentsByParentId, parentId]);
  const isLoadingDocs = parentId ? loadingByParentId[parentId] : false;

  const documentsGroupedBySection = useMemo(() => {
    const grouped: Record<string, EntityDocument[]> = {};
    STANDARD_DOCUMENT_SECTIONS.forEach((section) => {
      grouped[section] = [];
    });
    (entityDocuments || []).forEach((doc) => {
      const sectionKey = getFolderKeyFromYear(doc.year);
      if (!grouped[sectionKey]) {
        grouped[sectionKey] = [];
      }
      grouped[sectionKey].push(doc);
    });
    return grouped;
  }, [entityDocuments]);

  const sortedSections = useMemo(() => {
    const availableKeys = Object.keys(documentsGroupedBySection);
    const allSectionKeys = new Set([
      ...STANDARD_DOCUMENT_SECTIONS,
      ...availableKeys,
    ]);

    return Array.from(allSectionKeys).sort((a, b) => {
      const indexA = STANDARD_DOCUMENT_SECTIONS.indexOf(a);
      const indexB = STANDARD_DOCUMENT_SECTIONS.indexOf(b);
      if (a === 'School Documents') return -1;
      if (b === 'School Documents') return 1;
      const yearMatchA = a.match(/^(\d{4})/);
      const yearMatchB = b.match(/^(\d{4})/);
      if (yearMatchA && yearMatchB) {
        return parseInt(yearMatchB[1], 10) - parseInt(yearMatchA[1], 10);
      }
      if (indexA !== -1 && indexB !== -1) return indexB - indexA;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return b.localeCompare(a);
    });
  }, [documentsGroupedBySection]);

  // Handlers
  const handleFolderToggle = (folderName: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderName)
        ? prev.filter((f) => f !== folderName)
        : [...prev, folderName],
    );
  };

  const handleAddDocumentsClick = (section: string) => {
    setTargetUploadYear(section);
    fileInputRef.current?.click();
  };

  const handleUploadingFileNameChange = (tempId: string, newName: string) => {
    setUploadingFiles((prev) =>
      prev.map((f) => (f.tempId === tempId ? { ...f, name: newName } : f)),
    );
  };

  const handleCancelUpload = (tempId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.tempId !== tempId));
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || !targetUploadYear || !parentId) return;
    const section = targetUploadYear;
    const newUploads: UploadingFile[] = Array.from(files).map((file, i) => ({
      year: section,
      tempId: `${Date.now()}-${i}`,
      file,
      name: file.name.replace(/\.[^/.]+$/, ''),
      section: section,
      progress: 0,
      status: 'uploading',
      expires: null,
    }));
    setUploadingFiles((prev) => [...prev, ...newUploads]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTargetUploadYear(null);
    for (const upload of newUploads) {
      try {
        const handleProgress = (percentage: number) => {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.tempId === upload.tempId ? { ...f, progress: percentage } : f,
            ),
          );
        };
        const uploadedS3Key = await uploadFile(upload.file, handleProgress);
        if (!uploadedS3Key) throw new Error('S3 Upload failed');
        const apiYear = getApiYearFromFolderName(upload.section);
        const confirmationResponse = await axiosInstance.post<EntityDocument>(
          '/documents/',
          {
            name: upload.name,
            file_url: uploadedS3Key,
            year: apiYear,
            type: upload.file.type,
            parent_type: parentType,
            parent_id: parentId,
          },
        );
        dispatch(
          addDocumentToParent({
            parentId: parentId,
            document: confirmationResponse.data,
          }),
        );
        setUploadingFiles((prev) =>
          prev.filter((f) => f.tempId !== upload.tempId),
        );
      } catch {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.tempId === upload.tempId
              ? { ...f, status: 'error', progress: 0 }
              : f,
          ),
        );
      }
    }
  };

  const handleDocumentNameSave = async (
    docId: string,
    newName: string,
    currentSection: string,
  ) => {
    if (!parentId) return;
    dispatch(setLoadingForParent({ parentId: parentId, isLoading: true }));
    try {
      await axiosInstance.put(`/documents/${docId}/`, { name: newName });
      dispatch(
        updateDocumentInParent({
          parentId: parentId,
          year: currentSection,
          documentId: docId,
          updates: { name: newName },
        }),
      );
    } catch {
      // handle error
    } finally {
      dispatch(setLoadingForParent({ parentId: parentId, isLoading: false }));
    }
  };

  const handleExpiresDateChange = async (
    docId: string,
    dateValue: string,
    currentSection: string,
  ) => {
    if (!parentId) return;
    const expires = dateValue
      ? new Date(dateValue).toISOString().split('T')[0]
      : null;
    dispatch(setLoadingForParent({ parentId: parentId, isLoading: true }));
    try {
      await axiosInstance.put(`/documents/${docId}/`, {
        expiration_date: expires,
      });
      dispatch(
        updateDocumentInParent({
          parentId: parentId,
          year: currentSection,
          documentId: docId,
          updates: { expiration_date: expires },
        }),
      );
      setEditingExpiresDocId(null);
    } catch {
      setEditingExpiresDocId(null);
    } finally {
      dispatch(setLoadingForParent({ parentId: parentId, isLoading: false }));
    }
  };

  const handleDeleteDocument = async (
    docId: string /*, s3FileKey: string*/,
  ) => {
    if (!parentId) return;
    const parentDocs = documentsByParentId[parentId] || {};
    let sectionToDelete: string | undefined;
    for (const section in parentDocs) {
      if (parentDocs[section].some((d: EntityDocument) => d.id === docId)) {
        sectionToDelete = section;
        break;
      }
    }
    if (!sectionToDelete) return;
    dispatch(setLoadingForParent({ parentId: parentId, isLoading: true }));
    try {
      await axiosInstance.delete(`/documents/${docId}/`);
      dispatch(
        deleteDocumentFromParent({
          parentId: parentId,
          year: sectionToDelete,
          documentId: docId,
        }),
      );
    } catch {
      // handle error
    } finally {
      dispatch(setLoadingForParent({ parentId: parentId, isLoading: false }));
    }
  };

  if (!entity) return <DataLoading />;

  return (
    <div className="flex flex-col gap-4">
      <EntityDocumentsSection
        documentsGroupedBySection={documentsGroupedBySection}
        sortedSections={sortedSections}
        expandedFolders={expandedFolders}
        uploadingFiles={uploadingFiles}
        editingExpiresDocId={editingExpiresDocId}
        setEditingExpiresDocId={setEditingExpiresDocId}
        isLoading={isLoadingDocs}
        onFolderToggle={handleFolderToggle}
        onAddDocumentsClick={handleAddDocumentsClick}
        onUploadingFileNameChange={handleUploadingFileNameChange}
        onCancelUpload={handleCancelUpload}
        onDocumentNameSave={handleDocumentNameSave}
        onExpiresDateChange={handleExpiresDateChange}
        onDeleteDocument={handleDeleteDocument}
      />
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default DocumentsTab;
