import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { isAxiosError } from 'axios';
import type { RootState } from '@/store'; // Import RootState

import { ReportResponse } from '@/containers/Reports/index.types';
import {
  updateReportApi,
  createReport as createReportApi,
} from '@/api/reportsApi';

interface ReportsState {
  reports: ReportResponse[]; // Store reports by page number
  totalItems: number;
  loading: boolean;
}

const initialState: ReportsState = {
  reports: [],
  totalItems: 0,
  loading: false,
};

// Async thunk for fetching reports for an agency
export const fetchReportsForAgency = createAsyncThunk<
  { reports: ReportResponse[]; totalItems: number }, // Return type
  void, // Argument type (not needed here)
  { state: RootState; rejectValue: string } // ThunkAPI options
>('reports/fetchForAgency', async (_, { getState, rejectWithValue }) => {
  const agencyId = getState().auth.user?.agency;

  if (!agencyId) {
    return rejectWithValue('Agency ID not found. Cannot fetch reports.');
  }

  try {
    const response = await axiosInstance.get<ReportResponse[]>(
      `/agencies/${agencyId}/reports/`,
    );
    // Assuming the API returns an array of reports directly.
    // If it returns an object like { count: number, results: ReportResponse[] },
    // this needs adjustment: return { reports: response.data.results, totalItems: response.data.count };
    return { reports: response.data, totalItems: response.data.length };
  } catch (error: any) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.detail || 'Failed to fetch reports',
      );
    }
    return rejectWithValue(
      error.message || 'An unknown error occurred while fetching reports',
    );
  }
});

export const createReportOnServer = createAsyncThunk(
  'reports/createOnServer',
  async (
    payload: { report: ReportResponse; agency: string | undefined },
    { rejectWithValue },
  ) => {
    try {
      const response = await createReportApi(payload.report, payload.agency);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Could not create report on server',
      );
    }
  },
);

// New async thunk for updating a report on the server
export const updateReportOnServer = createAsyncThunk<
  ReportResponse,
  { id: string; updates: Partial<ReportResponse> },
  { rejectValue: string }
>('reports/updateOnServer', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await updateReportApi(
      id,
      updates as ReportResponse,
      undefined,
    ); // Use new API function. Assuming agency is not needed here or handled within updateReportApi if undefined.
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.message || 'Could not update report on server',
    );
  }
});

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<ReportResponse[]>) => {
      state.reports = action.payload;
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      state.totalItems = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearReports: (state) => {
      state.reports = [];
      state.totalItems = 0;
    },
    addReport: (state, action: PayloadAction<ReportResponse>) => {
      // Add the new report to page 1 if it exists
      state.reports.push(action.payload);
      state.totalItems += 1;
    },
    deleteReport: (state, action: PayloadAction<string>) => {
      const initialLength = state.reports.length;
      state.reports = state.reports.filter(
        (report) => report.id !== action.payload,
      );
      if (state.reports.length < initialLength) {
        state.totalItems -= initialLength - state.reports.length;
      }
    },
    // Add a new action for bulk deletion
    bulkDeleteReports: (state, action: PayloadAction<string[]>) => {
      const initialLength = state.reports.length;
      state.reports = state.reports.filter(
        (report) => !action.payload.includes(report.id),
      );
      if (state.reports.length < initialLength) {
        state.totalItems -= initialLength - state.reports.length;
      }
    },
    updateReport: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<ReportResponse> }>,
    ) => {
      // Update the report in all pages where it exists
      const reportIndex = state.reports.findIndex(
        (report) => report.id === action.payload.id,
      );

      if (reportIndex !== -1) {
        // Update the report at its original position
        state.reports[reportIndex] = {
          ...state.reports[reportIndex],
          ...action.payload.updates,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsForAgency.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportsForAgency.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchReportsForAgency.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createReportOnServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReportOnServer.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
      })
      .addCase(createReportOnServer.rejected, (state) => {
        state.loading = false;
        // console.error(
        //   'Failed to create report on server:',
        //   action.payload || action.error.message,
        // );
      })
      // Handle lifecycle for the new thunk
      .addCase(updateReportOnServer.pending, (state) => {
        state.loading = true; // Or a more specific loading flag like state.updatingReport = true;
      })
      .addCase(
        updateReportOnServer.fulfilled,
        (state, action: PayloadAction<ReportResponse>) => {
          state.loading = false;
          const index = state.reports.findIndex(
            (report) => report.id === action.payload.id,
          );
          if (index !== -1) {
            state.reports[index] = action.payload; // Replace with the updated report from server
          }
          // If creating a new report and it returns the full object, you might add it here too.
        },
      )
      .addCase(updateReportOnServer.rejected, (state) => {
        state.loading = false;
        // Optionally, store error in state
      });
  },
});

export const {
  setReports,
  setTotalItems,
  setLoading,
  clearReports,
  addReport,
  deleteReport,
  bulkDeleteReports,
  updateReport,
} = reportsSlice.actions;

export default reportsSlice.reducer;
