// import React, { useMemo, useState } from 'react';
// import { format, parseISO } from 'date-fns';
// import {
//   SquaresPlusIcon,
//   TrashIcon,
//   ArrowUpRightIcon,
//   PlusIcon,
//   XMarkIcon,
//   CheckIcon,
//   ChevronLeftIcon,
//   ChevronDownIcon,
//   ChevronRightIcon,
//   EyeIcon,
//   CloudArrowDownIcon,
//   PencilIcon,
//   ArrowsUpDownIcon,
// } from '@heroicons/react/24/outline';

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
// import { Tabs, TabsContainer, TabsContent } from '@/components/base/Tabs';
// import { ScrollArea } from '@/components/base/ScrollArea';
// import { Input } from '@/components/base/Input';
// import { InlineEditField } from '@/components/base/InlineEditField';
// import { DataLoading } from '@/components/base/Loading';

// import { EntityType } from '@/contexts/DrawerNavigationContext';

// import { School } from '@/store/slices/schoolsSlice';
// import { SchoolUser } from '@/store/slices/schoolUsersSlice';
// import { CustomFieldDefinition } from '@/store/slices/customFieldDefinitionsSlice';
// import { ActivityLog } from '@/store/slices/activityLogSlice';
// import { EntityDocument } from '@/store/slices/entityDocumentsSlice';
// import { AssignedReport as BaseAssignedReport } from '@/store/slices/assignedReportsSlice';
// import { getFolderKeyFromYear } from './utils'; // Use utils

// // Types from EntityInfoDrawer (can be moved to a shared types file)
// export interface UploadingFile {
//   tempId: string;
//   file: File;
//   name: string;
//   section: string; // Changed from year to section
//   progress: number;
//   status: 'uploading' | 'complete' | 'error' | 'cancelled';
//   expires: string | null;
// }

// export interface AssignedReport {
//   id: string;
//   name: string;
//   status: 'Complete' | 'Pending';
// }

// // Define the possible permission levels
// export type UserPermission = 'View' | 'Edit' | 'Hidden';

// // Define context function types explicitly for props
// export interface DrawerNavigationFunctions {
//   pushView: (
//     entityId: string,
//     entityType: EntityType,
//     parentEntityId?: string,
//     parentEntityType?: EntityType,
//   ) => void;
//   popView: () => void;
// }

// interface UserAssignedReport extends BaseAssignedReport {
//   schoolId: string;
//   schoolName: string;
// }

// interface UserInfoDrawerProps extends DrawerNavigationFunctions {
//   // Core Data
//   user: SchoolUser | null;
//   entityType: EntityType; // User type (School User or Board Member)
//   assignedSchools: School[];
//   userAssignedReports: UserAssignedReport[];
//   userDocuments: EntityDocument[];
//   // Mock data/placeholders passed as props
//   activityLogs: ActivityLog[];

//   // UI State
//   currentTab: string;
//   isAddingSchool: boolean;
//   schoolSearchQuery: string;
//   schoolSearchResults: School[];
//   selectedSchool: School | null;
//   expandedFolders: string[];
//   uploadingFiles: UploadingFile[];
//   editingExpiresDocId: string | null;
//   parentEntityName: string | null;
//   parentEntityType: EntityType | undefined;
//   isLoadingDocs: boolean;
//   customFieldDefinitions: CustomFieldDefinition[];
//   customFieldsLoading: boolean;

//   // Event Handlers
//   onClose: () => void;
//   onBack: () => void;
//   onTabChange: (tabId: string) => void;
//   onManageCustomFieldsClick: () => void;
//   onEditUserClick: () => void;
//   onAddFieldClick: () => void;
//   onAddSchoolClick: () => void;
//   onCancelAddSchool: () => void;
//   onConfirmAddSchool: () => void;
//   onSchoolSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onSchoolSelect: (school: School) => void;
//   onCustomFieldSave: (fieldName: string, newValue: string | File) => void;
//   onFolderToggle: (folderName: string) => void;
//   onAddDocumentsClick: (section: string) => void;
//   onUploadingFileNameChange: (tempId: string, newName: string) => void;
//   onCancelUpload: (tempId: string) => void;
//   onDocumentNameSave: (
//     docId: string,
//     newName: string,
//     currentSection: string,
//   ) => void;
//   onExpiresDateChange: (
//     docId: string,
//     dateValue: string,
//     currentSection: string,
//   ) => void;
//   setEditingExpiresDocId: (docId: string | null) => void;
//   onOpenReport: (reportId: string) => void;
//   onDeleteDocument: (docId: string, s3FileKey: string) => void;
//   onCustomFieldFileUpload: (
//     file: File,
//     onProgress: (progress: number) => void,
//   ) => Promise<string>;
// }

// const tabs = [
//   { id: 'details', label: 'Details' },
//   { id: 'assigned-reports', label: 'Assigned Reports' },
//   { id: 'documents', label: 'Documents' },
// ];

// const STANDARD_DOCUMENT_SECTIONS = [
//   'General Documents',
//   '2024 - 2025',
//   '2023 - 2024',
//   '2022 - 2023',
// ];

// export const UserInfoDrawer: React.FC<UserInfoDrawerProps> = ({
//   user,
//   entityType,
//   assignedSchools,
//   userAssignedReports,
//   userDocuments,
//   activityLogs,
//   currentTab,
//   isAddingSchool,
//   schoolSearchQuery,
//   schoolSearchResults,
//   selectedSchool,
//   expandedFolders,
//   uploadingFiles,
//   editingExpiresDocId,
//   parentEntityName,
//   parentEntityType,
//   isLoadingDocs,
//   customFieldDefinitions,
//   customFieldsLoading,
//   onClose,
//   onBack,
//   onTabChange,
//   onManageCustomFieldsClick,
//   onEditUserClick,
//   onAddFieldClick,
//   onAddSchoolClick,
//   onCancelAddSchool,
//   onConfirmAddSchool,
//   onSchoolSearchChange,
//   onSchoolSelect,
//   onCustomFieldSave,
//   onFolderToggle,
//   onAddDocumentsClick,
//   onUploadingFileNameChange,
//   onCancelUpload,
//   onDocumentNameSave,
//   onExpiresDateChange,
//   setEditingExpiresDocId,
//   onOpenReport,
//   onDeleteDocument,
//   pushView,
//   onCustomFieldFileUpload,
// }) => {
//   const [editingDocNameId, setEditingDocNameId] = useState<string | null>(null);

//   const documentsGroupedBySection = useMemo(() => {
//     const grouped: Record<string, EntityDocument[]> = {};
//     STANDARD_DOCUMENT_SECTIONS.forEach((section) => {
//       grouped[section] = [];
//     });
//     (userDocuments || []).forEach((doc) => {
//       const sectionKey = getFolderKeyFromYear(doc.year);
//       if (!grouped[sectionKey]) {
//         grouped[sectionKey] = [];
//       }
//       grouped[sectionKey].push(doc);
//     });
//     return grouped;
//   }, [userDocuments]);

//   const sortedSections = useMemo(() => {
//     const availableKeys = Object.keys(documentsGroupedBySection);
//     const allSectionKeys = new Set([
//       ...STANDARD_DOCUMENT_SECTIONS,
//       ...availableKeys,
//     ]);

//     return Array.from(allSectionKeys).sort((a, b) => {
//       const indexA = STANDARD_DOCUMENT_SECTIONS.indexOf(a);
//       const indexB = STANDARD_DOCUMENT_SECTIONS.indexOf(b);

//       if (a === 'General Documents') return -1;
//       if (b === 'General Documents') return 1;

//       const yearMatchA = a.match(/^(\d{4})/);
//       const yearMatchB = b.match(/^(\d{4})/);
//       if (yearMatchA && yearMatchB) {
//         return parseInt(yearMatchB[1], 10) - parseInt(yearMatchA[1], 10);
//       }

//       if (indexA !== -1 && indexB !== -1) return indexB - indexA;
//       if (indexA === -1) return 1;
//       if (indexB === -1) return -1;
//       return b.localeCompare(a);
//     });
//   }, [documentsGroupedBySection]);

//   if (!user) {
//     return (
//       <Drawer
//         open={true}
//         onClose={onClose}
//         width="600px"
//         side="right"
//         hideCloseButton
//       >
//         <div className="flex items-center justify-center h-full">
//           <DataLoading />
//         </div>
//       </Drawer>
//     );
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
//         {/* Moved Back Button to Render Unconditionally (if props exist) */}
//         {parentEntityName && parentEntityType && (
//           <div className="flex items-start gap-2 p-[16px_16px_0_16px]">
//             <Button
//               variant="ghost"
//               onClick={onBack}
//               className="flex items-center gap-2 text-slate-600 -ml-2 p-0 h-auto hover:bg-transparent"
//             >
//               <ChevronLeftIcon className="w-4 h-4" />
//               Back to {parentEntityType}: {parentEntityName}
//             </Button>
//           </div>
//         )}

//         {/* Board Member View */}
//         {entityType === 'Board Member' ? (
//           <div className="flex flex-col h-full">
//             <div className="flex flex-col p-[16px_16px_16px_16px] gap-2 border-b border-slate-200">
//               <div className="flex flex-col sm:flex-row gap-4 items-start">
//                 <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-[3px] flex items-center justify-center border border-orange-300">
//                   {user.profile_image ? (
//                     <img
//                       src={user.profile_image}
//                       alt=""
//                       className="w-full h-full object-cover rounded-[3px]"
//                     />
//                   ) : (
//                     <span className="text-xl font-semibold text-orange-600">
//                       {user.first_name?.[0]}
//                       {user.last_name?.[0]}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex-1 flex flex-col gap-1">
//                   <span className="text-lg font-semibold">
//                     {user.first_name} {user.last_name}
//                   </span>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="flex gap-2 h-[36px] w-auto p-[8px_12px] border-slate-700 border rounded-[6px]"
//                     onClick={onManageCustomFieldsClick}
//                   >
//                     <SquaresPlusIcon className="w-[18px] h-[18px] text-slate-700" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="flex gap-2 h-[36px] w-auto p-[8px_12px] border-slate-700 border rounded-[6px]"
//                     onClick={onEditUserClick}
//                   >
//                     <PencilIcon className="w-[18px] h-[18px] text-slate-700" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <ScrollArea className="flex-1">
//               <div className="p-6 flex flex-col gap-6">
//                 <div className="grid grid-cols-[120px_1fr] gap-y-4 items-center">
//                   <span className="body2-bold text-slate-700">Email</span>
//                   <span className="body2-medium text-slate-900">
//                     {user.email}
//                   </span>
//                   <span className="body2-bold text-slate-700">Phone</span>
//                   <span className="body2-medium text-slate-900">
//                     {user.phone_number || '-'}
//                   </span>
//                   <span className="body2-bold text-slate-700">Title</span>
//                   <span className="body2-medium text-slate-900">
//                     {user.title || '-'}
//                   </span>
//                   <span className="body2-bold text-slate-700">Role</span>
//                   <span className="body2-medium text-slate-900">
//                     Board Member
//                   </span>
//                   <span className="body2-bold text-slate-700">Start Term</span>
//                   <span className="body2-medium text-slate-900">
//                     {user.start_term
//                       ? format(new Date(user.start_term), 'P')
//                       : '-'}
//                   </span>
//                   <span className="body2-bold text-slate-700">End Term</span>
//                   <span className="body2-medium text-slate-900">
//                     {user.end_term ? format(new Date(user.end_term), 'P') : '-'}
//                   </span>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <h5 className="mb-2">Custom Fields</h5>
//                   {customFieldsLoading ? (
//                     <div className="py-4 text-center text-slate-500 italic">
//                       Loading...
//                     </div>
//                   ) : customFieldDefinitions.length > 0 ? (
//                     <Table>
//                       <TableBody>
//                         {customFieldDefinitions.map((field) => {
//                           const fieldValue =
//                             user?.custom_fields?.[field.Name] ?? '';
//                           return (
//                             <TableRow
//                               key={field.Name}
//                               className="border-b border-slate-200 last:border-0"
//                             >
//                               <TableCell className="body2-bold w-[150px] py-3 px-0">
//                                 {field.Name}
//                               </TableCell>
//                               <TableCell className="body2-medium py-3 px-0">
//                                 <InlineEditField
//                                   value={fieldValue as string}
//                                   fieldType={field.Type || 'Text'}
//                                   onSave={(newValue) =>
//                                     onCustomFieldSave(field.Name, newValue)
//                                   }
//                                   placeholder={`Enter ${field.Name}`}
//                                   className="body2-medium"
//                                   fileUploadConfig={
//                                     field.Type === 'File Upload'
//                                       ? {
//                                           onFileUpload: onCustomFieldFileUpload,
//                                         }
//                                       : undefined
//                                   }
//                                 />
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })}
//                       </TableBody>
//                     </Table>
//                   ) : (
//                     <span className="body2-medium text-slate-500">
//                       No custom fields defined.
//                     </span>
//                   )}
//                   <Button
//                     variant="ghost"
//                     className="flex text-blue-500 h-[38px] py-2 px-0 gap-2 w-auto self-start mt-2"
//                     onClick={onAddFieldClick}
//                   >
//                     <PlusIcon className="w-4 h-4" /> Add field
//                   </Button>
//                 </div>
//               </div>
//             </ScrollArea>
//           </div>
//         ) : (
//           // Regular User View
//           <TabsContainer
//             defaultTab={currentTab}
//             className="flex flex-col h-full pt-2"
//             onTabChange={onTabChange}
//           >
//             <div className="flex flex-col p-[0_16px_0_16px] gap-2 pb-2">
//               <div className="flex flex-col sm:flex-row gap-4 items-start">
//                 <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-[3px] flex items-center justify-center border border-orange-300">
//                   {user.profile_image ? (
//                     <img
//                       src={user.profile_image}
//                       alt=""
//                       className="w-full h-full object-cover rounded-[3px]"
//                     />
//                   ) : (
//                     <span className="text-xl font-semibold text-orange-600">
//                       {user.first_name?.[0]}
//                       {user.last_name?.[0]}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex-1 flex flex-col gap-1">
//                   <span className="text-lg font-semibold">
//                     {user.first_name} {user.last_name}
//                   </span>
//                   <div className="flex flex-col gap-1">
//                     <span className="body2-regular text-slate-800">
//                       {user.email} | {user.phone_number || '-'}
//                     </span>
//                     <div className="flex items-center gap-2">
//                       <div
//                         className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-amber-500'}`}
//                       ></div>
//                       <span className="body2-regular text-slate-500">
//                         {user.is_active ? 'Active' : 'Pending'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="flex gap-2 h-[36px] w-auto p-[8px_12px] border-slate-700 border rounded-[6px]"
//                     onClick={onManageCustomFieldsClick}
//                   >
//                     <SquaresPlusIcon className="w-[18px] h-[18px] text-slate-700" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="flex gap-2 h-[36px] w-auto p-[8px_12px] border-slate-700 border rounded-[6px]"
//                     onClick={onEditUserClick}
//                   >
//                     <PencilIcon className="w-[18px] h-[18px] text-slate-700" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <Tabs
//               tabs={tabs}
//               activeTab={currentTab}
//               onTabChange={onTabChange}
//               className="border-b border-slate-300 px-4"
//               tabClassName="body1-medium"
//               activeTabClassName="border-b-4 border-orange-500 text-orange-500"
//             />

//             <TabsContent
//               tabId="details"
//               activeTab={currentTab}
//               className="flex-1 overflow-hidden flex flex-col"
//             >
//               <div className="flex flex-col gap-6 h-full flex-1 overflow-hidden px-6 py-4">
//                 <ScrollArea className="h-full">
//                   <div className="flex flex-col gap-4">
//                     <div className="flex flex-col gap-2">
//                       <h5>Assigned Schools and Networks</h5>
//                       <Table className="border-b border-slate-200">
//                         <TableBody>
//                           {assignedSchools.map((school) => (
//                             <TableRow
//                               key={school.id}
//                               className="border-b border-slate-200"
//                             >
//                               <TableCell>{school.name}</TableCell>
//                               <TableCell>{school.type}</TableCell>
//                               <TableCell>
//                                 {school.type === 'School' &&
//                                   (school as School).gradeserved?.[0]}
//                               </TableCell>
//                               <TableCell>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="flex gap-2 text-blue-500"
//                                   onClick={() =>
//                                     pushView(
//                                       school.id,
//                                       school.type === 'Network'
//                                         ? 'Network'
//                                         : 'School',
//                                       user.id,
//                                       entityType,
//                                     )
//                                   }
//                                 >
//                                   <EyeIcon className="w-4 h-4" /> View
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
//                               placeholder="Search for school or network"
//                               value={schoolSearchQuery}
//                               onChange={onSchoolSearchChange}
//                               className="w-full"
//                             />
//                             {schoolSearchResults.length > 0 &&
//                               !selectedSchool && (
//                                 <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
//                                   {schoolSearchResults.map((school) => (
//                                     <div
//                                       key={school.id}
//                                       className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
//                                       onClick={() => onSchoolSelect(school)}
//                                     >
//                                       {school.name} ({school.type})
//                                     </div>
//                                   ))}
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
//                                 <XMarkIcon className="w-4 h-4 text-red-500" />
//                               </Button>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <Button
//                           variant="ghost"
//                           className="flex text-blue-500 h-[38px] py-2 gap-2 w-auto self-start"
//                           onClick={onAddSchoolClick}
//                         >
//                           <PlusIcon className="w-4 h-4" /> Add school or network
//                         </Button>
//                       )}
//                     </div>
//                     <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 mt-4">
//                       <h5 className="mb-2">Custom Fields</h5>
//                       {customFieldsLoading ? (
//                         <div className="py-4 text-center text-slate-500 italic">
//                           Loading...
//                         </div>
//                       ) : customFieldDefinitions.length > 0 ? (
//                         <Table>
//                           <TableBody>
//                             {customFieldDefinitions.map((field) => {
//                               const fieldValue =
//                                 user?.custom_fields?.[field.Name] ?? '';
//                               return (
//                                 <TableRow
//                                   key={field.Name}
//                                   className="border-b border-slate-200 last:border-0"
//                                 >
//                                   <TableCell className="body2-bold w-[150px] py-3 px-0">
//                                     {field.Name}
//                                   </TableCell>
//                                   <TableCell className="body2-medium py-3 px-0">
//                                     <InlineEditField
//                                       value={fieldValue as string}
//                                       fieldType={field.Type || 'Text'}
//                                       onSave={(newValue) =>
//                                         onCustomFieldSave(field.Name, newValue)
//                                       }
//                                       placeholder={`Enter ${field.Name}`}
//                                       className="body2-medium"
//                                       fileUploadConfig={
//                                         field.Type === 'File Upload'
//                                           ? {
//                                               onFileUpload:
//                                                 onCustomFieldFileUpload,
//                                             }
//                                           : undefined
//                                       }
//                                     />
//                                   </TableCell>
//                                 </TableRow>
//                               );
//                             })}
//                           </TableBody>
//                         </Table>
//                       ) : (
//                         <span className="body2-medium text-slate-500">
//                           No custom fields defined.
//                         </span>
//                       )}
//                       <Button
//                         variant="ghost"
//                         className="flex text-blue-500 h-[38px] py-2 px-0 gap-2 w-auto self-start mt-2"
//                         onClick={onAddFieldClick}
//                       >
//                         <PlusIcon className="w-4 h-4" /> Add field
//                       </Button>
//                     </div>
//                     <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 mt-4">
//                       <h5>Activity</h5>
//                       <div className="space-y-4">
//                         {activityLogs.length === 0 ? (
//                           <div className="text-slate-500 text-center py-4">
//                             No activity logs available
//                           </div>
//                         ) : (
//                           activityLogs.map((log, index) => (
//                             <div key={index} className="space-y-1">
//                               <div className="flex items-center gap-1">
//                                 <span className="font-medium text-slate-800">
//                                   {log.user?.first_name}{' '}
//                                   {log.user?.last_name || 'User'}
//                                 </span>
//                                 <span className="text-sm text-slate-500">
//                                   {log.created_at
//                                     ? format(
//                                         parseISO(log.created_at),
//                                         'M/d/yyyy',
//                                       )
//                                     : ''}
//                                 </span>
//                               </div>
//                               <div className="text-slate-700">
//                                 {log.content}
//                               </div>
//                             </div>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </ScrollArea>
//               </div>
//             </TabsContent>

//             <TabsContent
//               tabId="assigned-reports"
//               activeTab={currentTab}
//               className="flex-1 overflow-hidden flex flex-col"
//             >
//               <div className="flex flex-col gap-6 h-full flex-1 overflow-hidden px-6 py-4">
//                 <ScrollArea className="h-full">
//                   <div className="flex flex-col gap-4">
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="border-b border-slate-200">
//                           <TableHead className="text-slate-500">
//                             REPORT NAME
//                           </TableHead>
//                           <TableHead className="text-slate-500">
//                             SCHOOL
//                           </TableHead>
//                           <TableHead className="text-slate-500">
//                             STATUS
//                           </TableHead>
//                           <TableHead className="text-slate-500 text-right"></TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {userAssignedReports.map((report) => (
//                           <TableRow
//                             key={report.id}
//                             className="border-b border-slate-200"
//                           >
//                             <TableCell>{report.name}</TableCell>
//                             <TableCell>{report.schoolName}</TableCell>
//                             <TableCell>
//                               <Badge
//                                 className={`${report.status === 'Complete' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-400 text-white hover:bg-slate-500'}`}
//                               >
//                                 {report.status}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="flex gap-1 text-blue-500 justify-end"
//                                 onClick={() =>
//                                   onOpenReport(report.reportId ?? report.id)
//                                 }
//                               >
//                                 <ArrowUpRightIcon className="w-4 h-4" /> Open
//                                 report
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </ScrollArea>
//               </div>
//             </TabsContent>

//             <TabsContent
//               tabId="documents"
//               activeTab={currentTab}
//               className="flex-1 overflow-hidden flex flex-col"
//             >
//               <ScrollArea className="flex-1">
//                 <div className="px-6 py-4 flex flex-col gap-0">
//                   {sortedSections.map((section) => {
//                     const sectionDocuments =
//                       documentsGroupedBySection[section] || [];
//                     const sectionUploadingFiles = uploadingFiles.filter(
//                       (f) => f.section === section && f.status === 'uploading',
//                     );
//                     const isSectionExpanded = expandedFolders.includes(section);
//                     const itemCount =
//                       sectionDocuments.length + sectionUploadingFiles.length;

//                     return (
//                       <div
//                         key={section}
//                         className="flex flex-col gap-0 border-b border-slate-200 last:border-b-0"
//                       >
//                         <div className="h-10 flex items-center justify-between py-2">
//                           <div className="flex items-center">
//                             <button
//                               onClick={() => onFolderToggle(section)}
//                               className="flex items-center gap-2 text-slate-900 hover:text-slate-700 p-1 -ml-1"
//                             >
//                               <div className="w-5 h-5 flex items-center justify-center">
//                                 {isSectionExpanded ? (
//                                   <ChevronDownIcon className="w-4 h-4" />
//                                 ) : (
//                                   <ChevronRightIcon className="w-4 h-4" />
//                                 )}
//                               </div>
//                               <span className="body2-medium">
//                                 {section} ({itemCount} items)
//                               </span>
//                             </button>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             onClick={() => onAddDocumentsClick(section)}
//                             className="flex text-blue-500 body2-semibold h-auto py-1 px-2 gap-1"
//                           >
//                             <PlusIcon className="size-5" /> Add document(s)
//                           </Button>
//                         </div>
//                         {isSectionExpanded && (
//                           <div className="pb-2 pl-6">
//                             {isLoadingDocs && itemCount === 0 ? (
//                               <div className="py-2 text-sm text-slate-500 italic">
//                                 Loading...
//                               </div>
//                             ) : itemCount === 0 ? (
//                               <div className="py-2 text-sm text-slate-500 italic">
//                                 No documents in this section.
//                               </div>
//                             ) : (
//                               <div className="flex flex-col gap-1 pt-1">
//                                 <div className="flex items-center text-xs text-slate-500 font-medium pb-1">
//                                   <div className="flex-1 pr-2">File Name</div>
//                                   <div className="w-16 px-2">Type</div>
//                                   <div className="w-36 px-2">Expires</div>
//                                   <div className="w-20 flex justify-end pl-2">
//                                     Actions
//                                   </div>
//                                 </div>
//                                 {sectionUploadingFiles.map((upload) => (
//                                   <div
//                                     key={upload.tempId}
//                                     className="flex items-center h-10 border-b border-slate-100 last:border-b-0"
//                                   >
//                                     <div className="flex-1 flex items-center gap-2 pr-2 body2-regular text-slate-700">
//                                       <Input
//                                         value={upload.name}
//                                         onChange={(e) =>
//                                           onUploadingFileNameChange(
//                                             upload.tempId,
//                                             e.target.value,
//                                           )
//                                         }
//                                         className="h-7 text-sm flex-grow"
//                                       />
//                                       <span className="text-xs text-slate-500 whitespace-nowrap">
//                                         ({Math.round(upload.progress)}%)
//                                       </span>
//                                     </div>
//                                     <div className="w-16 px-2 body2-regular text-slate-700 truncate">
//                                       {upload.file.type
//                                         .split('/')
//                                         .pop()
//                                         ?.toUpperCase() || 'FILE'}
//                                     </div>
//                                     <div className="w-36 px-2 body2-regular text-slate-700">
//                                       -
//                                     </div>
//                                     <div className="w-20 flex justify-end items-center pl-2">
//                                       <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
//                                         onClick={() =>
//                                           onCancelUpload(upload.tempId)
//                                         }
//                                       >
//                                         <XMarkIcon className="w-4 h-4" />
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 ))}
//                                 {sectionDocuments.map((doc) => (
//                                   <div
//                                     key={doc.id}
//                                     className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-b-0"
//                                   >
//                                     <div className="flex-1 flex flex-col gap-1">
//                                       {editingDocNameId === doc.id ? (
//                                         <Input
//                                           defaultValue={doc.name}
//                                           placeholder="Enter name"
//                                           className="body2-medium h-8"
//                                           autoFocus
//                                           onBlur={(e) => {
//                                             const newValue = e.target.value;
//                                             if (newValue !== doc.name) {
//                                               onDocumentNameSave(
//                                                 doc.id,
//                                                 newValue,
//                                                 doc.year,
//                                               );
//                                             }
//                                             setEditingDocNameId(null);
//                                           }}
//                                           onKeyDown={(e) => {
//                                             if (e.key === 'Enter') {
//                                               const newValue = (
//                                                 e.target as HTMLInputElement
//                                               ).value;
//                                               if (newValue !== doc.name) {
//                                                 onDocumentNameSave(
//                                                   doc.id,
//                                                   newValue,
//                                                   doc.year,
//                                                 );
//                                               }
//                                               setEditingDocNameId(null);
//                                             } else if (e.key === 'Escape') {
//                                               setEditingDocNameId(null);
//                                             }
//                                           }}
//                                         />
//                                       ) : (
//                                         <>
//                                           <span
//                                             className="body2-medium text-slate-800 cursor-pointer hover:text-blue-600"
//                                             onClick={() =>
//                                               setEditingDocNameId(doc.id)
//                                             }
//                                           >
//                                             {doc.name}
//                                           </span>
//                                           <div className="flex items-center gap-4">
//                                             <span className="body2-regular text-slate-500">
//                                               Uploaded:{' '}
//                                               {doc.created_at
//                                                 ? format(
//                                                     parseISO(doc.created_at),
//                                                     'PP',
//                                                   )
//                                                 : '-'}
//                                             </span>
//                                             <span className="body2-regular text-slate-500 flex items-center gap-1">
//                                               Expires:
//                                               {editingExpiresDocId ===
//                                               doc.id ? (
//                                                 <Input
//                                                   type="date"
//                                                   defaultValue={
//                                                     doc.expiration_date || ''
//                                                   }
//                                                   onBlur={(e) => {
//                                                     if (
//                                                       e.target.value !==
//                                                       (doc.expiration_date ||
//                                                         '')
//                                                     ) {
//                                                       onExpiresDateChange(
//                                                         doc.id,
//                                                         e.target.value,
//                                                         section,
//                                                       );
//                                                     } else {
//                                                       setEditingExpiresDocId(
//                                                         null,
//                                                       );
//                                                     }
//                                                   }}
//                                                   onKeyDown={(e) => {
//                                                     if (e.key === 'Enter') {
//                                                       onExpiresDateChange(
//                                                         doc.id,
//                                                         (
//                                                           e.target as HTMLInputElement
//                                                         ).value,
//                                                         section,
//                                                       );
//                                                     }
//                                                     if (e.key === 'Escape') {
//                                                       setEditingExpiresDocId(
//                                                         null,
//                                                       );
//                                                     }
//                                                   }}
//                                                   autoFocus
//                                                   className="h-6 text-xs"
//                                                 />
//                                               ) : (
//                                                 <span
//                                                   className={`cursor-pointer hover:text-blue-600 ${doc.expiration_date ? '' : 'italic text-slate-400'}`}
//                                                   onClick={() =>
//                                                     setEditingExpiresDocId(
//                                                       doc.id,
//                                                     )
//                                                   }
//                                                 >
//                                                   {doc.expiration_date
//                                                     ? format(
//                                                         parseISO(
//                                                           doc.expiration_date,
//                                                         ),
//                                                         'PP',
//                                                       )
//                                                     : 'Set Date'}
//                                                 </span>
//                                               )}
//                                               <ArrowsUpDownIcon className="w-3 h-3 text-slate-400 opacity-50 ml-1" />
//                                             </span>
//                                           </div>
//                                         </>
//                                       )}
//                                     </div>
//                                     <div className="w-16 px-2 body2-regular text-slate-950 truncate">
//                                       {doc.type
//                                         ? doc.type
//                                             .split('/')
//                                             .pop()
//                                             ?.toUpperCase()
//                                         : 'FILE'}
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                       <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         className="text-slate-500 hover:text-blue-600 p-1 h-auto w-auto cursor-not-allowed opacity-50"
//                                         title="View (Not Implemented)"
//                                         disabled
//                                       >
//                                         <EyeIcon className="w-5 h-5" />
//                                       </Button>
//                                       <a
//                                         href={doc.file_url}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         download
//                                         title="Download"
//                                       >
//                                         <Button
//                                           variant="ghost"
//                                           size="icon"
//                                           className="text-slate-500 hover:text-blue-600 p-1 h-auto w-auto"
//                                         >
//                                           <CloudArrowDownIcon className="w-5 h-5" />
//                                         </Button>
//                                       </a>
//                                       <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         className="text-slate-500 hover:text-blue-600 p-1 h-auto w-auto"
//                                         onClick={() =>
//                                           setEditingDocNameId(doc.id)
//                                         }
//                                         title="Edit Name"
//                                       >
//                                         <PencilIcon className="w-5 h-5" />
//                                       </Button>
//                                       <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         className="text-slate-500 hover:text-red-600 p-1 h-auto w-auto"
//                                         onClick={() =>
//                                           onDeleteDocument(doc.id, doc.file_url)
//                                         }
//                                         title="Delete"
//                                       >
//                                         <TrashIcon className="w-5 h-5" />
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </ScrollArea>
//             </TabsContent>
//           </TabsContainer>
//         )}
//       </div>
//     </Drawer>
//   );
// };
