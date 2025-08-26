import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { XCircleIcon } from '@heroicons/react/24/outline';
import ReactPlayer from 'react-player';

import { ReportResponse } from '@/containers/Reports/index.types';
import { Category } from '@/containers/Reports/index.types';

import { Button } from '@/components/base/Button';
import { ScrollArea } from '@/components/base/ScrollArea';
import { RadioGroup, RadioGroupItem } from '@/components/base/RadioGroup';
import { Checkbox } from '@/components/base/Checkbox';
import { TabsContainer, Tabs, TabsContent } from '@/components/base/Tabs';
import { CustomInput } from '@/components/base/CustomInput';
import { FileUploadInput } from '@/components/base/FileUploadInput';
import FilePreview from '../FilePreview';

interface SelectedFileType {
  file_url: string;
  file_name: string;
}

interface ReportPreviewProps {
  report: ReportResponse;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  categories: Category[];
  selectedFile: SelectedFileType | null;
  setSelectedFile: Dispatch<SetStateAction<SelectedFileType | null>>;
  onUpdate: (updatedFileUrls: SelectedFileType[]) => void;
  onClose: () => void;
}

const tabs = [
  { id: 'details', label: 'Details' },
  { id: 'resources', label: 'Resources' },
  { id: 'submission-instructions', label: 'Submission Instructions' },
];

const ReportPreview: React.FC<ReportPreviewProps> = ({
  report,
  activeTab,
  setActiveTab,
  categories,
  selectedFile,
  setSelectedFile,
  onUpdate,
  onClose,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-white absolute inset-0 z-50">
      {/* Header */}
      <div className="flex flex-col border-b border-slate-300 p-[16px_16px_0_16px] gap-2">
        <div className="flex items-center gap-2 justify-between w-full">
          <h4>{report.name || '[Report Name]'}</h4>
          <Link to="/reports">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex gap-2 h-[36px] p-[8px_12px] border-slate-700 rounded-[6px] bg-white"
            >
              <X className="h-4 w-4" />
              <span className="text-slate-700 button2-semibold">
                Close Preview
              </span>
            </Button>
          </Link>
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
                            className='rounded-md px-4 py-2'
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

                {report.video_url ? (
                  <div className="flex gap-6 flex-col h-[225.087px] bg-blue-100 max-w-[378px] w-[378px] rounded-[5px]">
                    <ReactPlayer
                      url={report.video_url}
                      width="100%"
                      height="100%"
                      playing={false}
                      controls
                      light={true}
                    />
                  </div>
                ) : (
                  ''
                )}
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
                              className={`flex items-center justify-between p-4 hover:bg-slate-100 cursor-pointer ${selectedFile?.file_url === file.file_url
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
                                  onUpdate(updatedFileUrls);
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
              className={
                report.submission_instruction?.type === 'CERTIFICATE_ONLY'
                  ? 'p-16'
                  : 'p-6'
              }
            >
              {report.submission_instruction?.type === 'CERTIFICATE_ONLY' ? (
                <p className="body1-regular text-slate-700">
                  Once you've completed the steps in <b>Details</b>, you're
                  done! Just press the complete button in the top-right corner
                </p>
              ) : (
                <div className="p-6 flex flex-col gap-6">
                  {report.submission_instruction?.type ===
                    'DEFAULT_RESPONSE' ? (
                    <p className="body1-regular text-slate-700">
                      Answer the following question and upload your file.
                    </p>
                  ) : (
                    <p className="body1-regular text-slate-700">
                      Answer the following questions and upload files where
                      applicable.
                    </p>
                  )}
                  {report.submission_instruction?.type ===
                    'DEFAULT_RESPONSE' ? (
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col">
                        <span className="body1-bold mb-1">
                          Upload your file
                        </span>
                        <p className="flex flex-row gap-1 body1-regular text-slate-700 mb-4">
                          <p>Types allowed:</p>
                          <p>
                            {report.submission_instruction?.accepted_files.join(
                              ', ',
                            )}
                          </p>
                        </p>
                        <FileUploadInput
                          allowedTypes={
                            report.submission_instruction?.accepted_files || []
                          }
                          onFilesSelected={(files) =>
                            console.log('on file selected:', files)
                          }
                        />
                        <Button className="cursor-pointer bg-slate-500 rounded-[6px] hover:bg-slate-700 active:bg-slate-800 p-[10px_20px] h-[36px] w-[90px] mt-6">
                          <span className="text-white button2">Upload</span>
                        </Button>
                      </div>
                      <div className="flex flex-col gap-1 w-[360px]">
                        <CustomInput
                          label="Additional comments"
                          placeholder="Enter your answer here"
                          value={''}
                          onChange={(e) =>
                            console.log('on change:', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ) : report.submission_instruction?.type ===
                    'RESPONSE_REQUIRED' ? (
                    report.submission_instruction?.questions.map(
                      (question, index) => (
                        <div
                          key={index}
                          className="w-[397px] flex flex-col gap-4 border border-slate-200 rounded-lg p-6"
                        >
                          <div className="flex flex-col gap-2">
                            <h6 className="text-slate-700">
                              {question.question}
                            </h6>
                          </div>

                          {/* Text Response */}
                          {question.type === 'text' && (
                            <CustomInput
                              value={''}
                              onChange={(e) =>
                                console.log('change event:', e.target.value)
                              }
                              placeholder="Enter your answer here"
                              className="w-full"
                            />
                          )}

                          {/* Single Choice */}
                          {question.type === 'single_choice' && (
                            <RadioGroup
                              value={''}
                              onValueChange={(value: string) =>
                                console.log('on value change:', value)
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
                                    checked={false}
                                    onCheckedChange={(checked) =>
                                      console.log('on check changed:', checked)
                                    }
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
                                onFilesSelected={(files) =>
                                  console.log('on file selected:', files)
                                }
                                allowedTypes={question.accepted_files}
                                multiple={false}
                              />
                            </div>
                          )}
                        </div>
                      ),
                    )
                  ) : (
                    ''
                  )}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </TabsContainer>
      </div>
    </div>
  );
};

export default ReportPreview;
