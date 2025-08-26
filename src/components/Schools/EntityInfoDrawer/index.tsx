// import React, { useMemo } from 'react';
// import { format, parseISO } from 'date-fns';

// import { EyeIcon, PencilIcon, PlusIcon, CheckIcon, XIcon } from 'lucide-react';
// import {
//   SquaresPlusIcon,
//   TrashIcon,
//   CloudArrowDownIcon,
//   ArrowUpRightIcon,
//   ChevronDownIcon,
//   ChevronRightIcon,
//   ChevronLeftIcon,
// } from '@heroicons/react/24/outline';

// import { School, Network } from '@/store/slices/schoolsSlice';
// import { SchoolUser } from '@/store/slices/schoolUsersSlice';
// import { CustomFieldDefinition } from '@/store/slices/customFieldDefinitionsSlice';
// import { ActivityLog } from '@/store/slices/activityLogSlice';
// import { EntityDocument } from '@/store/slices/entityDocumentsSlice';
// import { AssignedReport } from '@/store/slices/assignedReportsSlice';

// import { EntityType } from '@/contexts/DrawerNavigationContext';

// import { SearchBar } from '@/components/base/SearchBar';
// import { Input } from '@/components/base/Input';
// import { InlineEditField } from '@/components/base/InlineEditField';
// import { Badge } from '@/components/base/Badge';
// import { Button } from '@/components/base/Button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/base/Table';
// import { Drawer } from '@/components/base/Drawer';
// import { ScrollArea } from '@/components/base/ScrollArea';
// import { Tabs, TabsContainer, TabsContent } from '@/components/base/Tabs';

// // Define the context function types explicitly for props
// export interface DrawerNavigationFunctions {
//   pushView: (
//     entityId: string,
//     entityType: EntityType,
//     parentEntityId?: string,
//     parentEntityType?: EntityType,
//     options?: { returnToTabForOpener?: string },
//   ) => void;
//   popView: () => void;
// }

// // Interface for uploading file state (used in props)
// export interface UploadingFile {
//   tempId: string;
//   file: File;
//   name: string;
//   year: string;
//   progress: number;
//   status: 'uploading' | 'complete' | 'error' | 'cancelled';
//   expires: string | null;
// }

// // Interface for Mock Board Document (used in props)
// export interface BoardDocument {
//   id: string;
//   name: string;
//   type: string;
//   expires: string | null;
//   added: string | null;
// }

// // Updated props to handle Network type explicitly
// interface EntityInfoDrawerProps extends DrawerNavigationFunctions {
//   entity: School | Network | null; // Allow Network type
//   entityType: EntityType;
//   teamMembers: SchoolUser[];
//   boardMembers: SchoolUser[];
//   isLoadingBoardMembers?: boolean;
//   networkSchools: School[];
//   activityLogs: ActivityLog[];
//   allDocumentsForParent: EntityDocument[];
//   assignedReports: AssignedReport[];
//   meetingDates: string[];
//   boardDocuments: EntityDocument[];
//   currentTab: string;
//   isAddingSchool: boolean;
//   schoolSearchQuery: string;
//   schoolSearchResults: School[];
//   selectedSchool: School | null;
//   isAddingUser: boolean;
//   userSearchQuery: string;
//   userSearchResults: SchoolUser[];
//   initialUserSuggestions: SchoolUser[];
//   isAddingBoardMember: boolean;
//   boardMemberSearchQuery: string;
//   boardMemberSearchResults: SchoolUser[];
//   initialBoardMemberSuggestions: SchoolUser[];
//   expandedFolders: string[];
//   uploadingFiles: UploadingFile[];
//   editingExpiresDocId: string | null;
//   boardUploadingFiles: UploadingFile[];
//   editingBoardExpiresDocId: string | null;
//   isAddingMeetingDate: boolean;
//   newMeetingDate: string;
//   loadingActivity: boolean;
//   parentEntityName: string | null; // Name of the parent for back button
//   parentEntityType: EntityType | undefined;
//   isLoadingDocs: boolean;
//   isLoadingBoardDocs: boolean;
//   customFieldDefinitions: CustomFieldDefinition[];
//   customFieldsLoading: boolean;
//   editingMeetingDate: string | null;
//   onClose: () => void; // Main close handler
//   onBack: () => void; // Back navigation handler
//   onTabChange: (tabId: string) => void;
//   onManageCustomFieldsClick: () => void;
//   onEditEntityClick: () => void;
//   onAddFieldClick: () => void;
//   onAddSchoolClick: () => void;
//   onCancelAddSchool: () => void;
//   onConfirmAddSchool: () => void;
//   onSchoolSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onSchoolSelect: (school: School) => void;
//   onTriggerAddSchoolDialog: () => void; // Handler to open AddSchool from search
//   onAddUserClick: () => void;
//   onCancelAddUser: () => void;
//   onUserSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onUserSelect: (user: SchoolUser) => void;
//   onTriggerAddUserDialog: (query: string) => void; // Handler to open AddUser from search
//   onAddBoardMemberClick: () => void;
//   onCancelAddBoardMember: () => void;
//   onBoardMemberSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onBoardMemberSelect: (user: SchoolUser) => void;
//   onTriggerAddBoardMemberDialog: (query: string) => void; // Handler to open AddBoardMember from search
//   onCustomFieldSave: (fieldName: string, newValue: string | File) => void;
//   onFolderToggle: (folderName: string) => void;
//   onAddDocumentsClick: (year: string) => void;
//   onUploadingFileNameChange: (tempId: string, newName: string) => void;
//   onCancelUpload: (tempId: string) => void;
//   onDocumentNameSave: (
//     docId: string,
//     newValue: string,
//     currentSection: string,
//   ) => void;
//   onExpiresDateChange: (
//     docId: string,
//     dateValue: string,
//     currentSection: string,
//   ) => void;
//   setEditingExpiresDocId: (docId: string | null) => void;
//   onAssignReportsClick: () => void;
//   onAddMeetingDateClick: () => void;
//   onCancelAddMeetingDate: () => void;
//   onSaveNewMeetingDate: () => void;
//   onNewMeetingDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onDeleteDocument: (docId: string, s3FileKey: string) => void;
//   onAddBoardDocumentsClick: () => void;
//   onCancelBoardDocUpload: (tempId: string) => void;
//   onBoardDocNameSave: (docId: string, newName: string | File) => void;
//   onBoardDocExpiresChange: (docId: string, dateValue: string) => void;
//   setEditingBoardExpiresDocId: (docId: string | null) => void;
//   onDeleteBoardDocument: (docId: string, s3FileKey: string) => void;
//   onOpenReport: (reportId: string) => void;
//   onCustomFieldFileUpload: (
//     file: File,
//     onProgress: (progress: number) => void,
//   ) => Promise<string>;
//   onViewUser: (userId: string) => void;
//   onSetEditingMeetingDate: (date: string | null) => void;
//   onUpdateMeetingDate: (oldDate: string, newDate: string) => void;
//   onCancelEditMeetingDate: () => void;
// }

// const tabs = [
//   { id: 'details', label: 'Details' },
//   { id: 'board-center', label: 'Board Center' },
//   { id: 'assigned-reports', label: 'Assigned Reports' },
//   { id: 'documents', label: 'Documents' },
// ];

// // Define standard document sections (renamed and updated)
// const STANDARD_DOCUMENT_SECTIONS = [
//   'School Documents', // Added this section
//   '2024 - 2025',
//   '2023 - 2024',
//   '2022 - 2023',
//   '2021 - 2022',
//   '2020 - 2021',
//   '2019 - 2020', // Added this year
//   '2018 - 2019', // Added this year
//   // Add more years as required by the design
// ];

// // Helper function to map API year to folder/section key (updated)
// const getSectionKeyFromDocument = (doc: EntityDocument): string => {
//   const year = doc.year;
//   // Explicitly check for the "School Documents" string
//   if (year === 'School Documents') {
//     return year;
//   }
//   // Handle 4-digit years
//   if (year && /^[0-9]{4}$/.test(year)) {
//     try {
//       const startYear = parseInt(year, 10);
//       const endYear = startYear + 1;
//       return `${startYear} - ${endYear}`;
//     } catch {
//       // Fallback if parsing fails unexpectedly
//       return 'Unknown';
//     }
//   }
//   // Fallback for null, undefined, or other invalid year formats
//   return 'Unknown';
// };

// export const EntityInfoDrawer: React.FC<EntityInfoDrawerProps> = ({
//   entity,
//   teamMembers,
//   boardMembers,
//   networkSchools,
//   activityLogs,
//   allDocumentsForParent,
//   assignedReports,
//   meetingDates,
//   boardDocuments,
//   currentTab,
//   isAddingSchool,
//   schoolSearchQuery,
//   schoolSearchResults,
//   selectedSchool,
//   isAddingUser,
//   userSearchQuery,
//   userSearchResults,
//   initialUserSuggestions,
//   isAddingBoardMember,
//   boardMemberSearchQuery,
//   boardMemberSearchResults,
//   initialBoardMemberSuggestions,
//   expandedFolders,
//   uploadingFiles,
//   editingExpiresDocId,
//   boardUploadingFiles,
//   editingBoardExpiresDocId,
//   isAddingMeetingDate,
//   newMeetingDate,
//   loadingActivity,
//   parentEntityName,
//   parentEntityType,
//   isLoadingDocs,
//   isLoadingBoardDocs,
//   customFieldDefinitions,
//   customFieldsLoading,
//   editingMeetingDate,
//   onClose,
//   onBack,
//   onTabChange,
//   onManageCustomFieldsClick,
//   onEditEntityClick,
//   onAddFieldClick,
//   onAddSchoolClick,
//   onCancelAddSchool,
//   onConfirmAddSchool,
//   onSchoolSearchChange,
//   onSchoolSelect,
//   onTriggerAddSchoolDialog,
//   onAddUserClick,
//   onCancelAddUser,
//   onUserSearchChange,
//   onUserSelect,
//   onTriggerAddUserDialog,
//   onAddBoardMemberClick,
//   onCancelAddBoardMember,
//   onBoardMemberSearchChange,
//   onBoardMemberSelect,
//   onTriggerAddBoardMemberDialog,
//   onCustomFieldSave,
//   onFolderToggle,
//   onAddDocumentsClick,
//   onUploadingFileNameChange,
//   onCancelUpload,
//   onDocumentNameSave,
//   onExpiresDateChange,
//   setEditingExpiresDocId,
//   onAssignReportsClick,
//   onAddMeetingDateClick,
//   onNewMeetingDateChange,
//   onDeleteDocument,
//   onAddBoardDocumentsClick,
//   onCancelBoardDocUpload,
//   onBoardDocNameSave,
//   onBoardDocExpiresChange,
//   setEditingBoardExpiresDocId,
//   onDeleteBoardDocument,
//   onOpenReport,
//   pushView,
//   onCustomFieldFileUpload,
//   onViewUser,
//   onSetEditingMeetingDate,
//   onUpdateMeetingDate,
//   onCancelEditMeetingDate,
//   isLoadingBoardMembers,
// }) => {
//   // Group documents locally within the component by section key
//   const documentsGroupedBySection = useMemo(() => {
//     const grouped: Record<string, EntityDocument[]> = {};
//     // Initialize standard sections to ensure they appear even if empty
//     STANDARD_DOCUMENT_SECTIONS.forEach((section) => {
//       grouped[section] = [];
//     });

//     (allDocumentsForParent || []).forEach((doc) => {
//       const sectionKey = getSectionKeyFromDocument(doc); // Use updated helper
//       // Ensure the key exists even if not in standard list (e.g., "Unknown")
//       if (!grouped[sectionKey]) {
//         grouped[sectionKey] = [];
//       }
//       grouped[sectionKey].push(doc);
//     });
//     // Filter out the "Unknown" section if it's empty and not needed
//     if (grouped['Unknown'] && grouped['Unknown'].length === 0) {
//       delete grouped['Unknown'];
//     }
//     return grouped;
//   }, [allDocumentsForParent]);

//   // Determine the order of sections to display
//   const sortedSections = useMemo(() => {
//     const availableKeys = Object.keys(documentsGroupedBySection);
//     // Ensure all standard sections are included, plus any others found (like 'Unknown' if it has items)
//     const allSectionKeys = new Set([
//       ...STANDARD_DOCUMENT_SECTIONS,
//       ...availableKeys,
//     ]);

//     return Array.from(allSectionKeys).sort((a, b) => {
//       const indexA = STANDARD_DOCUMENT_SECTIONS.indexOf(a);
//       const indexB = STANDARD_DOCUMENT_SECTIONS.indexOf(b);

//       // "School Documents" should come first
//       if (a === 'School Documents') return -1;
//       if (b === 'School Documents') return 1;

//       // Sort year ranges reverse chronologically (newest first)
//       const yearMatchA = a.match(/^(\d{4}) - (\d{4})$/);
//       const yearMatchB = b.match(/^(\d{4}) - (\d{4})$/);
//       if (yearMatchA && yearMatchB) {
//         return parseInt(yearMatchB[1], 10) - parseInt(yearMatchA[1], 10);
//       }

//       // Handle sorting if only one is a standard year range
//       if (indexA !== -1 && indexB === -1) return -1; // Standard years before others
//       if (indexA === -1 && indexB !== -1) return 1; // Others after standard years

//       // Fallback sort for non-standard/non-year sections (like 'Unknown')
//       if (indexA === -1 && indexB === -1) {
//         return a.localeCompare(b);
//       }

//       // Keep the order defined in STANDARD_DOCUMENT_SECTIONS for any remaining standard items
//       return indexA - indexB;
//     });
//   }, [documentsGroupedBySection]);

//   if (!entity) {
//     return null; // Or a loading state
//   }

//   return (
//     <Drawer
//       open={true}
//       onClose={onClose}
//       width="600px"
//       side="right"
//       hideCloseButton
//     >
//       <div className="flex flex-col h-full overflow-hidden">
//         <TabsContainer
//           defaultTab={currentTab}
//           className="flex flex-col h-full"
//           onTabChange={onTabChange}
//         >
//           <div className="flex flex-col p-[16px_16px_0_16px] gap-2 pb-2">
//             {parentEntityName && parentEntityType && (
//               <div className="flex items-start gap-2">
//                 <Button
//                   variant="ghost"
//                   onClick={onBack}
//                   className="flex items-center gap-2 text-slate-600 -ml-2"
//                 >
//                   <ChevronLeftIcon className="w-4 h-4" />
//                   Back to {
//                     parentEntityType
//                   }: {parentEntityName}
//                 </Button>
//               </div>
//             )}
//             <div className="flex flex-col sm:flex-row gap-4 items-start">
//               <div className="flex flex-col gap-2 w-12 h-12 bg-slate-200 rounded-[3px]">
//                 <img
//                   src={entity.profile_image}
//                   alt={
//                     entity.type === 'School' ? 'School Logo' : 'Network Logo'
//                   }
//                   className="w-full h-full object-cover rounded-[3px]"
//                 />
//               </div>
//               <div className="flex-1 flex flex-col gap-1">
//                 <div>
//                   <span className="text-wrap break-words max-w-full body1-bold">
//                     {entity.name}
//                     {entity.type === 'Network' && (
//                       <span className="ml-1 body1-regular text-slate-600">
//                         ({(entity as Network).schools?.length || 0} schools)
//                       </span>
//                     )}
//                   </span>
//                   <div className="flex flex-col">
//                     <span className="body1-regular">
//                       {entity.address || '[Street Address]'}
//                     </span>
//                     <span className="body1-regular">
//                       {entity.city && entity.state && entity.zipcode
//                         ? `${entity.city}, ${entity.state} ${entity.zipcode}`
//                         : '[City, State ZIP]'}
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <span className="body1-regular">
//                     {entity.type === 'School' &&
//                       `${entity.type} | ${entity.gradeserved[0]} - ${entity.gradeserved[entity.gradeserved.length - 1]} | ${entity.district}`}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="flex gap-2 h-[36px] p-[8px_12px] border-slate-700 border rounded-[6px]"
//                   onClick={onManageCustomFieldsClick}
//                 >
//                   <SquaresPlusIcon className="w-[18px] h-[18px] text-slate-700" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="flex gap-2 h-[36px] p-[8px_12px] border-slate-700 border rounded-[6px]"
//                   onClick={onEditEntityClick}
//                 >
//                   <PencilIcon className="w-[18px] h-[18px] text-slate-700" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <Tabs
//             tabs={tabs}
//             activeTab={currentTab}
//             onTabChange={onTabChange}
//             className="border-b border-slate-300 px-4"
//             tabClassName="body1-medium"
//             activeTabClassName="border-b-4 border-orange-500 text-orange-500"
//           />

//           {/* Details Tab */}
//           <TabsContent
//             tabId="details"
//             activeTab={currentTab}
//             className="flex-1 overflow-hidden flex flex-col"
//           >
//             <div className="flex flex-col gap-6 h-full flex-1 overflow-hidden px-6 py-4">
//               <ScrollArea className="h-full">
//                 <div className="flex flex-col gap-4">
//                   {/* Team Members Section */}
//                   <div className="flex flex-col gap-2">
//                     <div className="flex items-center gap-2">
//                       <h5 className="flex-1">Team Members</h5>
//                     </div>
//                     <div className="flex gap-4 w-full flex-wrap">
//                       {teamMembers.map((user) => (
//                         <div
//                           key={user.id}
//                           className="flex items-start w-[calc(50%-8px)] p-2 rounded-[8px] border border-slate-200 hover:bg-slate-50 cursor-pointer"
//                           onClick={() => onViewUser(user.id)}
//                           role="button"
//                           tabIndex={0}
//                           onKeyDown={(e) => {
//                             if (e.key === 'Enter' || e.key === ' ')
//                               onViewUser(user.id);
//                           }}
//                         >
//                           <div className="flex gap-2 bg-white">
//                             <div className="flex w-[56px] h-[56px] rounded-[3px] overflow-hidden items-center justify-center bg-orange-50">
//                               {user.profile_image ? (
//                                 <img
//                                   src={user.profile_image}
//                                   alt={`${user.first_name} ${user.last_name}`}
//                                   className="w-full h-full object-cover"
//                                 />
//                               ) : (
//                                 <div className="w-8 h-8 bg-orange-100 flex items-center justify-center text-orange-500 rounded-full border border-orange-300">
//                                   <span className="body1-regular text-orange-800">{`${user.first_name[0]}${user.last_name[0]}`}</span>
//                                 </div>
//                               )}
//                             </div>
//                             <div className="flex flex-col">
//                               <span className="body2-bold text-slate-900">{`${user.first_name} ${user.last_name}`}</span>
//                               <span className="body3-regular">
//                                 {user.title}
//                               </span>
//                               <span className="body3-regular text-slate-500">{`${user.role === 'School_Admin' ? 'Admin' : 'School User'} | ${user.is_active ? 'Active' : 'Pending'} `}</span>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     {isAddingUser ? (
//                       <div className="flex flex-col gap-2">
//                         <div className="relative">
//                           <div className="flex items-center gap-2 w-full">
//                             <div className="flex-1">
//                               <Input
//                                 type="text"
//                                 placeholder="Search for user to add as team member"
//                                 value={userSearchQuery}
//                                 onChange={onUserSearchChange}
//                                 className="w-full"
//                               />
//                             </div>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="p-1 text-slate-500 hover:text-slate-700"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 onCancelAddUser();
//                               }}
//                             >
//                               <XIcon className="w-5 h-5" />
//                             </Button>
//                           </div>

//                           {/* Container for suggestions or search results dropdown */}
//                           <div className="relative">
//                             {/* Display Initial Suggestions - show if search is empty and suggestions exist */}
//                             {userSearchQuery === '' &&
//                               initialUserSuggestions.length > 0 && (
//                                 <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                                   <div className="p-2 text-sm text-slate-500">
//                                     Suggestions:
//                                   </div>
//                                   {initialUserSuggestions.map((user) => (
//                                     <div
//                                       key={user.id}
//                                       className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         onUserSelect(user);
//                                       }}
//                                     >
//                                       {/* Initials Circle */}
//                                       <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs flex-shrink-0">
//                                         <span className="text-xs">{`${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`}</span>
//                                       </div>
//                                       {/* Name and Email */}
//                                       <div className="flex flex-col">
//                                         <span className="font-medium text-sm">{`${user.first_name} ${user.last_name}`}</span>
//                                         {user.email && (
//                                           <span className="text-xs text-slate-500">
//                                             {user.email}
//                                           </span>
//                                         )}
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}

//                             {/* Display Search Results or "Add new" - show if search query has text */}
//                             {userSearchQuery !== '' && (
//                               <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                                 {userSearchResults.map((user) => (
//                                   <div
//                                     key={user.id}
//                                     className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       onUserSelect(user);
//                                     }}
//                                   >
//                                     {/* Initials Circle */}
//                                     <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs flex-shrink-0">
//                                       <span className="text-xs">{`${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`}</span>
//                                     </div>
//                                     {/* Name and Email */}
//                                     <div className="flex flex-col">
//                                       <span className="font-medium text-sm">{`${user.first_name} ${user.last_name}`}</span>
//                                       {user.email && (
//                                         <span className="text-xs text-slate-500">
//                                           {user.email}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </div>
//                                 ))}
//                                 {/* "Add new" link - shown if query exists and no exact match in results */}
//                                 {userSearchQuery &&
//                                   !userSearchResults.some(
//                                     (u) =>
//                                       `${u.first_name} ${u.last_name}`.toLowerCase() ===
//                                         userSearchQuery.toLowerCase() ||
//                                       u.email.toLowerCase() ===
//                                         userSearchQuery.toLowerCase(),
//                                   ) && (
//                                     <div
//                                       className="px-4 py-2 text-blue-500 hover:bg-slate-50 cursor-pointer"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         onTriggerAddUserDialog(userSearchQuery);
//                                       }}
//                                     >
//                                       + Add '{userSearchQuery}' as new user
//                                     </div>
//                                   )}
//                                 {userSearchResults.length === 0 &&
//                                   userSearchQuery && (
//                                     <div className="px-4 py-2 text-slate-500">
//                                       No existing users found. You can add '
//                                       {userSearchQuery}' as a new user.
//                                     </div>
//                                   )}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <Button
//                         variant="ghost"
//                         className="flex text-blue-500 h-[38px] py-2 gap-2 w-[100px]"
//                         onClick={onAddUserClick}
//                       >
//                         <PlusIcon className="w-4 h-4" />
//                         Add user
//                       </Button>
//                     )}
//                   </div>

//                   {/* Network Schools section - only shown for Networks */}
//                   {entity.type === 'Network' && (
//                     <div className="flex flex-col gap-2">
//                       <div className="flex items-center gap-2">
//                         <h5 className="flex-1">Network Schools</h5>
//                       </div>
//                       <Table>
//                         <TableBody>
//                           {networkSchools.map((networkSchool) => (
//                             <TableRow
//                               key={networkSchool.id}
//                               className="border-b border-slate-200"
//                             >
//                               <TableCell>{networkSchool.name}</TableCell>
//                               <TableCell>Elementary</TableCell>{' '}
//                               {/* Placeholder */}
//                               <TableCell>
//                                 {networkSchool.city}, {networkSchool.state}
//                               </TableCell>
//                               <TableCell>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="flex gap-1 text-blue-500"
//                                   onClick={() =>
//                                     pushView(
//                                       networkSchool.id,
//                                       'School',
//                                       entity.id,
//                                       entity.type === 'Network'
//                                         ? 'Network'
//                                         : 'School',
//                                     )
//                                   }
//                                 >
//                                   <EyeIcon className="w-4 h-4" />
//                                   View school
//                                 </Button>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                       {isAddingSchool ? (
//                         <div className="flex flex-col gap-2">
//                           <div className="relative">
//                             <Input
//                               type="text"
//                               placeholder="Search for school"
//                               value={schoolSearchQuery}
//                               onChange={onSchoolSearchChange}
//                               className="w-full"
//                             />
//                             {(schoolSearchResults.length > 0 ||
//                               schoolSearchQuery) &&
//                               !selectedSchool && (
//                                 <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
//                                   {schoolSearchResults.map((school) => (
//                                     <div
//                                       key={school.id}
//                                       className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
//                                       onClick={() => onSchoolSelect(school)}
//                                     >
//                                       {school.name}
//                                     </div>
//                                   ))}
//                                   {schoolSearchQuery && (
//                                     <div
//                                       className="px-4 py-2 text-blue-500 hover:bg-slate-50 cursor-pointer"
//                                       onClick={onTriggerAddSchoolDialog}
//                                     >
//                                       + Add '{schoolSearchQuery}' as new school
//                                     </div>
//                                   )}
//                                 </div>
//                               )}
//                           </div>
//                           {selectedSchool && (
//                             <div className="flex items-center gap-2">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="p-1"
//                                 onClick={onConfirmAddSchool}
//                               >
//                                 <CheckIcon className="w-4 h-4 text-green-500" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="p-1"
//                                 onClick={onCancelAddSchool}
//                               >
//                                 <XIcon className="w-4 h-4 text-red-500" />
//                               </Button>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <Button
//                           variant="ghost"
//                           className="flex text-blue-500 h-[38px] py-2 gap-2 w-[140px]"
//                           onClick={onAddSchoolClick}
//                         >
//                           <PlusIcon className="w-4 h-4" />
//                           Add school
//                         </Button>
//                       )}
//                     </div>
//                   )}

//                   {/* Custom Fields Section */}
//                   <div className="flex flex-col gap-2">
//                     <div className="flex gap-2 items-center">
//                       <h5 className="flex-1">Custom Fields</h5>
//                     </div>
//                     {customFieldsLoading &&
//                     customFieldDefinitions.length === 0 ? (
//                       <div className="py-4 text-center text-slate-500 italic">
//                         Loading custom fields...
//                       </div>
//                     ) : customFieldDefinitions.length > 0 ? (
//                       <Table>
//                         <TableBody>
//                           {customFieldDefinitions.map((field) => {
//                             const fieldValue =
//                               entity?.custom_fields?.[field.Name] ?? '';
//                             return (
//                               <TableRow
//                                 key={field.Name}
//                                 className="border-b border-slate-200 last:border-0"
//                               >
//                                 <TableCell className="body2-bold w-[150px] py-3 px-0 align-top">
//                                   {field.Name}
//                                 </TableCell>
//                                 <TableCell className="body2-medium py-3 px-0">
//                                   <InlineEditField
//                                     value={fieldValue as string}
//                                     fieldType={field.Type || 'Text'}
//                                     onSave={(newValue) => {
//                                       // Pass string or file
//                                       onCustomFieldSave(field.Name, newValue);
//                                     }}
//                                     placeholder={`Enter ${field.Name}`}
//                                     className="body2-medium"
//                                     fileUploadConfig={
//                                       field.Type === 'File Upload'
//                                         ? {
//                                             onFileUpload:
//                                               onCustomFieldFileUpload,
//                                             // TODO: Add allowedTypes/maxSize from field definition if available
//                                           }
//                                         : undefined
//                                     }
//                                   />
//                                 </TableCell>
//                               </TableRow>
//                             );
//                           })}
//                         </TableBody>
//                       </Table>
//                     ) : (
//                       <span className="body2-medium text-slate-500">
//                         No custom fields defined.
//                       </span>
//                     )}
//                     <Button
//                       variant="ghost"
//                       className="flex text-blue-500 h-[38px] py-2 gap-2 w-[100px]"
//                       onClick={onAddFieldClick}
//                     >
//                       <PlusIcon className="w-4 h-4" />
//                       Add field
//                     </Button>
//                   </div>

//                   {/* Activity Section */}
//                   <div className="flex flex-col gap-2">
//                     <h5>Activity</h5>
//                     <div className="space-y-4">
//                       {loadingActivity ? (
//                         <div className="flex justify-center py-4">
//                           <span>Loading activity...</span>
//                         </div>
//                       ) : activityLogs.length === 0 ? (
//                         <div className="text-slate-500 text-center py-4">
//                           No activity logs available
//                         </div>
//                       ) : (
//                         activityLogs.map((log, index) => (
//                           <div key={index} className="space-y-1">
//                             <div className="flex items-center gap-1">
//                               <span className="font-medium text-slate-800">
//                                 {log.user.first_name +
//                                   ' ' +
//                                   log.user.last_name || 'User'}
//                               </span>
//                               <span className="text-sm text-slate-500">
//                                 {log.created_at
//                                   ? format(new Date(log.created_at), 'M/d/yyyy')
//                                   : ''}
//                               </span>
//                             </div>
//                             <div className="text-slate-700">{log.content}</div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </ScrollArea>
//             </div>
//           </TabsContent>

//           {/* Board Center Tab */}
//           <TabsContent
//             tabId="board-center"
//             activeTab={currentTab}
//             className="flex-1 overflow-hidden flex flex-col"
//           >
//             <div className="flex flex-col gap-6 h-full flex-1 overflow-hidden px-6 py-4">
//               <ScrollArea className="h-full">
//                 <div className="flex flex-col gap-4">
//                   {/* Board Members Section */}
//                   <div className="flex flex-col gap-4">
//                     <h5>Board Members</h5>
//                     {isLoadingBoardMembers ? (
//                       <div className="flex items-center justify-center py-4">
//                         <p className="text-slate-500">
//                           Loading board members...
//                         </p>
//                       </div>
//                     ) : boardMembers.length > 0 ? (
//                       <Table className="border-b border-slate-200">
//                         <TableBody>
//                           {boardMembers.map((user) => (
//                             <TableRow
//                               key={user.id}
//                               className="border-b border-slate-200 last:border-0 hover:bg-slate-50 cursor-pointer"
//                               onClick={() => onViewUser(user.id)}
//                               role="link"
//                               tabIndex={0}
//                               onKeyDown={(e) => {
//                                 if (e.key === 'Enter' || e.key === ' ')
//                                   onViewUser(user.id);
//                               }}
//                             >
//                               <TableCell>
//                                 <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
//                                   {user.profile_image ? (
//                                     <img
//                                       src={user.profile_image}
//                                       alt={`${user.first_name} ${user.last_name}`}
//                                       className="w-full h-full object-cover rounded-full"
//                                     />
//                                   ) : (
//                                     <span className="text-sm">{`${user.first_name[0]}${user.last_name[0]}`}</span>
//                                   )}
//                                 </div>
//                               </TableCell>
//                               <TableCell>
//                                 <div className="flex flex-col">
//                                   <span className="body1-regular">{`${user.first_name} ${user.last_name}`}</span>
//                                   {user.title && (
//                                     <span className="body2-regular text-slate-500">
//                                       {user.title}
//                                     </span>
//                                   )}
//                                 </div>
//                               </TableCell>
//                               <TableCell>
//                                 {user.start_term && user.end_term
//                                   ? `${format(new Date(user.start_term), 'M/d/yyyy')} - ${format(new Date(user.end_term), 'M/d/yyyy')}`
//                                   : 'Term not set'}
//                               </TableCell>
//                               <TableCell>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="flex gap-2 text-blue-500"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     pushView(
//                                       user.id,
//                                       'Board Member',
//                                       entity.id,
//                                       entity.type === 'Network'
//                                         ? 'Network'
//                                         : 'School',
//                                       { returnToTabForOpener: 'board-center' },
//                                     );
//                                   }}
//                                 >
//                                   <EyeIcon className="w-4 h-4" />
//                                   View member
//                                 </Button>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     ) : (
//                       <p className="body2-medium text-slate-500">
//                         No board members assigned to this{' '}
//                         {entity.type.toLowerCase()}.
//                       </p>
//                     )}
//                     {isAddingBoardMember ? (
//                       <div className="flex flex-col gap-2 w-full">
//                         <div className="flex items-center gap-2 w-full">
//                           <div className="flex-1">
//                             <Input
//                               type="text"
//                               placeholder="Search or select a board member"
//                               value={boardMemberSearchQuery}
//                               onChange={onBoardMemberSearchChange}
//                               className="w-full"
//                             />
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="p-1 text-slate-500 hover:text-slate-700"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               onCancelAddBoardMember();
//                             }}
//                           >
//                             <XIcon className="w-5 h-5" />
//                           </Button>
//                         </div>

//                         {/* Container for suggestions or search results dropdown */}
//                         <div className="relative">
//                           {/* Display Initial Suggestions - show if search is empty and suggestions exist */}
//                           {boardMemberSearchQuery === '' &&
//                             initialBoardMemberSuggestions.length > 0 && (
//                               <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                                 <div className="p-2 text-sm text-slate-500">
//                                   Suggestions:
//                                 </div>
//                                 {initialBoardMemberSuggestions.map((user) => (
//                                   <div
//                                     key={user.id}
//                                     className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       onBoardMemberSelect(user);
//                                     }}
//                                   >
//                                     {/* Initials Circle */}
//                                     <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs flex-shrink-0">
//                                       <span className="text-xs">{`${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`}</span>
//                                     </div>
//                                     {/* Name and Email */}
//                                     <div className="flex flex-col">
//                                       <span className="font-medium text-sm">{`${user.first_name} ${user.last_name}`}</span>
//                                       {/* Optionally display email if/when available */}
//                                       {/* <span className="text-xs text-slate-500">{user.email}</span> */}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}

//                           {/* Display Search Results or "Add new" - show if search query has text */}
//                           {boardMemberSearchQuery !== '' && (
//                             <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                               {boardMemberSearchResults.map((user) => (
//                                 <div
//                                   key={user.id}
//                                   className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     onBoardMemberSelect(user);
//                                   }}
//                                 >
//                                   {/* Initials Circle */}
//                                   <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs flex-shrink-0">
//                                     <span className="text-xs">{`${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`}</span>
//                                   </div>
//                                   {/* Name and Email */}
//                                   <div className="flex flex-col">
//                                     <span className="font-medium text-sm">{`${user.first_name} ${user.last_name}`}</span>
//                                     {/* Optionally display email if/when available */}
//                                     {/* <span className="text-xs text-slate-500">{user.email}</span> */}
//                                   </div>
//                                 </div>
//                               ))}
//                               {/* "Add new" link - shown if query exists and no exact match in results or initial suggestions */}
//                               {boardMemberSearchQuery &&
//                                 !boardMemberSearchResults.some(
//                                   (u) =>
//                                     `${u.first_name} ${u.last_name}`.toLowerCase() ===
//                                       boardMemberSearchQuery.toLowerCase() ||
//                                     u.email.toLowerCase() ===
//                                       boardMemberSearchQuery.toLowerCase(),
//                                 ) &&
//                                 !initialBoardMemberSuggestions.some(
//                                   (u) =>
//                                     `${u.first_name} ${u.last_name}`.toLowerCase() ===
//                                       boardMemberSearchQuery.toLowerCase() ||
//                                     u.email.toLowerCase() ===
//                                       boardMemberSearchQuery.toLowerCase(),
//                                 ) && (
//                                   <div
//                                     className="px-4 py-2 text-blue-500 hover:bg-slate-50 cursor-pointer"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       onTriggerAddBoardMemberDialog(
//                                         boardMemberSearchQuery,
//                                       );
//                                     }}
//                                   >
//                                     + Add '{boardMemberSearchQuery}' as new
//                                     board member
//                                   </div>
//                                 )}
//                               {boardMemberSearchResults.length === 0 &&
//                                 boardMemberSearchQuery && (
//                                   <div className="px-4 py-2 text-slate-500">
//                                     No existing users found. You can add '
//                                     {boardMemberSearchQuery}' as a new board
//                                     member.
//                                   </div>
//                                 )}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ) : (
//                       <Button
//                         variant="ghost"
//                         className="flex text-blue-500 h-[38px] py-2 gap-2 w-[170px]"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onAddBoardMemberClick();
//                         }}
//                       >
//                         <PlusIcon className="w-4 h-4" />
//                         Add board member
//                       </Button>
//                     )}
//                   </div>

//                   {/* Board Meeting Dates Section */}
//                   <div className="flex flex-col gap-4">
//                     <h5>Board Meeting Dates</h5>
//                     <div className="flex flex-col">
//                       {meetingDates.map((dateString) => (
//                         <div
//                           key={dateString}
//                           className="py-4 border-b border-slate-200 last:border-b-0"
//                         >
//                           {editingMeetingDate === dateString ? (
//                             <div className="flex items-center gap-2">
//                               <Input
//                                 type="date"
//                                 defaultValue={dateString}
//                                 onBlur={(e) => {
//                                   const newSelectedDate = e.target.value;
//                                   if (
//                                     newSelectedDate &&
//                                     newSelectedDate !== dateString
//                                   ) {
//                                     onUpdateMeetingDate(
//                                       dateString,
//                                       newSelectedDate,
//                                     );
//                                   } else if (!newSelectedDate) {
//                                     onCancelEditMeetingDate();
//                                   } else {
//                                     onCancelEditMeetingDate();
//                                   }
//                                 }}
//                                 className="h-8 w-[150px] text-sm"
//                                 autoFocus
//                               />
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-6 w-6 p-0"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   onCancelEditMeetingDate();
//                                 }}
//                               >
//                                 <XIcon className="w-4 h-4 text-red-600" />
//                               </Button>
//                             </div>
//                           ) : (
//                             <span
//                               onClick={() =>
//                                 onSetEditingMeetingDate(dateString)
//                               }
//                               className="cursor-pointer hover:text-blue-600"
//                               role="button"
//                               tabIndex={0}
//                               onKeyDown={(e) => {
//                                 if (e.key === 'Enter' || e.key === ' ')
//                                   onSetEditingMeetingDate(dateString);
//                               }}
//                             >
//                               {format(parseISO(dateString), 'MMMM d, yyyy')}
//                             </span>
//                           )}
//                         </div>
//                       ))}
//                       {isAddingMeetingDate && (
//                         <div className="flex items-center gap-2 py-4">
//                           <Input
//                             type="date"
//                             value={newMeetingDate}
//                             onChange={onNewMeetingDateChange}
//                             className="h-8 w-[150px] text-sm"
//                             autoFocus
//                           />
//                         </div>
//                       )}
//                     </div>
//                     {!isAddingMeetingDate && !editingMeetingDate && (
//                       <Button
//                         variant="ghost"
//                         className="flex text-blue-500 h-[38px] py-2 gap-2 w-[100px] self-start"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onAddMeetingDateClick();
//                         }}
//                       >
//                         <PlusIcon className="w-4 h-4" />
//                         Add date
//                       </Button>
//                     )}
//                   </div>

//                   {/* Board Documents Section - Updated */}
//                   <div className="flex flex-col gap-4">
//                     <h5>Board Documents</h5>

//                     {/* Optional: Display Loading State */}
//                     {isLoadingBoardDocs && boardDocuments.length === 0 && (
//                       <div className="py-4 text-center text-slate-500 italic">
//                         Loading board documents...
//                       </div>
//                     )}

//                     {/* Optional: Display Uploading Files - maybe above the table? */}
//                     {boardUploadingFiles.length > 0 && (
//                       <div className="pb-2 pl-4 border border-dashed border-blue-300 rounded mb-2">
//                         <Table>
//                           <TableBody>
//                             {boardUploadingFiles.map((upload) => (
//                               <TableRow
//                                 key={upload.tempId}
//                                 className={`${upload.status === 'uploading' ? 'opacity-75' : ''} ${upload.status === 'error' ? 'bg-red-50' : ''}`}
//                               >
//                                 <TableCell className="w-2/5">
//                                   {/* Display filename and progress */}
//                                   <div className="flex items-center gap-2">
//                                     <span className="truncate">
//                                       {upload.name}.
//                                       {upload.file.type.split('/').pop()}
//                                     </span>
//                                     {upload.status === 'uploading' && (
//                                       <span className="text-slate-500 text-xs whitespace-nowrap">
//                                         ({Math.round(upload.progress)}%)
//                                       </span>
//                                     )}
//                                     {upload.status === 'error' && (
//                                       <span className="text-red-500 text-xs whitespace-nowrap">
//                                         (Upload Failed)
//                                       </span>
//                                     )}
//                                   </div>
//                                 </TableCell>
//                                 <TableCell>—</TableCell>{' '}
//                                 {/* Placeholder for Expires */}
//                                 <TableCell>
//                                   {' '}
//                                   {/* Dynamic Status Cell */}
//                                   {upload.status === 'uploading' && (
//                                     <span className="text-slate-500">
//                                       Uploading ({Math.round(upload.progress)}%)
//                                     </span>
//                                   )}
//                                   {upload.status === 'error' && (
//                                     <span className="text-red-500">
//                                       Upload Failed
//                                     </span>
//                                   )}
//                                   {upload.status === 'complete' && (
//                                     <span className="text-green-500">
//                                       Processing...
//                                     </span>
//                                   )}
//                                   {upload.status === 'cancelled' && (
//                                     <span className="text-slate-500">
//                                       Cancelled
//                                     </span>
//                                   )}
//                                 </TableCell>
//                                 <TableCell className="flex justify-end gap-2">
//                                   {/* Cancel Button */}
//                                   {upload.status === 'uploading' && (
//                                     <Button
//                                       variant="ghost"
//                                       size="icon"
//                                       className="h-6 w-6 p-0"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         onCancelBoardDocUpload(upload.tempId);
//                                       }}
//                                     >
//                                       <XIcon className="w-4 h-4 text-red-500" />
//                                     </Button>
//                                   )}
//                                   {/* Maybe Retry for errors? */}
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </div>
//                     )}

//                     {/* Main Board Documents Table */}
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="border-b border-slate-200">
//                           <TableHead>File Name</TableHead>
//                           <TableHead>Expires</TableHead>
//                           <TableHead>Added</TableHead>
//                           <TableHead></TableHead> {/* Actions column */}
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {/* Render fetched documents */}
//                         {boardDocuments.map((doc) => (
//                           <TableRow
//                             key={doc.id}
//                             className="border-b border-slate-200 last:border-b-0"
//                           >
//                             <TableCell>
//                               {/* Keep inline edit for name */}
//                               <InlineEditField
//                                 value={doc.name}
//                                 fieldType="text"
//                                 onSave={(newValue) => {
//                                   if (typeof newValue === 'string') {
//                                     onBoardDocNameSave(doc.id, newValue);
//                                   } else {
//                                     console.warn(
//                                       'Attempted to save non-string value as document name',
//                                     );
//                                   }
//                                 }}
//                                 placeholder="Enter name"
//                                 className="body2-medium h-8"
//                               />
//                             </TableCell>
//                             {/* Expires Column */}
//                             <TableCell>
//                               {editingBoardExpiresDocId === doc.id ? (
//                                 <Input
//                                   type="date"
//                                   defaultValue={doc.expiration_date || ''}
//                                   onBlur={(e) => {
//                                     onBoardDocExpiresChange(
//                                       doc.id,
//                                       e.target.value,
//                                     );
//                                     // setEditingBoardExpiresDocId(null); // Already handled in container?
//                                   }}
//                                   className="h-8 w-[150px] text-sm"
//                                 />
//                               ) : (
//                                 <span
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     setEditingBoardExpiresDocId(doc.id);
//                                   }}
//                                   className="cursor-pointer hover:text-blue-600"
//                                 >
//                                   {doc.expiration_date
//                                     ? format(
//                                         parseISO(doc.expiration_date), // Assumes YYYY-MM-DD from API
//                                         'P', // Or 'MM/dd/yyyy'
//                                       )
//                                     : 'Set Date'}
//                                 </span>
//                               )}
//                             </TableCell>
//                             {/* Added Column */}
//                             <TableCell>
//                               {doc.created_at
//                                 ? format(parseISO(doc.created_at), 'P') // Or 'MM/dd/yyyy'
//                                 : '-'}
//                             </TableCell>
//                             {/* Actions Column */}
//                             <TableCell className="flex justify-end gap-2">
//                               <a
//                                 href={doc.file_url || '#'}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 title="View"
//                               >
//                                 <EyeIcon className="w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-600" />
//                               </a>
//                               <a
//                                 href={doc.file_url || '#'}
//                                 download={doc.name}
//                                 title="Download"
//                               >
//                                 <CloudArrowDownIcon className="w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-600" />
//                               </a>
//                               <TrashIcon
//                                 className="w-4 h-4 text-slate-500 cursor-pointer hover:text-red-600"
//                                 onClick={() =>
//                                   onDeleteBoardDocument(doc.id, doc.file_url)
//                                 }
//                                 title="Delete"
//                               />
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>

//                     {/* Show message if no documents and not loading */}
//                     {!isLoadingBoardDocs &&
//                       boardDocuments.length === 0 &&
//                       boardUploadingFiles.length === 0 && (
//                         <div className="py-4 text-center text-slate-500 italic">
//                           No board documents uploaded.
//                         </div>
//                       )}

//                     {/* Moved Add Button */}
//                     <Button
//                       variant="ghost"
//                       className="flex text-blue-500 h-[38px] py-2 gap-2 w-[170px] self-start mt-2"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onAddBoardDocumentsClick();
//                       }}
//                     >
//                       <PlusIcon className="w-4 h-4" />
//                       Add document(s)
//                     </Button>
//                   </div>
//                 </div>
//               </ScrollArea>
//             </div>
//           </TabsContent>

//           {/* Assigned Reports Tab */}
//           <TabsContent
//             tabId="assigned-reports"
//             activeTab={currentTab}
//             className="flex-1 overflow-hidden flex flex-col"
//           >
//             <div className="flex flex-col gap-6 h-full flex-1 overflow-hidden px-6 py-4">
//               <ScrollArea className="h-full">
//                 <div className="flex flex-col gap-4">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-b border-slate-200">
//                         <TableHead className="text-slate-500">NAME</TableHead>
//                         <TableHead className="text-slate-500">STATUS</TableHead>
//                         <TableHead className="text-slate-500 text-right"></TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {assignedReports.map((report) => (
//                         <TableRow
//                           key={report.id}
//                           className="border-b border-slate-200"
//                         >
//                           <TableCell>{report.name}</TableCell>
//                           <TableCell>
//                             <Badge
//                               className={`
//                               ${
//                                 report.status === 'Complete'
//                                   ? 'bg-emerald-500 text-white hover:bg-emerald-600'
//                                   : 'bg-slate-400 text-white hover:bg-slate-500'
//                               }
//                               `}
//                             >
//                               {report.status}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="flex gap-1 text-blue-500 justify-end"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 onOpenReport(report.reportId ?? report.id);
//                               }}
//                             >
//                               <ArrowUpRightIcon className="w-4 h-4" />
//                               Open report
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                   <Button
//                     variant="ghost"
//                     className="flex text-blue-500 h-[38px] py-2 gap-2 w-[140px]"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onAssignReportsClick();
//                     }}
//                   >
//                     <PlusIcon className="w-4 h-4" />
//                     Assign report
//                   </Button>
//                 </div>
//               </ScrollArea>
//             </div>
//           </TabsContent>

//           {/* Documents Tab */}
//           <TabsContent
//             tabId="documents"
//             activeTab={currentTab}
//             className="flex-1 overflow-hidden flex flex-col"
//           >
//             <div className="p-4 border-b border-slate-300 bg-slate-50">
//               <SearchBar placeholder="Search for a document by title" />
//             </div>
//             <ScrollArea className="flex-1">
//               <div className="px-6 py-4 flex flex-col gap-0">
//                 {/* Iterate over sections */}
//                 {sortedSections.map((section) => {
//                   const sectionDocuments =
//                     documentsGroupedBySection[section] || [];
//                   const sectionUploadingFiles = uploadingFiles.filter(
//                     (f) => f.year === section && f.status === 'uploading', // Match upload state by section key
//                   );
//                   const isSectionExpanded = expandedFolders.includes(section);
//                   const itemCount =
//                     sectionDocuments.length + sectionUploadingFiles.length;

//                   // Don't render if section is "Unknown" and empty (already filtered in memo)
//                   // if (section === 'Unknown' && itemCount === 0) return null;

//                   return (
//                     <div
//                       key={section}
//                       className="flex flex-col gap-0 border-b border-slate-200 last:border-b-0"
//                     >
//                       {/* Folder Header Row */}
//                       <div className="h-10 flex items-center justify-between py-2">
//                         {/* Section Toggle */}
//                         <div className="flex items-center">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               onFolderToggle(section);
//                             }}
//                             className="flex items-center gap-2 text-slate-900 hover:text-slate-700 p-1 -ml-1"
//                           >
//                             <div className="w-5 h-5 flex items-center justify-center">
//                               {isSectionExpanded ? (
//                                 <ChevronDownIcon className="w-4 h-4" />
//                               ) : (
//                                 <ChevronRightIcon className="w-4 h-4" />
//                               )}
//                             </div>
//                             <span className="body2-medium">
//                               {section} ({itemCount} items)
//                             </span>
//                           </button>
//                         </div>
//                         {/* Add Button */}
//                         <Button
//                           variant="ghost"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             onAddDocumentsClick(section);
//                           }}
//                           className="flex text-blue-500 body2-semibold h-auto py-1 px-2 gap-1"
//                         >
//                           <PlusIcon className="size-5" />
//                           Add document(s)
//                         </Button>
//                       </div>

//                       {/* Expanded Content */}
//                       {isSectionExpanded && (
//                         <div className="pb-2 pl-6">
//                           {isLoadingDocs &&
//                           sectionDocuments.length === 0 &&
//                           sectionUploadingFiles.length === 0 ? (
//                             <div className="py-2 text-sm text-slate-500 italic">
//                               Loading...
//                             </div>
//                           ) : itemCount === 0 ? (
//                             <div className="py-2 text-sm text-slate-500 italic">
//                               {/* Updated empty state message */}
//                               No documents uploaded for this{' '}
//                               {section.includes(' - ')
//                                 ? 'period'
//                                 : 'section'}.
//                             </div>
//                           ) : (
//                             <Table>
//                               <TableHeader>
//                                 <TableRow>
//                                   <TableHead>File Name</TableHead>
//                                   <TableHead>Type</TableHead>
//                                   <TableHead>Expiration Date</TableHead>
//                                   <TableHead>Created At</TableHead>
//                                   <TableHead></TableHead>
//                                 </TableRow>
//                               </TableHeader>
//                               <TableBody>
//                                 {/* Render uploading files first */}
//                                 {sectionUploadingFiles.map((upload) => (
//                                   <TableRow
//                                     key={upload.tempId}
//                                     className={`${upload.status === 'uploading' ? 'opacity-75' : ''} ${upload.status === 'error' ? 'bg-red-50' : ''}`}
//                                   >
//                                     {' '}
//                                     {/* Indicate uploading */}
//                                     <TableCell className="flex items-center gap-1">
//                                       <Input
//                                         value={upload.name}
//                                         onChange={(e) =>
//                                           onUploadingFileNameChange(
//                                             upload.tempId,
//                                             e.target.value,
//                                           )
//                                         }
//                                         className="h-8 flex-1"
//                                       />
//                                       {upload.status === 'error' && (
//                                         <span className="text-red-500 text-xs whitespace-nowrap">
//                                           (Failed)
//                                         </span>
//                                       )}
//                                     </TableCell>
//                                     <TableCell>
//                                       {upload.file.type
//                                         .split('/')[1]
//                                         ?.toUpperCase() || ''}
//                                     </TableCell>
//                                     {/* Status Column for Uploading Files */}
//                                     <TableCell colSpan={2}>
//                                       {' '}
//                                       {/* Combine Expires and Created At for status */}
//                                       {upload.status === 'uploading' && (
//                                         <span className="text-slate-500 text-xs">
//                                           Uploading (
//                                           {Math.round(upload.progress)}%)
//                                         </span>
//                                       )}
//                                       {upload.status === 'error' && (
//                                         <span className="text-red-500 text-xs">
//                                           Upload Failed
//                                         </span>
//                                       )}
//                                       {upload.status === 'complete' && (
//                                         <span className="text-green-500 text-xs">
//                                           Processing...
//                                         </span>
//                                       )}
//                                       {upload.status === 'cancelled' && (
//                                         <span className="text-slate-500 text-xs">
//                                           Cancelled
//                                         </span>
//                                       )}
//                                     </TableCell>
//                                     <TableCell className="flex justify-end gap-2">
//                                       {/* Cancel Button */}
//                                       <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         className="h-6 w-6 p-0"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           onCancelUpload(upload.tempId);
//                                         }}
//                                       >
//                                         <XIcon className="w-4 h-4 text-red-500" />
//                                       </Button>
//                                     </TableCell>
//                                   </TableRow>
//                                 ))}
//                                 {/* Fetched Documents */}
//                                 {sectionDocuments.map((doc) => (
//                                   <TableRow
//                                     key={doc.id}
//                                     className="border-b border-slate-200"
//                                   >
//                                     <TableCell className="flex items-center gap-2">
//                                       <InlineEditField
//                                         value={doc.name}
//                                         fieldType="text"
//                                         onSave={(newValue) => {
//                                           if (typeof newValue === 'string') {
//                                             onDocumentNameSave(
//                                               doc.id,
//                                               newValue,
//                                               doc.year,
//                                             );
//                                           } else {
//                                             console.warn(
//                                               'Attempted to save non-string value as document name',
//                                             );
//                                           }
//                                         }}
//                                         placeholder="Enter name"
//                                         className="body2-medium h-8"
//                                       />
//                                     </TableCell>
//                                     <TableCell>
//                                       {doc.type
//                                         ? doc.type
//                                             .split('/')
//                                             .pop()
//                                             ?.toUpperCase() || doc.type
//                                         : '-'}
//                                     </TableCell>
//                                     <TableCell>
//                                       {editingExpiresDocId === doc.id ? (
//                                         <Input
//                                           type="date"
//                                           defaultValue={
//                                             doc.expiration_date || ''
//                                           }
//                                           onBlur={(e) => {
//                                             onExpiresDateChange(
//                                               doc.id,
//                                               e.target.value,
//                                               doc.year,
//                                             );
//                                             setEditingExpiresDocId(null);
//                                           }}
//                                           className="h-8 w-[150px] text-sm"
//                                         />
//                                       ) : (
//                                         <span
//                                           onClick={(e) => {
//                                             e.stopPropagation();
//                                             setEditingExpiresDocId(doc.id);
//                                           }}
//                                           className="cursor-pointer hover:text-blue-600"
//                                         >
//                                           {doc.expiration_date
//                                             ? format(
//                                                 new Date(
//                                                   doc.expiration_date +
//                                                     'T00:00:00',
//                                                 ),
//                                                 'P',
//                                               )
//                                             : 'Set Date'}
//                                         </span>
//                                       )}
//                                     </TableCell>
//                                     <TableCell>
//                                       {doc.created_at
//                                         ? format(parseISO(doc.created_at), 'P')
//                                         : '-'}
//                                     </TableCell>
//                                     <TableCell className="flex justify-end gap-2">
//                                       <a
//                                         href={doc.file_url || '#'}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                       >
//                                         <EyeIcon className="w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-600" />
//                                       </a>
//                                       <a
//                                         href={doc.file_url || '#'}
//                                         download={doc.name}
//                                       >
//                                         <CloudArrowDownIcon className="w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-600" />
//                                       </a>
//                                       <TrashIcon
//                                         className="w-4 h-4 text-slate-500 cursor-pointer hover:text-red-600"
//                                         onClick={() =>
//                                           onDeleteDocument(doc.id, doc.file_url)
//                                         }
//                                         title="Delete"
//                                       />
//                                     </TableCell>
//                                   </TableRow>
//                                 ))}
//                               </TableBody>
//                             </Table>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </ScrollArea>
//           </TabsContent>
//         </TabsContainer>
//       </div>
//     </Drawer>
//   );
// };

// // Note: Child dialogs (AddUser, AddBoardMember, etc.) are NOT rendered here.
// // Their open state and handlers are managed by the Container component,
// // and the container component renders them alongside this presentational component.
// // This component only provides the UI elements (like buttons) that trigger those dialogs via props.
// // Similarly, hidden file inputs are not included here; their refs and handlers belong in the container.
