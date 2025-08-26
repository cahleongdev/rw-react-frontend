import React, { Dispatch, SetStateAction } from 'react';
import {
  ArrowLeftIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';

import { Button } from '@/components/base/Button';
import { RadioGroup, RadioGroupItem } from '@/components/base/RadioGroup';
import { Label } from '@/components/base/Label';
import { Progress } from '@/components/base/Progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select';
import { cn } from '@utils/tailwind';

export interface PreviewData {
  [key: string]: string | undefined;
}

interface BulkImportProps {
  open: boolean;
  onClose: () => void;
  step: number;
  selectedOption: string | null;
  uploadedFile: File | null;
  uploadProgress: number;
  uploadError: string | null;
  columnMappings: Record<string, string>;
  sourceColumns: string[];
  previewData: PreviewData;
  recordCount: number;
  onOptionChange: (value: string) => void;
  onFileUploadClick: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMappingChange: (sourceColumn: string, reportwellField: string) => void;
  onNext: () => void;
  onBack: () => void;
  onCancelUpload: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  reportwellFields: string[];
  handleDownloadTemplate: () => void;
  setShowCustomFieldsManager: Dispatch<SetStateAction<boolean>>;
}

export const BulkImport: React.FC<BulkImportProps> = ({
  open,
  onClose,
  step,
  selectedOption,
  uploadedFile,
  uploadProgress,
  uploadError,
  columnMappings,
  sourceColumns,
  previewData,
  recordCount,
  onOptionChange,
  onFileUploadClick,
  onFileChange,
  onMappingChange,
  onNext,
  onBack,
  onCancelUpload,
  fileInputRef,
  reportwellFields,
  handleDownloadTemplate,
}) => {
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-1 flex-col items-center justify-center py-8 gap-6">
            <div className="bg-slate-100 rounded-full p-4 mb-4">
              <img
                src="/assets/images/files/files.png"
                alt="Select Import Type"
                className="w-[135px] h-[121px]"
              />
            </div>
            <p className="text-slate-600 body1-medium">
              Select what you want to import
            </p>
            <RadioGroup
              value={selectedOption || ''}
              onValueChange={onOptionChange}
              className="flex flex-wrap gap-4 w-full px-6 justify-center"
            >
              {['Schools', 'Networks', 'Users', 'Board Members'].map(
                (option) => (
                  <Label
                    key={option}
                    htmlFor={option}
                    className={`flex items-center border rounded-md px-4 py-2 hover:bg-slate-50 cursor-pointer w-[162px] ${selectedOption === option ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}
                  >
                    <RadioGroupItem
                      value={option}
                      id={option}
                      className="mr-2"
                    />
                    <span className="body2-regular">{option}</span>
                  </Label>
                ),
              )}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-1 flex-col items-center justify-center py-8 gap-6">
            <img
              src="/assets/images/files/files.png"
              alt="Upload File"
              className="w-[135px] h-[121px]"
            />
            <div className="flex flex-col items-center gap-2  w-[90%]">
              <h4 className="text-slate-700">
                Import from .XLS, .XLSX, or .CSV
              </h4>
              <p className="text-slate-500 body2-regular text-center">
                Before uploading, ensure your spreadsheet has columns
                identifying what is in each column.
                <br />
                Or, download the template (recommended if you haven't imported
                previously).
              </p>
            </div>
            {uploadedFile && (
              <p className="text-green-600 body2-medium">
                File selected: {uploadedFile.name}
              </p>
            )}
            <div className="flex gap-4 mt-4">
              <Button
                variant="outline"
                className="h-[34px] p-[8px_12px] border border-slate-600 text-slate-600"
                onClick={handleDownloadTemplate}
              >
                Download Template
              </Button>
              <Button
                onClick={onFileUploadClick}
                className="h-[34px] p-[8px_12px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
              >
                Upload File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
                accept=".xls,.xlsx,.csv"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-1 flex-col items-center justify-center py-8 gap-6">
            <div className="relative bg-slate-100 rounded-full p-4 mb-4">
              <img
                src="/assets/images/files/files.png"
                alt="Uploading"
                className="w-[135px] h-[121px] opacity-50"
              />
            </div>
            <div className="w-3/4 max-w-md flex flex-col items-center gap-3">
              <div className="w-full relative pt-5">
                <Progress
                  value={uploadProgress}
                  className="w-full h-2 bg-orange-50"
                  indicatorClassName="bg-orange-500"
                />
                <div
                  className="absolute top-0 left-0 w-full"
                  style={{ left: `${uploadProgress}%` }}
                >
                  <span className="inline-block transform -translate-x-1/2 bg-slate-700 text-white text-xs font-semibold rounded px-2 py-0.5">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <p className="text-slate-600 body1-medium mt-4">
                Uploading {uploadedFile?.name}
              </p>
              <Button
                variant="outline"
                onClick={onCancelUpload}
                className="mt-4 text-red-600 border-red-600 hover:bg-red-50"
              >
                Cancel Upload
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-1 flex-col p-6 overflow-y-auto">
            <p className="text-slate-600 body1-regular mb-4">
              Map the columns from your file on the left to the fields in
              Reportwell in the middle column.
              <br />
              Use the Preview column to ensure that your data is appearing as
              you expect.
            </p>
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] bg-slate-50 font-medium text-slate-700 body2-medium pr-4">
                <div className="p-3 border-b border-r">Source columns</div>
                <div className="p-3 border-b border-r">Reportwell fields</div>
                <div className="p-3 border-b">Preview</div>
              </div>
              <div className="max-h-[300px] overflow-y-scroll">
                {sourceColumns.map((col) => {
                  // Get all mapped values except for this column
                  const mappedValues = Object.entries(columnMappings)
                    .filter(([key]) => key !== col)
                    .map(([, value]) => value)
                    .filter(Boolean);
                  return (
                    <div
                      key={col}
                      className="grid grid-cols-[1fr_1fr_1fr_auto] items-center border-b last:border-b-0"
                    >
                      <div
                        className="p-3 border-r body1-regular text-slate-800 truncate"
                        title={col}
                      >
                        {col}
                      </div>
                      <div className="p-2 border-r">
                        {/* Field Mapping DropDown */}
                        <Select
                          value={columnMappings[col] || ''}
                          onValueChange={(value) => onMappingChange(col, value)}
                        >
                          <SelectTrigger className="w-full h-9 text-sm border-none shadow-none">
                            <SelectValue placeholder="Click to map field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="none"
                              className="text-slate-500 py-3"
                            >
                              No Field
                            </SelectItem>
                            {reportwellFields.map((field) => {
                              const isMappedElsewhere =
                                mappedValues.includes(field) &&
                                columnMappings[col] !== field;
                              return (
                                <SelectItem
                                  key={field}
                                  value={field}
                                  disabled={isMappedElsewhere}
                                  className={cn(
                                    'py-3',
                                    isMappedElsewhere
                                      ? 'text-slate-400 cursor-not-allowed'
                                      : '',
                                  )}
                                >
                                  {field}
                                </SelectItem>
                              );
                            })}
                            <SelectItem
                              value="__add_custom_field__"
                              className="text-blue-600 hover:text-blue-700 cursor-pointer rounded-t-none border-t-1 border-slate-300 bg-blue-50 hover:bg-blue-100 w-full justify-start py-3"
                            >
                              <PlusIcon className="h-4 w-4 mr-2 text-blue-600" />
                              Create new Field
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div
                        className="p-3 body1-regular text-slate-600 truncate"
                        title={previewData[col] || 'None'}
                      >
                        {previewData[col] || (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-1 flex-col items-center justify-center py-8 gap-4">
            <img
              src="/assets/images/files/file-success.svg"
              alt="Success"
              className="w-[135px] h-[121px]"
            />
            <h4 className="text-green-700 font-semibold">Success!</h4>
            <p className="text-slate-600 body1-regular">
              You imported {recordCount}{' '}
              {selectedOption?.toLowerCase() || 'records'}.
            </p>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-1 flex-col items-center justify-center py-8 gap-4 text-center">
            <img
              src="/assets/images/files/file-error.svg"
              alt="Error"
              className="w-[135px] h-[121px]"
            />
            <h4 className="text-red-700 font-semibold">
              Error uploading {uploadedFile?.name}.
            </h4>
            <p className="text-slate-500 body1-regular max-w-sm">
              {uploadError || 'An unexpected error occurred.'}
              <br />
              Try using a template or checking to ensure you have headers in
              your table.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFooterButtons = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-[72px] h-[34px] p-[8px_12px] border border-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={onNext}
              disabled={!selectedOption}
              className="w-[72px] h-[34px] p-[8px_12px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
            >
              Next
            </Button>
          </>
        );

      case 2:
        return (
          <>
            <Button
              variant="outline"
              onClick={onBack}
              className="w-[72px] h-[34px] p-[8px_12px] border border-slate-700"
            >
              Back
            </Button>
            <Button
              onClick={onNext}
              disabled={!uploadedFile}
              className="w-[72px] h-[34px] p-[8px_12px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
            >
              Next
            </Button>
          </>
        );

      case 3:
        return (
          <>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-[72px] h-[34px] p-[8px_12px] border border-slate-700"
            >
              Cancel
            </Button>
            <Button
              disabled
              className="w-[72px] h-[34px] p-[8px_12px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white opacity-50 cursor-not-allowed"
            >
              Next
            </Button>
          </>
        );

      case 4:
        return (
          <>
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-auto text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to file upload
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="h-[34px] p-[8px_12px] border border-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={onNext}
              className="h-[34px] p-[8px_12px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
            >
              Import {recordCount} records
            </Button>
          </>
        );

      case 5:
        return (
          <Button
            onClick={onClose}
            className="h-[34px] p-[8px_25px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
          >
            View
          </Button>
        );

      case 6:
        return (
          <>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-[72px] h-[34px] p-[8px_12px] border border-slate-700"
            >
              Cancel
            </Button>
            <Button
              disabled
              className="w-[72px] h-[34px] p-[8px_12px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white opacity-50 cursor-not-allowed"
            >
              Next
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[750px] min-h-[607px] bg-white p-0 flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
        showClose={false}
      >
        <DialogTitle hidden />
        <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
          <h3 className="text-slate-900 font-semibold">
            Import {selectedOption || ['Schools/Networks/Users']}
          </h3>
          <XMarkIcon
            className="h-6 w-6 text-slate-500 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {renderStepContent()}

        <DialogFooter className="flex justify-end items-center p-4 border-t border-slate-200 gap-2 mt-auto flex-shrink-0">
          {renderFooterButtons()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
