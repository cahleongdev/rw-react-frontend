import React, { useState, useRef, DragEvent, useEffect } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

import { cn } from '@/utils/tailwind';

import useFileUpload from '@/hooks/useFileUpload';

interface FileUploadInputProps {
  label?: string;
  required?: boolean;
  onFilesSelected: (files: File[]) => void;
  onFileUploaded?: (fileUrl: string, fileName: string) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[]; // e.g. ['.pdf', '.docx', '.xlsx']
  multiple?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  autoUpload?: boolean; // Whether to automatically upload files
  icon?: React.ReactNode;
}

interface CustomFileUploadInputProps extends FileUploadInputProps {
  label?: string;
  required?: boolean;
  onFilesSelected: (files: File[]) => void;
  onFileUploaded?: (fileUrl: string, fileName: string) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[]; // e.g. ['.pdf', '.docx', '.xlsx']
  multiple?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  autoUpload?: boolean; // Whether to automatically upload files
  inputRef?: React.RefObject<HTMLInputElement>;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label,
  required = false,
  onFilesSelected,
  onFileUploaded,
  maxSize = 10, // Default 10MB
  allowedTypes = [],
  multiple = true,
  error: externalError,
  helperText,
  className,
  autoUpload = false,
  icon,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only use the upload hook if autoUpload is enabled
  const { isUploading, uploadStatus, uploadedFileName, uploadFile } =
    useFileUpload();

  // Effect to handle successful uploads
  useEffect(() => {
    if (
      autoUpload &&
      uploadedFileName &&
      uploadingFiles.length > 0 &&
      !isUploading
    ) {
      if (onFileUploaded) {
        onFileUploaded(uploadedFileName, uploadingFiles[0].name);
      }
    }
  }, [
    uploadedFileName,
    isUploading,
    autoUpload,
    onFileUploaded,
    uploadingFiles,
  ]);

  const error = externalError || internalError;

  // Add this helper function to convert file extension to MIME type
  const isFileTypeAllowed = (file: File): boolean => {
    // Create a mapping of common file extensions to MIME types
    const mimeTypeMap: { [key: string]: string[] } = {
      '.pdf': ['application/pdf'],
      '.doc': ['application/msword'],
      '.docx': [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      '.xls': ['application/vnd.ms-excel'],
      '.xlsx': [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      '.png': ['image/png'],
      '.jpg': ['image/jpeg'],
      '.jpeg': ['image/jpeg'],
      '.gif': ['image/gif'],
    };

    // If allowedTypes is empty, allow all files.
    if (allowedTypes.length === 0) {
      return true;
    }

    // Check by extension first
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedTypes.includes(fileExtension)) {
      return false;
    }

    // If we have MIME type info, double-check that too
    const allowedMimeTypes = allowedTypes.flatMap(
      (ext) => mimeTypeMap[ext.toLowerCase()] || [],
    );

    // If we don't have MIME type info for this extension, just allow it
    if (allowedMimeTypes.length === 0) {
      return true;
    }

    return allowedMimeTypes.includes(file.type);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      validateAndProcessFiles(filesArray);
    }
  };

  const validateAndProcessFiles = async (files: File[]) => {
    setInternalError(null);

    // Log file types for debugging
    files.forEach((file) => {
      console.log(
        `File: ${file.name}, Type: ${file.type}, Size: ${file.size / (1024 * 1024)} MB`,
      );
    });

    // Filter files by size
    const validSizeFiles = files.filter((file) => {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSize) {
        setInternalError(`File size exceeds the ${maxSize}MB limit`);
        return false;
      }
      return true;
    });

    // Filter files by type if allowedTypes is provided and not empty
    const validFiles =
      allowedTypes && allowedTypes.length > 0
        ? validSizeFiles.filter((file) => {
            if (!isFileTypeAllowed(file)) {
              setInternalError(
                `File type not allowed. Allowed types: ${allowedTypes.join(
                  ', ',
                )}`,
              );
              return false;
            }
            return true;
          })
        : validSizeFiles;

    if (validFiles.length > 0) {
      // Always notify parent component about selected files
      setUploadingFiles(validFiles);
      onFilesSelected(validFiles);

      // If autoUpload is enabled, upload the first file
      if (autoUpload && validFiles.length > 0) {
        try {
          await uploadFile(validFiles[0]);
          console.log('uploaded');
        } catch (error) {
          setInternalError('Failed to upload file');
          console.error(error);
        }
      }
    } else if (files.length > 0 && validFiles.length === 0) {
      // If we had files but none were valid, make sure the error is shown
      if (!internalError) {
        setInternalError('No valid files were selected');
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      validateAndProcessFiles(filesArray);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label className="body2-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`border-2 border-dashed rounded-md p-4 text-center transition-colors
          ${isDragging ? 'border-orange-500 bg-blue-50' : 'border-slate-300'} 
          ${error ? 'border-red-500' : ''}
          hover:border-orange-500 cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple={multiple}
          className="hidden"
          onChange={handleFileChange}
          accept={allowedTypes?.join(',')}
        />
        <div className="flex flex-col items-center gap-1">
          {icon || <DocumentArrowUpIcon className="h-12 w-12 text-slate-400" />}
          <div>
            <span className="text-orange-500 body2-regular">
              {'Upload a file '}
            </span>
            <span className="text-slate-500 body2-regular">
              or drag and drop up to {maxSize}MB
            </span>
          </div>

          {/* Show allowed file types */}
          <div className="text-xs text-slate-500 mt-1">
            {allowedTypes.length > 0
              ? `Allowed types: ${allowedTypes.join(', ')}`
              : 'All file types are allowed'}
          </div>

          {/* Show selected files */}
          {uploadingFiles.length > 0 && (
            <div className="mt-2 text-left w-full">
              {uploadingFiles.map((file, index) => (
                <div key={index} className="text-sm text-slate-700">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              ))}
            </div>
          )}

          {/* Upload progress indicator */}
          {autoUpload && isUploading && (
            <div className="w-full mt-2">
              <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 animate-pulse w-full"></div>
              </div>
              <p className="text-sm text-slate-500 mt-1">Uploading...</p>
            </div>
          )}

          {/* Upload status */}
          {autoUpload && uploadStatus && (
            <p
              className={`text-sm mt-2 ${uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}
            >
              {uploadStatus}
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

const CustomFileUploadInput: React.FC<CustomFileUploadInputProps> = ({
  label,
  required = false,
  onFilesSelected,
  onFileUploaded,
  maxSize = 10, // Default 10MB
  allowedTypes = [],
  multiple = true,
  error: externalError,
  helperText,
  className,
  autoUpload = false,
  inputRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const defaultRef = useRef<HTMLInputElement>(null);
  const fileInputRef = inputRef || defaultRef;

  // Only use the upload hook if autoUpload is enabled
  const { isUploading, uploadStatus, uploadedFileName, uploadFile } =
    useFileUpload();

  // Effect to handle successful uploads
  useEffect(() => {
    if (
      autoUpload &&
      uploadedFileName &&
      uploadingFiles.length > 0 &&
      !isUploading
    ) {
      if (onFileUploaded) {
        onFileUploaded(uploadedFileName, uploadingFiles[0].name);
      }
    }
  }, [
    uploadedFileName,
    isUploading,
    autoUpload,
    onFileUploaded,
    uploadingFiles,
  ]);

  const error = externalError || internalError;

  // Add this helper function to convert file extension to MIME type
  const isFileTypeAllowed = (file: File): boolean => {
    // Create a mapping of common file extensions to MIME types
    const mimeTypeMap: { [key: string]: string[] } = {
      '.pdf': ['application/pdf'],
      '.doc': ['application/msword'],
      '.docx': [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      '.xls': ['application/vnd.ms-excel'],
      '.xlsx': [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      '.png': ['image/png'],
      '.jpg': ['image/jpeg'],
      '.jpeg': ['image/jpeg'],
      '.gif': ['image/gif'],
    };

    // If allowedTypes is empty, allow all files.
    if (allowedTypes.length === 0) {
      return true;
    }

    // Check by extension first
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedTypes.includes(fileExtension)) {
      return false;
    }

    // If we have MIME type info, double-check that too
    const allowedMimeTypes = allowedTypes.flatMap(
      (ext) => mimeTypeMap[ext.toLowerCase()] || [],
    );

    // If we don't have MIME type info for this extension, just allow it
    if (allowedMimeTypes.length === 0) {
      return true;
    }

    return allowedMimeTypes.includes(file.type);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      validateAndProcessFiles(filesArray);
    }
  };

  const validateAndProcessFiles = async (files: File[]) => {
    setInternalError(null);

    // Log file types for debugging
    files.forEach((file) => {
      console.log(
        `File: ${file.name}, Type: ${file.type}, Size: ${file.size / (1024 * 1024)} MB`,
      );
    });

    // Filter files by size
    const validSizeFiles = files.filter((file) => {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSize) {
        setInternalError(`File size exceeds the ${maxSize}MB limit`);
        return false;
      }
      return true;
    });

    // Filter files by type if allowedTypes is provided and not empty
    const validFiles =
      allowedTypes && allowedTypes.length > 0
        ? validSizeFiles.filter((file) => {
            if (!isFileTypeAllowed(file)) {
              setInternalError(
                `File type not allowed. Allowed types: ${allowedTypes.join(
                  ', ',
                )}`,
              );
              return false;
            }
            return true;
          })
        : validSizeFiles;

    if (validFiles.length > 0) {
      // Always notify parent component about selected files
      setUploadingFiles(validFiles);
      onFilesSelected(validFiles);

      // If autoUpload is enabled, upload the first file
      if (autoUpload && validFiles.length > 0) {
        try {
          await uploadFile(validFiles[0]);
          console.log('uploaded');
        } catch (error) {
          setInternalError('Failed to upload file');
          console.error(error);
        }
      }
    } else if (files.length > 0 && validFiles.length === 0) {
      // If we had files but none were valid, make sure the error is shown
      if (!internalError) {
        setInternalError('No valid files were selected');
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      validateAndProcessFiles(filesArray);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label className="body2-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={cn(
          `border-2 border-dashed rounded-md p-4 text-center transition-colors
          ${isDragging ? 'border-orange-500 bg-blue-50' : 'border-slate-300'} 
          ${error ? 'border-red-500' : 'hover:border-orange-500'}
           cursor-pointer`,
          className,
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef?.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple={multiple}
          className="hidden"
          onChange={handleFileChange}
          accept={allowedTypes?.join(',')}
        />
        <div className="flex flex-col items-center gap-1">
          <DocumentArrowUpIcon className="h-12 w-12 text-slate-400" />
          <div>
            <span className="text-orange-500 body2-regular">
              {'Upload a file '}
            </span>
            <span className="text-slate-500 body2-regular">
              or drag and drop up to {maxSize}MB
            </span>
          </div>

          {/* Show allowed file types */}
          <div className="text-xs text-slate-500 mt-1">
            {allowedTypes.length > 0
              ? `Allowed types: ${allowedTypes.join(', ')}`
              : 'All file types are allowed'}
          </div>

          {/* Show selected files */}
          {uploadingFiles.length > 0 && (
            <div className="mt-2 text-left w-full">
              {uploadingFiles.map((file, index) => (
                <div key={index} className="text-sm text-slate-700">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              ))}
            </div>
          )}

          {/* Upload progress indicator */}
          {autoUpload && isUploading && (
            <div className="w-full mt-2">
              <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 animate-pulse w-full"></div>
              </div>
              <p className="text-sm text-slate-500 mt-1">Uploading...</p>
            </div>
          )}

          {/* Upload status */}
          {autoUpload && uploadStatus && (
            <p
              className={`text-sm mt-2 ${uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}
            >
              {uploadStatus}
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export { FileUploadInput, CustomFileUploadInput };
