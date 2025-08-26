import React from 'react';
import { useSelector } from 'react-redux';
import { PencilIcon } from '@heroicons/react/24/outline';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import ReactPlayer from 'react-player';

import { ReportResponse } from '@/containers/Reports/index.types';
import { getCategoryColors } from '@/utils/categoryColors';

import { Badge } from '@/components/base/Badge';
import { Button } from '@/components/base/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/Table';

import { RootState } from '@/store';

interface ReviewStepProps {
  formData: ReportResponse;
  handleNext: () => void;
  isSubmitting: boolean;
  stepLabels: string[];
  currentStep: number;
  onNavigateToStep?: (step: number) => void;
  onPreviewRequest?: (report: ReportResponse) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onNavigateToStep,
  // onPreviewRequest,
}) => {
  const categoryOptions = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const handleEditDetails = () => {
    if (onNavigateToStep) onNavigateToStep(1);
  };

  const handleEditSchedule = () => {
    if (onNavigateToStep) onNavigateToStep(2);
  };

  const handleEditSubmission = () => {
    if (onNavigateToStep) onNavigateToStep(3);
  };

  const handleEditScoring = () => {
    if (onNavigateToStep) onNavigateToStep(4);
  };

  // const handlePreviewOpen = () => {
  //   if (onPreviewRequest) onPreviewRequest(formData);
  // };

  return (
    <div className="flex flex-col gap-6 p-6 mx-auto w-[884px]">
      <div className="gap-8 flex w-[541px]">
        <h2 className="flex-1">Review</h2>
        {/* <Button
          variant="outline"
          className="rounded-[6px] bg-white border border-slate-500 px-3 py-2 flex items-center gap-2 text-slate-700 button2-semibold hover:bg-slate-50"
          onClick={handlePreviewOpen}
        >
          Preview
          <EyeIcon className="w-4 h-4" />
        </Button> */}
      </div>

      <div className="flex flex-col w-[541px] gap-4">
        <p className="body2-regular text-slate-700">
          {
            'Review the details below. Once you\'ve confirmed the report is accurate, save or assign the report.'
          }
        </p>
        {/* Report Details Section */}
        <div className="flex flex-col gap-4 p-4 border rounded-[8px] border-slate-300">
          <div className="flex justify-between items-center">
            <h3 className="flex-1 text-slate-700">Report Details</h3>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={handleEditDetails}
            >
              <PencilIcon className="w-5 h-5 text-slate-700" />
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-slate-700">Name</p>
              <p className="font-medium">{formData.name || '[Name]'}</p>
            </div>

            <div>
              <p className="text-sm text-slate-700">Categories</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.categories.map((categoryId) => {
                  const category = categoryOptions.find(
                    (c) => c.id === categoryId,
                  );
                  let badgeClasses =
                    'bg-blue-50 text-blue-700 border border-blue-200';
                  if (category?.color) {
                    const colorMapping = getCategoryColors(category.color);
                    if (colorMapping) {
                      const textColor = 'text-slate-800';
                      badgeClasses = `${colorMapping.background} ${textColor} ${colorMapping.border}`;
                    }
                  }
                  return (
                    <Badge key={categoryId} className={badgeClasses}>
                      {category?.name || categoryId}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-700">Description</p>
              <p className="text-sm text-slate-700">
                {parse(
                  DOMPurify.sanitize(formData.description || '[Description]'),
                )}
              </p>
            </div>
            <h3 className="flex-1 text-slate-700">Steps</h3>
            <div>
              <p className="font-medium text-sm">
                {formData.content?.step1?.title || '[Step 1 Name]'}
              </p>
              <p className="text-xs mt-1">
                {parse(
                  DOMPurify.sanitize(
                    formData.content?.step1?.description || '[Description]',
                  ),
                )}
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">
                {formData.content?.step2?.title || '[Step 2 Name]'}
              </p>
              <p className="text-xs mt-1">
                {parse(
                  DOMPurify.sanitize(
                    formData.content?.step2?.description || '[Description]',
                  ),
                )}
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">
                {formData.content?.step3?.title || '[Step 3 Name]'}
              </p>
              <p className="text-xs mt-1">
                {parse(
                  DOMPurify.sanitize(
                    formData.content?.step3?.description || '[Description]',
                  ),
                )}
              </p>
            </div>

            <p className="text-sm text-slate-500">Video Upload</p>
            {formData.video_url ? (
              <div className="mt-1 flex flex-col">
                <a
                  href={formData.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline mb-2"
                >
                  {formData.video_url}
                </a>
                <div className="w-48 h-32 bg-slate-100 rounded flex items-center justify-center mr-2">
                  <ReactPlayer
                    url={formData.video_url}
                    light={true}
                    width="100%"
                    height="100%"
                    controls={true}
                  />
                </div>
              </div>
            ) : (
              <span className="text-sm text-slate-500">No video uploaded</span>
            )}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="flex flex-col gap-4 p-4 border rounded-[8px] border-slate-300">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Schedule</h3>
            <Button
              variant="ghost"
              size="icon"
              className="relative w-6 h-6"
              onClick={handleEditSchedule}
            >
              <PencilIcon className="w-5 h-5 text-slate-700" />
            </Button>
          </div>

          {formData.schedules ? (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-left text-slate-700 font-medium">
                    DATE
                  </TableHead>
                  <TableHead className="text-left text-slate-700 font-medium">
                    NAME
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.schedules.map((schedule, index) => {
                  return (
                    <TableRow key={index} className="border-t border-slate-200">
                      <TableCell className="text-slate-700">
                        {new Date(schedule.schedule_time).toLocaleDateString(
                          'en-US',
                          { month: 'long', day: 'numeric', year: 'numeric' },
                        )}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <p className="body2-regular">{schedule.report_name}</p>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-slate-500">No schedules found</p>
          )}
        </div>

        {/* Submission Instructions */}
        <div className="flex flex-col gap-4 p-4 border rounded-[8px] border-slate-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Submission Instructions</h3>
            <Button
              variant="ghost"
              size="sm"
              className="relative w-6 h-6"
              onClick={handleEditSubmission}
            >
              <PencilIcon className="w-5 h-5 text-slate-700" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Submission Type</p>
              <p className="font-medium">
                {formData.submission_instruction?.type === 'CERTIFICATE_ONLY'
                  ? 'Certification only'
                  : formData.submission_instruction?.type === 'DEFAULT_RESPONSE'
                    ? 'Default response'
                    : formData.submission_instruction?.type ===
                        'RESPONSE_REQUIRED'
                      ? 'Form response'
                      : 'Default'}
              </p>
            </div>

            {formData.submission_instruction?.type === 'CERTIFICATE_ONLY' && (
              <div>
                <p className="text-sm text-slate-500">Auto Accept</p>
                <p className="font-medium">
                  {formData.submission_instruction?.auto_accept ? 'Yes' : 'No'}
                </p>
              </div>
            )}

            {formData.submission_instruction?.type === 'DEFAULT_RESPONSE' && (
              <>
                <div>
                  <p className="text-sm text-slate-500">
                    Allow Late Submission
                  </p>
                  <p className="font-medium">
                    {formData.submission_instruction?.allow_submission
                      ? 'Yes'
                      : 'No'}
                  </p>
                </div>
              </>
            )}

            {formData.submission_instruction?.type === 'DEFAULT_RESPONSE' && (
              <>
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">File Formats</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.submission_instruction?.accepted_files.map(
                      (format) => (
                        <Badge
                          key={format}
                          className="bg-amber-50 text-amber-800 border border-amber-200"
                        >
                          {format}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Display Questions if type is RESPONSE_REQUIRED */}
          {formData.submission_instruction?.type === 'RESPONSE_REQUIRED' && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-md font-medium text-slate-700 mb-3">
                Form Questions
              </h4>
              <div className="space-y-4">
                {formData.submission_instruction.questions?.map(
                  (question, index) => (
                    <div
                      key={question.id || index}
                      className="p-3 border rounded-[6px] border-slate-200 bg-slate-50"
                    >
                      <p className="font-medium text-slate-800">
                        {index + 1}. {question.question}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 capitalize">
                        Type: {question.type?.replace('_', ' ')}
                      </p>

                      {/* Display Allow Late Submission for the question */}
                      <p className="text-xs text-slate-500 mt-1">
                        Late Submissions Allowed:{' '}
                        {question.allow_submission ? 'Yes' : 'No'}
                      </p>

                      {(question.type === 'single_choice' ||
                        question.type === 'multiple_choice') &&
                        question.options &&
                        question.options.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-slate-600 mb-1">
                              Options:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {question.options.map((opt, optIndex) => (
                                <Badge
                                  key={opt.id || optIndex}
                                  variant="outline"
                                  className="text-slate-700 border-slate-300"
                                >
                                  {opt.option}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      {question.type === 'document' && (
                        <>
                          {question.accepted_files &&
                            question.accepted_files.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-slate-600 mb-1">
                                  Accepted File Types:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {question.accepted_files.map(
                                    (fileType, ftIndex) => (
                                      <Badge
                                        key={ftIndex}
                                        variant="outline"
                                        className="text-xs bg-white border-slate-300 text-slate-700"
                                      >
                                        {fileType}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        {/* Scoring */}
        {formData.use_scoring && (
          <div className="flex flex-col gap-4 p-4 border rounded-[8px] border-slate-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex-1">Scoring</h3>
              <Button
                variant="ghost"
                size="sm"
                className="relative w-6 h-6"
                onClick={handleEditScoring}
              >
                <PencilIcon className="w-5 h-5 text-slate-700" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <>
                <div className="col-span-2">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="border rounded p-2 bg-green-50">
                      <p className="text-xs font-medium text-green-800">
                        Exceeds Standard
                      </p>
                      <p className="text-sm">
                        {formData.scoring?.exceed || 'Not specified'}
                      </p>
                    </div>
                    <div className="border rounded p-2 bg-blue-50">
                      <p className="text-xs font-medium text-blue-800">
                        Meets Standard
                      </p>
                      <p className="text-sm">
                        {formData.scoring?.meet || 'Not specified'}
                      </p>
                    </div>
                    <div className="border rounded p-2 bg-yellow-50">
                      <p className="text-xs font-medium text-yellow-800">
                        Approaching Standard
                      </p>
                      <p className="text-sm">
                        {formData.scoring?.approach || 'Not specified'}
                      </p>
                    </div>
                    <div className="border rounded p-2 bg-red-50">
                      <p className="text-xs font-medium text-red-800">
                        Does Not Meet Standard
                      </p>
                      <p className="text-sm">
                        {formData.scoring?.notmeet || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewStep;
