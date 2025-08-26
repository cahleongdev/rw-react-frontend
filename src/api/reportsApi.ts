import axios from './axiosInstance';
import { ReportResponse } from '@/containers/Reports/index.types';

export const getReports = () => {
  return axios.get<ReportResponse[]>('/reports/');
};

export const assignReportsToSchool = (
  schoolId: string,
  reportIds: string[],
) => {
  return axios.post(`/schools/${schoolId}/reports/`, {
    reports: reportIds,
  });
};

export const createReport = (
  reportData: ReportResponse,
  agency: string | undefined,
) => {
  return axios.post('/reports/', {
    ...reportData,
    agency,
  });
};

export const updateReportApi = (
  reportId: string,
  reportData: ReportResponse,
  agency: string | undefined,
) => {
  return axios.put(`/reports/${reportId}/`, {
    ...reportData,
    agency,
  });
};
