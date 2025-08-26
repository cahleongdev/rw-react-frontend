import React from 'react';
import { format, parseISO } from 'date-fns';
import {
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  CloudArrowDownIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/base/Table';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { InlineEditField } from '@/components/base/InlineEditField';
import { EntityDocument } from '@/store/slices/entityDocumentsSlice';

// Add BoardUploadingFile type
type BoardUploadingFile = {
  tempId: string;
  name: string;
  file: File;
  progress: number;
  status: 'uploading' | 'error' | 'complete' | 'cancelled';
};

interface BoardDocumentsSectionProps {
  boardDocuments: EntityDocument[];
  editingBoardExpiresDocId: string | null;
  setEditingBoardExpiresDocId: (id: string | null) => void;
  onBoardDocNameSave: (docId: string, newName: string | File) => void;
  onBoardDocExpiresChange: (docId: string, dateValue: string) => void;
  onAddBoardDocumentsClick: () => void;
  onDeleteBoardDocument: (docId: string, s3FileKey: string) => void;
  boardUploadingFiles: BoardUploadingFile[];
  onCancelBoardDocUpload: (tempId: string) => void;
}

export const BoardDocumentsSection: React.FC<BoardDocumentsSectionProps> = ({
  boardDocuments,
  editingBoardExpiresDocId,
  setEditingBoardExpiresDocId,
  onBoardDocNameSave,
  onBoardDocExpiresChange,
  onAddBoardDocumentsClick,
  onDeleteBoardDocument,
  boardUploadingFiles,
  onCancelBoardDocUpload,
}) => (
  <div className="flex flex-col gap-4">
    <h5>Board Documents</h5>

    {/* Optional: Display Uploading Files - maybe above the table? */}
    {boardUploadingFiles.length > 0 && (
      <div className="pb-2 pl-4 border border-dashed border-blue-300 rounded mb-2">
        <Table>
          <TableBody>
            {boardUploadingFiles.map((upload) => (
              <TableRow
                key={upload.tempId}
                className={`${upload.status === 'uploading' ? 'opacity-75' : ''} ${upload.status === 'error' ? 'bg-red-50' : ''}`}
              >
                <TableCell className="w-2/5">
                  {/* Display filename and progress */}
                  <div className="flex items-center gap-2">
                    <span className="truncate">
                      {upload.name}.{upload.file.type.split('/').pop()}
                    </span>
                    {upload.status === 'uploading' && (
                      <span className="text-slate-500 text-xs whitespace-nowrap">
                        ({Math.round(upload.progress)}%)
                      </span>
                    )}
                    {upload.status === 'error' && (
                      <span className="text-red-500 text-xs whitespace-nowrap">
                        (Upload Failed)
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>—</TableCell> {/* Placeholder for Expires */}
                <TableCell>
                  {' '}
                  {/* Dynamic Status Cell */}
                  {upload.status === 'uploading' && (
                    <span className="text-slate-500">
                      Uploading ({Math.round(upload.progress)}%)
                    </span>
                  )}
                  {upload.status === 'error' && (
                    <span className="text-red-500">Upload Failed</span>
                  )}
                  {upload.status === 'complete' && (
                    <span className="text-green-500">Processing...</span>
                  )}
                  {upload.status === 'cancelled' && (
                    <span className="text-slate-500">Cancelled</span>
                  )}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  {/* Cancel Button */}
                  {upload.status === 'uploading' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancelBoardDocUpload(upload.tempId);
                      }}
                    >
                      <XMarkIcon className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                  {/* Maybe Retry for errors? */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}

    {/* Main Board Documents Table */}
    <Table>
      <TableHeader>
        <TableRow className="border-b border-slate-200">
          <TableHead className="min-w-[150px] max-w-[150px]">
            File Name
          </TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Added</TableHead>
          <TableHead></TableHead> {/* Actions column */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Render fetched documents */}
        {boardDocuments.map((doc) => (
          <TableRow
            key={doc.id}
            className="border-b border-slate-200 last:border-b-0 items-center"
          >
            <TableCell className="min-w-[150px] max-w-[150px]">
              {/* Keep inline edit for name */}
              <InlineEditField
                value={doc.name}
                fieldType="text"
                onSave={(newValue) => {
                  if (typeof newValue === 'string') {
                    onBoardDocNameSave(doc.id, newValue);
                  } else {
                    console.warn(
                      'Attempted to save non-string value as document name',
                    );
                  }
                }}
                placeholder="Enter name"
                className="body2-medium h-8 max-w-[150px] truncate"
              />
            </TableCell>
            {/* Expires Column */}
            <TableCell>
              {editingBoardExpiresDocId === doc.id ? (
                <Input
                  type="date"
                  defaultValue={doc.expiration_date || ''}
                  onBlur={(e) => {
                    onBoardDocExpiresChange(doc.id, e.target.value);
                    // setEditingBoardExpiresDocId(null); // Already handled in container?
                  }}
                  className="h-8 w-[150px] text-sm"
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingBoardExpiresDocId(doc.id);
                  }}
                  className="cursor-pointer hover:text-blue-600"
                >
                  {doc.expiration_date
                    ? format(
                        parseISO(doc.expiration_date), // Assumes YYYY-MM-DD from API
                        'P', // Or 'MM/dd/yyyy'
                      )
                    : 'Set Date'}
                </span>
              )}
            </TableCell>
            {/* Added Column */}
            <TableCell>
              {doc.created_at
                ? format(parseISO(doc.created_at), 'P') // Or 'MM/dd/yyyy'
                : '-'}
            </TableCell>
            {/* Actions Column */}
            <TableCell className="flex justify-end gap-2 mx-4">
              <a
                href={doc.file_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                title="View"
              >
                <EyeIcon className="w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-600" />
              </a>
              <a
                href={doc.file_url || '#'}
                download={doc.name}
                title="Download"
              >
                <CloudArrowDownIcon className="w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-600" />
              </a>
              <TrashIcon
                className="w-4 h-4 text-slate-500 cursor-pointer hover:text-red-600"
                onClick={() => onDeleteBoardDocument(doc.id, doc.file_url)}
                title="Delete"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    {/* Moved Add Button */}
    <Button
      variant="ghost"
      className="hover:bg-transparent text-blue-500 hover:text-blue-600 !pl-0 w-auto self-start"
      onClick={onAddBoardDocumentsClick}
    >
      <PlusIcon className="w-4 h-4" />
      Add document(s)
    </Button>
  </div>
);
