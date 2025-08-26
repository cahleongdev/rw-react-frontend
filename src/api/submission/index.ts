import axios, { AxiosResponse } from 'axios';

import axiosInstance from '@/api/axiosInstance';

import {
  SubmissionFile,
  SubmissionStatus,
} from '@/store/slices/submissionsSlice';

import { getPresignedDownloadUrl } from '@utils/fileUploadService';

export interface SubmissionApiResponse {
  id: string;
  agency: string;
  due_date: string | null;
  report_schedule: string;
  report: {
    id: string;
    name: string;
  };
  school: {
    id: string;
    name: string;
  };
  status: SubmissionStatus;
  submission_content: Record<string, any>;
  assigned_member: string | null;
  evaluator: string | null;
  school_submission_date: string | null;
  evaluator_submission_date: string | null;
  school_submission_explanation: string | null;
  file_urls: SubmissionFile[];
  created_by: string;
  updated_by: string | null;
}

// API function to get submissions for a report group download
export const getSubmissionsForReportDownload = async (
  reportId: string,
): Promise<SubmissionApiResponse[]> => {
  const response = await axiosInstance.get<SubmissionApiResponse[]>(
    `/submissions/download/report/${reportId}/`,
  );
  return response.data;
};

// API function to get submissions for a school group download
export const getSubmissionsForSchoolDownload = async (
  schoolId: string,
): Promise<SubmissionApiResponse[]> => {
  const response = await axiosInstance.get<SubmissionApiResponse[]>(
    `/submissions/download/school/${schoolId}/`,
  );
  return response.data;
};

// API function to get submission details for individual download
export const getSubmissionForDownload = async (
  submissionId: string,
): Promise<SubmissionApiResponse> => {
  const response = await axiosInstance.get<SubmissionApiResponse>(
    `/submissions/download/${submissionId}/`,
  );
  return response.data;
};

export const getSubmissionFileDownload = async (
  fileId: string,
): Promise<AxiosResponse<Blob>> => {
  const presignedUrl = await getPresignedDownloadUrl(fileId);
  const response = await axios.get(presignedUrl, { responseType: 'blob' });
  return response;
};
