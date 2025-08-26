// import React, {
//   useState,
//   useCallback,
//   useRef,
//   useEffect,
//   useMemo,
// } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { isAxiosError } from 'axios';
// import { useNavigate } from 'react-router-dom';

// import { RootState, AppDispatch } from '@/store';
// import { setLoading } from '@/store/slices/activityLogSlice';
// import {
//   updateSchool,
//   School,
//   Network,
//   addSchoolToNetwork,
//   addSchool,
// } from '@/store/slices/schoolsSlice';
// import { CustomFieldEntityType } from '@/store/slices/customFieldDefinitionsSlice';
// import {
//   updateUser,
//   SchoolUser,
//   assignBoardMemberToSchoolAPI,
//   fetchBoardMembersForSchool,
//   fetchAllBoardMembers,
// } from '@/store/slices/schoolUsersSlice';
// import {
//   setForSchool,
//   AssignedReport,
// } from '@/store/slices/assignedReportsSlice';

// import { ReportResponse } from '@/containers/Reports/index.types';
// import { EntityType } from '@/contexts/DrawerNavigationContext';
// import { useDrawerNavigation } from '@/contexts/DrawerNavigationContext';

// import { AddUser } from '@/containers/Schools/AddUser';
// import { AddBoardMember } from '@/containers/Schools/AddBoardMember';
// import { AddSchool } from '@/containers/Schools/AddSchool';
// import { ManageCustomFields } from '@containers/EntitySideDrawer/ManageCustomFields';
// import { AddField } from '@containers/EntitySideDrawer/AddField';
// import { EditSchool } from '@containers/EntitySideDrawer/EditSchool';
// import { AssignReports } from '@containers/EntitySideDrawer/AssignReports';
// import {
//   EntityInfoDrawer as EntityInfoDrawerComponent,
//   DrawerNavigationFunctions,
//   UploadingFile,
// } from '@/components/Schools/EntityInfoDrawer';

// import axios from '@/api/axiosInstance';
// import useFileUpload from '@/hooks/useFileUpload';
// import { validateField } from '@/utils/validation';

// import {
//   EntityDocument,
//   setLoadingForParent,
//   setAllDocumentsForParent,
//   addDocumentToParent,
//   updateDocumentInParent,
//   deleteDocumentFromParent,
//   setLoadingBoardDocs,
//   addBoardDocumentToParent,
//   updateBoardDocumentInParent,
//   deleteBoardDocumentFromParent,
// } from '@/store/slices/entityDocumentsSlice';

// interface EntityInfoDrawerProps extends DrawerNavigationFunctions {
//   entityId: string;
//   entityType: EntityType;
//   onClose: () => void;
// }

// interface AssignedReportApiResponseItem {
//   id: string;
//   status: string;
//   report: {
//     id: string;
//     name: string;
//   } | null;
// }

// export const EntityInfoDrawer: React.FC<EntityInfoDrawerProps> = ({
//   entityId,
//   entityType,
//   onClose,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     currentView,
//     pushView,
//     popView,
//     tabOverrideForParent,
//     clearTabOverride,
//   } = useDrawerNavigation();
//   const navigate = useNavigate();
//   const { uploadFile } = useFileUpload();

//   // --- State Variables ---
//   const [currentTab, setCurrentTab] = useState('details');
//   const [isAddingSchool, setIsAddingSchool] = useState(false);
//   const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<School[]>([]);
//   const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
//   const [isAddUserOpen, setIsAddUserOpen] = useState(false);
//   const [isAddBoardMemberOpen, setIsAddBoardMemberOpen] = useState(false);
//   const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
//   const [isManageCustomFieldsOpen, setIsManageCustomFieldsOpen] =
//     useState(false);
//   const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
//   const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
//   const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
//   const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
//   const [targetUploadYear, setTargetUploadYear] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [editingExpiresDocIdLocal, setEditingExpiresDocIdLocal] = useState<
//     string | null
//   >(null);
//   const [isAssignReportsDialogOpen, setIsAssignReportsDialogOpen] =
//     useState(false);
//   const [isAddingMeetingDate, setIsAddingMeetingDate] = useState(false);
//   const [newMeetingDate, setNewMeetingDate] = useState('');
//   const [editingMeetingDate, setEditingMeetingDate] = useState<string | null>(
//     null,
//   );
//   const [boardUploadingFiles, setBoardUploadingFiles] = useState<
//     UploadingFile[]
//   >([]);
//   const boardFileInputRef = useRef<HTMLInputElement>(null);
//   const boardUploadIntervalRefs = useRef<Record<string, NodeJS.Timeout>>({});
//   const [editingBoardExpiresDocId, setEditingBoardExpiresDocId] = useState<
//     string | null
//   >(null);
//   const [isAddingUser, setIsAddingUser] = useState(false);
//   const [userSearchQuery, setUserSearchQuery] = useState('');
//   const [userSearchResults, setUserSearchResults] = useState<SchoolUser[]>([]);
//   const [initialUserSuggestions, setInitialUserSuggestions] = useState<
//     SchoolUser[]
//   >([]);
//   const [initialUserNames, setInitialUserNames] = useState<{
//     firstName: string;
//     lastName: string;
//   } | null>(null);
//   const [isAddingBoardMember, setIsAddingBoardMember] = useState(false);
//   const [boardMemberSearchQuery, setBoardMemberSearchQuery] = useState('');
//   const [boardMemberSearchResults, setBoardMemberSearchResults] = useState<
//     SchoolUser[]
//   >([]);
//   const [initialBoardMemberNames, setInitialBoardMemberNames] = useState<{
//     firstName: string;
//     lastName: string;
//   } | null>(null);
//   const [initialBoardMemberSuggestions, setInitialBoardMemberSuggestions] =
//     useState<SchoolUser[]>([]);
//   const assignedReportsFromStore = useSelector(
//     (state: RootState) => state.assignedReports.reportsBySchool[entityId] || [],
//   );

//   // Effect to handle tab override from navigation context
//   useEffect(() => {
//     console.log(
//       '[EntityInfoDrawerContainer] useEffect for tab override triggered.',
//     );
//     console.log(
//       '[EntityInfoDrawerContainer] tabOverrideForParent:',
//       tabOverrideForParent,
//     );
//     console.log(
//       '[EntityInfoDrawerContainer] This drawer instance entityId (prop):',
//       entityId,
//     );
//     console.log(
//       '[EntityInfoDrawerContainer] currentView from context:',
//       currentView,
//     );

//     if (
//       tabOverrideForParent &&
//       entityId === tabOverrideForParent.entityId &&
//       (entityType === 'School' || entityType === 'Network')
//     ) {
//       console.log(
//         '[EntityInfoDrawerContainer] Conditions MET. Setting tab to:',
//         tabOverrideForParent.tabId,
//       );
//       setCurrentTab(tabOverrideForParent.tabId);
//       clearTabOverride();
//     } else {
//       console.log(
//         '[EntityInfoDrawerContainer] Conditions NOT MET or tabOverrideForParent is null.',
//       );
//     }
//   }, [
//     tabOverrideForParent,
//     entityId,
//     entityType,
//     currentView,
//     clearTabOverride,
//     setCurrentTab,
//   ]);

//   useEffect(() => {
//     console.log('[EntityInfoDrawerContainer] MOUNTED with entityId:', entityId);
//     return () => {
//       console.log(
//         '[EntityInfoDrawerContainer] UNMOUNTING with entityId:',
//         entityId,
//       );
//     };
//   }, [entityId]); // Log when this specific instance mounts or its entityId prop changes

//   // --- Redux Selectors ---
//   const allSchools = useSelector((state: RootState) => state.schools.schools);
//   const allUsers = useSelector(
//     (state: RootState) => state.schoolUsers.schoolUsers || [],
//   );
//   const allActivityLogs = useSelector(
//     (state: RootState) => state.activityLogs.logs,
//   );
//   const loadingActivity = useSelector(
//     (state: RootState) => state.activityLogs.loading,
//   );
//   const allReports: ReportResponse[] = useSelector(
//     (state: RootState) => state.reports.reports,
//   );

//   const schoolUsersLoading = useSelector(
//     (state: RootState) => state.schoolUsers.loading,
//   );

//   const entity = useMemo(
//     () => allSchools.find((s) => s.id === entityId) as School | Network | null,
//     [allSchools, entityId],
//   );

//   // Select correct custom field definitions based on entityType prop
//   const customFieldDefinitions = useSelector((state: RootState) => {
//     if (!entityType) return [];
//     const definitionKey: CustomFieldEntityType | null =
//       entityType === 'School'
//         ? CustomFieldEntityType.SchoolEntity
//         : entityType === 'Network'
//           ? CustomFieldEntityType.NetworkEntity
//           : null;
//     return definitionKey
//       ? state.customFieldDefinitions[definitionKey] || []
//       : [];
//   });

//   // Select loading state for custom fields
//   const customFieldsLoading = useSelector(
//     (state: RootState) => state.customFieldDefinitions.loading === 'pending',
//   );

//   const schoolUsers = allUsers;
//   const activityLogs = allActivityLogs[entityId] || [];

//   const documentsByParentId = useSelector(
//     (state: RootState) => state.entityDocuments.documentsByParentId,
//   );
//   const loadingByParentId = useSelector(
//     (state: RootState) => state.entityDocuments.loadingByParentId,
//   );

//   const allDocumentsForParent = useMemo(() => {
//     const docsByYear = documentsByParentId[entityId] || {};
//     return Object.values(docsByYear).flat();
//   }, [documentsByParentId, entityId]);

//   const isLoadingDocs = loadingByParentId[entityId] || false;

//   const teamMembers = schoolUsers.filter(
//     (user) =>
//       user.role !== 'Board_Member' &&
//       user.schools &&
//       user.schools.includes(entityId),
//   );
//   const boardMembers = schoolUsers.filter(
//     (user) =>
//       user.role === 'Board_Member' &&
//       user.schools &&
//       user.schools.includes(entityId),
//   );

//   const networkSchools =
//     entity?.type === 'Network'
//       ? (((entity as Network).schools as School[] | undefined | null) ?? [])
//       : [];

//   const parentEntityFromContext = currentView?.parentEntityId
//     ? allSchools.find((s) => s.id === currentView.parentEntityId)
//     : null;
//   const parentEntityName = parentEntityFromContext?.name || null;
//   const parentEntityTypeFromContext = currentView?.parentEntityType;

//   const associatedSchoolIds = useMemo(() => {
//     if (entity?.type === 'Network') {
//       const networkEntity = entity as Network;
//       const schoolsArray = Array.isArray(networkEntity.schools)
//         ? networkEntity.schools
//         : [];
//       return new Set(
//         schoolsArray
//           .map((s) => (typeof s === 'string' ? s : s?.id))
//           .filter(Boolean),
//       );
//     }
//     return new Set<string>();
//   }, [entity]);

//   // Selectors for Board Documents
//   const boardDocumentsByParentId = useSelector(
//     (state: RootState) => state.entityDocuments.boardDocumentsByParentId,
//   );
//   const boardDocumentsFromState = useMemo(
//     () => boardDocumentsByParentId[entityId] || [],
//     [boardDocumentsByParentId, entityId],
//   );
//   const isLoadingBoardDocs = useSelector(
//     (state: RootState) =>
//       state.entityDocuments.loadingBoardDocsByParentId[entityId] || false,
//   );

//   console.log(
//     '[EntityInfoDrawerContainer] RENDERING with currentTab:',
//     currentTab,
//     'for entityId:',
//     entityId,
//   );

//   // --- Event Handlers & Logic ---
//   const handleDrawerClose = () => {
//     if (
//       isAddUserOpen ||
//       isAddBoardMemberOpen ||
//       isAddSchoolOpen ||
//       isManageCustomFieldsOpen ||
//       isAddFieldOpen ||
//       isEditSchoolOpen ||
//       isAssignReportsDialogOpen
//     ) {
//       return;
//     }
//     onClose();
//   };

//   const handleBack = () => {
//     popView();
//   };

//   const handleTabChange = (tabId: string) => {
//     setCurrentTab(tabId);
//   };

//   const searchSchools = useCallback(
//     (query: string) => {
//       if (!query.trim()) {
//         setSearchResults([]);
//         return;
//       }
//       const filteredSchools = allSchools.filter(
//         (s): s is School =>
//           s.type !== 'Network' &&
//           !associatedSchoolIds.has(s.id) &&
//           s.name.toLowerCase().includes(query.toLowerCase()),
//       );
//       setSearchResults(filteredSchools);
//     },
//     [allSchools, associatedSchoolIds],
//   );

//   const handleSchoolSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const query = e.target.value;
//     setSchoolSearchQuery(query);
//     searchSchools(query);
//   };

//   const handleSchoolSelect = (school: School) => {
//     setSelectedSchool(school);
//     setSearchResults([]);
//     setSchoolSearchQuery(school.name);
//   };

//   const handleConfirmAddSchool = async () => {
//     if (!selectedSchool || !entity || entity.type !== 'Network') return;
//     const networkId = entity.id;
//     const schoolId = selectedSchool.id;
//     dispatch(setLoading(true));
//     try {
//       const response = await axios.patch(`/schools/${schoolId}/`, {
//         network: networkId,
//       });
//       const updatedSchoolData = response.data as School;
//       if (!updatedSchoolData || !updatedSchoolData.network) {
//         throw new Error('Failed to confirm school update from server.');
//       }
//       const schoolExists = allSchools.some(
//         (s) => s.id === updatedSchoolData.id,
//       );
//       if (!schoolExists) {
//         dispatch(addSchool(updatedSchoolData));
//       }
//       dispatch(updateSchool({ id: schoolId, updates: updatedSchoolData }));
//       dispatch(
//         addSchoolToNetwork({ networkId: networkId, school: updatedSchoolData }),
//       );
//       setIsAddingSchool(false);
//       setSelectedSchool(null);
//       setSchoolSearchQuery('');
//     } catch (error: unknown) {
//       console.error('Error adding school to network:', error);
//       let errorMessage = 'Failed to add school to network.';
//       if (isAxiosError(error) && error.response) {
//         const responseData = error.response.data;
//         errorMessage =
//           responseData?.detail ||
//           (typeof responseData === 'string'
//             ? responseData
//             : JSON.stringify(responseData)) ||
//           error.message;
//       } else if (error instanceof Error) {
//         errorMessage = error.message;
//       }
//       console.error('User-facing error message:', errorMessage);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleCancelAddSchool = () => {
//     setIsAddingSchool(false);
//     setSelectedSchool(null);
//     setSchoolSearchQuery('');
//     setSearchResults([]);
//   };

//   const handleTriggerAddSchoolDialog = () => {
//     setIsAddSchoolOpen(true);
//     setIsAddingSchool(false);
//     setSearchResults([]);
//   };

//   const handleFolderToggle = (folderName: string) => {
//     setExpandedFolders((prev) =>
//       prev.includes(folderName)
//         ? prev.filter((f) => f !== folderName)
//         : [...prev, folderName],
//     );
//   };

//   const handleAddDocumentsClick = (year: string) => {
//     setTargetUploadYear(year);
//     fileInputRef.current?.click();
//   };

//   const handleUploadingFileNameChange = (tempId: string, newName: string) => {
//     setUploadingFiles((prev) =>
//       prev.map((f) => (f.tempId === tempId ? { ...f, name: newName } : f)),
//     );
//   };

//   const handleCancelUpload = (tempId: string) => {
//     console.log(`Cancelling upload for tempId: ${tempId}`);
//     setUploadingFiles((prev) => prev.filter((f) => f.tempId !== tempId));
//   };

//   const handleFileSelect = async (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const files = event.target.files;
//     if (!files || !targetUploadYear) return;
//     const yearString = targetUploadYear;

//     let yearParam: string;
//     if (yearString === 'School Documents') {
//       yearParam = yearString;
//     } else if (yearString.includes(' - ')) {
//       const yearParts = yearString.split(' - ');
//       if (yearParts[0] && /^[0-9]{4}$/.test(yearParts[0])) {
//         yearParam = yearParts[0];
//       } else {
//         console.error('Invalid year format in section key:', yearString);
//         setTargetUploadYear(null);
//         return;
//       }
//     } else {
//       if (/^[0-9]{4}$/.test(yearString)) {
//         yearParam = yearString;
//       } else {
//         console.error('Unexpected year format:', yearString);
//         yearParam = 'Unknown';
//       }
//     }

//     const newUploads: UploadingFile[] = Array.from(files).map((file, i) => ({
//       tempId: `${Date.now()}-${i}`,
//       file,
//       name: file.name.replace(/\.[^/.]+$/, ''),
//       year: yearString,
//       progress: 0,
//       status: 'uploading',
//       expires: null,
//     }));
//     setUploadingFiles((prev) => [...prev, ...newUploads]);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//     setTargetUploadYear(null);
//     for (const upload of newUploads) {
//       try {
//         // S3 Upload Skipped
//         // const handleProgress = (percentage: number) => {
//         //   setUploadingFiles((prev) =>
//         //     prev.map((f) =>
//         //       f.tempId === upload.tempId ? { ...f, progress: percentage } : f,
//         //     ),
//         //   );
//         // };
//         // const uploadedS3Key = await uploadFile(upload.file, handleProgress);
//         // if (!uploadedS3Key) {
//         //   throw new Error('S3 Upload failed, received empty key.');
//         // }
//         const placeholderS3Key = `s3_upload_skipped/${upload.file.name}`;
//         setUploadingFiles((prev) =>
//           prev.map((f) =>
//             f.tempId === upload.tempId ? { ...f, progress: 50 } : f,
//           ),
//         ); // Simulate some progress

//         const confirmationResponse = await axios.post<EntityDocument>(
//           '/documents/',
//           {
//             name: upload.name,
//             file_url: placeholderS3Key, // Using placeholder
//             year: yearParam,
//             type: upload.file.type,
//             parent_type: 'school',
//             parent_id: entityId,
//           },
//         );
//         setUploadingFiles((prev) =>
//           prev.map((f) =>
//             f.tempId === upload.tempId
//               ? { ...f, progress: 100, status: 'complete' }
//               : f,
//           ),
//         );
//         dispatch(
//           addDocumentToParent({
//             parentId: entityId,
//             document: confirmationResponse.data,
//           }),
//         );
//       } catch (error) {
//         console.error(
//           `Failed to process upload for ${upload.file.name}:`,
//           error,
//         );
//         setUploadingFiles((prev) =>
//           prev.map((f) =>
//             f.tempId === upload.tempId
//               ? { ...f, status: 'error', progress: 0 }
//               : f,
//           ),
//         );
//       }
//     }
//   };

//   const handleDocumentNameSave = async (docId: string, newName: string) => {
//     dispatch(setLoadingForParent({ parentId: entityId, isLoading: true }));
//     try {
//       const originalDoc = allDocumentsForParent.find((doc) => doc.id === docId);
//       const originalYearKey = originalDoc?.year || 'Unknown';

//       await axios.put(`/documents/${docId}/`, { name: newName });
//       dispatch(
//         updateDocumentInParent({
//           parentId: entityId,
//           year: originalYearKey,
//           documentId: docId,
//           updates: { name: newName },
//         }),
//       );
//     } catch (error) {
//       console.error(`Error updating document name for ${docId}:`, error);
//     } finally {
//       dispatch(setLoadingForParent({ parentId: entityId, isLoading: false }));
//     }
//   };

//   const handleExpiresDateChange = async (docId: string, dateValue: string) => {
//     const expires = dateValue
//       ? new Date(dateValue).toISOString().split('T')[0]
//       : null;
//     dispatch(setLoadingForParent({ parentId: entityId, isLoading: true }));
//     try {
//       const originalDoc = allDocumentsForParent.find((doc) => doc.id === docId);
//       const originalYearKey = originalDoc?.year || 'Unknown';

//       await axios.put(`/documents/${docId}/`, { expiration_date: expires });
//       dispatch(
//         updateDocumentInParent({
//           parentId: entityId,
//           year: originalYearKey,
//           documentId: docId,
//           updates: { expiration_date: expires },
//         }),
//       );
//       setEditingExpiresDocIdLocal(null);
//     } catch (error) {
//       console.error(`Error updating document expiration for ${docId}:`, error);
//       setEditingExpiresDocIdLocal(null);
//     } finally {
//       dispatch(setLoadingForParent({ parentId: entityId, isLoading: false }));
//     }
//   };

//   const handleSaveNewMeetingDate = async (dateToAddValue?: string) => {
//     const dateToSave = dateToAddValue || newMeetingDate;

//     console.log('handleSaveNewMeetingDate triggered');
//     console.log('Values:', { dateToSave, entity });

//     if (!dateToSave || !entity) {
//       console.log('Exiting early:', { dateToSave, entityExists: !!entity });
//       setIsAddingMeetingDate(false);
//       setNewMeetingDate('');
//       return;
//     }

//     const entityIdForAPI = entity.id;

//     try {
//       console.log('Attempting to parse date:', dateToSave);
//       const dateObj = new Date(dateToSave + 'T00:00:00');
//       if (isNaN(dateObj.getTime())) {
//         console.error('Invalid date format provided:', dateToSave);
//         setIsAddingMeetingDate(false);
//         setNewMeetingDate('');
//         return;
//       }
//       const formattedDate = dateObj.toISOString().split('T')[0];

//       const existingMeetings =
//         (entity as School | Network).board_meetings || [];

//       if (existingMeetings.includes(formattedDate)) {
//         console.warn('Meeting date already exists:', formattedDate);
//         setNewMeetingDate('');
//         setIsAddingMeetingDate(false);
//         return;
//       }

//       const updatedMeetings = [...existingMeetings, formattedDate].sort();

//       dispatch(setLoading(true));

//       const endpoint = `/schools/${entityIdForAPI}/`;
//       const payload = { board_meetings: updatedMeetings };
//       console.log(`Calling API PUT ${endpoint} with payload:`, payload);
//       await axios.put(endpoint, payload);
//       console.log('API call successful for new meeting date');

//       const updatePayload = {
//         id: entityIdForAPI,
//         updates: { board_meetings: updatedMeetings },
//       };
//       if (entityType === 'School' || entityType === 'Network') {
//         console.log(
//           `[Dispatching updateSchool for ${entityType}]`,
//           updatePayload,
//         );
//         dispatch(updateSchool(updatePayload));
//       } else {
//         console.error(
//           `[handleSaveNewMeetingDate] Unexpected entityType prop: ${entityType}`,
//         );
//       }

//       setNewMeetingDate('');
//       setIsAddingMeetingDate(false);
//     } catch (error) {
//       console.error('Error in handleSaveNewMeetingDate:', error);
//       setIsAddingMeetingDate(false);
//       setNewMeetingDate('');
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleCancelAddMeetingDate = () => {
//     setNewMeetingDate('');
//     setIsAddingMeetingDate(false);
//   };

//   const handleSetEditingMeetingDate = (date: string | null) => {
//     setEditingMeetingDate(date);
//     setIsAddingMeetingDate(false);
//   };

//   const handleCancelEditMeetingDate = () => {
//     setEditingMeetingDate(null);
//   };

//   const handleUpdateMeetingDate = async (
//     oldDate: string,
//     newDateValue: string,
//   ) => {
//     if (!newDateValue || !entity || !oldDate) {
//       setEditingMeetingDate(null);
//       return;
//     }

//     const entityIdForAPI = entity.id;
//     try {
//       const dateObj = new Date(newDateValue + 'T00:00:00');
//       if (isNaN(dateObj.getTime())) {
//         console.error('Invalid date format for update:', newDateValue);
//         setEditingMeetingDate(null);
//         return;
//       }
//       const formattedNewDate = dateObj.toISOString().split('T')[0];

//       const existingMeetings =
//         (entity as School | Network).board_meetings || [];

//       if (
//         formattedNewDate !== oldDate &&
//         existingMeetings.includes(formattedNewDate)
//       ) {
//         console.warn('Updated meeting date already exists:', formattedNewDate);
//         setEditingMeetingDate(null);
//         return;
//       }

//       const updatedMeetings = existingMeetings
//         .map((date) => (date === oldDate ? formattedNewDate : date))
//         .sort();

//       dispatch(setLoading(true));
//       const endpoint = `/schools/${entityIdForAPI}/`;
//       const payload = { board_meetings: updatedMeetings };
//       await axios.put(endpoint, payload);
//       console.log('API call successful for updating meeting date');

//       const updatePayload = {
//         id: entityIdForAPI,
//         updates: { board_meetings: updatedMeetings },
//       };
//       if (entityType === 'School' || entityType === 'Network') {
//         dispatch(updateSchool(updatePayload));
//       }

//       setEditingMeetingDate(null);
//     } catch (error) {
//       console.error('Error in handleUpdateMeetingDate:', error);
//       setEditingMeetingDate(null);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleDeleteDocument = async (docId: string, s3FileKey: string) => {
//     console.log(
//       `Attempting to delete document: ID=${docId}, S3Key=${s3FileKey}`,
//     );
//     try {
//       console.log(`Deleting document ${docId} from backend...`);
//       await axios.delete(`/documents/${docId}/`);
//       console.log(`Backend delete successful for ${docId}`);
//       if (s3FileKey) {
//         console.log(`Removing file key ${s3FileKey} from S3...`);
//         try {
//           await axios.delete(
//             `/files/remove_file?file_name=${encodeURIComponent(s3FileKey)}/`,
//           );
//           console.log(`S3 removal successful for key ${s3FileKey}`);
//         } catch (s3Error) {
//           console.error(
//             `Failed to remove file key from S3: ${s3FileKey}`,
//             s3Error,
//           );
//         }
//       }
//       let yearToDelete: string | undefined;
//       const parentDocs = documentsByParentId[entityId];
//       if (parentDocs) {
//         for (const year in parentDocs) {
//           if (parentDocs[year].some((d) => d.id === docId)) {
//             yearToDelete = year;
//             break;
//           }
//         }
//       }
//       if (yearToDelete) {
//         dispatch(
//           deleteDocumentFromParent({
//             parentId: entityId,
//             year: yearToDelete,
//             documentId: docId,
//           }),
//         );
//       } else {
//         console.warn(
//           `Could not find year for document ${docId} to remove from Redux state.`,
//         );
//         fetchAllDocumentsForParent();
//       }
//     } catch (error) {
//       console.error(`Error deleting document ${docId}:`, error);
//     }
//   };

//   const handleAddBoardDocumentsClick = () => {
//     boardFileInputRef.current?.click();
//   };

//   const handleDeleteBoardDocument = async (
//     docId: string,
//     s3FileKey: string,
//   ) => {
//     console.log(
//       `Attempting to delete BOARD document: ID=${docId}, S3Key=${s3FileKey}`,
//     );
//     dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: true }));
//     try {
//       console.log(`Deleting board document ${docId} from backend...`);
//       await axios.delete(`/documents/${docId}/`);
//       console.log(`Backend delete successful for ${docId}`);

//       if (s3FileKey) {
//         console.log(`Removing file key ${s3FileKey} from S3...`);
//         try {
//           await axios.delete(
//             `/files/remove_file?file_name=${encodeURIComponent(s3FileKey)}/`,
//           );
//           console.log(`S3 removal successful for key ${s3FileKey}`);
//         } catch (s3Error) {
//           console.error(
//             `Failed to remove file key from S3: ${s3FileKey}`,
//             s3Error,
//           );
//         }
//       }

//       dispatch(
//         deleteBoardDocumentFromParent({
//           parentId: entityId,
//           documentId: docId,
//         }),
//       );
//       console.log(`Board document ${docId} removed from Redux state.`);
//     } catch (error) {
//       console.error(`Error deleting board document ${docId}:`, error);
//     } finally {
//       dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: false }));
//     }
//   };

//   const handleCancelBoardDocUpload = (tempId: string) => {
//     if (boardUploadIntervalRefs.current[tempId]) {
//       clearInterval(boardUploadIntervalRefs.current[tempId]);
//       delete boardUploadIntervalRefs.current[tempId];
//     }
//     setBoardUploadingFiles((prev) => prev.filter((f) => f.tempId !== tempId));
//   };

//   const handleBoardDocFileSelect = async (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const files = event.target.files;
//     if (!files) return;

//     // Prepare UI state for new uploads
//     const newUploads: UploadingFile[] = Array.from(files).map((file, i) => ({
//       tempId: `board-${Date.now()}-${i}`,
//       file,
//       name: file.name.replace(/\.[^/.]+$/, ''), // Initial name from file
//       year: 'Board Documents', // Keep for UI grouping if needed, API won't use it
//       progress: 0,
//       status: 'uploading',
//       expires: null, // Expiration date TBD
//     }));
//     setBoardUploadingFiles((prev) => [...prev, ...newUploads]);

//     // Clear file input
//     if (boardFileInputRef.current) {
//       boardFileInputRef.current.value = '';
//     }

//     // Process each file: S3 upload -> POST to /documents/
//     for (const upload of newUploads) {
//       try {
//         // 1. Upload to S3 - SKIPPED AS PER USER REQUEST
//         // const handleProgress = (percentage: number) => {
//         //   setBoardUploadingFiles((prev) =>
//         //     prev.map((f) =>
//         //       f.tempId === upload.tempId ? { ...f, progress: percentage } : f,
//         //     ),
//         //   );
//         // };
//         // const uploadedS3Key = await uploadFile(upload.file, handleProgress);
//         // if (!uploadedS3Key) {
//         //   throw new Error('S3 Upload failed, received empty key.');
//         // }
//         const placeholderS3Key = `s3_upload_skipped/${upload.file.name}`;
//         setBoardUploadingFiles((prev) =>
//           prev.map((f) =>
//             f.tempId === upload.tempId ? { ...f, progress: 50 } : f,
//           ),
//         ); // Simulate some progress

//         // 2. POST to backend API
//         const payload = {
//           name: upload.name,
//           file_url: placeholderS3Key, // Using placeholder
//           type: upload.file.type,
//           parent_type: 'board',
//           parent_id: entityId,
//         };
//         console.log('Posting board document (S3 upload skipped):', payload);
//         const confirmationResponse = await axios.post<EntityDocument>(
//           '/documents/',
//           payload,
//         );
//         setBoardUploadingFiles((prev) =>
//           prev.map((f) =>
//             f.tempId === upload.tempId
//               ? { ...f, progress: 100, status: 'complete' }
//               : f,
//           ),
//         );

//         // 3. Update Redux state
//         dispatch(
//           addBoardDocumentToParent({
//             parentId: entityId,
//             document: confirmationResponse.data,
//           }),
//         );

//         // 4. Remove from uploading UI state
//         setBoardUploadingFiles((prev) =>
//           prev.filter((f) => f.tempId !== upload.tempId),
//         );
//       } catch (error) {
//         console.error(
//           `Failed to process board document upload for ${upload.file.name}:`,
//           error,
//         );
//         // Update UI state to show error
//         setBoardUploadingFiles((prev) =>
//           prev.map((f) =>
//             f.tempId === upload.tempId
//               ? { ...f, status: 'error', progress: 0 }
//               : f,
//           ),
//         );
//       }
//     }
//   };

//   const handleBoardDocNameSave = async (
//     docId: string,
//     newName: string | File,
//   ) => {
//     if (newName instanceof File) {
//       // This case seems unlikely for a document name save. Log warning?
//       console.warn('Attempted to save a File object as a board document name.');
//       return;
//     }
//     dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: true }));
//     try {
//       await axios.put(`/documents/${docId}/`, { name: newName });
//       dispatch(
//         updateBoardDocumentInParent({
//           parentId: entityId,
//           documentId: docId,
//           updates: { name: newName },
//         }),
//       );
//     } catch (error) {
//       console.error(`Error updating board document name for ${docId}:`, error);
//     } finally {
//       dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: false }));
//     }
//   };

//   const handleBoardDocExpiresChange = async (
//     docId: string,
//     dateValue: string,
//   ) => {
//     const expires = dateValue
//       ? new Date(dateValue).toISOString().split('T')[0]
//       : null;
//     dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: true }));
//     try {
//       await axios.put(`/documents/${docId}/`, { expiration_date: expires });
//       dispatch(
//         updateBoardDocumentInParent({
//           parentId: entityId,
//           documentId: docId,
//           updates: { expiration_date: expires },
//         }),
//       );
//       setEditingBoardExpiresDocId(null);
//     } catch (error) {
//       console.error(
//         `Error updating board document expiration for ${docId}:`,
//         error,
//       );
//       setEditingBoardExpiresDocId(null);
//     } finally {
//       dispatch(setLoadingBoardDocs({ parentId: entityId, isLoading: false }));
//     }
//   };

//   const handleToggleAddUserInlineSearch = () => {
//     if (!entityId) return;

//     // Get all users who are not board members and not already team members
//     const assignedUserIds = new Set(teamMembers.map((tm) => tm.id));
//     const suggestions = schoolUsers
//       .filter(
//         (user) => !assignedUserIds.has(user.id) && user.role !== 'Board_Member',
//       )
//       .sort((a, b) => {
//         const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
//         const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
//         return nameA.localeCompare(nameB);
//       })
//       .slice(0, 5); // Show top 5 suggestions

//     setInitialUserSuggestions(suggestions);
//     setIsAddingUser(true);
//   };

//   const handleAddUserClick = () => {
//     handleToggleAddUserInlineSearch();
//   };

//   const searchUsers = useCallback(
//     (query: string) => {
//       if (!query.trim()) {
//         setUserSearchResults([]);
//         return;
//       }
//       const filteredUsers = schoolUsers.filter(
//         (user) =>
//           !user.schools.includes(entityId) &&
//           user.role !== 'Board_Member' &&
//           (`${user.first_name} ${user.last_name}`
//             .toLowerCase()
//             .includes(query.toLowerCase()) ||
//             user.email.toLowerCase().includes(query.toLowerCase())),
//       );
//       setUserSearchResults(filteredUsers);
//     },
//     [schoolUsers, entityId],
//   );

//   const handleUserSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const query = e.target.value;
//     setUserSearchQuery(query);
//     searchUsers(query);
//   };

//   const handleCancelAddUser = () => {
//     setIsAddingUser(false);
//     setUserSearchQuery('');
//     setUserSearchResults([]);
//     setInitialUserSuggestions([]);
//   };

//   const handleUserSelect = async (user: SchoolUser) => {
//     if (!user || !entityId) {
//       console.error('Cannot add user: User data or entityId missing.');
//       return;
//     }
//     // Check if user is already associated (important to prevent errors or duplicate operations)
//     // This check should ideally use the most up-to-date teamMembers list or allUsers.
//     // For simplicity, assuming user.schools is sufficiently up-to-date for this check.
//     if (user.schools?.includes(entityId) && user.role !== 'Board_Member') {
//       console.warn('User is already a team member for this entity.');
//       // Optionally, still close the search and reset
//       setUserSearchQuery('');
//       setUserSearchResults([]);
//       setIsAddingUser(false); // Close inline search on selection/action
//       return;
//     }

//     const updatedSchoolIds = [...(user.schools || []), entityId];
//     const updatePayload = { schools: updatedSchoolIds };
//     // Consider dispatching a loading state for the specific user assignment if needed
//     // dispatch(setLoading(true)); // This is a general loading, might need a more specific one

//     try {
//       console.log(
//         `Assigning user ${user.id} to entity ${entityId}. Payload:`,
//         updatePayload,
//       );
//       const response = await axios.put(
//         `/users/${user.id}/`, // Ensure this is the correct endpoint for *assigning* a user (might involve role too)
//         updatePayload,
//       );
//       console.log('User assignment successful:', response.data);
//       dispatch(
//         updateUser({ id: user.id, updates: response.data as SchoolUser }),
//       );

//       // Reset UI
//       setUserSearchQuery('');
//       setUserSearchResults([]);
//       setIsAddingUser(false); // Close inline search after successful assignment
//     } catch (error) {
//       console.error(
//         `Error assigning user ${user.id} to entity ${entityId}:`,
//         error,
//       );
//       // TODO: Add user-facing error feedback
//       // Potentially leave the search open on error or provide specific feedback
//     } finally {
//       // dispatch(setLoading(false)); // Match any specific loading state dispatched
//     }
//   };

//   const handleTriggerAddUserDialog = (query: string) => {
//     const names = query.split(' ');
//     const firstName = names[0] || '';
//     const lastName = names.slice(1).join(' ') || '';
//     setInitialUserNames({ firstName, lastName });
//     setIsAddUserOpen(true);
//     setIsAddingUser(false);
//     setUserSearchResults([]);
//   };

//   const allBoardMembersFromStore =
//     useSelector((state: RootState) => state.schoolUsers.allBoardMembers) || [];

//   // Fetch all board members when the drawer is opened for an entity
//   useEffect(() => {
//     if (entityId) {
//       dispatch(fetchAllBoardMembers());
//     }
//   }, [entityId, dispatch]);

//   // This generates the list of board members for the current school/entity
//   const handleToggleAddBoardMemberInlineSearch = () => {
//     if (!entityId) return;

//     // Use allBoardMembersFromStore for suggestions, filtering out already assigned members
//     const assignedBoardMemberIds = new Set(
//       boardMembers.map((bm) => bm.id), // boardMembers are those ALREADY assigned to THIS school
//     );

//     const suggestions = allBoardMembersFromStore
//       .filter((bm) => !assignedBoardMemberIds.has(bm.id))
//       .map(
//         (bm): Partial<SchoolUser> => ({
//           id: bm.id,
//           first_name: bm.first_name,
//           last_name: bm.last_name,
//           role: 'Board_Member',
//           email: '',
//           schools: [],
//         }),
//       );

//     setInitialBoardMemberSuggestions(suggestions as SchoolUser[]);
//     setIsAddingBoardMember(!isAddingBoardMember); // Toggle the inline search UI
//     // Clear previous search state when toggling
//     if (!isAddingBoardMember) {
//       setBoardMemberSearchQuery('');
//       setBoardMemberSearchResults([]);
//     }
//   };

//   const handleBoardMemberSearchChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const query = e.target.value;
//     setBoardMemberSearchQuery(query);

//     if (!query.trim()) {
//       setBoardMemberSearchResults([]);
//       // When query is empty, show initial suggestions again if the inline search is active
//       if (isAddingBoardMember) {
//         setBoardMemberSearchResults(initialBoardMemberSuggestions);
//       }
//       return;
//     }

//     // Filter from allBoardMembersFromStore
//     const assignedBoardMemberIds = new Set(boardMembers.map((bm) => bm.id));
//     const results = allBoardMembersFromStore
//       .filter(
//         (bm) =>
//           !assignedBoardMemberIds.has(bm.id) &&
//           (bm.first_name.toLowerCase().includes(query.toLowerCase()) ||
//             bm.last_name.toLowerCase().includes(query.toLowerCase()) ||
//             `${bm.first_name} ${bm.last_name}`
//               .toLowerCase()
//               .includes(query.toLowerCase())),
//       )
//       .map(
//         (bm): Partial<SchoolUser> => ({
//           id: bm.id,
//           first_name: bm.first_name,
//           last_name: bm.last_name,
//           role: 'Board_Member',
//           email: '',
//           schools: [],
//         }),
//       );

//     setBoardMemberSearchResults(results as SchoolUser[]);
//   };

//   // Internal helper function to perform the assignment API call
//   const assignMember = useCallback(
//     async (memberIdToAdd: string) => {
//       if (!entityId) return;
//       const schoolIdToAdd = entityId;

//       setIsAddingBoardMember(false); // Close the search UI immediately

//       try {
//         const resultAction = await dispatch(
//           assignBoardMemberToSchoolAPI({
//             schoolId: schoolIdToAdd,
//             memberId: memberIdToAdd,
//           }),
//         );

//         if (assignBoardMemberToSchoolAPI.fulfilled.match(resultAction)) {
//           console.log(
//             `Successfully assigned board member ${memberIdToAdd} to school ${schoolIdToAdd}`,
//           );
//           dispatch(fetchBoardMembersForSchool(schoolIdToAdd));
//         } else {
//           console.error(
//             `Failed to assign board member ${memberIdToAdd} to school ${schoolIdToAdd}:`,
//             resultAction.payload,
//           );
//           // TODO: Show user-facing error message
//         }
//       } catch (error) {
//         console.error(
//           `Unexpected error assigning board member ${memberIdToAdd} to school ${schoolIdToAdd}:`,
//           error,
//         );
//         // TODO: Show user-facing error message
//       } finally {
//         // Reset search state after attempting assignment
//         setBoardMemberSearchQuery('');
//         setBoardMemberSearchResults([]);
//         setInitialBoardMemberSuggestions([]);
//       }
//     },
//     [dispatch, entityId],
//   ); // Dependencies for the callback

//   // Modified: Directly assign the member when selected from the list
//   const handleBoardMemberSelect = (user: SchoolUser) => {
//     console.log(`Board member selected, assigning: ${user.id}`);
//     assignMember(user.id); // Call the assignment logic directly
//     // No longer need to set selected state or search query
//     // setSelectedBoardMember(user);
//     // setBoardMemberSearchResults([]);
//     // setBoardMemberSearchQuery(`${user.first_name} ${user.last_name}`);
//   };

//   const handleCancelAddBoardMember = () => {
//     setIsAddingBoardMember(false); // Hide the inline search UI
//     setBoardMemberSearchQuery(''); // Clear search query
//     setBoardMemberSearchResults([]); // Clear search results
//     setInitialBoardMemberSuggestions([]); // Clear suggestions
//     setInitialBoardMemberNames(null); // Clear any pre-filled names for the dialog
//   };

//   const handleTriggerAddBoardMemberDialog = (query?: string) => {
//     if (query) {
//       const names = query.split(' ');
//       const firstName = names[0] || '';
//       const lastName = names.slice(1).join(' ') || '';
//       setInitialBoardMemberNames({ firstName, lastName });
//     } else {
//       setInitialBoardMemberNames(null);
//     }
//     setIsAddBoardMemberOpen(true);
//     setIsAddingBoardMember(false);
//     setBoardMemberSearchQuery('');
//     setBoardMemberSearchResults([]);
//     setInitialBoardMemberSuggestions([]);
//   };

//   const transformAssigned = (
//     apiArr: AssignedReportApiResponseItem[],
//   ): AssignedReport[] =>
//     apiArr.map((item: AssignedReportApiResponseItem) => ({
//       id: item.id,
//       reportId: item.report?.id || item.id,
//       name: item.report?.name || 'Unnamed report',
//       status: item.status === 'completed' ? 'Complete' : 'Pending',
//     }));

//   useEffect(() => {
//     const loadIfNeeded = async () => {
//       if (entityType !== 'School') return;
//       if (assignedReportsFromStore.length > 0) return;
//       try {
//         dispatch(setLoading(true));
//         const { data } = await axios.get(`/schools/${entityId}/reports/`);
//         const transformed = transformAssigned(data);
//         dispatch(setForSchool({ schoolId: entityId, reports: transformed }));
//       } catch (err) {
//         console.error('Error fetching assigned reports:', err);
//       } finally {
//         dispatch(setLoading(false));
//       }
//     };
//     loadIfNeeded();
//   }, [entityId, entityType, assignedReportsFromStore.length, dispatch]);

//   const handleAssignReportsSubmit = (reportIds: string[]) => {
//     const newAssignedList: AssignedReport[] = reportIds.map((id) => {
//       const r = allReports.find((rep) => rep.id === id);
//       return {
//         id: `temp-${id}`,
//         reportId: id,
//         name: r?.name || 'Unnamed report',
//         status: 'Pending',
//       };
//     });
//     dispatch(setForSchool({ schoolId: entityId, reports: newAssignedList }));
//   };

//   const handleOpenReport = (reportId: string) => {
//     navigate(`/reports/preview/${reportId}`);
//   };

//   const fetchAllDocumentsForParent = useCallback(async () => {
//     if (isLoadingDocs || documentsByParentId[entityId] !== undefined) {
//       return;
//     }
//     const parentType = entityType === 'Network' ? 'network' : 'school';
//     dispatch(setLoadingForParent({ parentId: entityId, isLoading: true }));
//     try {
//       console.log(`Fetching all documents for ${parentType} ${entityId}...`);
//       const { data } = await axios.get<EntityDocument[]>(
//         `/documents/?parent_type=${parentType}&parent_id=${entityId}`,
//       );
//       dispatch(
//         setAllDocumentsForParent({ parentId: entityId, documents: data || [] }),
//       );
//     } catch (error) {
//       console.error(
//         `Error fetching documents for ${parentType} ${entityId}:`,
//         error,
//       );
//       dispatch(setLoadingForParent({ parentId: entityId, isLoading: false }));
//     }
//   }, [entityId, entityType, dispatch, isLoadingDocs, documentsByParentId]);

//   useEffect(() => {
//     if (
//       entityId &&
//       entityType !== 'School User' &&
//       entityType !== 'Board Member'
//     ) {
//       fetchAllDocumentsForParent();
//     }
//   }, [entityId, entityType, fetchAllDocumentsForParent]);

//   // This useEffect is responsible for fetching board members on initial load/entity change
//   useEffect(() => {
//     if (entityId && (entityType === 'School' || entityType === 'Network')) {
//       // If we have a valid entityId and it's a School or Network...
//       console.log(
//         `[EntityInfoDrawer] useEffect triggered for entity ${entityId}. Dispatching fetchBoardMembersForSchool.`,
//       );
//       dispatch(fetchBoardMembersForSchool(entityId));
//     } else {
//       console.log(
//         `[EntityInfoDrawer] useEffect triggered BUT conditions not met (entityId: ${entityId}, entityType: ${entityType}). Skipping fetch.`,
//       );
//     }
//   }, [entityId, entityType, dispatch]); // Dependencies: Runs when these change

//   // Derive board documents from the fetched state
//   /* REMOVED - boardDocumentsData useMemo hook was incorrect
//   const boardDocumentsData = useMemo(() => {
//     // ... old incorrect logic ...
//   }, [documentsByParentId, entityId]);
//   */

//   // --- Custom Field File Upload Handler ---
//   const handleCustomFieldUpload = useCallback(
//     async (
//       file: File,
//       onProgress: (progress: number) => void,
//     ): Promise<string> => {
//       try {
//         const fileUrl = await uploadFile(file, onProgress);
//         if (!fileUrl) {
//           throw new Error('Upload returned empty URL');
//         }
//         return fileUrl;
//       } catch (error) {
//         console.error('Entity custom field file upload failed:', error);
//         throw new Error('File upload failed. Please try again.');
//       }
//     },
//     [uploadFile],
//   );

//   const handleCustomFieldSave = async (
//     fieldName: string,
//     newValue: string | File,
//   ) => {
//     if (!entity || !entity.id) return;

//     if (newValue instanceof File) {
//       console.error(
//         'handleCustomFieldSave received a File object directly. This should not happen.',
//       );
//       alert('An internal error occurred while saving the file field.');
//       return;
//     }

//     const finalValue = newValue;
//     const fieldDefinition = customFieldDefinitions.find(
//       (f) => f.Name === fieldName,
//     );

//     // --- Use validation utility ---
//     const validationError = validateField(
//       fieldName,
//       finalValue,
//       fieldDefinition?.Type,
//     );
//     if (validationError) {
//       alert(validationError); // Show validation error message
//       // TODO: Optionally revert the InlineEditField state or provide better feedback
//       return;
//     }

//     console.log(
//       `Saving entity custom field value: ${fieldName} = ${finalValue}`,
//     );

//     const updatedCustomFields = {
//       ...(entity.custom_fields || {}),
//       [fieldName]: finalValue,
//     };

//     const payload = { custom_fields: updatedCustomFields };
//     const endpoint =
//       entity.type === 'Network'
//         ? `/networks/${entity.id}/`
//         : `/schools/${entity.id}/`;

//     try {
//       console.log(`Putting ${endpoint} custom fields:`, payload);
//       const response = await axios.put(endpoint, payload);
//       console.log('Entity custom field update successful:', response.data);

//       dispatch(
//         updateSchool({
//           id: entity.id,
//           updates: { custom_fields: updatedCustomFields },
//         }),
//       );
//     } catch (error: unknown) {
//       console.error(
//         `Error updating custom field ${fieldName} for entity ${entity.id}:`,
//         error,
//       );
//       const message = error instanceof Error ? error.message : String(error);
//       console.error('User-facing error hint:', message);
//       // TODO: Add user-facing error feedback
//     }
//   };

//   const handleViewUser = (userId: string) => {
//     // Determine the user's type (School User vs Board Member)
//     // Check if the user is in the boardMembers list fetched for this entity
//     const isBoardMember = boardMembers.some((member) => member.id === userId);
//     const userEntityType: EntityType = isBoardMember
//       ? 'Board Member'
//       : 'School User';

//     // Push the UserInfoDrawer view
//     pushView(userId, userEntityType, entityId, entityType, {
//       returnToTabForOpener: 'board-center',
//     });
//   };

//   // Log state before rendering
//   console.log('[EntityInfoDrawer] PRE-RENDER LOG:', {
//     entityId,
//     entityType,
//     currentTab,
//     schoolUsersLoading,
//     boardMembersCount: boardMembers.length,
//     // For debugging, you might want to log the actual boardMembers array, but be mindful of console clutter
//     // boardMembers: boardMembers.map(bm => bm.id),
//     allUsersInStoreCount: allUsers.length,
//     isAddingBoardMember,
//   });

//   // --- Render Logic ---
//   return (
//     <>
//       <EntityInfoDrawerComponent
//         entity={entity}
//         entityType={entityType === 'Network' ? 'Network' : 'School'}
//         teamMembers={teamMembers}
//         boardMembers={boardMembers}
//         isLoadingBoardMembers={schoolUsersLoading}
//         networkSchools={networkSchools}
//         activityLogs={activityLogs}
//         allDocumentsForParent={allDocumentsForParent}
//         isLoadingDocs={isLoadingDocs}
//         assignedReports={assignedReportsFromStore}
//         meetingDates={entity?.board_meetings || []}
//         boardDocuments={boardDocumentsFromState}
//         isLoadingBoardDocs={isLoadingBoardDocs}
//         currentTab={currentTab}
//         isAddingSchool={isAddingSchool}
//         schoolSearchQuery={schoolSearchQuery}
//         schoolSearchResults={searchResults}
//         selectedSchool={selectedSchool}
//         isAddingUser={isAddingUser}
//         userSearchQuery={userSearchQuery}
//         userSearchResults={userSearchResults}
//         initialUserSuggestions={initialUserSuggestions}
//         isAddingBoardMember={isAddingBoardMember}
//         boardMemberSearchQuery={boardMemberSearchQuery}
//         boardMemberSearchResults={boardMemberSearchResults}
//         initialBoardMemberSuggestions={initialBoardMemberSuggestions}
//         expandedFolders={expandedFolders}
//         uploadingFiles={uploadingFiles}
//         editingExpiresDocId={editingExpiresDocIdLocal}
//         boardUploadingFiles={boardUploadingFiles}
//         editingBoardExpiresDocId={editingBoardExpiresDocId}
//         isAddingMeetingDate={isAddingMeetingDate}
//         newMeetingDate={newMeetingDate}
//         editingMeetingDate={editingMeetingDate}
//         loadingActivity={loadingActivity}
//         parentEntityName={parentEntityName}
//         parentEntityType={parentEntityTypeFromContext}
//         onClose={handleDrawerClose}
//         onBack={handleBack}
//         onTabChange={handleTabChange}
//         onManageCustomFieldsClick={() => setIsManageCustomFieldsOpen(true)}
//         onEditEntityClick={() => setIsEditSchoolOpen(true)}
//         onAddFieldClick={() => setIsAddFieldOpen(true)}
//         onAddSchoolClick={() => setIsAddingSchool(true)}
//         onCancelAddSchool={handleCancelAddSchool}
//         onConfirmAddSchool={handleConfirmAddSchool}
//         onSchoolSearchChange={handleSchoolSearchChange}
//         onSchoolSelect={handleSchoolSelect}
//         onTriggerAddSchoolDialog={handleTriggerAddSchoolDialog}
//         onAddUserClick={handleAddUserClick}
//         onCancelAddUser={handleCancelAddUser}
//         onUserSearchChange={handleUserSearchChange}
//         onUserSelect={handleUserSelect}
//         onTriggerAddUserDialog={handleTriggerAddUserDialog}
//         onAddBoardMemberClick={handleToggleAddBoardMemberInlineSearch}
//         onCancelAddBoardMember={handleCancelAddBoardMember}
//         onBoardMemberSearchChange={handleBoardMemberSearchChange}
//         onBoardMemberSelect={handleBoardMemberSelect}
//         onTriggerAddBoardMemberDialog={handleTriggerAddBoardMemberDialog}
//         onCustomFieldSave={handleCustomFieldSave}
//         onFolderToggle={handleFolderToggle}
//         onAddDocumentsClick={handleAddDocumentsClick}
//         onUploadingFileNameChange={handleUploadingFileNameChange}
//         onCancelUpload={handleCancelUpload}
//         onDocumentNameSave={handleDocumentNameSave}
//         onExpiresDateChange={handleExpiresDateChange}
//         setEditingExpiresDocId={setEditingExpiresDocIdLocal}
//         onAssignReportsClick={() => setIsAssignReportsDialogOpen(true)}
//         onAddMeetingDateClick={() => {
//           setIsAddingMeetingDate(true);
//           setEditingMeetingDate(null);
//         }}
//         onCancelAddMeetingDate={handleCancelAddMeetingDate}
//         onSaveNewMeetingDate={handleSaveNewMeetingDate}
//         onNewMeetingDateChange={(e) => {
//           const selectedDate = e.target.value;
//           if (selectedDate) {
//             handleSaveNewMeetingDate(selectedDate);
//           }
//         }}
//         onSetEditingMeetingDate={handleSetEditingMeetingDate}
//         onUpdateMeetingDate={handleUpdateMeetingDate}
//         onCancelEditMeetingDate={handleCancelEditMeetingDate}
//         onDeleteDocument={handleDeleteDocument}
//         onAddBoardDocumentsClick={handleAddBoardDocumentsClick}
//         onDeleteBoardDocument={handleDeleteBoardDocument}
//         onCancelBoardDocUpload={handleCancelBoardDocUpload}
//         onBoardDocNameSave={handleBoardDocNameSave}
//         onBoardDocExpiresChange={handleBoardDocExpiresChange}
//         setEditingBoardExpiresDocId={setEditingBoardExpiresDocId}
//         onOpenReport={handleOpenReport}
//         pushView={pushView}
//         popView={popView}
//         customFieldDefinitions={customFieldDefinitions}
//         customFieldsLoading={customFieldsLoading}
//         onCustomFieldFileUpload={handleCustomFieldUpload}
//         onViewUser={handleViewUser}
//       />

//       {/* Render Child Dialogs/Modals Here */}
//       {isAddUserOpen && (
//         <AddUser
//           open={isAddUserOpen}
//           onClose={() => setIsAddUserOpen(false)}
//           entityId={entityId}
//           initialFirstName={initialUserNames?.firstName}
//           initialLastName={initialUserNames?.lastName}
//           onSubmitSuccess={(createdUser) => {
//             console.log(
//               'User created successfully from EntityInfoDrawer:',
//               createdUser,
//             );
//             handleCancelAddUser();
//             setIsAddUserOpen(false);
//           }}
//         />
//       )}
//       <AddBoardMember
//         open={isAddBoardMemberOpen}
//         onClose={() => {
//           setIsAddBoardMemberOpen(false);
//           setInitialBoardMemberNames(null);
//         }}
//         entityId={entityId}
//         initialFirstName={initialBoardMemberNames?.firstName || ''}
//         initialLastName={initialBoardMemberNames?.lastName || ''}
//       />
//       <AddSchool
//         open={isAddSchoolOpen}
//         onClose={() => setIsAddSchoolOpen(false)}
//         initialName={schoolSearchQuery}
//         network={entityType === 'Network' ? entityId : undefined}
//       />
//       <ManageCustomFields
//         open={isManageCustomFieldsOpen}
//         onClose={() => setIsManageCustomFieldsOpen(false)}
//         entityType={
//           entityType === 'School'
//             ? CustomFieldEntityType.SchoolEntity
//             : CustomFieldEntityType.NetworkEntity
//         }
//       />
//       <AddField
//         open={isAddFieldOpen}
//         onClose={() => setIsAddFieldOpen(false)}
//         entityType={
//           entityType === 'School'
//             ? CustomFieldEntityType.SchoolEntity
//             : CustomFieldEntityType.NetworkEntity
//         }
//       />
//       {entity && (
//         <EditSchool
//           open={isEditSchoolOpen}
//           schoolId={entityId}
//           onClose={() => setIsEditSchoolOpen(false)}
//         />
//       )}
//       <AssignReports
//         open={isAssignReportsDialogOpen}
//         onOpenChange={setIsAssignReportsDialogOpen}
//         entityId={entityId}
//         entityType={entityType === 'Network' ? 'Network' : 'School'}
//         onSubmit={handleAssignReportsSubmit}
//       />

//       {/* Hidden File Inputs */}
//       <input
//         type="file"
//         multiple
//         ref={fileInputRef}
//         onChange={handleFileSelect}
//         className="hidden"
//       />
//       <input
//         type="file"
//         multiple
//         ref={boardFileInputRef}
//         onChange={handleBoardDocFileSelect}
//         className="hidden"
//       />
//     </>
//   );
// };
