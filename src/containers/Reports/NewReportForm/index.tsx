import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createReport, updateReportApi } from '@/api/reportsApi';

import { addReport, updateReport } from '@/store/slices/reportsSlice';
import { RootState } from '@/store';

import { ReportResponse } from '@/containers/Reports/index.types';

import NewReportFormComponent from '@/components/Reports/NewReportForm';

interface NewReportFormProps {
  onCancel: () => void;
  initialData?: ReportResponse;
  initialStep?: number;
  onPreviewRequest?: (report: ReportResponse) => void;
}

const NewReportForm: React.FC<NewReportFormProps> = ({
  onCancel,
  initialData,
  initialStep = 1,
  onPreviewRequest,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [currentStep, setCurrentStep] = useState(initialStep);
  const totalSteps = 5;
  const stepLabels = ['Setup', 'Schedule', 'Submission', 'Scoring', 'Review'];

  const [formData, setFormData] = useState<ReportResponse>(
    initialData || {
      id: '',
      school_year: '',
      name: '',
      report: '',
      file_format: [],
      completion_time: '',
      description: '',
      content: {
        step1: { title: '', description: '' },
        step2: { title: '', description: '' },
        step3: { title: '', description: '' },
      },
      video_url: null,
      video_cover: null,
      file_urls: [],
      agency: '',
      categories: [],
      schedules: [],
      submission_instruction: null,
      scoring: null,
      has_scoring: false,
      edited_by: null,
      domain: '',
      use_scoring: false,
      schedule_type: '',
      due_date: null,
      tag: null,
      submission_format: null,
      type: null,
      recurring_period: null,
      recurring_interval: null,
      recurring_occurrences: null,
      recurring_first_occurrence: null,
      approved: false,
      assigned_schools: [],
    },
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reportNameError, setReportNameError] = useState(false);

  const [isEditMode] = useState(!!initialData);

  const handleChange = <K extends keyof ReportResponse>(
    field: K,
    value: ReportResponse[K],
  ) => {
    setFormData((prev: ReportResponse) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.name) {
      setReportNameError(true);
      return;
    }
    setReportNameError(false);

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      let response;

      if (isEditMode) {
        response = await updateReportApi(formData.id, formData, user?.agency);

        dispatch(
          updateReport({
            id: response.data.id,
            updates: response.data,
          }),
        );
      } else {
        response = await createReport(formData, user?.agency);

        dispatch(addReport(response.data));
      }

      onCancel();
    } catch {
      setError(
        `Failed to ${isEditMode ? 'update' : 'create'} report. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndExit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      let response;

      if (isEditMode) {
        response = await updateReportApi(formData.id, formData, user?.agency);

        dispatch(
          updateReport({
            id: response.data.id,
            updates: response.data,
          }),
        );
      } else {
        // Save the current form data as a draft
        response = await createReport(formData, user?.agency);

        dispatch(addReport(response.data));
      }

      // Return to reports list
      onCancel();
    } catch {
      setError('Failed to save report. Please try again.');
      onCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepClick = (step: number) => {
    // In edit mode, allow clicking any step
    if (isEditMode) {
      setCurrentStep(step);
      return;
    }

    // If trying to move from Setup (step 1) to any other step without a report name
    if (currentStep === 1 && step !== 1 && !formData.name) {
      setReportNameError(true);
      return;
    }
    setReportNameError(false);

    // Allow navigation to any step if not blocked by the report name check above
    setCurrentStep(step);
  };

  return (
    <NewReportFormComponent
      currentStep={currentStep}
      formData={formData}
      handleChange={handleChange}
      handleNext={handleNext}
      isSubmitting={isSubmitting}
      stepLabels={stepLabels}
      setCurrentStep={setCurrentStep}
      onPreviewRequest={onPreviewRequest}
      isEditMode={isEditMode}
      totalSteps={totalSteps}
      handleStepClick={handleStepClick}
      handleSaveAndExit={handleSaveAndExit}
      handleSubmit={handleSubmit}
      error={error}
      reportNameError={reportNameError}
    />
  );
};

export default NewReportForm;
