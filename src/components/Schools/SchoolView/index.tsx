import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { PlusIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  TrashIcon,
  CloudArrowDownIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/components/base/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/Table';
import { ScrollArea } from '@/components/base/ScrollArea';
import { Tabs, TabsContainer, TabsContent } from '@/components/base/Tabs';
import { Badge } from '@/components/base/Badge';
import { FileUploadInput } from '@/components/base/FileUploadInput';
import { InlineEditField } from '@/components/base/InlineEditField';
import { SearchBar } from '@/components/base/SearchBar';
import { Input } from '@/components/base/Input';

import { School } from '@/store/slices/schoolsSlice';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { CustomFieldDefinition } from '@/store/slices/customFieldDefinitionsSlice';
import { RootState } from '@/store';
import { EntityDocument } from '@/store/slices/entityDocumentsSlice';

// Re-define UploadingFile interface locally
export interface UploadingFile {
  tempId: string;
  file: File;
  name: string;
  yearSection: string; // Section key like "2023 - 2024" or "School Documents"
  progress: number;
  status: 'uploading' | 'complete' | 'error' | 'cancelled';
}

// Define necessary prop types
interface SchoolViewProps {
  schoolId: string; // Can be null initially
  schoolUsers: SchoolUser[];
  customFieldDefinitions: CustomFieldDefinition[];
  currentTab: string;
  uploadedImage: string | null;
  assignedReports: { id: string; name: string; status: string }[];
  meetingDates: string[];
  documents: EntityDocument[]; // Changed from userDocuments and type updated
  isLoadingDocuments: boolean; // Added prop for loading state
  // State flags passed as props
  isSubmitting: boolean;
  error: string;
  // Event Handlers
  onTabChange: (tabId: string) => void;
  onImageUpload: (files: File[]) => void;
  onStandardFieldSave: (fieldName: keyof School, newValue: string) => void;
  onCustomFieldSave: (fieldName: string, newValue: string | File) => void;
  onAddUserClick: () => void;
  onAddBoardMemberClick: () => void;
  onManageCustomFieldsClick: () => void; // Need handler for this
  onAddFieldClick: () => void;
  onViewUser: (userId: string) => void; // Add prop for viewing user
  // Document specific props
  expandedFolders: string[];
  onFolderToggle: (folderName: string) => void;
  onAddDocumentsClick: (section: string) => void; // Added handler prop
  uploadingFiles?: UploadingFile[]; // Added for displaying upload progress
  onDeleteDocument: (document: EntityDocument) => void; // Added delete handler prop
  onDocumentNameSave: (
    docId: string,
    newName: string,
    originalDocument: EntityDocument,
  ) => void; // Added name save handler prop
  // Expiration Date Editing Props
  editingExpiresDocId: string | null;
  onSetEditingExpiresDocId: (docId: string | null) => void;
  onExpiresDateChange: (
    docId: string,
    dateValue: string,
    originalDocument: EntityDocument,
  ) => void;
  // Board Meeting Date Add Props
  isAddingMeetingDate: boolean;
  newMeetingDate: string;
  onAddMeetingDateClick: () => void;
  onNewMeetingDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelAddMeetingDate: () => void;
  onSaveNewMeetingDate: () => void; // Added save handler prop
  // Board Meeting Date Edit Props
  editingMeetingDate: string | null;
  currentEditMeetingDateValue: string;
  onSetEditingMeetingDate: (dateString: string) => void;
  onCurrentEditMeetingDateChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onCancelEditMeetingDate: () => void;
  onUpdateMeetingDate: () => void;
  // Board Members Props
  boardMembers: SchoolUser[];
  isLoadingBoardMembers?: boolean;
  // Inline Board Member Add (Initial Props)
  isAddingBoardMemberInline: boolean;
  onToggleAddBoardMemberInlineSearch: () => void;
  initialBoardMemberSuggestions: SchoolUser[];
  boardMemberSearchQuery: string;
  // Full Inline Board Member Search/Add Props
  boardMemberSearchResults: SchoolUser[];
  onBoardMemberSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelAddBoardMemberInline: () => void;
  onBoardMemberSelect: (user: SchoolUser) => void; // Added select handler prop
  onTriggerAddBoardMemberDialog: (query?: string) => void;
  // Corrected Board Documents Props
  boardDocuments: EntityDocument[]; // THIS IS THE PROP FOR BOARD DOCS DATA
  isLoadingBoardDocumentsList: boolean; // THIS IS ITS LOADING STATE PROP
  onAddBoardDocumentsClick: () => void;
  boardDocUploadingFiles: UploadingFile[];
}

// Local Document interface is no longer needed, replaced by EntityDocument
// interface Document {
//   id: string;
//   name: string;
//   type: string;
//   expires: string | null;
//   section: string;
//   entityId: string;
//   entityType: string;
// }

export const SchoolView: React.FC<SchoolViewProps> = ({
  schoolId,
  schoolUsers,
  customFieldDefinitions,
  currentTab,
  uploadedImage,
  assignedReports,
  meetingDates,
  documents, // Changed from userDocuments
  isLoadingDocuments, // Added
  // isSubmitting,
  error,
  onTabChange,
  onImageUpload,
  onStandardFieldSave,
  onCustomFieldSave,
  onAddUserClick,
  // onAddBoardMemberClick,
  // onManageCustomFieldsClick,
  onViewUser,
  // onAddFieldClick,
  expandedFolders,
  onFolderToggle,
  onAddDocumentsClick, // Added to destructuring
  uploadingFiles, // Added to destructuring
  onDeleteDocument, // Added to destructuring
  onDocumentNameSave, // Added to destructuring
  editingExpiresDocId, // Added
  onSetEditingExpiresDocId, // Added
  onExpiresDateChange, // Added
  // Board Meeting Date Add Props
  isAddingMeetingDate,
  newMeetingDate,
  onAddMeetingDateClick,
  onNewMeetingDateChange,
  onCancelAddMeetingDate,
  onSaveNewMeetingDate, // Added to destructuring
  // Board Meeting Date Edit Props
  editingMeetingDate,
  currentEditMeetingDateValue,
  onSetEditingMeetingDate,
  onCurrentEditMeetingDateChange,
  onCancelEditMeetingDate,
  onUpdateMeetingDate,
  // Destructure new board member props
  boardMembers,
  isLoadingBoardMembers,
  // Inline Board Member Add (Initial Props)
  isAddingBoardMemberInline,
  onToggleAddBoardMemberInlineSearch,
  initialBoardMemberSuggestions,
  boardMemberSearchQuery,
  boardMemberSearchResults,
  onBoardMemberSearchChange,
  onCancelAddBoardMemberInline,
  onBoardMemberSelect, // Added to destructuring
  onTriggerAddBoardMemberDialog, // Destructure prop
  // Destructure corrected board document props
  boardDocuments, // DESTRUCTURED
  isLoadingBoardDocumentsList, // DESTRUCTURED
  onAddBoardDocumentsClick,
  boardDocUploadingFiles,
}) => {
  // Call hooks unconditionally at the top level
  const schools = useSelector((state: RootState) => state.schools.schools);
  const school = useMemo(
    () => schools.find((s) => s.id === schoolId),
    [schools, schoolId],
  );

  // --- Document Sectioning Logic (adapted from EntityInfoDrawerComponent) --- //
  const STANDARD_DOCUMENT_SECTIONS = [
    'School Documents',
    '2024 - 2025',
    '2023 - 2024',
    '2022 - 2023',
    '2021 - 2022',
    '2020 - 2021',
    '2019 - 2020',
    '2018 - 2019',
    // Add more years as required
  ];

  const getSectionKeyFromDocument = (doc: EntityDocument): string => {
    const year = doc.year;
    if (year === 'School Documents') {
      return year;
    }
    if (year && /^[0-9]{4}$/.test(year)) {
      try {
        const startYear = parseInt(year, 10);
        const endYear = startYear + 1;
        return `${startYear} - ${endYear}`;
      } catch {
        return 'Unknown'; // Fallback for unexpected parsing error
      }
    }
    return 'Unknown'; // Fallback for null, undefined, or other invalid formats
  };

  const documentsGroupedBySection = useMemo(() => {
    const grouped: Record<string, EntityDocument[]> = {};
    STANDARD_DOCUMENT_SECTIONS.forEach((section) => {
      grouped[section] = []; // Initialize standard sections
    });

    (documents || []).forEach((doc) => {
      const sectionKey = getSectionKeyFromDocument(doc);
      if (!grouped[sectionKey]) {
        grouped[sectionKey] = [];
      }
      grouped[sectionKey].push(doc);
    });

    // Filter out empty "Unknown" sections unless they were explicitly part of standard sections
    if (
      grouped['Unknown'] &&
      grouped['Unknown'].length === 0 &&
      !STANDARD_DOCUMENT_SECTIONS.includes('Unknown')
    ) {
      delete grouped['Unknown'];
    }
    return grouped;
  }, [documents, STANDARD_DOCUMENT_SECTIONS]);

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

      const yearMatchA = a.match(/^(\d{4}) - (\d{4})$/);
      const yearMatchB = b.match(/^(\d{4}) - (\d{4})$/);
      if (yearMatchA && yearMatchB) {
        return parseInt(yearMatchB[1], 10) - parseInt(yearMatchA[1], 10); // Sort years reverse chrono
      }

      if (indexA !== -1 && indexB === -1) return -1; // Standard years before others
      if (indexA === -1 && indexB !== -1) return 1; // Others after standard years

      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b); // Sort non-standard non-year sections alphabetically
      }
      return indexA - indexB; // Keep order from STANDARD_DOCUMENT_SECTIONS
    });
  }, [documentsGroupedBySection, STANDARD_DOCUMENT_SECTIONS]);
  // --- End Document Sectioning Logic --- //

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'board-center', label: 'Board Center' },
    { id: 'assigned-reports', label: 'Assigned Reports' },
    { id: 'documents', label: 'Documents' },
  ];

  // Check for schoolId early, but after hooks
  if (!schoolId) {
    return <div>Loading school data...</div>;
  }

  // Check for school object after trying to find it
  if (!school) {
    return <div>School not found</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center py-4 px-6 border-b border-slate-200">
        <h3 className="text-slate-900 font-semibold">School Details</h3>
        {/* Add buttons or actions if needed in the header */}
      </div>

      <TabsContainer
        defaultTab={currentTab}
        className="flex flex-col flex-1 overflow-hidden h-full"
        onTabChange={onTabChange}
      >
        <Tabs
          tabs={tabs}
          activeTab={currentTab}
          onTabChange={onTabChange}
          className="border-b border-slate-300 px-4 flex-shrink-0"
          tabClassName="body1-medium"
          activeTabClassName="border-b-4 border-orange-500 text-orange-500"
        />

        {/* Details Tab */}
        <TabsContent
          tabId="details"
          activeTab={currentTab}
          className="flex-1 overflow-y-auto"
        >
          <div className="px-6 py-4 flex flex-col gap-4 max-w-[896px]">
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            {/* Basic Info Table */}
            <div className="flex flex-col gap-2">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="body2-bold w-1/3">Name</TableCell>
                    <TableCell>
                      <InlineEditField
                        value={school.name}
                        fieldType="text"
                        onSave={(newValue) =>
                          onStandardFieldSave('name', newValue as string)
                        }
                        placeholder="Enter school name"
                        className="body2-medium"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="body2-bold">Address</TableCell>
                    <TableCell>
                      <InlineEditField
                        value={school.address}
                        fieldType="text"
                        onSave={(newValue) =>
                          onStandardFieldSave('address', newValue as string)
                        }
                        placeholder="Enter address"
                        className="body2-medium"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="body2-bold">City</TableCell>
                    <TableCell>
                      <InlineEditField
                        value={school.city}
                        fieldType="text"
                        onSave={(newValue) =>
                          onStandardFieldSave('city', newValue as string)
                        }
                        placeholder="Enter city"
                        className="body2-medium"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="body2-bold">State</TableCell>
                    <TableCell>
                      <InlineEditField
                        value={school.state}
                        fieldType="text"
                        onSave={(newValue) =>
                          onStandardFieldSave('state', newValue as string)
                        }
                        placeholder="Enter state"
                        className="body2-medium"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="body2-bold">Zip</TableCell>
                    <TableCell>
                      <InlineEditField
                        value={school.zipcode}
                        fieldType="text"
                        onSave={(newValue) =>
                          onStandardFieldSave('zipcode', newValue as string)
                        }
                        placeholder="Enter zipcode"
                        className="body2-medium"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="body2-bold">Type</TableCell>
                    <TableCell>{school.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="body2-bold">Grades Served</TableCell>
                    <TableCell>{school.gradeserved?.join(', ')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="body2-bold">Status</TableCell>
                    <TableCell>{school.status}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Photo Section */}
            <div className="py-2">
              <h5 className="text-slate-700 mb-2">Photo</h5>
              <div className="flex gap-2 items-start">
                <img
                  src={
                    uploadedImage || school.profile_image || './placeholder.svg'
                  } // Add placeholder
                  alt="School"
                  className="flex w-[139px] h-[139px] rounded-[3px] bg-beige-200 object-cover border"
                />
                <FileUploadInput
                  onFilesSelected={onImageUpload}
                  allowedTypes={['.png', '.jpg', '.jpeg', '.gif']}
                  className="w-full max-w-xs" // Constrain width
                  multiple={false}
                />
              </div>
            </div>

            {/* Team Members Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h5 className="text-slate-700">Team Members</h5>
              </div>
              <div className="flex gap-4 w-full flex-wrap">
                {schoolUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start justify-between w-[calc(33%-8px)] p-2 rounded-[8px] border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    onClick={() => onViewUser(user.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        onViewUser(user.id);
                    }}
                  >
                    <div className="flex gap-2 bg-white items-center flex-1">
                      <div className="w-[56px] h-[56px] rounded-[6px] bg-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-full h-full rounded-[6px] object-cover"
                          />
                        ) : (
                          <span className="text-lg">{`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="body2-bold text-slate-900">{`${user.first_name} ${user.last_name}`}</span>
                        <span className="body3-regular">
                          {user.role?.replace('_', ' ')}
                        </span>
                        <span className="body3-regular text-slate-500">
                          {`${user.is_active ? 'Active' : 'Pending'}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="flex text-blue-500 h-[38px] py-2 gap-2 w-[100px] self-start"
                onClick={onAddUserClick}
              >
                <PlusIcon className="w-4 h-4" />
                Add user
              </Button>
            </div>

            {/* Custom Fields Section */}
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="">Custom Fields</h5>
              </div>
              {customFieldDefinitions.length > 0 ? (
                <Table>
                  <TableBody>
                    {customFieldDefinitions.map((fieldDef) => {
                      const fieldValue =
                        school?.custom_fields?.[fieldDef.Name] || '';
                      return (
                        <TableRow
                          key={fieldDef.Name}
                          className="border-b border-slate-200 last:border-0"
                        >
                          <TableCell className="py-2 body2-bold w-[150px] pl-0">
                            {fieldDef.Name}
                          </TableCell>
                          <TableCell className="py-2 body2-medium pl-0">
                            <InlineEditField
                              value={fieldValue}
                              fieldType={fieldDef.Type || 'Text'}
                              onSave={(newValue) =>
                                onCustomFieldSave(fieldDef.Name, newValue)
                              }
                              placeholder="Enter value"
                              className="body2-medium"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <span className="body2-medium text-slate-500">
                  No custom fields defined.
                </span>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Board Center Tab */}
        <TabsContent
          tabId="board-center"
          activeTab={currentTab}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="flex flex-col gap-4">
            <h5 className="mb-4">Board Center</h5>
            {/* Board Members List */}
            <div className="flex flex-col gap-4">
              <h5>Board Members</h5>
              {isLoadingBoardMembers ? (
                <div className="py-4 text-center text-slate-500 italic">
                  Loading board members...
                </div>
              ) : boardMembers.length === 0 ? (
                <div className="py-4 text-slate-500 italic">
                  No board members assigned.
                </div>
              ) : (
                <Table className="border-b border-slate-200">
                  <TableBody>
                    {boardMembers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-b border-slate-200 last:border-0 hover:bg-slate-50 cursor-pointer"
                        onClick={() => onViewUser(user.id)} // TODO: Confirm if onViewUser should handle Board Member type
                        role="button" // Changed from link as it triggers a drawer view
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ')
                            onViewUser(user.id);
                        }}
                      >
                        <TableCell>
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                            {user.profile_image ? (
                              <img
                                src={user.profile_image}
                                alt={`${user.first_name} ${user.last_name}`}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-sm">{`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="body1-regular">{`${user.first_name} ${user.last_name}`}</span>
                            {user.title && (
                              <span className="body2-regular text-slate-500">
                                {user.title}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.start_term && user.end_term
                            ? `${format(new Date(user.start_term), 'M/d/yyyy')} - ${format(new Date(user.end_term), 'M/d/yyyy')}`
                            : 'Term not set'}
                        </TableCell>
                        <TableCell>
                          {/* onViewUser above handles the main click. EntityInfoDrawer also had a specific View Member button */}
                          {/* Keep it simple for now, main row click opens user. Can add explicit button if needed. */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {/* TODO: Add inline search/add UI for board members here later */}
              {isAddingBoardMemberInline ? (
                <div className="flex flex-col gap-2 mt-2 p-3 border border-dashed border-slate-300 rounded-md">
                  <Input
                    type="text"
                    placeholder="Search for user to add as board member"
                    value={boardMemberSearchQuery}
                    onChange={onBoardMemberSearchChange}
                    className="w-full h-9 text-sm"
                  />
                  {(boardMemberSearchQuery
                    ? boardMemberSearchResults
                    : initialBoardMemberSuggestions
                  ).length > 0 && (
                    <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-md mt-1">
                      <div className="p-2 text-xs text-slate-500">
                        {boardMemberSearchQuery
                          ? 'Search Results:'
                          : 'Suggestions:'}
                      </div>
                      {(boardMemberSearchQuery
                        ? boardMemberSearchResults
                        : initialBoardMemberSuggestions
                      ).map((user) => (
                        <div
                          key={user.id}
                          className="px-3 py-1.5 hover:bg-slate-100 cursor-pointer text-sm"
                          onClick={() => onBoardMemberSelect(user)} // Wired up select handler
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ')
                              onBoardMemberSelect(user);
                          }}
                        >
                          {user.first_name} {user.last_name} ({user.email})
                        </div>
                      ))}
                    </div>
                  )}
                  {boardMemberSearchQuery &&
                    boardMemberSearchResults.length === 0 &&
                    initialBoardMemberSuggestions.length === 0 && (
                      <div className="text-sm text-slate-500 italic py-1">
                        No users found matching '{boardMemberSearchQuery}'.
                      </div>
                    )}
                  {/* Link to add new user if query exists and no results found */}
                  {boardMemberSearchQuery &&
                    !boardMemberSearchResults.some(
                      (u) =>
                        `${u.first_name} ${u.last_name}`.toLowerCase() ===
                          boardMemberSearchQuery.toLowerCase() ||
                        u.email.toLowerCase() ===
                          boardMemberSearchQuery.toLowerCase(),
                    ) &&
                    !initialBoardMemberSuggestions.some(
                      (u) =>
                        `${u.first_name} ${u.last_name}`.toLowerCase() ===
                          boardMemberSearchQuery.toLowerCase() ||
                        u.email.toLowerCase() ===
                          boardMemberSearchQuery.toLowerCase(),
                    ) && (
                      <div
                        className="text-blue-500 hover:text-blue-700 cursor-pointer text-sm mt-2 p-2 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200"
                        onClick={() =>
                          onTriggerAddBoardMemberDialog(boardMemberSearchQuery)
                        } // Use the new prop
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ')
                            onTriggerAddBoardMemberDialog(
                              boardMemberSearchQuery,
                            );
                        }}
                      >
                        + Add '{boardMemberSearchQuery}' as new board member
                      </div>
                    )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancelAddBoardMemberInline} // Use specific cancel for inline UI
                    className="self-start mt-2"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="flex text-blue-500 h-[38px] py-2 gap-2 w-[170px] self-start"
                  onClick={onToggleAddBoardMemberInlineSearch} // Changed to toggle inline search UI
                >
                  <PlusIcon className="w-4 h-4" />
                  Add board member
                </Button>
              )}
            </div>
            {/* Board Meeting Dates */}
            <div className="flex flex-col gap-4">
              <h5>Board Meeting Dates</h5>
              <div className="flex flex-col">
                {meetingDates.map((dateString) => (
                  <div
                    key={dateString}
                    className="py-4 border-b border-slate-200 last:border-b-0 flex items-center justify-between"
                  >
                    {editingMeetingDate === dateString ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="date"
                          value={currentEditMeetingDateValue}
                          onChange={onCurrentEditMeetingDateChange}
                          className="h-8 py-1 px-2 text-sm border-slate-300 rounded w-[150px]"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onCancelEditMeetingDate}
                          className="text-slate-600 hover:text-slate-800"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={onUpdateMeetingDate}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Update Date
                        </Button>
                      </div>
                    ) : (
                      <span
                        onClick={() => onSetEditingMeetingDate(dateString)}
                        className="cursor-pointer hover:text-blue-600"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ')
                            onSetEditingMeetingDate(dateString);
                        }}
                      >
                        {format(
                          new Date(dateString.replace(/-/g, '/')),
                          'MMMM d, yyyy',
                        )}
                      </span>
                    )}
                  </div>
                ))}
                {meetingDates.length === 0 && !isAddingMeetingDate && (
                  <div className="py-4 text-slate-500 italic">
                    No meeting dates scheduled.
                  </div>
                )}
              </div>

              {isAddingMeetingDate ? (
                <div className="flex items-center gap-2 py-2">
                  <Input
                    type="date"
                    value={newMeetingDate}
                    onChange={onNewMeetingDateChange}
                    className="h-8 py-1 px-2 text-sm border-slate-300 rounded w-[150px]"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-800"
                    onClick={onCancelAddMeetingDate}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={onSaveNewMeetingDate} // Wired up save handler
                  >
                    Save Date
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="flex text-blue-500 h-[38px] py-2 gap-2 w-[100px] self-start"
                  onClick={onAddMeetingDateClick} // Wired up
                >
                  <PlusIcon className="w-4 h-4" /> Add date
                </Button>
              )}
            </div>
            {/* Board Documents */}
            <div className="flex flex-col gap-4">
              <h5>Board Documents</h5>
              {/* Display uploading board documents */}
              {boardDocUploadingFiles &&
                boardDocUploadingFiles.filter(
                  (f) => f.status === 'uploading' || f.status === 'error',
                ).length > 0 && (
                  <div className="mb-2 border border-dashed border-blue-300 p-2 rounded-md">
                    <h6 className="text-sm font-medium text-slate-700 mb-1">
                      Currently Uploading:
                    </h6>
                    {boardDocUploadingFiles
                      .filter(
                        (f) => f.status === 'uploading' || f.status === 'error',
                      )
                      .map((upload) => (
                        <div
                          key={upload.tempId}
                          className="text-xs text-slate-600 py-0.5"
                        >
                          {upload.name} (
                          {upload.status === 'error'
                            ? 'Error'
                            : `${Math.round(upload.progress)}%`}
                          )
                        </div>
                      ))}
                  </div>
                )}

              {isLoadingBoardDocumentsList && boardDocuments.length === 0 ? (
                <div className="py-4 text-center text-slate-500 italic">
                  Loading board documents...
                </div>
              ) : !isLoadingBoardDocumentsList &&
                boardDocuments.length === 0 &&
                (!boardDocUploadingFiles ||
                  boardDocUploadingFiles.filter((f) => f.status !== 'complete')
                    .length === 0) ? (
                <div className="py-4 text-center text-slate-500 italic">
                  No board documents uploaded.
                </div>
              ) : boardDocuments.length > 0 ? (
                <Table className="border-b border-slate-200">
                  <TableHeader>
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="text-slate-500">
                        File Name
                      </TableHead>
                      <TableHead className="text-slate-500">Expires</TableHead>
                      <TableHead className="text-slate-500">Added</TableHead>
                      <TableHead className="text-slate-500 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boardDocuments.map((doc) => (
                      <TableRow
                        key={doc.id}
                        className="border-b border-slate-200 last:border-b-0"
                      >
                        <TableCell className="py-2">{doc.name}</TableCell>
                        <TableCell className="py-2">
                          {doc.expiration_date
                            ? format(
                                new Date(
                                  doc.expiration_date.replace(/-/g, '/'),
                                ),
                                'P',
                              )
                            : 'Set Date'}
                        </TableCell>
                        <TableCell className="py-2">
                          {doc.created_at
                            ? format(new Date(doc.created_at), 'P')
                            : '-'}
                        </TableCell>
                        <TableCell className="flex gap-2 justify-end py-2">
                          <a
                            href={doc.file_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`View ${doc.name}`}
                            className="text-slate-500 hover:text-blue-600"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </a>
                          <a
                            href={doc.file_url || '#'}
                            download={doc.name}
                            title={`Download ${doc.name}`}
                            className="text-slate-500 hover:text-blue-600"
                          >
                            <CloudArrowDownIcon className="w-4 h-4" />
                          </a>
                          <button
                            title={`Delete ${doc.name}`}
                            className="text-slate-500 hover:text-red-600" /* onClick={() => onDeleteBoardDoc(doc.id)} */
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}

              <Button
                variant="ghost"
                className="flex text-blue-500 h-[38px] py-2 gap-2 w-[170px] self-start mt-2"
                onClick={onAddBoardDocumentsClick}
              >
                <PlusIcon className="w-4 h-4" /> Add document(s)
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Assigned Reports Tab */}
        <TabsContent
          tabId="assigned-reports"
          activeTab={currentTab}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="flex flex-col gap-4">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200">
                  <TableHead className="text-slate-500">NAME</TableHead>
                  <TableHead className="text-slate-500">STATUS</TableHead>
                  <TableHead className="text-slate-500"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="border-b border-slate-200"
                  >
                    <TableCell>{report.name}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${report.status === 'Complete' ? 'bg-emerald-500' : 'bg-slate-400'} text-white hover:bg-opacity-80`}
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{/* Actions if needed */}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant="ghost"
              className="flex text-blue-500 h-[38px] py-2 gap-2 w-[140px] self-start"
            >
              <PlusIcon className="w-4 h-4" /> Assign report
            </Button>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent
          tabId="documents"
          activeTab={currentTab}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-slate-300 bg-slate-50 flex-shrink-0">
            <SearchBar placeholder="Search for a document by title" />
          </div>
          <ScrollArea className="flex-1 p-6">
            {isLoadingDocuments && documents.length === 0 ? (
              <div className="text-center text-slate-500 italic py-4">
                Loading documents...
              </div>
            ) : (
              <div className="flex flex-col gap-0">
                {sortedSections.length === 0 && !isLoadingDocuments ? (
                  <div className="text-center text-slate-500 italic py-4">
                    No document categories defined or available.
                  </div>
                ) : (
                  sortedSections.map((section) => {
                    const sectionDocuments =
                      documentsGroupedBySection[section] || [];
                    const sectionUploadingFiles = (uploadingFiles || []).filter(
                      (f) =>
                        f.yearSection === section &&
                        (f.status === 'uploading' || f.status === 'error'),
                    );
                    const isSectionExpanded = expandedFolders.includes(section);
                    const itemCount =
                      sectionDocuments.length + sectionUploadingFiles.length;

                    // Don't render empty sections unless they are part of the standard (and thus initialized)
                    // or if it's the unknown section and it's empty
                    if (itemCount === 0 && section === 'Unknown') return null;
                    if (
                      itemCount === 0 &&
                      !STANDARD_DOCUMENT_SECTIONS.includes(section)
                    )
                      return null;

                    return (
                      <div
                        key={section}
                        className="flex flex-col gap-0 border-b border-slate-200 last:border-b-0 py-2"
                      >
                        <div className="h-10 flex items-center justify-between">
                          <button
                            onClick={() => onFolderToggle(section)}
                            className="flex items-center gap-2 text-slate-900 hover:text-slate-700 p-1 -ml-1"
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              {isSectionExpanded ? (
                                <ChevronDownIcon className="w-4 h-4" />
                              ) : (
                                <ChevronRightIcon className="w-4 h-4" />
                              )}
                            </div>
                            <span className="body2-medium">
                              {section} ({itemCount} items)
                            </span>
                          </button>
                          {/* Wire up this button to a handler from props, pass section */}
                          <Button
                            variant="ghost"
                            className="flex text-blue-500 body2-semibold h-auto py-1 px-2 gap-1"
                            onClick={() => onAddDocumentsClick(section)} // Wired up
                          >
                            <PlusIcon className="size-5" />
                            Add document(s)
                          </Button>
                        </div>

                        {isSectionExpanded && (
                          <div className="pb-2 pl-6 pt-2">
                            {/* Display uploading files for this section */}
                            {sectionUploadingFiles.length > 0 && (
                              <div className="mb-2 border border-dashed border-blue-300 p-2 rounded-md">
                                <h6 className="text-sm font-medium text-slate-700 mb-1">
                                  Uploading:
                                </h6>
                                {sectionUploadingFiles.map((upload) => (
                                  <div
                                    key={upload.tempId}
                                    className="text-xs text-slate-600 py-0.5"
                                  >
                                    {upload.name} (
                                    {upload.status === 'error'
                                      ? 'Error'
                                      : `${Math.round(upload.progress)}%`}
                                    )
                                  </div>
                                ))}
                              </div>
                            )}

                            {itemCount === 0 &&
                            sectionUploadingFiles.length === 0 ? (
                              <div className="text-sm text-slate-500 italic">
                                No documents in this section.
                              </div>
                            ) : sectionDocuments.length === 0 &&
                              sectionUploadingFiles.length > 0 ? null : ( // Already handled by the uploading display above if only uploads are present
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {sectionDocuments.map((doc) => (
                                    <TableRow
                                      key={doc.id}
                                      className="border-b border-slate-200 last:border-b-0"
                                    >
                                      <TableCell className="py-2">
                                        <InlineEditField
                                          value={doc.name}
                                          fieldType="text"
                                          onSave={(newValue) => {
                                            // Ensure newValue is string, though InlineEditField with type text should provide string
                                            if (typeof newValue === 'string') {
                                              onDocumentNameSave(
                                                doc.id,
                                                newValue,
                                                doc,
                                              );
                                            } else {
                                              console.warn(
                                                'InlineEditField for document name did not return a string.',
                                              );
                                            }
                                          }}
                                          placeholder="Enter document name"
                                          className="body2-medium text-slate-900 hover:bg-slate-100 p-1 -m-1 rounded"
                                        />
                                      </TableCell>
                                      <TableCell className="py-2">
                                        {doc.created_at
                                          ? format(
                                              new Date(doc.created_at),
                                              'P',
                                            )
                                          : '-'}
                                      </TableCell>
                                      <TableCell className="py-2">
                                        {editingExpiresDocId === doc.id ? (
                                          <div className="flex items-center gap-1">
                                            <Input
                                              type="date"
                                              defaultValue={
                                                doc.expiration_date || ''
                                              } // HTML date input needs YYYY-MM-DD
                                              onBlur={(e) => {
                                                onExpiresDateChange(
                                                  doc.id,
                                                  e.target.value,
                                                  doc,
                                                );
                                              }}
                                              className="h-8 py-1 px-2 text-sm border-slate-300 rounded w-[150px]"
                                              autoFocus
                                            />
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-7 w-7 p-0 text-slate-500 hover:text-slate-700"
                                              onClick={(e) => {
                                                e.stopPropagation(); // Prevent blur from triggering save if cancel is clicked
                                                onSetEditingExpiresDocId(null);
                                              }}
                                              aria-label="Cancel date edit"
                                            >
                                              <XMarkIcon className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        ) : (
                                          <span
                                            onClick={() =>
                                              onSetEditingExpiresDocId(doc.id)
                                            }
                                            className="cursor-pointer hover:text-blue-600 p-1 -m-1 rounded hover:bg-slate-100"
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                              if (
                                                e.key === 'Enter' ||
                                                e.key === ' '
                                              )
                                                onSetEditingExpiresDocId(
                                                  doc.id,
                                                );
                                            }}
                                          >
                                            {/* Ensure correct date parsing for display if not YYYY-MM-DD */}
                                            {doc.expiration_date
                                              ? format(
                                                  new Date(
                                                    doc.expiration_date.replace(
                                                      /-/g,
                                                      '/',
                                                    ),
                                                  ),
                                                  'P',
                                                )
                                              : 'Set Date'}
                                          </span>
                                        )}
                                      </TableCell>
                                      <TableCell className="flex gap-2 py-2">
                                        <a
                                          href={doc.file_url || '#'}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          title={`View ${doc.name}`}
                                          className="text-slate-500 hover:text-blue-600"
                                          onClick={(e) => {
                                            if (!doc.file_url)
                                              e.preventDefault();
                                          }} // Prevent navigation if no URL
                                        >
                                          <EyeIcon className="w-4 h-4 cursor-pointer" />
                                        </a>
                                        <a
                                          href={doc.file_url || '#'}
                                          download={doc.name} // Consider adding file extension if doc.name doesn't have it
                                          title={`Download ${doc.name}`}
                                          className="text-slate-500 hover:text-blue-600"
                                          onClick={(e) => {
                                            if (!doc.file_url)
                                              e.preventDefault();
                                          }} // Prevent navigation if no URL
                                        >
                                          <CloudArrowDownIcon className="w-4 h-4 cursor-pointer" />
                                        </a>
                                        <TrashIcon
                                          className="w-4 h-4 text-slate-500 cursor-pointer hover:text-red-600"
                                          onClick={() => onDeleteDocument(doc)} // Wired up delete
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </TabsContainer>

      {/* Removed footer buttons - handled by specific modals/drawers or main page potentially */}
    </div>
  );
};
