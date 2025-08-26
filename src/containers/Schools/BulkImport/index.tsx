import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

import { BulkImport as BulkImportComponent } from '@/components/Schools/BulkImport';
import { ManageCustomFields } from '@containers/EntitySideDrawer/ManageCustomFields';

import schoolsAPI from '@/api/schools';
import { excelDateToISO } from '@/utils/date';

import {
  CustomFieldDefinition,
  EntityTypeWithCustomFields,
} from '@store/slices/customFieldDefinitionsSlice';
import {
  STATIC_FIELDS_MAP,
  dateFields,
  downloadTemplateURLs,
} from '@/containers/Schools/index.constants';
import type { AppDispatch } from '@/store';
import { RootState } from '@store/index';

import { fetchUsers } from '@/store/slices/usersSlice';
import { fetchAllBoardMembers } from '@/store/slices/schoolUsersSlice';
import { setLoading, setSchools } from '@/store/slices/schoolsSlice';

const getCustomFieldKey = (option: string | null) => {
  switch (option) {
    case 'Schools':
      return 'school_entity_fields';
    case 'Networks':
      return 'network_entity_fields';
    case 'Users':
      return 'school_user_fields';
    case 'Board Members':
      return 'board_member_fields';
    default:
      return null;
  }
};

export const BulkImport: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  // State
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>(
    {},
  );
  const [sourceColumns, setSourceColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<Record<string, string>>({});
  const [recordCount, setRecordCount] = useState(0);
  const [rawData, setRawData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCustomFieldsManager, setShowCustomFieldsManager] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // Get real fields
  const customFieldKey = getCustomFieldKey(selectedOption);
  const customFields = useSelector((state: RootState) =>
    customFieldKey ? state.customFieldDefinitions[customFieldKey] || [] : [],
  );
  const staticFields = STATIC_FIELDS_MAP[selectedOption || 'Users'] || [];
  const reportwellFields = [
    ...staticFields.map((f) => f.name),
    ...customFields.map((f: CustomFieldDefinition) => f.Name),
  ];

  // Reset state on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setSelectedOption(null);
        setUploadedFile(null);
        setUploadProgress(0);
        setUploadError(null);
        setColumnMappings({});
        setSourceColumns([]);
        setPreviewData({});
        setRecordCount(0);
        setRawData([]);
      }, 300);
    }
  }, [open]);

  // File selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setUploadError(null);
  };

  // Upload and parse with progress
  const startUpload = () => {
    if (!uploadedFile) return;
    setStep(3);
    setUploadProgress(0);
    setUploadError(null);

    // Simulate progress (0-50%), then parse
    let progress = 0;
    const parsingInterval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 50) {
        clearInterval(parsingInterval);
        parseFile(uploadedFile);
      }
    }, 100);
  };

  // Parse file and finish progress
  const parseFile = (file: File) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data: any[] = [];
        if (fileExt === 'csv') {
          Papa.parse(e.target?.result as string, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              data = results.data as any[];
              finishUpload(data);
            },
            error: () => setUploadError('Failed to parse CSV file'),
          });
        } else if (fileExt === 'xls' || fileExt === 'xlsx') {
          const workbook = XLSX.read(e.target?.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          // Convert date fields if they are numbers
          data = data.map((row) => {
            const newRow = { ...row };
            dateFields.forEach((field) => {
              if (typeof newRow[field] === 'number') {
                newRow[field] = excelDateToISO(newRow[field]);
              } else if (typeof newRow[field] === 'string') {
                const dateStr = newRow[field].trim();
                // Try to parse as Date
                const dateObj = new Date(dateStr);
                if (!isNaN(dateObj.getTime())) {
                  // Format as YYYY-MM-DD
                  const yyyy = dateObj.getFullYear();
                  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                  const dd = String(dateObj.getDate()).padStart(2, '0');
                  newRow[field] = `${yyyy}-${mm}-${dd}`;
                } else {
                  setUploadError(
                    `Invalid date format for field '${field}': ${dateStr}`,
                  );
                  throw new Error(
                    `Invalid date format for field '${field}': ${dateStr}`,
                  );
                }
              }
            });
            return newRow;
          });
          finishUpload(data);
        } else {
          setUploadError('Unsupported file type');
        }
      } catch (error) {
        setUploadError('Failed to parse file');
        console.error(error);
        setStep(6);
      }
    };
    if (fileExt === 'csv') reader.readAsText(file);
    else reader.readAsBinaryString(file);
  };

  // Finish upload, set data, and complete progress
  const finishUpload = (data: any[]) => {
    setUploadProgress(60);
    setTimeout(() => {
      if (data.length > 0) {
        setSourceColumns(Object.keys(data[0]));
        setPreviewData(data[0]);
        setRecordCount(data.length);
        setRawData(data);
      }
      // Simulate mapping progress (60-100%)
      let progress = 60;
      const mappingInterval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(mappingInterval);
          if (uploadedFile && uploadedFile.name.includes('error')) {
            setUploadError(`Error uploading ${uploadedFile.name}.`);
            setStep(6);
          } else {
            // Pre-populate mappings based on static fields (by name)
            const initialMappings: Record<string, string> = {};
            Object.keys(data[0] || {}).forEach((col) => {
              const match = staticFields.find(
                (field) => field.name.toLowerCase() === col.toLowerCase(),
              );
              if (match) initialMappings[col] = match.name;
            });
            setColumnMappings(initialMappings);
            setStep((prev) => (prev === 3 ? 4 : 2));
          }
        }
      }, 60);
    }, 200);
  };

  // Navigation and mapping
  const handleNext = async () => {
    if (step === 1 && selectedOption) setStep(2);
    else if (step === 2 && uploadedFile) startUpload();
    else if (step === 4) {
      if (!selectedOption) return;
      // Format data for backend: split into staticFields and customFields
      const formattedData = rawData.map((row) => {
        const staticFieldsObj: Record<string, string> = {};
        const customFieldsObj: Record<string, string> = {};
        Object.entries(columnMappings).forEach(
          ([sourceCol, reportwellField]) => {
            if (reportwellField) {
              const staticField = staticFields.find(
                (f) => f.name === reportwellField,
              );
              if (staticField) {
                staticFieldsObj[staticField.dataName] = row[sourceCol];
              } else {
                customFieldsObj[reportwellField] = row[sourceCol];
              }
            }
          },
        );
        return {
          staticFields: staticFieldsObj,
          customFields: customFieldsObj,
        };
      });

      try {
        const res = await schoolsAPI.postBulkImport(
          selectedOption,
          formattedData,
        );
        if (res.errors.length > 0 && res.created_count === 0) {
          toast.error('Failed to import data, try again.');
          setStep(6);
        } else {
          // Dispatch the correct fetch action based on selectedOption
          if (selectedOption === 'Schools' || selectedOption === 'Networks') {
            // Use the same logic as fetchData in AgencyAdmin/index.tsx
            dispatch(setLoading(true));
            try {
              const { data: schoolsResult } = await schoolsAPI.getAgencyAdmin();
              dispatch(setSchools(schoolsResult.results));
              dispatch(setLoading(false));
            } catch {
              dispatch(setLoading(false));
            }
          } else if (selectedOption === 'Users') {
            await dispatch(fetchUsers());
          } else if (selectedOption === 'Board Members') {
            await dispatch(fetchAllBoardMembers());
          }
          toast.success('Data imported successfully');
          setStep(5);
        }
      } catch (err) {
        toast.error('Failed to import data, try again.');
        setStep(6);
        console.log(err);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setUploadedFile(null);
    } else if (step === 4) {
      setStep(2);
      setColumnMappings({});
      setUploadedFile(null);
    } else if (step === 6) {
      setStep(2);
      setUploadError(null);
      setUploadedFile(null);
    }
  };

  const handleFileUploadClick = () => fileInputRef.current?.click();

  const handleMappingChange = (
    sourceColumn: string,
    reportwellField: string,
  ) => {
    if (reportwellField === '__add_custom_field__') {
      setShowCustomFieldsManager(true);
    } else {
      setColumnMappings((prev) => ({
        ...prev,
        [sourceColumn]: reportwellField === 'none' ? '' : reportwellField,
      }));
    }
  };

  const handleCancelUpload = () => {
    setUploadProgress(0);
    setUploadedFile(null);
    setStep(2);
  };

  const handleClose = () => {
    handleCancelUpload();
    onClose();
  };

  // Download template handler
  const handleDownloadTemplate = () => {
    if (!selectedOption) return;
    if (
      Object.prototype.hasOwnProperty.call(downloadTemplateURLs, selectedOption)
    ) {
      const url =
        downloadTemplateURLs[
          selectedOption as keyof typeof downloadTemplateURLs
        ];
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop() || 'template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <>
      <BulkImportComponent
        open={open}
        onClose={handleClose}
        step={step}
        selectedOption={selectedOption}
        uploadedFile={uploadedFile}
        uploadProgress={uploadProgress}
        uploadError={uploadError}
        columnMappings={columnMappings}
        sourceColumns={sourceColumns}
        previewData={previewData}
        recordCount={recordCount}
        onOptionChange={setSelectedOption}
        onFileUploadClick={handleFileUploadClick}
        onFileChange={handleFileChange}
        onMappingChange={handleMappingChange}
        onNext={handleNext}
        onBack={handleBack}
        onCancelUpload={handleCancelUpload}
        fileInputRef={fileInputRef}
        reportwellFields={reportwellFields}
        handleDownloadTemplate={handleDownloadTemplate}
        setShowCustomFieldsManager={setShowCustomFieldsManager}
      />
      <ManageCustomFields
        open={showCustomFieldsManager}
        onClose={() => setShowCustomFieldsManager(false)}
        entityType={
          getCustomFieldKey(selectedOption) as EntityTypeWithCustomFields
        }
      />
    </>
  );
};
