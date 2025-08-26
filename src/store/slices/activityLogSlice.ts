import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SchoolUser } from '@/store/slices/schoolUsersSlice';

// Define the activity log interface
export interface ActivityLog {
  id: string;
  report: string;
  content: string;
  created_at: string;
  user: SchoolUser;
}

// Define the state structure
interface ActivityLogsState {
  logs: Record<string, ActivityLog[]>; // Key is reportId, value is array of logs
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ActivityLogsState = {
  logs: {
    '1': [
      {
        id: '1',
        report: 'Report 1',
        content: 'submitted the report for review.',
        created_at: '2025-01-04T14:30:00.000Z',
        user: {
          id: '1',
          first_name: 'Christian',
          last_name: 'Beck',
          email: 'christian.beck@example.com',
          role: 'School_Admin',
          phone_number: '',
          profile_image: '/assets/images/avatars/1.png',
          title: 'School Administrator',
          is_active: true,
          schools: ['1'],
          agency: '1',
          notification_settings: {
            benchmark: true,
            comments: true,
            daily_report: true,
            messages: true,
            report_assigned: true,
            report_rejected: true,
            report_returned: true,
            weekly_report: true,
          },
          view_only: false,
          permissions: {
            Submissions: 'View' as const,
            Schools: 'View' as const,
            Reports: 'View' as const,
            Applications: 'View' as const,
            Complaints: 'View' as const,
            Transparency: 'View' as const,
            Accountability: 'View' as const,
            'ReportWell University': 'View' as const,
          },
        },
      },
      {
        id: '2',
        report: 'Report 1',
        content:
          'added a comment: "Please review the updated student performance metrics in section 3."',
        created_at: '2025-01-04T13:45:00.000Z',
        user: {
          id: '1',
          first_name: 'Christian',
          last_name: 'Beck',
          email: 'christian.beck@example.com',
          role: 'School_Admin',
          phone_number: '',
          profile_image: '/assets/images/avatars/1.png',
          title: 'School Administrator',
          is_active: true,
          schools: ['1'],
          agency: '1',
          notification_settings: {
            benchmark: true,
            comments: true,
            daily_report: true,
            messages: true,
            report_assigned: true,
            report_rejected: true,
            report_returned: true,
            weekly_report: true,
          },
          view_only: false,
          permissions: {
            Submissions: 'View' as const,
            Schools: 'View' as const,
            Reports: 'View' as const,
            Applications: 'View' as const,
            Complaints: 'View' as const,
            Transparency: 'View' as const,
            Accountability: 'View' as const,
            'ReportWell University': 'View' as const,
          },
        },
      },
      {
        id: '3',
        report: 'Report 1',
        content: 'updated the attendance data in the report.',
        created_at: '2025-01-04T11:20:00.000Z',
        user: {
          id: '1',
          first_name: 'Christian',
          last_name: 'Beck',
          email: 'christian.beck@example.com',
          role: 'School_Admin',
          phone_number: '',
          profile_image: '/assets/images/avatars/1.png',
          title: 'School Administrator',
          is_active: true,
          schools: ['1'],
          agency: '1',
          notification_settings: {
            benchmark: true,
            comments: true,
            daily_report: true,
            messages: true,
            report_assigned: true,
            report_rejected: true,
            report_returned: true,
            weekly_report: true,
          },
          view_only: false,
          permissions: {
            Submissions: 'View' as const,
            Schools: 'View' as const,
            Reports: 'View' as const,
            Applications: 'View' as const,
            Complaints: 'View' as const,
            Transparency: 'View' as const,
            Accountability: 'View' as const,
            'ReportWell University': 'View' as const,
          },
        },
      },
      {
        id: '4',
        report: 'Report 1',
        content: 'started working on the report.',
        created_at: '2025-01-04T09:15:00.000Z',
        user: {
          id: '1',
          first_name: 'Christian',
          last_name: 'Beck',
          email: 'christian.beck@example.com',
          role: 'School_Admin',
          phone_number: '',
          profile_image: '/assets/images/avatars/1.png',
          title: 'School Administrator',
          is_active: true,
          schools: ['1'],
          agency: '1',
          notification_settings: {
            benchmark: true,
            comments: true,
            daily_report: true,
            messages: true,
            report_assigned: true,
            report_rejected: true,
            report_returned: true,
            weekly_report: true,
          },
          view_only: false,
          permissions: {
            Submissions: 'View' as const,
            Schools: 'View' as const,
            Reports: 'View' as const,
            Applications: 'View' as const,
            Complaints: 'View' as const,
            Transparency: 'View' as const,
            Accountability: 'View' as const,
            'ReportWell University': 'View' as const,
          },
        },
      },
    ],
  },
  loading: false,
  error: null,
};

// Create the slice
const activityLogsSlice = createSlice({
  name: 'activityLogs',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setActivityLogs: (
      state,
      action: PayloadAction<{ reportId: string; logs: ActivityLog[] }>,
    ) => {
      const { reportId, logs } = action.payload;
      state.logs[reportId] = logs;
    },
    addActivityLog: (
      state,
      action: PayloadAction<{ reportId: string; log: ActivityLog }>,
    ) => {
      const { reportId, log } = action.payload;
      if (!state.logs[reportId]) {
        state.logs[reportId] = [];
      }

      // Add the new log
      state.logs[reportId] = [...state.logs[reportId], log];

      // Sort logs by created_at timestamp
      state.logs[reportId].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    },
    clearActivityLogs: (state) => {
      state.logs = {};
    },
    clearReportActivityLogs: (state, action: PayloadAction<string>) => {
      const reportId = action.payload;
      delete state.logs[reportId];
    },
  },
});

export const {
  setLoading,
  setError,
  setActivityLogs,
  addActivityLog,
  clearActivityLogs,
  clearReportActivityLogs,
} = activityLogsSlice.actions;

export default activityLogsSlice.reducer;
