import React from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  CloudArrowDownIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { parseISO, format } from 'date-fns';

import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { EntityDocument } from '@/store/slices/entityDocumentsSlice';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/base/Table';
import { SearchBar } from '@components/base/SearchBar';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Table } from '@components/base/Table';
import { InlineEditField } from '@components/base/InlineEditField';

import { UploadingFile } from '@containers/EntitySideDrawer/index.types';

interface EntityDocumentsSectionProps {
  documentsGroupedBySection: Record<string, EntityDocument[]>;
  sortedSections: string[];
  expandedFolders: string[];
  uploadingFiles: UploadingFile[];
  // editingDocNameId: string | null;
  // setEditingDocNameId: (id: string | null) => void;
  editingExpiresDocId: string | null;
  setEditingExpiresDocId: (id: string | null) => void;
  isLoading: boolean;
  onFolderToggle: (folderName: string) => void;
  onAddDocumentsClick: (section: string) => void;
  onUploadingFileNameChange: (tempId: string, newName: string) => void;
  onCancelUpload: (tempId: string) => void;
  onDocumentNameSave: (
    docId: string,
    newName: string,
    currentSection: string,
  ) => void;
  onExpiresDateChange: (
    docId: string,
    dateValue: string,
    currentSection: string,
  ) => void;
  onDeleteDocument: (docId: string, s3FileKey: string) => void;
  // fileInputRef: React.RefObject<HTMLInputElement>;
}

const EntityDocumentsSection: React.FC<EntityDocumentsSectionProps> = ({
  documentsGroupedBySection,
  sortedSections,
  expandedFolders,
  uploadingFiles,
  editingExpiresDocId,
  setEditingExpiresDocId,
  isLoading,
  onFolderToggle,
  onAddDocumentsClick,
  onUploadingFileNameChange,
  onCancelUpload,
  onDocumentNameSave,
  onExpiresDateChange,
  onDeleteDocument,
}) => {
  return (
    <>
      <div className="p-4 border-b border-slate-300 bg-slate-50">
        <SearchBar placeholder="Search for a document by title" />
      </div>
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 flex flex-col gap-0">
          {/* Iterate over sections */}
          {sortedSections.map((section) => {
            const sectionDocuments = documentsGroupedBySection[section] || [];
            const sectionUploadingFiles = uploadingFiles.filter(
              (f) => f.year === section && f.status === 'uploading', // Match upload state by section key
            );
            const isSectionExpanded = expandedFolders.includes(section);
            const itemCount =
              sectionDocuments.length + sectionUploadingFiles.length;

            // Don't render if section is "Unknown" and empty (already filtered in memo)
            // if (section === 'Unknown' && itemCount === 0) return null;

            return (
              <div
                key={section}
                className="flex flex-col gap-0 border-b border-slate-200 last:border-b-0"
              >
                {/* Folder Header Row */}
                <div className="h-10 flex items-center justify-between py-2">
                  {/* Section Toggle */}
                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFolderToggle(section);
                      }}
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
                  </div>
                  {/* Add Button */}
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddDocumentsClick(section);
                    }}
                    className="flex text-blue-500 body2-semibold h-auto py-1 px-2 gap-1"
                  >
                    <PlusIcon className="size-5" />
                    Add document(s)
                  </Button>
                </div>

                {/* Expanded Content */}
                {isSectionExpanded && (
                  <div className="pb-2 pl-6">
                    {isLoading &&
                    sectionDocuments.length === 0 &&
                    sectionUploadingFiles.length === 0 ? (
                      <div className="py-2 text-sm text-slate-500 italic">
                        Loading...
                      </div>
                    ) : itemCount === 0 ? (
                      <div className="py-2 text-sm text-slate-500 italic">
                        {/* Updated empty state message */}
                        No documents uploaded for this{' '}
                        {section.includes(' - ')
                          ? 'period'
                          : 'section'}.
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Expiration Date</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Render uploading files first */}
                          {sectionUploadingFiles.map((upload) => (
                            <TableRow
                              key={upload.tempId}
                              className={`${upload.status === 'uploading' ? 'opacity-75' : ''} ${upload.status === 'error' ? 'bg-red-50' : ''}`}
                            >
                              {' '}
                              {/* Indicate uploading */}
                              <TableCell className="flex items-center gap-1">
                                <Input
                                  value={upload.name}
                                  onChange={(e) =>
                                    onUploadingFileNameChange(
                                      upload.tempId,
                                      e.target.value,
                                    )
                                  }
                                  className="h-8 flex-1"
                                />
                                {upload.status === 'error' && (
                                  <span className="text-red-500 text-xs whitespace-nowrap">
                                    (Failed)
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {upload.file.type
                                  .split('/')[1]
                                  ?.toUpperCase() || ''}
                              </TableCell>
                              {/* Status Column for Uploading Files */}
                              <TableCell colSpan={2}>
                                {' '}
                                {/* Combine Expires and Created At for status */}
                                {upload.status === 'uploading' && (
                                  <span className="text-slate-500 text-xs">
                                    Uploading ({Math.round(upload.progress)}%)
                                  </span>
                                )}
                                {upload.status === 'error' && (
                                  <span className="text-red-500 text-xs">
                                    Upload Failed
                                  </span>
                                )}
                                {upload.status === 'complete' && (
                                  <span className="text-green-500 text-xs">
                                    Processing...
                                  </span>
                                )}
                                {upload.status === 'cancelled' && (
                                  <span className="text-slate-500 text-xs">
                                    Cancelled
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="flex justify-end gap-2">
                                {/* Cancel Button */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onCancelUpload(upload.tempId);
                                  }}
                                >
                                  <XMarkIcon className="w-4 h-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Fetched Documents */}
                          {sectionDocuments.map((doc) => (
                            <TableRow
                              key={doc.id}
                              className="border-b border-slate-200 w-full"
                            >
                              <TableCell className="flex items-center gap-2 max-w-[180px]">
                                <InlineEditField
                                  value={doc.name}
                                  fieldType="text"
                                  onSave={(newValue) => {
                                    if (typeof newValue === 'string') {
                                      onDocumentNameSave(
                                        doc.id,
                                        newValue,
                                        doc.year,
                                      );
                                    } else {
                                      console.warn(
                                        'Attempted to save non-string value as document name',
                                      );
                                    }
                                  }}
                                  placeholder="Enter name"
                                  className="body2-medium h-8 max-w-[180px] truncate"
                                />
                              </TableCell>
                              <TableCell className="max-w-[80px] truncate">
                                {doc.type
                                  ? doc.type.split('/').pop()?.toUpperCase() ||
                                    doc.type
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {editingExpiresDocId === doc.id ? (
                                  <Input
                                    type="date"
                                    defaultValue={doc.expiration_date || ''}
                                    onBlur={(e) => {
                                      onExpiresDateChange(
                                        doc.id,
                                        e.target.value,
                                        doc.year,
                                      );
                                      setEditingExpiresDocId(null);
                                    }}
                                    className="h-8 w-[150px] text-sm"
                                  />
                                ) : (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingExpiresDocId(doc.id);
                                    }}
                                    className="cursor-pointer hover:text-blue-600"
                                  >
                                    {doc.expiration_date
                                      ? format(
                                          new Date(
                                            doc.expiration_date + 'T00:00:00',
                                          ),
                                          'P',
                                        )
                                      : 'Set Date'}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {doc.created_at
                                  ? format(parseISO(doc.created_at), 'P')
                                  : '-'}
                              </TableCell>
                              <TableCell className="flex justify-end gap-2">
                                <a
                                  href={doc.file_url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <EyeIcon className="w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-600" />
                                </a>
                                <a
                                  href={doc.file_url || '#'}
                                  download={doc.name}
                                >
                                  <CloudArrowDownIcon className="w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-600" />
                                </a>
                                <TrashIcon
                                  className="w-4 h-4 text-slate-500 cursor-pointer hover:text-red-600"
                                  onClick={() =>
                                    onDeleteDocument(doc.id, doc.file_url)
                                  }
                                  title="Delete"
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
          })}
        </div>
      </ScrollArea>
    </>
  );
};

export default EntityDocumentsSection;
