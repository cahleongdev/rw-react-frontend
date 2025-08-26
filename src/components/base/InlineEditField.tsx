import React, { useState, useEffect, useRef } from 'react';

import { Input } from '@/components/base/Input';
// Potentially import other input types like DatePicker if needed later

// Define more specific field types
export type InlineFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'tel' // For phone numbers
  | 'email'
  | 'url'
  | 'File Upload' // Assuming this string is used for file type
  | 'Dropdown' // Added from UserInfoDrawer example
  | string; // Allow other custom types

interface FileUploadConfig {
  onFileUpload: (
    file: File,
    onProgress: (progress: number) => void,
  ) => Promise<string>; // Returns the URL/identifier of the uploaded file
  allowedTypes?: string[]; // e.g., ['image/*', '.pdf']
  maxSize?: number; // in bytes
}

interface InlineEditFieldProps {
  value: string | number | undefined | null;
  fieldType: InlineFieldType;
  onSave: (newValue: string | File) => void; // Can save string or File object for uploads
  placeholder?: string;
  className?: string;
  options?: string[]; // For Dropdown type
  fileUploadConfig?: FileUploadConfig; // Configuration for file uploads
}

export const InlineEditField: React.FC<InlineEditFieldProps> = ({
  value,
  fieldType,
  onSave,
  placeholder = 'Enter value',
  className = '',
  options = [],
  fileUploadConfig,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState<string>(String(value ?? ''));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(String(value ?? ''));
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing) {
      if (fieldType === 'Dropdown' && selectRef.current) {
        selectRef.current.focus();
      } else if (inputRef.current) {
        inputRef.current.focus();
        if (fieldType !== 'date') {
          // Don't select for date input, it's not user-friendly
          inputRef.current.select();
        }
      }
    }
  }, [isEditing, fieldType]);

  const handleSave = async () => {
    if (fieldType === 'File Upload') {
      if (selectedFile && fileUploadConfig) {
        setIsUploading(true);
        try {
          const uploadedFileUrl = await fileUploadConfig.onFileUpload(
            selectedFile,
            setUploadProgress,
          );
          onSave(uploadedFileUrl); // Save the returned URL or identifier
          setSelectedFile(null);
        } catch (error) {
          console.error('File upload failed:', error);
          // Handle error display to user if necessary
        }
        setIsUploading(false);
        setUploadProgress(0);
      } else {
        // If no file selected, or no config, do nothing or revert
      }
    } else if (String(value ?? '') !== currentValue) {
      onSave(currentValue);
    }
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileUploadConfig?.allowedTypes) {
        if (
          !fileUploadConfig.allowedTypes.includes(file.type) &&
          !fileUploadConfig.allowedTypes.some(
            (type) =>
              type.endsWith('/*') &&
              file.type.startsWith(type.replace('/*', '')),
          )
        ) {
          alert(
            `Invalid file type. Allowed types: ${fileUploadConfig.allowedTypes.join(', ')}`,
          );
          return;
        }
      }
      if (fileUploadConfig?.maxSize && file.size > fileUploadConfig.maxSize) {
        alert(
          `File is too large. Maximum size is ${fileUploadConfig.maxSize / (1024 * 1024)}MB`,
        );
        return;
      }
      setSelectedFile(file);
      // For file uploads, we might save immediately or wait for a save button if the UI is more complex.
      // For simplicity here, we'll trigger save when a file is selected and validated.
      // The actual upload happens in handleSave, triggered by blur or Enter.
      setCurrentValue(file.name); // Show file name in the input temporarily
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(String(value ?? ''));
      setSelectedFile(null);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    // For file uploads, blur might not always mean save, especially if a file picker is open.
    // However, for simple text/date/etc., save on blur is fine.
    if (fieldType !== 'File Upload') {
      setTimeout(handleSave, 100); // setTimeout to allow other click events
    }
  };

  if (isEditing) {
    if (fieldType === 'File Upload') {
      return (
        <div className={`flex flex-col ${className}`}>
          <Input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className={`h-auto py-1 px-2 ${fileUploadConfig?.allowedTypes ? '' : 'w-full'}`}
            accept={fileUploadConfig?.allowedTypes?.join(',')}
            onClick={(e) => e.stopPropagation()}
          />
          {selectedFile && (
            <span className="text-xs text-slate-500 mt-1">
              Selected: {selectedFile.name}
            </span>
          )}
          {isUploading && (
            <div className="mt-1 w-full bg-slate-200 rounded">
              <div
                className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}
          {/* Add a save button for file uploads, as blur might not be desired UX */}
          <button
            onClick={handleSave}
            disabled={isUploading || !selectedFile}
            className="text-xs text-blue-500 hover:text-blue-700 mt-1 self-start"
          >
            {isUploading ? 'Uploading...' : 'Confirm Upload'}
          </button>
        </div>
      );
    } else if (fieldType === 'Dropdown' && options.length > 0) {
      return (
        <select
          ref={selectRef}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur} // Save on blur for dropdowns too
          className={`h-auto py-1 px-2 border border-slate-300 rounded bg-white ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    let inputType: React.HTMLInputTypeAttribute = 'text';
    if (fieldType === 'number') inputType = 'number';
    else if (fieldType === 'date') inputType = 'date';
    else if (fieldType === 'tel') inputType = 'tel';
    else if (fieldType === 'email') inputType = 'email';
    else if (fieldType === 'url') inputType = 'url';

    return (
      <Input
        ref={inputRef}
        type={inputType}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`h-auto py-1 px-2 ${className}`}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  // Display Logic
  let displayValue: React.ReactNode = String(value ?? '');
  if (value === undefined || value === null || String(value).trim() === '') {
    displayValue = <span className="text-slate-400 italic">{placeholder}</span>;
  } else if (fieldType === 'date' && value) {
    try {
      // Attempt to format if it's a valid date string already (e.g., YYYY-MM-DD)
      const date = new Date(String(value) + 'T00:00:00'); // Ensure local timezone interpretation
      if (!isNaN(date.getTime())) {
        displayValue = date.toLocaleDateString(); // Or use date-fns format(parseISO(String(value)), 'P') if available
      }
    } catch {
      /* Ignore formatting error, display as is */
    }
  } else if (fieldType === 'File Upload' && value) {
    // Assuming 'value' for a file is a URL or a file name string
    displayValue = (
      <a
        href={String(value)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {String(value).substring(String(value).lastIndexOf('/') + 1) ||
          String(value)}{' '}
        {/* Show filename from URL */}
      </a>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`cursor-pointer min-h-[28px] py-1 px-2 hover:bg-slate-50 rounded-[3px] ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isEditing) setIsEditing(true);
      }}
      title="Click to edit"
    >
      {displayValue}
    </div>
  );
};

// Optional: Create an index.ts in the same directory
// export * from './InlineEditField';
