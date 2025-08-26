import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import ReactPlayer from 'react-player';

import { ReportResponse } from '@/containers/Reports/index.types';
import { Category } from '@/containers/Reports/index.types';

import { Button } from '@/components/base/Button';
import { RadioGroup, RadioGroupItem } from '@/components/base/RadioGroup';
import { Checkbox } from '@/components/base/Checkbox';
import { ScrollArea } from '@/components/base/ScrollArea';
import { TabsContainer, Tabs, TabsContent } from '@/components/base/Tabs';
import { FileUploadInput } from '@/components/base/FileUploadInput';
import { CustomInput } from '@/components/base/CustomInput';
import FilePreview from '../FilePreview';

interface FormFieldValue {
  text: string;
  single_choice: string;
  multiple_choice: string[];
}

type QuestionType = keyof FormFieldValue;

interface FormData {
  comments?: string;
  [key: `question_${number}`]: FormFieldValue[QuestionType];
}

interface SelectedFile {
  file_url: string;
  file_name: string;
}

interface ReportPreviewProps {
  report: ReportResponse;
  onClose: () => void;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  categories: Category[];
  selectedFile: SelectedFile | null;
  setSelectedFile: Dispatch<SetStateAction<SelectedFile | null>>;
  onUpdate?: (updatedFileUrls: SelectedFile[]) => void;
  handleSubmit: () => void;
  handleFileUpload: (files: File[]) => void;
  formData: FormData;
  handleInputChange: (
    field: keyof FormData,
    value: FormFieldValue[keyof FormFieldValue],
  ) => void;
}

const tabs = [
  { id: 'details', label: 'Details' },
  { id: 'resources', label: 'Resources' },
  { id: 'submission-instructions', label: 'Submission Instructions' },
];

const ReportPreview: React.FC<ReportPreviewProps> = ({
  report,
  onClose,
  activeTab,
  setActiveTab,
  categories,
  selectedFile,
  setSelectedFile,
  onUpdate,
  handleSubmit,
  handleFileUpload,
  formData,
  handleInputChange,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-white absolute inset-0 z-50">
      {/* Header */}
      <div className="flex flex-col border-b border-slate-300 p-[16px_16px_0_16px] gap-2">
        <div className="flex items-center gap-2 justify-between w-full">
          <h4>{report.name || '[Report Name]'}</h4>
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              className="flex gap-2 h-[36px] p-[8px_12px] border-slate-700 rounded-[6px] bg-blue-500 hover:bg-blue-400"
            >
              <CheckIcon className="h-4 w-4" />
              <span className="text-white button2-semibold">Complete</span>
            </Button>
            <Link to="/reports">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex gap-2 h-[36px] p-[8px_12px] border-slate-700 rounded-[6px] bg-white"
              >
                <X className="h-4 w-4" />
                <span className="text-slate-700 button2-semibold">Back</span>
              </Button>
            </Link>
          </div>
        </div>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          tabClassName="button2-semibold"
          onTabChange={setActiveTab}
          className="border-none"
          activeTabClassName="border-b-4 border-orange-500 text-orange-500"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <TabsContainer defaultTab="details" className="h-full">
          <ScrollArea className="h-full">
            <TabsContent tabId="details" activeTab={activeTab}>
              <div className="flex gap-6 items-start p-6">
                <div className="flex gap-6 flex-col">
                  {/* Due Date */}
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-700 button2-medium">
                      Due Date
                    </span>
                    <span className="text-slate-500 button2-regular">
                      {(report.schedules &&
                        report.schedules.length > 0 &&
                        new Date(
                          report.schedules[0].schedule_time,
                        ).toLocaleDateString()) ||
                        '[Due Date]'}
                    </span>
                  </div>

                  {/* Est. Completion Time */}
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-700 button2-medium">
                      Est. Completion Time
                    </span>
                    <span className="text-slate-500 button2-regular">
                      {report.completion_time || '[Completion Time]'}
                    </span>
                  </div>

                  {/* Accepted formats */}
                  <div className="flex flex-col gap-2">
                    <span className="text-slate-700 button2-medium">
                      Accepted formats
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {report.file_format ? (
                        report.file_format.map((format, index) => (
                          <span
                            key={index}
                            className="border b-slate-200 bg-slate-200 rounded-md px-4 inline-flex items-center justify-center h-[24px] body2-medium"
                          >
                            {format.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="border border-slate-200 bg-slate-100 rounded-md px-4 inline-flex items-center justify-center h-[24px] body2-medium">
                          PDF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-col gap-2">
                    <span className="text-slate-700 button2-medium">
                      Categories
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {report.categories && report.categories.length > 0 ? (
                        report.categories.map((category) => (
                          <span
                            key={category}
                            className="rounded-md px-4 py-2"
                            style={{
                              backgroundColor: categories.find(
                                (c) => c.id === category,
                              )?.color,
                            }}
                          >
                            {categories.find((c) => c.id === category)?.name}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="bg-amber-100 flex justify-center items-center body2-medium text-amber-800 h-[24px] rounded-md px-4 py-2">
                            Q1
                          </span>
                          <span className="bg-green-100 flex justify-center items-center body2-medium text-green-800 h-[24px] rounded-md px-4 py-2">
                            Performance Review
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 flex-col h-[225.087px] bg-blue-100 max-w-[378px] w-[378px] rounded-[5px]">
                  {report.video_url ? (
                    <ReactPlayer
                      url={report.video_url}
                      width="100%"
                      height="100%"
                      playing={false}
                      controls
                      light={true}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 p-6">
                <h5 className="text-slate-700 button2-medium">Description</h5>
                <p className="body1-regular max-w-[776px]">
                  {parse(
                    DOMPurify.sanitize(report.description || '[Description]'),
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                  <h5 className="text-slate-700 button2-medium">
                    Instructions
                  </h5>
                  <p className="body1-regular">
                    Follow the steps below to complete this form submission.
                  </p>
                </div>
                <div className="flex gap-6 min-h-[250px]">
                  {/* Step 1 */}
                  <div className="flex-1 bg-slate-50 rounded-md p-4 flex flex-col gap-3 max-w-[350px]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center">
                        <span>1</span>
                      </div>
                      <h6 className="font-medium">
                        {report.content?.step1?.title || '[Step 1 Name]'}
                      </h6>
                    </div>
                    <p className="text-sm text-slate-700">
                      {parse(
                        DOMPurify.sanitize(
                          report.content?.step1?.description ||
                            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
                        ),
                      )}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex-1 bg-slate-50 rounded-md p-4 flex flex-col gap-3 max-w-[350px]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center">
                        <span>2</span>
                      </div>
                      <h6 className="font-medium">
                        {report.content?.step2?.title || '[Step 2 Name]'}
                      </h6>
                    </div>
                    <p className="text-sm text-slate-700">
                      {parse(
                        DOMPurify.sanitize(
                          report.content?.step2?.description ||
                            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
                        ),
                      )}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex-1 bg-slate-50 rounded-md p-4 flex flex-col gap-3 max-w-[350px]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center">
                        <span>3</span>
                      </div>
                      <h6 className="font-medium">
                        {report.content?.step3?.title || '[Step 3 Name]'}
                      </h6>
                    </div>
                    <p className="text-sm text-slate-700">
                      {parse(
                        DOMPurify.sanitize(
                          report.content?.step3?.description ||
                            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
                        ),
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              tabId="resources"
              activeTab={activeTab}
              className="p-6"
            >
              <div className="flex flex-col">
                <p className="text-slate-700 body1-regular mb-6">
                  The following resources should be used as a guide only.
                </p>

                <div className="flex gap-6">
                  {/* Left side - File list */}
                  <div className="w-[350px]">
                    <div className="border border-slate-200 rounded-md overflow-hidden">
                      {report.file_urls && report.file_urls.length > 0 ? (
                        report.file_urls.map((file, index) => (
                          <React.Fragment key={index}>
                            <div
                              className={`flex items-center justify-between p-4 hover:bg-slate-100 cursor-pointer ${
                                selectedFile?.file_url === file.file_url
                                  ? 'bg-slate-100'
                                  : ''
                              }`}
                              onClick={() => setSelectedFile(file)}
                            >
                              <div className="flex-1 truncate">
                                <span className="text-sm font-medium text-slate-800">
                                  {file.file_name}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-4 h-4 cursor-pointer hover:bg-slate-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedFileUrls =
                                    report.file_urls.filter(
                                      (f) => f.file_url !== file.file_url,
                                    );
                                  if (onUpdate) {
                                    onUpdate(updatedFileUrls);
                                  }
                                }}
                              >
                                <XCircleIcon className="w-4 h-4" />
                              </Button>
                            </div>
                            {index < report.file_urls.length - 1 && (
                              <div className="border-b border-slate-200"></div>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-slate-500">
                            No files available
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side - File preview */}
                  <div className="flex-1 bg-slate-50 rounded-md p-4 min-h-[400px] flex items-center justify-center">
                    <FilePreview file={selectedFile || undefined} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              tabId="submission-instructions"
              activeTab={activeTab}
              className="p-6"
            >
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-4 p-4 rounded-md">
                    {/* Certification Only */}
                    {report.submission_instruction?.type ===
                      'CERTIFICATE_ONLY' && (
                      <div className="flex flex-col gap-3 mt-2">
                        <p className="body1-regular text-slate-700">
                          Once you've completed the steps in Details, you're
                          done!
                        </p>
                        <p className="body1-regular text-slate-700">
                          Just press the complete button in the top-right corner
                        </p>
                        <Button
                          onClick={handleSubmit}
                          className="w-full h-[52px] rounded-[6px] bg-orange-500 text-white py-[14px] mt-4"
                        >
                          Complete
                        </Button>
                      </div>
                    )}

                    {/* Default Response */}
                    {report.submission_instruction?.type ===
                      'DEFAULT_RESPONSE' && (
                      <div className="flex flex-col gap-6">
                        <p className="body1-regular text-slate-700">
                          Answer the following question and upload your file.
                        </p>

                        <div className="flex flex-col gap-4 w-[314px]">
                          <div>
                            <h6 className="text-slate-700 mb-2">
                              Upload your file
                            </h6>
                            <p className="text-slate-700 text-sm mb-4">
                              Types allowed:{' '}
                              {report.submission_instruction?.accepted_files.join(
                                ', ',
                              )}
                            </p>
                            <FileUploadInput
                              onFilesSelected={handleFileUpload}
                              allowedTypes={
                                report.submission_instruction?.accepted_files ||
                                []
                              }
                              multiple={false}
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <h6 className="text-slate-700">
                              Additional comments
                            </h6>
                            <CustomInput
                              value={formData.comments || ''}
                              onChange={(e) =>
                                handleInputChange('comments', e.target.value)
                              }
                              placeholder="Enter your answer here"
                              className="w-full"
                            />
                          </div>

                          <Button
                            onClick={handleSubmit}
                            className="w-full h-[52px] rounded-[6px] bg-orange-500 text-white py-[14px] mt-4"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Form Response */}
                    {report.submission_instruction?.type ===
                      'RESPONSE_REQUIRED' && (
                      <div className="flex flex-col gap-6">
                        <p className="body1-regular text-slate-700">
                          Answer the following questions and upload files where
                          applicable.
                        </p>

                        {report.submission_instruction?.questions.map(
                          (question, index) => (
                            <div
                              key={index}
                              className="w-[397px] flex flex-col gap-4 border border-slate-200 rounded-lg p-6"
                            >
                              <div className="flex flex-col gap-2">
                                <h6 className="text-slate-700">
                                  {question.question}
                                </h6>
                                <p className="text-slate-500 text-sm">
                                  {question.type}
                                </p>
                              </div>

                              {/* Text Response */}
                              {question.type === 'text' && (
                                <CustomInput
                                  value={
                                    (formData[`question_${index}`] as string) ||
                                    ''
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      `question_${index}`,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter your answer here"
                                  className="w-full"
                                />
                              )}

                              {/* Single Choice */}
                              {question.type === 'single_choice' && (
                                <RadioGroup
                                  value={
                                    formData[`question_${index}`] as string
                                  }
                                  onValueChange={(value: string) =>
                                    handleInputChange(
                                      `question_${index}`,
                                      value,
                                    )
                                  }
                                  className="flex flex-col gap-3"
                                >
                                  {question.options.map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className="flex items-center space-x-2"
                                    >
                                      <RadioGroupItem
                                        value={option.option}
                                        id={`radio-${index}-${optIndex}`}
                                        className="text-orange-500 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                      />
                                      <label
                                        htmlFor={`radio-${index}-${optIndex}`}
                                        className="text-slate-700 cursor-pointer"
                                      >
                                        {option.option}
                                      </label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              )}

                              {/* Multiple Choice */}
                              {question.type === 'multiple_choice' && (
                                <div className="flex flex-col gap-3">
                                  {question.options.map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className="flex items-center space-x-2"
                                    >
                                      <Checkbox
                                        id={`checkbox-${index}-${optIndex}`}
                                        checked={
                                          (
                                            formData[
                                              `question_${index}`
                                            ] as string[]
                                          )?.includes(option.option) || false
                                        }
                                        onCheckedChange={(checked) => {
                                          const currentValues =
                                            (formData[
                                              `question_${index}`
                                            ] as string[]) || [];
                                          const newValues = checked
                                            ? [...currentValues, option.option]
                                            : currentValues.filter(
                                                (val) => val !== option.option,
                                              );
                                          handleInputChange(
                                            `question_${index}`,
                                            newValues,
                                          );
                                        }}
                                        className="border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                      />
                                      <label
                                        htmlFor={`checkbox-${index}-${optIndex}`}
                                        className="text-slate-700 cursor-pointer"
                                      >
                                        {option.option}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Document Upload */}
                              {question.type === 'document' && (
                                <div>
                                  <p className="text-slate-700 text-sm mb-4">
                                    Types allowed:{' '}
                                    {question.accepted_files.join(', ')}
                                  </p>
                                  <FileUploadInput
                                    onFilesSelected={(files) => {
                                      handleFileUpload(files);
                                      handleInputChange(
                                        `question_${index}`,
                                        files.map((file) => file.name),
                                      );
                                    }}
                                    allowedTypes={question.accepted_files}
                                    multiple={false}
                                  />
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </TabsContainer>
      </div>
    </div>
  );
};

export default ReportPreview;
