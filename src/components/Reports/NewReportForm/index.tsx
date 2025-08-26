// src/pages/AgencyAdmin/ReportsPage/components/NewReportForm.tsx
import React, { Dispatch, SetStateAction } from 'react';

import { ReportResponse } from '@/containers/Reports/index.types';

import { Button } from '@/components/base/Button';
import { ScrollArea } from '@/components/base/ScrollArea';
import StepIndicator from './StepIndicator';
import SetupStep from './SetupStep';
import ScheduleStep from './ScheduleStep';
import SubmissionStep from './SubmissionStep';
import ScoringStep from './ScoringStep';
import ReviewStep from './ReviewStep';

interface NewReportFormProps {
  currentStep: number;
  formData: ReportResponse;
  handleChange: <K extends keyof ReportResponse>(
    field: K,
    value: ReportResponse[K],
  ) => void;
  handleNext: () => void;
  isSubmitting: boolean;
  stepLabels: string[];
  setCurrentStep: Dispatch<SetStateAction<number>>;
  onPreviewRequest?: (report: ReportResponse) => void;
  isEditMode: boolean;
  totalSteps: number;
  handleStepClick: (step: number) => void;
  handleSaveAndExit: () => void;
  handleSubmit: () => void;
  error: string;
  reportNameError?: boolean;
}

const NewReportForm: React.FC<NewReportFormProps> = ({
  currentStep,
  formData,
  handleChange,
  handleNext,
  isSubmitting,
  stepLabels,
  setCurrentStep,
  onPreviewRequest,
  isEditMode,
  totalSteps,
  handleStepClick,
  handleSaveAndExit,
  handleSubmit,
  error,
  reportNameError,
}: NewReportFormProps) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Setup
        return (
          <SetupStep
            formData={formData}
            handleChange={handleChange}
            handleNext={handleNext}
            isSubmitting={isSubmitting}
            stepLabels={stepLabels}
            currentStep={currentStep}
            reportNameError={reportNameError}
          />
        );
      case 2: // Schedule
        return (
          <ScheduleStep
            formData={formData}
            handleChange={handleChange}
            handleNext={handleNext}
            isSubmitting={isSubmitting}
            stepLabels={stepLabels}
            currentStep={currentStep}
          />
        );
      case 3: // Submission
        return (
          <SubmissionStep
            formData={formData}
            handleChange={handleChange}
            handleNext={handleNext}
            isSubmitting={isSubmitting}
            stepLabels={stepLabels}
            currentStep={currentStep}
          />
        );
      case 4: // Scoring
        return (
          <ScoringStep
            formData={formData}
            handleChange={handleChange}
            handleNext={handleNext}
            isSubmitting={isSubmitting}
            stepLabels={stepLabels}
            currentStep={currentStep}
          />
        );
      case 5: // Review
        return (
          <ReviewStep
            formData={formData}
            handleNext={handleNext}
            isSubmitting={isSubmitting}
            stepLabels={stepLabels}
            currentStep={currentStep}
            onNavigateToStep={setCurrentStep}
            onPreviewRequest={onPreviewRequest}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center py-4 px-6 border-b-[1px] border-beige-300">
        <h3 className="text-slate-700 w-[157px]">
          {isEditMode ? 'Edit Report' : 'New Report'}
        </h3>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          labels={stepLabels}
          className="flex items-center flex-1"
          isEditMode={isEditMode}
          onStepClick={handleStepClick}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveAndExit}
            disabled={isSubmitting}
            className="border-none text-slate-700 shadow-none"
          >
            <span className="button2-semibold">Save and Exit</span>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting || !formData.name || currentStep !== totalSteps
            }
            className="bg-blue-500 text-white rounded-[6px] p-[10px_20px] h-[36px]"
          >
            <span className="button2-semibold">
              {isSubmitting ? 'Saving...' : 'Assign'}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex justify-center overflow-hidden">
        <ScrollArea className="h-full">{renderStepContent()}</ScrollArea>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm max-w-3xl mx-auto">
          {error}
        </div>
      )}
    </div>
  );
};

export default NewReportForm;
