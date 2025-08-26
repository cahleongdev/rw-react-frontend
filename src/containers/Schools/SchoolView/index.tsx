// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useRef,
// } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { SchoolView as SchoolViewComponent } from '@/components/Schools/SchoolView';
// import { RootState, AppDispatch } from '@/store';
// import {
//   updateSchool,
//   // updateAllCustomFields,
//   School,
// } from '@/store/slices/schoolsSlice';
// import {
//   EntityDocument,
//   setLoadingForParent as setLoadingDocumentsForParent,
//   setAllDocumentsForParent,
//   addDocumentToParent,
//   deleteDocumentFromParent,
//   updateDocumentInParent,
//   // Actions for board documents (assuming they exist or will be added to entityDocumentsSlice)
//   // If not, we might need to adapt general actions or add specific ones.
//   // For now, let's assume general ones can be used if parent_type='board' is handled by reducer.
//   // Or, more likely, EntityInfoDrawerContainer might use specific ones like:
//   // addBoardDocumentToParent, updateBoardDocumentInParent, deleteBoardDocumentFromParent
//   // setLoadingBoardDocs (for specific loading state)
// } from '@/store/slices/entityDocumentsSlice';
// import {
//   fetchBoardMembersForSchool,
//   SchoolUser,
//   assignBoardMemberToSchoolAPI,
// } from '@/store/slices/schoolUsersSlice';
// // Unused: import { CustomFieldDefinition, EntityTypeWithCustomFields } from '@/store/slices/customFieldDefinitionsSlice';
// // Import Child Dialogs/Containers
// import { AddField } from '@containers/EntitySideDrawer/AddField';
// import { AddUser } from '@/containers/Schools/AddUser';
// import { AddBoardMember } from '@/containers/Schools/AddBoardMember';
// // Assuming ManageCustomFields lives here now
// import { ManageCustomFields } from '@containers/EntitySideDrawer/ManageCustomFields';
// import { CustomFieldEntityType } from '@/store/slices/customFieldDefinitionsSlice';
// import {
//   useDrawerNavigation,
//   EntityType as DrawerEntityType,
// } from '@/contexts/DrawerNavigationContext'; // Import EntityType
// import {
//   fetchSchoolDetails,
//   updateSchoolBoardMeetings,
// } from '@/api/schoolsApi';
// import {
//   fetchDocumentsForParent,
//   uploadDocument,
//   deleteDocumentById,
//   updateDocumentDetails,
// } from '@/api/documentsApi';
// import { validateField } from '@/utils/validation'; // Import validateField
// import { Loading } from '@/components/base/Loading'; // ADDED: Import Loading component
// import { UserInfoDrawer } from '@/containers/Shared/UserInfoDrawer'; // Import UserInfoDrawer
// // import { UploadingFile } from '@/types/models'; // Remove shared import

// // Re-define UploadingFile interface locally
// export interface UploadingFile {
//   tempId: string;
//   file: File;
//   name: string;
//   yearSection: string; // Section key like "2023 - 2024" or "School Documents"
//   progress: number;
//   status: 'uploading' | 'complete' | 'error' | 'cancelled';
// }

// // Remove Unused Mock Data
// // const MOCK_ASSIGNED_REPORTS = [
// //   { id: 'rep1', name: 'Compliance Report Q1', status: 'Pending' },
// //   { id: 'rep2', name: 'Annual Review 2024', status: 'Complete' },
// // ];
// // const MOCK_BOARD_DOCUMENTS = [
// //   { id: 'doc1', name: 'Meeting Minutes Jan', expires: '2025-12-31', added: '2024-01-15' },
// //   { id: 'doc2', name: 'Board Charter', expires: 'N/A', added: '2023-05-10' },
// // ];
// // const MOCK_MEETING_DATES = ['2025-03-15', '2025-06-15'];
// // const MOCK_USER_DOCUMENTS: Document[] = [];

// interface SchoolViewContainerProps {
//   schoolId: string;
//   // onClose prop might not be needed if this component isn't directly closable
//   // but part of a larger layout managed by something else (like a drawer)
// }

// export const SchoolView: React.FC<SchoolViewContainerProps> = ({
//   schoolId,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { pushView, popView } = useDrawerNavigation(); // Keep popView if needed for UserInfoDrawer onClose

//   // Local state for detail loading
//   const [isFetchingSchoolDetails, setIsFetchingSchoolDetails] = useState(false);

//   // Selector for the specific school from the list (might be summary data or already detailed if from a nested network structure)
//   const schoolFromList = useSelector((state: RootState) =>
//     state.schools.schools.find((s) => s.id === schoolId),
//   );

//   // Effect to fetch full school details if the version from the list is incomplete
//   useEffect(() => {
//     const fetchFullSchoolDetailsIfNeeded = async () => {
//       if (schoolId) {
//         // If schoolFromList is found and already has board_meetings defined (even if empty array),
//         // assume it's complete enough (e.g., came from a flattened network structure or previous detail fetch).
//         if (
//           schoolFromList &&
//           typeof schoolFromList.board_meetings !== 'undefined'
//         ) {
//           setIsFetchingSchoolDetails(false); // Ensure loading is false if we skip fetch
//           return;
//         }

//         setIsFetchingSchoolDetails(true);
//         try {
//           const data = await fetchSchoolDetails(schoolId);
//           if (data) {
//             dispatch(updateSchool({ id: schoolId, updates: data }));
//           } else {
//             // Error already logged by fetchSchoolDetails, consider UI update
//           }
//         } catch {
//           // Error already logged by fetchSchoolDetails, consider UI update
//         } finally {
//           setIsFetchingSchoolDetails(false);
//         }
//       }
//     };
//     fetchFullSchoolDetailsIfNeeded();
//   }, [schoolId, dispatch, schoolFromList]);

//   // This is the school object that the rest of the container will use.
//   // It will be updated by the useEffect above if a detail fetch occurs.
//   const school =
//     useSelector((state: RootState) =>
//       state.schools.schools.find((s) => s.id === schoolId),
//     ) || null;

//   // Global list of all school users - still useful for searches, adding users etc.
//   const allSchoolUsersFromStore = useSelector(
//     (state: RootState) => state.schoolUsers.schoolUsers || [],
//   );
//   const schoolUsersLoading = useSelector(
//     (state: RootState) => state.schoolUsers.loading,
//   );

//   // --- Selectors --- //
//   const customFieldDefinitions = useSelector(
//     (state: RootState) =>
//       state.customFieldDefinitions.school_entity_fields || [],
//   );

//   // Document Selectors
//   const documentsByParentId = useSelector(
//     (state: RootState) => state.entityDocuments.documentsByParentId,
//   );
//   const isLoadingDocumentsByParentId = useSelector(
//     (state: RootState) => state.entityDocuments.loadingByParentId,
//   );

//   const schoolDocuments = useMemo(() => {
//     if (!schoolId || !documentsByParentId[schoolId]) {
//       return [];
//     }
//     // The documents are stored in an object keyed by year/section, flatten them.
//     return Object.values(documentsByParentId[schoolId]).flat();
//   }, [documentsByParentId, schoolId]);

//   // Memoized values for current school's document status, used in useEffect dependency array
//   const documentsAvailableForCurrentSchool = useMemo(
//     () => (schoolId ? documentsByParentId[schoolId] !== undefined : false),
//     [documentsByParentId, schoolId],
//   );
//   const isLoadingForCurrentSchool = useMemo(
//     () => (schoolId ? isLoadingDocumentsByParentId[schoolId] === true : false),
//     [isLoadingDocumentsByParentId, schoolId],
//   );

//   // --- State --- //
//   const [currentTab, setCurrentTab] = useState('details');
//   const [isSubmitting] = useState(false); // For potential future use
//   const [error] = useState('');
//   const [uploadedImage, setUploadedImage] = useState<string | null>(
//     school?.profile_image || null,
//   );
//   const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
//   const [isAddUserOpen, setIsAddUserOpen] = useState(false);
//   const [isAddBoardMemberOpen, setIsAddBoardMemberOpen] = useState(false);
//   const [isManageCustomFieldsOpen, setIsManageCustomFieldsOpen] =
//     useState(false);
//   const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
//   const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
//   const [targetUploadSection, setTargetUploadSection] = useState<string | null>(
//     null,
//   );
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [editingExpiresDocId, setEditingExpiresDocId] = useState<string | null>(
//     null,
//   );
//   // State for Board Meeting Dates
//   const [isAddingMeetingDate, setIsAddingMeetingDate] = useState(false);
//   const [newMeetingDate, setNewMeetingDate] = useState('');
//   const [editingMeetingDate, setEditingMeetingDate] = useState<string | null>(
//     null,
//   );
//   const [currentEditMeetingDateValue, setCurrentEditMeetingDateValue] =
//     useState('');
//   // State for Inline Board Member Add
//   const [isAddingBoardMemberInline, setIsAddingBoardMemberInline] =
//     useState(false);
//   const [boardMemberSearchQuery, setBoardMemberSearchQuery] = useState('');
//   const [boardMemberSearchResults, setBoardMemberSearchResults] = useState<
//     SchoolUser[]
//   >([]);
//   const [initialBoardMemberSuggestions, setInitialBoardMemberSuggestions] =
//     useState<SchoolUser[]>([]);
//   const [initialBoardMemberNamesForModal, setInitialBoardMemberNamesForModal] =
//     useState<{ firstName: string; lastName: string } | null>(null);
//   // State for Board Document Uploads
//   const [boardDocUploadingFiles, setBoardDocUploadingFiles] = useState<
//     UploadingFile[]
//   >([]);
//   const boardDocFileInputRef = useRef<HTMLInputElement>(null);
//   // --- Temporary Local State for Board Documents ---
//   const [localBoardDocsData, setLocalBoardDocsData] = useState<
//     EntityDocument[]
//   >([]);
//   const [isLoadingLocalBoardDocs, setIsLoadingLocalBoardDocs] =
//     useState<boolean>(false);

//   // State for viewing user profile drawer
//   const [viewingUserId, setViewingUserId] = useState<string | null>(null);
//   const [viewingUserEntityType, setViewingUserEntityType] =
//     useState<DrawerEntityType | null>(null);

//   // Effect to fetch board members for the school
//   useEffect(() => {
//     if (schoolId) {
//       console.log(
//         `[SchoolViewContainer] Fetching board members for school: ${schoolId}`,
//       );
//       dispatch(fetchBoardMembersForSchool(schoolId));
//     }
//   }, [schoolId, dispatch]);

//   // Update uploaded image state if school OR school.profile_image changes
//   useEffect(() => {
//     setUploadedImage(school?.profile_image || null);
//   }, [school]); // Depend on the school object itself

//   // --- Fetch School Documents --- //
//   const fetchSchoolDocuments = useCallback(
//     async (currentSchoolId: string) => {
//       dispatch(
//         setLoadingDocumentsForParent({
//           parentId: currentSchoolId,
//           isLoading: true,
//         }),
//       );
//       try {
//         const documents = await fetchDocumentsForParent(
//           currentSchoolId,
//           'school',
//         );
//         dispatch(
//           setAllDocumentsForParent({
//             parentId: currentSchoolId,
//             documents: documents,
//           }),
//         );
//       } catch {
//         // Error logged in API function
//       } finally {
//         dispatch(
//           setLoadingDocumentsForParent({
//             parentId: currentSchoolId,
//             isLoading: false,
//           }),
//         );
//       }
//     },
//     [dispatch],
//   );

//   useEffect(() => {
//     if (schoolId && currentTab === 'documents') {
//       if (!documentsAvailableForCurrentSchool && !isLoadingForCurrentSchool) {
//         fetchSchoolDocuments(schoolId);
//       }
//     }
//   }, [
//     schoolId,
//     currentTab,
//     documentsAvailableForCurrentSchool,
//     isLoadingForCurrentSchool,
//     fetchSchoolDocuments,
//   ]);

//   // --- Fetch Board Documents --- //
//   const fetchBoardDocuments = useCallback(
//     async (currentSchoolId: string) => {
//       setIsLoadingLocalBoardDocs(true);
//       try {
//         const documents = await fetchDocumentsForParent(
//           currentSchoolId,
//           'board',
//         );
//         setLocalBoardDocsData(documents);
//       } catch {
//         setLocalBoardDocsData([]);
//         // Error logged in API function
//       } finally {
//         setIsLoadingLocalBoardDocs(false);
//       }
//     },
//     [], // dispatch removed as it's not directly used for this local state version
//   );

//   useEffect(() => {
//     if (schoolId && currentTab === 'board-center') {
//       if (localBoardDocsData.length === 0 && !isLoadingLocalBoardDocs) {
//         fetchBoardDocuments(schoolId);
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [schoolId, currentTab, fetchBoardDocuments]);

//   // --- Handlers --- //

//   const handleTabChange = useCallback((tabId: string) => {
//     setCurrentTab(tabId);
//   }, []);

//   const handleFolderToggle = useCallback((folderName: string) => {
//     setExpandedFolders((prev) =>
//       prev.includes(folderName)
//         ? prev.filter((f) => f !== folderName)
//         : [...prev, folderName],
//     );
//   }, []);

//   // --- Document Upload Handlers ---
//   const handleAddDocumentsClick = useCallback((section: string) => {
//     setTargetUploadSection(section);
//     fileInputRef.current?.click();
//   }, []);

//   const handleFileSelect = useCallback(
//     async (event: React.ChangeEvent<HTMLInputElement>) => {
//       const files = event.target.files;
//       if (!files || !targetUploadSection || !schoolId) {
//         if (fileInputRef.current) fileInputRef.current.value = '';
//         setTargetUploadSection(null);
//         return;
//       }

//       const currentSectionForUpload = targetUploadSection;

//       // Logic to convert section string to API's year parameter (from EntityInfoDrawerContainer)
//       let yearParamForAPI: string;
//       if (currentSectionForUpload === 'School Documents') {
//         yearParamForAPI = currentSectionForUpload;
//       } else if (currentSectionForUpload.includes(' - ')) {
//         const yearParts = currentSectionForUpload.split(' - ');
//         if (yearParts[0] && /^[0-9]{4}$/.test(yearParts[0])) {
//           yearParamForAPI = yearParts[0];
//         } else {
//           console.error(
//             'Invalid year format in section key:',
//             currentSectionForUpload,
//           );
//           if (fileInputRef.current) fileInputRef.current.value = '';
//           setTargetUploadSection(null);
//           return;
//         }
//       } else {
//         // Fallback for unexpected formats, though our sections should match the above
//         console.warn(
//           'Unexpected section format for year extraction:',
//           currentSectionForUpload,
//         );
//         yearParamForAPI = 'Unknown';
//       }

//       const newUploads: UploadingFile[] = Array.from(files).map((file, i) => ({
//         tempId: `${Date.now()}-${i}`,
//         file,
//         name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for initial name
//         yearSection: currentSectionForUpload,
//         progress: 0,
//         status: 'uploading',
//       }));

//       setUploadingFiles((prev) => [...prev, ...newUploads]);
//       if (fileInputRef.current) fileInputRef.current.value = '';
//       setTargetUploadSection(null);

//       for (const upload of newUploads) {
//         try {
//           // Simulate S3 Upload (placeholder logic from EntityInfoDrawerContainer)
//           setUploadingFiles((prev) =>
//             prev.map((f) =>
//               f.tempId === upload.tempId ? { ...f, progress: 50 } : f,
//             ),
//           );
//           const placeholderS3Key = `s3_upload_skipped/${schoolId}/${upload.file.name}`;
//           // Actual S3 upload would happen here if implemented
//           // const uploadedS3Key = await uploadFileToS3(upload.file, (progress) => { /* update progress */ });

//           const documentPayload = {
//             name: upload.name,
//             file_url: placeholderS3Key,
//             year: yearParamForAPI, // Use the extracted year for the API
//             document_type: upload.file.type, // Changed from 'type' to 'document_type' to match EntityDocument
//             parent_type: 'school' as 'school' | 'board',
//             parent_id: schoolId,
//           };

//           const newDocument = await uploadDocument(documentPayload);

//           setUploadingFiles((prev) =>
//             prev.map((f) =>
//               f.tempId === upload.tempId
//                 ? { ...f, progress: 100, status: 'complete' }
//                 : f,
//             ),
//           );

//           dispatch(
//             addDocumentToParent({
//               parentId: schoolId,
//               document: newDocument, // The actual document from backend
//             }),
//           );
//         } catch {
//           // Error logged in API function
//           setUploadingFiles((prev) =>
//             prev.map((f) =>
//               f.tempId === upload.tempId ? { ...f, status: 'error' } : f,
//             ),
//           );
//         }
//       }
//     },
//     [schoolId, dispatch, targetUploadSection],
//   );

//   // --- Document Action Handlers (Delete, Edit Name, Edit Expires) ---
//   const handleDeleteDocument = useCallback(
//     async (documentToDelete: EntityDocument) => {
//       if (!schoolId) return;

//       const docId = documentToDelete.id;
//       const s3FileKey = documentToDelete.file_url;
//       const yearKeyForReducer = documentToDelete.year;

//       try {
//         await deleteDocumentById(docId);

//         if (s3FileKey && s3FileKey.startsWith('s3_upload_skipped/')) {
//           // S3 deletion skipped for placeholder key
//         } else if (s3FileKey) {
//           // Actual S3 deletion logic would go here
//         }

//         dispatch(
//           deleteDocumentFromParent({
//             parentId: schoolId,
//             documentId: docId,
//             year: yearKeyForReducer,
//           }),
//         );
//       } catch {
//         // Error logged in API function
//         // TODO: Add user-facing error feedback
//       }
//     },
//     [schoolId, dispatch],
//   );

//   const handleDocumentNameSave = useCallback(
//     async (
//       docId: string,
//       newName: string,
//       originalDocument: EntityDocument,
//     ) => {
//       if (!schoolId || !originalDocument) return;
//       const yearKeyForReducer = originalDocument.year;

//       try {
//         await updateDocumentDetails(docId, { name: newName });
//         dispatch(
//           updateDocumentInParent({
//             parentId: schoolId,
//             documentId: docId,
//             year: yearKeyForReducer,
//             updates: { name: newName },
//           }),
//         );
//       } catch {
//         // Error logged in API function
//         // TODO: Add user-facing error feedback
//       }
//     },
//     [schoolId, dispatch],
//   );

//   const handleExpiresDateChange = useCallback(
//     async (
//       docId: string,
//       dateValue: string,
//       originalDocument: EntityDocument,
//     ) => {
//       if (!schoolId || !originalDocument) return;

//       const yearKeyForReducer = originalDocument.year;
//       const expires = dateValue
//         ? new Date(dateValue + 'T00:00:00').toISOString().split('T')[0]
//         : null;

//       try {
//         await updateDocumentDetails(docId, { expiration_date: expires });
//         dispatch(
//           updateDocumentInParent({
//             parentId: schoolId,
//             documentId: docId,
//             year: yearKeyForReducer,
//             updates: { expiration_date: expires },
//           }),
//         );
//       } catch {
//         // Error logged in API function
//         // TODO: Add user-facing error feedback
//       } finally {
//         setEditingExpiresDocId(null); // Always close the editor
//       }
//     },
//     [schoolId, dispatch],
//   );

//   const handleImageUpload = useCallback(
//     (files: File[]) => {
//       if (files.length > 0 && school) {
//         const file = files[0];
//         const imageUrl = URL.createObjectURL(file);
//         setUploadedImage(imageUrl);
//         // TODO: Implement actual image upload API call and Redux update
//         console.log('Uploading image:', file.name); // Kept for now as it's a TODO
//       }
//     },
//     [school],
//   );

//   const handleStandardFieldSave = useCallback(
//     (fieldName: keyof School, newValue: string) => {
//       if (!school) return;
//       // Assert that school is of type School for this operation,
//       // assuming the useEffect for detail fetching has populated it fully.
//       const currentSchool = school as School;
//       if (currentSchool[fieldName] === newValue) return;

//       dispatch(
//         updateSchool({ id: schoolId, updates: { [fieldName]: newValue } }),
//       );
//     },
//     [dispatch, schoolId, school],
//   );

//   const handleCustomFieldSave = async (
//     fieldName: string,
//     newValue: string | File,
//   ) => {
//     if (!school || !school.id) return;

//     if (newValue instanceof File) {
//       // TODO: Implement file upload logic for SchoolView custom fields
//       console.log(
//         `SchoolView Custom field ${fieldName} received a file:`,
//         newValue.name,
//       );
//       alert(
//         `File upload for custom field '${fieldName}' is not yet fully implemented. File was not saved.`,
//       );
//       return;
//     }

//     // Find field definition for validation
//     const fieldDefinition = customFieldDefinitions.find(
//       (def) => def.Name === fieldName,
//     );

//     // Validate the field before saving
//     const validationError = validateField(
//       fieldName,
//       newValue, // newValue is already confirmed to be a string here
//       fieldDefinition?.Type,
//     );

//     if (validationError) {
//       alert(validationError); // Show validation error to the user
//       // TODO: Optionally provide better UX than alert, e.g., inline error message
//       // And potentially revert the InlineEditField to its original value.
//       return; // Stop if validation fails
//     }

//     const updatedFields = {
//       ...(school.custom_fields || {}),
//       [fieldName]: newValue,
//     };

//     dispatch(
//       updateSchool({
//         id: schoolId,
//         updates: { custom_fields: updatedFields },
//       }),
//     );
//   };

//   // Derived data for presentational component
//   // For TEAM MEMBERS: Prioritize users directly from the school object if available
//   const teamMembersToDisplay = useMemo(() => {
//     if (school && Array.isArray(school.users)) {
//       // Filter out Board_Member roles from the school.users array
//       return school.users.filter((user) => user.role !== 'Board_Member');
//       // Ensure the user objects in school.users have all fields needed by SchoolUserCard
//       // (e.g., id, first_name, last_name, role, is_active, title, profile_image)
//       // If not, you might need to map/enrich them using allSchoolUsersFromStore, but that's more complex.
//       // For now, assume school.users has enough detail.
//     }
//     // Fallback or if school.users is not populated for some reason,
//     // could optionally filter allSchoolUsersFromStore as before, but this indicates an issue
//     // with school data consistency if school.users should be the source of truth.
//     console.warn(
//       '[SchoolViewContainer] school.users array not found or not an array for team members. School:',
//       school,
//     );
//     return []; // Default to empty if school.users isn't there
//   }, [school]);

//   // For BOARD MEMBERS: This remains the same, uses global list and specific fetch trigger
//   const boardMembersToDisplay = useMemo(() => {
//     return allSchoolUsersFromStore.filter(
//       (user) => user.role === 'Board_Member' && user.schools.includes(schoolId),
//     );
//   }, [allSchoolUsersFromStore, schoolId]);

//   // Handler to open user drawer
//   const handleViewUser = useCallback(
//     (userId: string) => {
//       if (!school) return;
//       const isBoardMemberForThisSchool = boardMembersToDisplay.some(
//         (member) => member.id === userId,
//       );
//       const determinedUserType: DrawerEntityType = isBoardMemberForThisSchool
//         ? 'Board Member'
//         : 'School User';

//       console.log(
//         `Setting user to view: ${userId}, type: ${determinedUserType}`,
//       );
//       setViewingUserId(userId);
//       setViewingUserEntityType(determinedUserType);
//       // No longer calling pushView here for UserInfoDrawer, it will be rendered directly
//     },
//     [school, boardMembersToDisplay], // Removed pushView, currentTab from dependencies for this specific handler
//   );

//   // --- Board Meeting Date Handlers (Initial: Add, Change, Cancel) ---
//   const handleAddMeetingDateClick = useCallback(() => {
//     setIsAddingMeetingDate(true);
//     setNewMeetingDate(''); // Clear any previous date
//     setEditingMeetingDate(null); // Ensure not in edit mode
//   }, []);

//   const handleNewMeetingDateChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setNewMeetingDate(e.target.value);
//     },
//     [],
//   );

//   const handleCancelAddMeetingDate = useCallback(() => {
//     setIsAddingMeetingDate(false);
//     setNewMeetingDate('');
//   }, []);

//   const handleSaveNewMeetingDate = useCallback(async () => {
//     console.log(
//       '[handleSaveNewMeetingDate] Triggered. newMeetingDate:',
//       newMeetingDate,
//       'school ID:',
//       school?.id,
//       'meetings:',
//       school?.board_meetings,
//     );
//     if (!newMeetingDate || !school) {
//       setIsAddingMeetingDate(false);
//       setNewMeetingDate('');
//       return;
//     }
//     if (!/^\d{4}-\d{2}-\d{2}$/.test(newMeetingDate)) {
//       console.error(
//         '[handleSaveNewMeetingDate] Early return: Invalid date format.',
//         newMeetingDate,
//       );
//       setIsAddingMeetingDate(false);
//       return;
//     }
//     const existingMeetings = school.board_meetings || [];
//     if (existingMeetings.includes(newMeetingDate)) {
//       setIsAddingMeetingDate(false);
//       setNewMeetingDate('');
//       return;
//     }
//     const updatedMeetings = [...existingMeetings, newMeetingDate].sort();
//     try {
//       await updateSchoolBoardMeetings(school.id, updatedMeetings);
//       dispatch(
//         updateSchool({
//           id: school.id,
//           updates: { board_meetings: updatedMeetings },
//         }),
//       );
//       setNewMeetingDate('');
//       setIsAddingMeetingDate(false);
//     } catch {
//       // Error logged in API function
//       setIsAddingMeetingDate(false); // ensure UI resets
//       setNewMeetingDate('');
//     }
//   }, [newMeetingDate, school, dispatch]);

//   // --- Edit Existing Meeting Date Handlers ---
//   const handleSetEditingMeetingDate = useCallback(
//     (dateStringToEdit: string) => {
//       setEditingMeetingDate(dateStringToEdit);
//       setCurrentEditMeetingDateValue(dateStringToEdit); // Initialize input with current date
//       setIsAddingMeetingDate(false); // Ensure not in add mode
//     },
//     [],
//   );

//   const handleCurrentEditMeetingDateChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setCurrentEditMeetingDateValue(e.target.value);
//     },
//     [],
//   );

//   const handleCancelEditMeetingDate = useCallback(() => {
//     setEditingMeetingDate(null);
//     setCurrentEditMeetingDateValue('');
//   }, []);

//   const handleUpdateMeetingDate = useCallback(async () => {
//     if (!editingMeetingDate || !currentEditMeetingDateValue || !school) {
//       setEditingMeetingDate(null); // Clear editing state if something is wrong
//       setCurrentEditMeetingDateValue('');
//       return;
//     }

//     if (!/^\d{4}-\d{2}-\d{2}$/.test(currentEditMeetingDateValue)) {
//       console.error(
//         'Invalid date format for updated meeting date:',
//         currentEditMeetingDateValue,
//       );
//       // TODO: Show user-facing error. Optionally, revert currentEditMeetingDateValue or keep editor open.
//       return;
//     }

//     const oldDate = editingMeetingDate;
//     const newDate = currentEditMeetingDateValue;

//     const existingMeetings = school.board_meetings || [];
//     if (newDate !== oldDate && existingMeetings.includes(newDate)) {
//       console.warn('Updated meeting date already exists:', newDate);
//       // TODO: Show user-facing warning. Keep editor open or close?
//       // For now, just close it without saving if new date (not the original) already exists elsewhere.
//       setEditingMeetingDate(null);
//       setCurrentEditMeetingDateValue('');
//       return;
//     }

//     const updatedMeetings = existingMeetings
//       .map((date) => (date === oldDate ? newDate : date))
//       .sort();

//     try {
//       await updateSchoolBoardMeetings(school.id, updatedMeetings);
//       dispatch(
//         updateSchool({
//           id: school.id,
//           updates: { board_meetings: updatedMeetings },
//         }),
//       );
//       setEditingMeetingDate(null);
//       setCurrentEditMeetingDateValue('');
//     } catch (error) {
//       console.error('Error updating meeting date:', error);
//       // TODO: Add user-facing error. Keep editor open?
//     }
//   }, [editingMeetingDate, currentEditMeetingDateValue, school, dispatch]);
//   // --- End Board Meeting Date Handlers (Initial) ---

//   // --- Board Member Handlers ---
//   const { open: openAddBoardMemberModal, onClose: closeAddBoardMemberModal } = {
//     open: () => setIsAddBoardMemberOpen(true),
//     onClose: () => setIsAddBoardMemberOpen(false),
//   };

//   const handleToggleAddBoardMemberInlineSearch = useCallback(() => {
//     if (isAddingBoardMemberInline) {
//       // If it's currently open and we are toggling to close
//       setInitialBoardMemberNamesForModal(null); // Clear prefill when inline search is cancelled
//     }
//     if (!schoolId || !allSchoolUsersFromStore) return;
//     const currentlyOpening = !isAddingBoardMemberInline;
//     setIsAddingBoardMemberInline(currentlyOpening);

//     if (currentlyOpening) {
//       const assignedBoardMemberIds = new Set(
//         boardMembersToDisplay.map((bm) => bm.id),
//       );
//       const suggestions = allSchoolUsersFromStore.filter(
//         (user) => !assignedBoardMemberIds.has(user.id),
//       );
//       setInitialBoardMemberSuggestions(suggestions);
//       setBoardMemberSearchQuery('');
//       setBoardMemberSearchResults([]);
//     } else {
//       setBoardMemberSearchQuery('');
//       setBoardMemberSearchResults([]);
//       setInitialBoardMemberSuggestions([]);
//       setInitialBoardMemberNamesForModal(null); // Also clear here when toggling off
//     }
//   }, [
//     schoolId,
//     allSchoolUsersFromStore,
//     boardMembersToDisplay,
//     isAddingBoardMemberInline,
//   ]);

//   const handleBoardMemberSearchChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const query = e.target.value;
//       setBoardMemberSearchQuery(query);
//       if (!query.trim()) {
//         setBoardMemberSearchResults([]);
//         return;
//       }
//       const assignedBoardMemberIds = new Set(
//         boardMembersToDisplay.map((bm) => bm.id),
//       );
//       const results = allSchoolUsersFromStore.filter(
//         (user) =>
//           !assignedBoardMemberIds.has(user.id) &&
//           (`${user.first_name} ${user.last_name}`
//             .toLowerCase()
//             .includes(query.toLowerCase()) ||
//             user.email.toLowerCase().includes(query.toLowerCase())),
//       );
//       setBoardMemberSearchResults(results);
//     },
//     [allSchoolUsersFromStore, boardMembersToDisplay],
//   );

//   const handleCancelAddBoardMemberInline = useCallback(() => {
//     setIsAddingBoardMemberInline(false);
//     setBoardMemberSearchQuery('');
//     setBoardMemberSearchResults([]);
//     setInitialBoardMemberSuggestions([]);
//     setInitialBoardMemberNamesForModal(null); // Clear prefill on explicit cancel
//   }, []);

//   const handleBoardMemberSelect = useCallback(
//     async (userToAssign: SchoolUser) => {
//       if (!schoolId) return;
//       try {
//         const resultAction = await dispatch(
//           assignBoardMemberToSchoolAPI({
//             schoolId: schoolId,
//             memberId: userToAssign.id,
//           }),
//         );
//         if (assignBoardMemberToSchoolAPI.fulfilled.match(resultAction)) {
//           dispatch(fetchBoardMembersForSchool(schoolId));
//         } else {
//           console.error(
//             'Failed to assign board member via API thunk:',
//             resultAction.payload,
//           );
//         }
//       } catch (error) {
//         console.error('Unexpected error assigning board member:', error);
//       }
//       handleCancelAddBoardMemberInline();
//     },
//     [schoolId, dispatch, handleCancelAddBoardMemberInline],
//   );

//   // ADDED: Handler to trigger the AddBoardMember dialog, potentially with pre-filled names
//   const handleTriggerAddBoardMemberDialog = useCallback(
//     (query?: string) => {
//       if (query) {
//         const names = query.split(' ').filter((n) => n.trim() !== '');
//         const firstName = names[0] || '';
//         const lastName = names.slice(1).join(' ') || '';
//         setInitialBoardMemberNamesForModal({ firstName, lastName });
//       } else {
//         setInitialBoardMemberNamesForModal(null);
//       }
//       openAddBoardMemberModal();
//       // It's important to close the inline search UI if this is triggered from there
//       // Setting setIsAddingBoardMemberInline(false) directly or via cancel handler
//       if (isAddingBoardMemberInline) {
//         // Check if it was open
//         handleCancelAddBoardMemberInline();
//       }
//     },
//     [
//       openAddBoardMemberModal,
//       handleCancelAddBoardMemberInline,
//       isAddingBoardMemberInline,
//     ],
//   );
//   // --- End Board Member Handlers ---

//   // --- Board Document Handlers ---
//   const handleAddBoardDocumentsClick = useCallback(() => {
//     boardDocFileInputRef.current?.click();
//   }, []);

//   const handleBoardDocFileSelect = useCallback(
//     async (event: React.ChangeEvent<HTMLInputElement>) => {
//       const files = event.target.files;
//       if (!files || !schoolId) {
//         if (boardDocFileInputRef.current)
//           boardDocFileInputRef.current.value = '';
//         return;
//       }

//       const newUploads: UploadingFile[] = Array.from(files).map((file, i) => ({
//         tempId: `board-${Date.now()}-${i}`,
//         file,
//         name: file.name.replace(/\.[^/.]+$/, ''),
//         yearSection: 'Board Documents',
//         progress: 0,
//         status: 'uploading',
//       }));

//       setBoardDocUploadingFiles((prev) => [...prev, ...newUploads]);
//       if (boardDocFileInputRef.current) boardDocFileInputRef.current.value = '';

//       for (const upload of newUploads) {
//         try {
//           setBoardDocUploadingFiles((prev) =>
//             prev.map((f) =>
//               f.tempId === upload.tempId ? { ...f, progress: 50 } : f,
//             ),
//           );
//           const placeholderS3Key = `s3_upload_skipped/board/${schoolId}/${upload.file.name}`;
//           const documentPayload = {
//             name: upload.name,
//             file_url: placeholderS3Key,
//             document_type: upload.file.type,
//             parent_type: 'board' as 'school' | 'board',
//             parent_id: schoolId,
//           };
//           const newDocument = await uploadDocument(documentPayload);
//           setBoardDocUploadingFiles((prev) =>
//             prev.map((f) =>
//               f.tempId === upload.tempId
//                 ? { ...f, progress: 100, status: 'complete' }
//                 : f,
//             ),
//           );
//           // UPDATE LOCAL STATE with the new document
//           setLocalBoardDocsData((prevDocs) => [...prevDocs, newDocument]);
//         } catch {
//           // Error logged by API function
//           setBoardDocUploadingFiles((prev) =>
//             prev.map((f) =>
//               f.tempId === upload.tempId ? { ...f, status: 'error' } : f,
//             ),
//           );
//         }
//       }
//     },
//     [schoolId], // Removed dispatch
//   );
//   // --- End Board Document Handlers ---

//   console.log(
//     '[SchoolViewContainer] Render - schoolId:',
//     schoolId,
//     'school object from store:',
//     school ? school.id : null,
//     'board_meetings:',
//     school?.board_meetings,
//     'school.users:',
//     school?.users,
//   );

//   // Loading states combined
//   if (!schoolId || (isFetchingSchoolDetails && !school)) {
//     // Show loading if no schoolId yet, or fetching details and school object isn't in store yet
//     return <Loading />;
//   }
//   if (!school) {
//     // If, after all attempts, school is still null (e.g. invalid schoolId or detail fetch failed badly)
//     return (
//       <div>Error: School with ID {schoolId} not found or failed to load.</div>
//     );
//   }
//   // Now, 'school' should be the most up-to-date version available in Redux.

//   return (
//     <>
//       <SchoolViewComponent
//         schoolId={schoolId}
//         schoolUsers={teamMembersToDisplay}
//         boardMembers={boardMembersToDisplay}
//         isLoadingBoardMembers={schoolUsersLoading}
//         customFieldDefinitions={customFieldDefinitions}
//         currentTab={currentTab}
//         uploadedImage={uploadedImage}
//         assignedReports={[]}
//         boardDocuments={localBoardDocsData}
//         meetingDates={school.board_meetings || []}
//         documents={schoolDocuments}
//         isLoadingDocuments={isLoadingForCurrentSchool}
//         isSubmitting={isSubmitting}
//         error={error}
//         expandedFolders={expandedFolders}
//         onFolderToggle={handleFolderToggle}
//         onTabChange={handleTabChange}
//         onImageUpload={handleImageUpload}
//         onStandardFieldSave={handleStandardFieldSave}
//         onCustomFieldSave={handleCustomFieldSave}
//         onAddUserClick={() => setIsAddUserOpen(true)}
//         onAddBoardMemberClick={openAddBoardMemberModal}
//         onManageCustomFieldsClick={() => setIsManageCustomFieldsOpen(true)}
//         onAddFieldClick={() => setIsAddFieldOpen(true)}
//         onViewUser={handleViewUser}
//         onAddDocumentsClick={handleAddDocumentsClick}
//         uploadingFiles={uploadingFiles}
//         onDeleteDocument={handleDeleteDocument}
//         onDocumentNameSave={handleDocumentNameSave}
//         editingExpiresDocId={editingExpiresDocId}
//         onSetEditingExpiresDocId={setEditingExpiresDocId}
//         onExpiresDateChange={handleExpiresDateChange}
//         isAddingMeetingDate={isAddingMeetingDate}
//         newMeetingDate={newMeetingDate}
//         onAddMeetingDateClick={handleAddMeetingDateClick}
//         onNewMeetingDateChange={handleNewMeetingDateChange}
//         onCancelAddMeetingDate={handleCancelAddMeetingDate}
//         onSaveNewMeetingDate={handleSaveNewMeetingDate}
//         editingMeetingDate={editingMeetingDate}
//         currentEditMeetingDateValue={currentEditMeetingDateValue}
//         onSetEditingMeetingDate={handleSetEditingMeetingDate}
//         onCurrentEditMeetingDateChange={handleCurrentEditMeetingDateChange}
//         onCancelEditMeetingDate={handleCancelEditMeetingDate}
//         onUpdateMeetingDate={handleUpdateMeetingDate}
//         isAddingBoardMemberInline={isAddingBoardMemberInline}
//         onToggleAddBoardMemberInlineSearch={
//           handleToggleAddBoardMemberInlineSearch
//         }
//         initialBoardMemberSuggestions={initialBoardMemberSuggestions}
//         boardMemberSearchQuery={boardMemberSearchQuery}
//         boardMemberSearchResults={boardMemberSearchResults}
//         onBoardMemberSearchChange={handleBoardMemberSearchChange}
//         onCancelAddBoardMemberInline={handleCancelAddBoardMemberInline}
//         onBoardMemberSelect={handleBoardMemberSelect}
//         onTriggerAddBoardMemberDialog={handleTriggerAddBoardMemberDialog}
//         isLoadingBoardDocumentsList={isLoadingLocalBoardDocs}
//         onAddBoardDocumentsClick={handleAddBoardDocumentsClick}
//         boardDocUploadingFiles={boardDocUploadingFiles}
//       />

//       {/* Render UserInfoDrawer conditionally */}
//       {viewingUserId && viewingUserEntityType && (
//         <UserInfoDrawer
//           userId={viewingUserId}
//           entityType={viewingUserEntityType} // Use the determined type
//           onClose={() => {
//             setViewingUserId(null);
//             setViewingUserEntityType(null);
//             // popView(); // Call popView IF UserInfoDrawer was part of main nav stack and needs explicit pop
//             // If UserInfoDrawer handles its own visibility entirely (e.g. is a self-contained modal), then popView might not be needed here.
//             // Given AgencySettings passes popView to it, UserInfoDrawer might call popView internally upon its own close actions.
//           }}
//           // Pass pushView/popView if UserInfoDrawer uses them internally for further navigation
//           pushView={pushView}
//           popView={popView}
//         />
//       )}

//       {/* Render Child Dialogs */}
//       {/* Hidden file input for general school document uploads */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileSelect}
//         multiple
//         style={{ display: 'none' }}
//       />
//       {/* Hidden file input for BOARD document uploads */}
//       <input
//         type="file"
//         ref={boardDocFileInputRef}
//         onChange={handleBoardDocFileSelect}
//         multiple
//         style={{ display: 'none' }}
//         // accept=".pdf,.doc,.docx,..." // Optional: specify accepted types for board docs
//       />
//       <AddField
//         open={isAddFieldOpen}
//         onClose={() => setIsAddFieldOpen(false)}
//         entityType={CustomFieldEntityType.SchoolEntity}
//       />
//       <AddUser
//         open={isAddUserOpen}
//         onClose={() => setIsAddUserOpen(false)}
//         entityId={schoolId}
//       />
//       <AddBoardMember
//         open={isAddBoardMemberOpen}
//         onClose={closeAddBoardMemberModal}
//         entityId={schoolId}
//         initialFirstName={initialBoardMemberNamesForModal?.firstName} // ADDED PROP
//         initialLastName={initialBoardMemberNamesForModal?.lastName} // ADDED PROP
//       />
//       <ManageCustomFields
//         open={isManageCustomFieldsOpen}
//         onClose={() => setIsManageCustomFieldsOpen(false)}
//         entityType={CustomFieldEntityType.SchoolEntity}
//       />
//     </>
//   );
// };
