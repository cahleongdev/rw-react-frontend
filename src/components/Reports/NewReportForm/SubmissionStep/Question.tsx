import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Bars3Icon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import {
  Question as QuestionType,
  Option,
} from '@/containers/Reports/index.types';

import { Input } from '@/components/base/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select';
import { Button } from '@/components/base/Button';
import AddFileFormatDialog from './AddFileFormatDialog';

interface QuestionProps {
  index: number;
  question: QuestionType;
  onQuestionChange: (index: number, value: string) => void;
  onTypeChange: (index: number, value: string) => void;
  onOptionsChange: (index: number, options: Option[]) => void;
  onDelete: (index: number) => void;
  onQuestionUpdate: (index: number, updatedQuestion: QuestionType) => void;
}

const Question: React.FC<QuestionProps> = ({
  index,
  question,
  onQuestionChange,
  onTypeChange,
  onOptionsChange,
  onDelete,
  onQuestionUpdate,
}) => {
  const [isAddFileFormatDialogOpen, setIsAddFileFormatDialogOpen] =
    useState(false);

  const handleOptionChange = (optionIndex: number, value: string) => {
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = { id: optionIndex.toString(), option: value };
    onOptionsChange(index, updatedOptions);
  };

  const handleAddOption = () => {
    onOptionsChange(index, [...question.options, { id: '', option: '' }]);
  };

  const handleDeleteOption = (optionIndex: number) => {
    const updatedOptions = question.options.filter((_, i) => i !== optionIndex);
    onOptionsChange(index, updatedOptions);
  };

  const toggleFileFormat = (format: string) => {
    const formatValue = `.${format.toLowerCase()}`;
    const updatedFormats = question.accepted_files.includes(formatValue)
      ? question.accepted_files.filter((f) => f !== formatValue)
      : [...question.accepted_files, formatValue];

    const updatedQuestion = { ...question, accepted_files: updatedFormats };
    onQuestionUpdate(index, updatedQuestion);
  };

  const handleAddFileFormat = (format: string) => {
    if (!question.accepted_files.includes(format)) {
      const updatedFormats = [...question.accepted_files, format];
      const updatedQuestion = { ...question, accepted_files: updatedFormats };
      onQuestionUpdate(index, updatedQuestion);
    }
  };

  const getDisplayFormat = (format: string) => {
    return format.replace(/^\./, '').toUpperCase();
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'single_choice':
      case 'multiple_choice':
        return (
          <div className="flex flex-col gap-3 mt-2">
            <span className="body2-medium text-slate-700">Options</span>

            <Droppable droppableId={index.toString()} type="option">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-2"
                >
                  {question.options.map((option, optionIndex) => (
                    <Draggable
                      key={optionIndex}
                      draggableId={`${index}-${optionIndex}`}
                      index={optionIndex}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-2"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab"
                          >
                            <Bars3Icon className="h-5 w-5 text-slate-400" />
                          </div>
                          <Input
                            value={option.option}
                            onChange={(e) =>
                              handleOptionChange(optionIndex, e.target.value)
                            }
                            placeholder="Answer"
                            className="border border-slate-300 rounded-md"
                          />
                          <div
                            className="cursor-pointer"
                            onClick={() => handleDeleteOption(optionIndex)}
                          >
                            <TrashIcon className="h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-orange-500 w-fit mt-1"
              onClick={handleAddOption}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add an answer</span>
            </Button>
          </div>
        );
      case 'document':
        return (
          <div>
            <p className="body2-medium text-slate-700 mb-2">
              Acceptable file type:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'PDF',
                'XLS',
                'DOC',
                ...question.accepted_files
                  .filter(
                    (f) => !['.pdf', '.xls', '.doc'].includes(f.toLowerCase()),
                  )
                  .map((f) => getDisplayFormat(f)),
              ].map((format) => (
                <div
                  key={format}
                  className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded"
                  onClick={() => toggleFileFormat(format)}
                >
                  <div
                    className={`
                      flex items-center justify-center
                      w-4 h-4 rounded
                      ${
                        question.accepted_files.includes(
                          `.${format.toLowerCase()}`,
                        )
                          ? 'bg-orange-500 border-orange-500'
                          : 'bg-white border border-slate-300'
                      }
                    `}
                  >
                    {question.accepted_files.includes(
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
                  <span className="body2-regular text-slate-700">{format}</span>
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
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Draggable draggableId={question.id} index={index}>
        {(provided, snapshot) => {
          console.log('Draggable render:', {
            id: question.id,
            index,
            isDragging: snapshot.isDragging,
            dragHandleProps: provided.dragHandleProps,
          });
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={`flex gap-2 mt-4 p-6 bg-white rounded-lg border border-slate-200 items-start ${
                snapshot.isDragging ? 'shadow-lg' : ''
              }`}
            >
              <div
                {...provided.dragHandleProps}
                className="flex items-center gap-2 cursor-grab"
              >
                <Bars3Icon className="h-5 w-5 text-slate-400" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="body2-medium">
                      Question<span className="text-orange-500">*</span>
                    </span>
                  </div>
                </div>

                <Input
                  value={question.question}
                  onChange={(e) => onQuestionChange(index, e.target.value)}
                  placeholder="Write your question here"
                  className="border border-slate-300 rounded-md"
                />

                <div className="flex flex-col gap-2">
                  <span className="body2-medium text-slate-700">
                    Question Type<span className="text-orange-500">*</span>
                  </span>
                  <Select
                    value={question.type}
                    onValueChange={(value) => onTypeChange(index, value)}
                  >
                    <SelectTrigger className="w-full border border-slate-300">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Response</SelectItem>
                      <SelectItem value="single_choice">
                        Single Choice
                      </SelectItem>
                      <SelectItem value="multiple_choice">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="document">Document Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {renderQuestion()}
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`flex items-center justify-center w-4 h-4 rounded border cursor-pointer
                      ${
                        question.allow_submission
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-slate-300 bg-white'
                      }`}
                    onClick={() => {
                      const updatedQuestion = {
                        ...question,
                        allow_submission: !question.allow_submission,
                      };
                      onQuestionUpdate(index, updatedQuestion);
                    }}
                  >
                    {question.allow_submission && (
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
                  <span
                    className="body2-regular text-slate-700 cursor-pointer select-none"
                    onClick={() => {
                      const updatedQuestion = {
                        ...question,
                        allow_submission: !question.allow_submission,
                      };
                      onQuestionUpdate(index, updatedQuestion);
                    }}
                  >
                    Allow submission after the report is approved.
                  </span>
                </div>
              </div>
              <div
                className="flex items-center gap-2"
                onClick={() => onDelete(index)}
              >
                <TrashIcon className="h-5 w-5 text-slate-400" />
              </div>
            </div>
          );
        }}
      </Draggable>
      <AddFileFormatDialog
        open={isAddFileFormatDialogOpen}
        onOpenChange={setIsAddFileFormatDialogOpen}
        onAdd={handleAddFileFormat}
        existingFormats={question.accepted_files}
      />
    </>
  );
};

export default Question;
