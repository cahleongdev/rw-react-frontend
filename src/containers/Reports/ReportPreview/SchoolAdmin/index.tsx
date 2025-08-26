import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  updateSubmissionDetails,
  SubmissionStatus,
} from '@/store/slices/submissionsSlice';

import useFileUpload from '@/hooks/useFileUpload';

import { RootState } from '@/store';

import ReportPreviewComponent from '@/components/Reports/ReportPreview/SchoolAdmin';
import { STORAGE_PATH } from '@containers/Settings/index.constants';
import { toast } from 'sonner';

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

interface ReportPreviewProps {
  reportId: string;
  submissionId?: string;
  onClose: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  reportId,
  submissionId,
  onClose,
}) => {
  const { uploadFile } = useFileUpload();
  const [activeTab, setActiveTab] = useState('details');
  const [selectedFile, setSelectedFile] = useState<{
    file_url: string;
    file_name: string;
  } | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const { categories } = useSelector((state: RootState) => state.categories);

  const report = useSelector((state: RootState) =>
    state.reports.reports.find((report) => report.id === reportId),
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const selectedSchoolId = useSelector(
    (state: RootState) => state.uiState.selectedSchoolIdForAdmin,
  );
  const submissions = useSelector(
    (state: RootState) => state.submissions.submissions,
  );

  const currentSubmission = useMemo(() => {
    if (submissionId) {
      return submissions.find((sub) => sub.id === submissionId);
    }
    // Fallback if submissionId is not provided, though this might be less precise
    // and could pick the wrong submission if a report has multiple schedules/submissions
    // for the same school.
    return submissions.find(
      (sub) => sub.report === reportId && sub.school === selectedSchoolId,
    );
  }, [submissions, submissionId, reportId, selectedSchoolId]);

  useEffect(() => {
    const newFormData: FormData = {};
    if (
      currentSubmission?.submission_content &&
      report?.submission_instruction?.questions
    ) {
      // Populate comments if they exist
      if (typeof currentSubmission.submission_content.comments === 'string') {
        newFormData.comments = currentSubmission.submission_content.comments;
      }

      // Populate question answers based on question types
      report.submission_instruction.questions.forEach((question, index) => {
        const questionKey = `question_${index}` as keyof FormData;
        const submissionValue =
          currentSubmission.submission_content[questionKey];

        if (submissionValue !== undefined) {
          switch (question.type as QuestionType) {
            case 'text':
            case 'single_choice':
              if (typeof submissionValue === 'string') {
                // Type assertion to any to bypass complex type inference issues
                newFormData[questionKey] = submissionValue as any;
              }
              break;
            case 'multiple_choice':
              if (
                Array.isArray(submissionValue) &&
                submissionValue.every((item) => typeof item === 'string')
              ) {
                // Type assertion to any to bypass complex type inference issues
                newFormData[questionKey] = submissionValue as any;
              }
              break;
            // Add cases for other question types if necessary
            default:
              // Optionally handle unknown question types or log a warning
              break;
          }
        }
      });
    }
    setFormData(newFormData);
  }, [currentSubmission, report]);

  if (!report) return null;

  const handleInputChange = (
    field: keyof FormData,
    value: FormFieldValue[keyof FormFieldValue],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleSubmit = async () => {
    if (!currentSubmission || !currentUserId || !selectedSchoolId) {
      return;
    }

    // If any of the questions are document updates, and there aren't any file_urls
    // Return an error
    if (
      report.submission_instruction &&
      report.submission_instruction.questions.some(
        (question) => question.type === 'document',
      ) &&
      uploadedFiles?.length === 0
    ) {
      toast.error('Please upload at least one file for the document questions');
      return;
    }

    const file_urls = [];

    // Trigger this upload
    for (const file of uploadedFiles) {
      const file_id = await uploadFile(file, undefined, 'document');
      file_urls.push({
        file_id: file_id.split('/')[file_id.split('/').length - 1],
        file_url: STORAGE_PATH + file_id,
        file_name: file.name,
      });
    }

    // Build submission_content from formData
    const submission_content: Record<string, any> = {};
    Object.entries(formData).forEach(([key, value]) => {
      submission_content[key] = value;
    });

    // Example: add school_submission_explanation if present
    const school_submission_explanation = formData.comments || '';

    // Build the payload
    const payload = {
      assigned_member_id: currentUserId,
      school_id: selectedSchoolId,
      file_urls,
      submission_content,
      school_submission_explanation,
      status: 'completed' as SubmissionStatus,
    };
    await dispatch(
      updateSubmissionDetails({
        submissionId: currentSubmission.id,
        data: payload,
      }),
    ).unwrap();
    onClose();
  };

  return (
    <ReportPreviewComponent
      report={report}
      onClose={onClose}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      categories={categories}
      selectedFile={selectedFile}
      setSelectedFile={setSelectedFile}
      handleSubmit={handleSubmit}
      handleFileUpload={handleFileUpload}
      formData={formData}
      handleInputChange={handleInputChange}
    />
  );
};

export default ReportPreview;
