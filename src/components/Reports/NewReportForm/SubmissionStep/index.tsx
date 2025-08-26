import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { PlusIcon } from 'lucide-react';

import { ReportResponse } from '@/containers/Reports/index.types';

import {
  Question as QuestionType,
  Option,
  SubmissionInstruction,
} from '@/containers/Reports/index.types';

import { Button } from '@/components/base/Button';
import AddFileFormatDialog from './AddFileFormatDialog';
import Question from './Question';

interface SubmissionStepProps {
  formData: ReportResponse;
  handleChange: <K extends keyof ReportResponse>(
    field: K,
    value: ReportResponse[K],
  ) => void;
  handleNext: () => void;
  isSubmitting: boolean;
  stepLabels: string[];
  currentStep: number;
}

const SubmissionStep: React.FC<SubmissionStepProps> = ({
  formData,
  handleChange,
  handleNext,
  isSubmitting,
  stepLabels,
  currentStep,
}) => {
  const [questions, setQuestions] = useState<QuestionType[]>(
    formData.submission_instruction?.questions || [],
  );
  const [submissionType, setSubmissionType] = useState(
    formData.submission_instruction?.type || 'CERTIFICATE_ONLY',
  );
  const [autoAccept, setAutoAccept] = useState(
    formData.submission_instruction?.auto_accept || false,
  );
  const [fileFormat, setFileFormat] = useState<string[]>(
    formData.submission_instruction?.accepted_files || [],
  );
  const [allowLateSubmission, setAllowLateSubmission] = useState(
    formData.submission_instruction?.allow_submission || false,
  );
  const [isAddFileFormatDialogOpen, setIsAddFileFormatDialogOpen] =
    useState(false);

  // Effect to update formData whenever submission instruction details change
  useEffect(() => {
    const currentSubmissionInstruction = formData.submission_instruction;
    const newSubmissionInstruction: SubmissionInstruction = {
      id: currentSubmissionInstruction?.id || '',
      type: submissionType,
      auto_accept: submissionType === 'CERTIFICATE_ONLY' ? autoAccept : false, // Only relevant for certificate_only
      accepted_files: submissionType === 'DEFAULT_RESPONSE' ? fileFormat : [], // Only relevant for default_response
      allow_submission:
        submissionType === 'DEFAULT_RESPONSE' ? allowLateSubmission : false, // Only relevant for default_response
      questions: submissionType === 'RESPONSE_REQUIRED' ? questions : [], // Only relevant for response_required
    };
    handleChange('submission_instruction', newSubmissionInstruction);
  }, [
    questions,
    submissionType,
    autoAccept,
    fileFormat,
    allowLateSubmission,
    handleChange,
    formData.submission_instruction?.id,
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(), // Ensure unique ID for new questions
        question: '',
        type: 'text',
        options: [],
        allow_submission: false, // This field seems to be part of QuestionType, but might not be used here.
        accepted_files: [], // ditto
      },
    ]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, question: value } : q,
    );
    setQuestions(updatedQuestions);
  };

  const handleTypeChange = (index: number, value: string) => {
    const updatedQuestions = questions.map(
      (q, i) => (i === index ? { ...q, type: value, options: [] } : q), // Reset options when type changes
    );
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleOptionsChange = (index: number, options: Option[]) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, options } : q,
    );
    setQuestions(updatedQuestions);
  };

  const toggleFileFormat = (format: string) => {
    const formatValue = format.startsWith('.')
      ? format.toLowerCase()
      : `.${format.toLowerCase()}`;
    setFileFormat((prevFormats) =>
      prevFormats.includes(formatValue)
        ? prevFormats.filter((f) => f !== formatValue)
        : [...prevFormats, formatValue],
    );
  };

  const getDisplayFormat = (format: string) => {
    return format.replace(/^\./, '').toUpperCase();
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'question') {
      const reorderedQuestions = Array.from(questions);
      const [removed] = reorderedQuestions.splice(source.index, 1);
      reorderedQuestions.splice(destination.index, 0, removed);
      setQuestions(reorderedQuestions);
    }

    if (type === 'option') {
      const questionIndex = parseInt(source.droppableId.split('-')[1]); // Assuming droppableId like "options-0"
      if (questions[questionIndex]) {
        const reorderedOptions = Array.from(questions[questionIndex].options);
        const [removed] = reorderedOptions.splice(source.index, 1);
        reorderedOptions.splice(destination.index, 0, removed);

        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          options: reorderedOptions,
        };
        setQuestions(updatedQuestions);
      }
    }
  };

  const handleNextClick = () => {
    // handleChange is now handled by useEffect
    handleNext();
  };

  const handleAddFileFormat = (format: string) => {
    const formatValue = format.startsWith('.')
      ? format.toLowerCase()
      : `.${format.toLowerCase()}`;
    if (!fileFormat.includes(formatValue)) {
      setFileFormat([...fileFormat, formatValue]);
    }
  };

  // This function is used by the Question component to update a whole question object
  const handleQuestionUpdate = (
    index: number,
    updatedQuestion: QuestionType,
  ) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? updatedQuestion : q,
    );
    setQuestions(updatedQuestions);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="mx-auto flex gap-6 flex-col p-6 w-[884px]">
        <h2>Submission Instructions</h2>
        <div className="flex flex-col gap-4">
          <p className="body2-regular text-slate-700">
            Determine how you want to get submissions.
          </p>

          <div className="flex flex-col gap-4">
            {/* Certification only option */}
            <div className="border border-slate-300 rounded-lg p-6 gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`
                    flex items-center justify-center cursor-pointer
                    w-5 h-5 rounded-full mt-0.5
                    ${
                      submissionType === 'CERTIFICATE_ONLY'
                        ? 'bg-white border-2 border-orange-500'
                        : 'bg-gray-100 border-1 border-gray-200'
                    }
                  `}
                  onClick={() => setSubmissionType('CERTIFICATE_ONLY')}
                >
                  {submissionType === 'CERTIFICATE_ONLY' && (
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="body2-regular text-slate-700">
                    Certification only
                  </span>
                  <p className="body3-regular text-slate-500">
                    Select this option if you only need schools to certify they
                    completed the report
                  </p>

                  {submissionType === 'CERTIFICATE_ONLY' && (
                    <div className="mt-3 flex items-center gap-2">
                      <div
                        className={`
                          flex items-center justify-center cursor-pointer
                          w-4 h-4 rounded
                          ${
                            autoAccept
                              ? 'bg-orange-500 border-orange-500'
                              : 'bg-white border border-slate-300'
                          }
                        `}
                        onClick={() => setAutoAccept(!autoAccept)}
                      >
                        {autoAccept && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 1L3.5 6.5L1 4"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="body2-regular text-slate-700">
                        Auto-Accept (Don't need to review the submission)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Default response option */}
            <div className="border border-slate-300 rounded-lg p-6 gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`
                    flex items-center justify-center cursor-pointer
                    w-5 h-5 rounded-full mt-0.5
                    ${
                      submissionType === 'DEFAULT_RESPONSE'
                        ? 'bg-white border-2 border-orange-500'
                        : 'bg-gray-100 border-1 border-gray-200'
                    }
                  `}
                  onClick={() => setSubmissionType('DEFAULT_RESPONSE')}
                >
                  {submissionType === 'DEFAULT_RESPONSE' && (
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <div>
                    <span className="body2-regular text-slate-700">
                      Default response
                    </span>
                    <p className="body3-regular text-slate-500">
                      Use the prebuilt short response form of a short text
                      response with a document upload.
                    </p>
                  </div>

                  {submissionType === 'DEFAULT_RESPONSE' && (
                    <div className="flex flex-col gap-4 mt-2">
                      <div>
                        <p className="body2-medium text-slate-700 mb-2">
                          Set acceptable file types:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            'PDF',
                            'XLS',
                            'DOC',
                            // Display other formats already in fileFormat that are not the default ones
                            ...fileFormat
                              .filter(
                                (f) =>
                                  !['.pdf', '.xls', '.doc'].includes(
                                    f.toLowerCase(),
                                  ),
                              )
                              .map((f) => getDisplayFormat(f)),
                          ]
                            .filter(
                              (value, index, self) =>
                                self.indexOf(value) === index,
                            ) // Ensure unique formats displayed
                            .map((format) => (
                              <div
                                key={format}
                                className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded cursor-pointer"
                                onClick={() => toggleFileFormat(format)}
                              >
                                <div
                                  className={`
                                  flex items-center justify-center
                                  w-4 h-4 rounded
                                  ${
                                    fileFormat.includes(
                                      `.${format.toLowerCase()}`,
                                    )
                                      ? 'bg-orange-500 border-orange-500'
                                      : 'bg-white border border-slate-300'
                                  }
                                `}
                                >
                                  {fileFormat.includes(
                                    `.${format.toLowerCase()}`,
                                  ) && (
                                    <svg
                                      width="10"
                                      height="8"
                                      viewBox="0 0 10 8"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9 1L3.5 6.5L1 4"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span className="body2-regular text-slate-700">
                                  {format}
                                </span>
                              </div>
                            ))}

                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 bg-slate-50 px-4 py-2 rounded h-auto"
                            onClick={() => setIsAddFileFormatDialogOpen(true)}
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span>Add file format</span>
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className={`
                            flex items-center justify-center cursor-pointer
                            w-4 h-4 rounded
                            ${
                              allowLateSubmission
                                ? 'bg-orange-500 border-orange-500'
                                : 'bg-white border border-slate-300'
                            }
                          `}
                          onClick={() =>
                            setAllowLateSubmission(!allowLateSubmission)
                          }
                        >
                          {allowLateSubmission && (
                            <svg
                              width="10"
                              height="8"
                              viewBox="0 0 10 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 1L3.5 6.5L1 4"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="body2-regular text-slate-700">
                          Allow submission after the report is approved.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form response option */}
            <div className="border border-slate-300 rounded-lg p-6 gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`
                    flex items-center justify-center cursor-pointer
                    w-5 h-5 rounded-full mt-0.5
                    ${
                      submissionType === 'RESPONSE_REQUIRED'
                        ? 'bg-white border-2 border-orange-500'
                        : 'bg-gray-100 border-1 border-gray-200'
                    }
                  `}
                  onClick={() => setSubmissionType('RESPONSE_REQUIRED')}
                >
                  {submissionType === 'RESPONSE_REQUIRED' && (
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <span className="body2-regular text-slate-700">
                    Form Response
                  </span>
                  <p className="body3-regular text-slate-500">
                    Add customized questions to guide the school's submission.
                  </p>

                  {submissionType === 'RESPONSE_REQUIRED' && (
                    <div className="mt-4 flex flex-col gap-4">
                      <Droppable droppableId="questions" type="question">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex flex-col gap-4"
                          >
                            {questions.map((q, index) => (
                              <Question
                                key={q.id} // Use stable ID from question object
                                index={index}
                                question={q}
                                onQuestionChange={handleQuestionChange} // Reverted to original handler
                                onTypeChange={handleTypeChange} // Reverted to original handler
                                onOptionsChange={handleOptionsChange} // Reverted to original handler
                                onDelete={handleDeleteQuestion} // Reverted to original handler
                                onQuestionUpdate={handleQuestionUpdate} // This was already correct
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-orange-500 w-fit mt-2"
                        onClick={handleAddQuestion}
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Question</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleNextClick}
          disabled={isSubmitting}
          className="w-full h-[52px] rounded-[6px] bg-orange-500 text-white max-w-[884px] py-[14px] mt-4"
        >
          {`Next: ${stepLabels[currentStep]}`}
        </Button>
      </div>
      <AddFileFormatDialog
        open={isAddFileFormatDialogOpen}
        onOpenChange={setIsAddFileFormatDialogOpen}
        onAdd={handleAddFileFormat}
        existingFormats={fileFormat}
      />
    </DragDropContext>
  );
};

export default SubmissionStep;
