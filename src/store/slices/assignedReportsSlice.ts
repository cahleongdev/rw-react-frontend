import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AssignedReport {
  id: string; // unique assignment id (assignment object)
  reportId?: string; // original report id (used for matching available list)
  name: string;
  status: 'Complete' | 'Pending';
}

interface AssignedReportsState {
  loading: boolean;
  reportsBySchool: Record<string, AssignedReport[]>; // key = schoolId
}

const initialState: AssignedReportsState = {
  loading: false,
  reportsBySchool: {},
};

const assignedReportsSlice = createSlice({
  name: 'assignedReports',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setForSchool(
      state,
      action: PayloadAction<{ schoolId: string; reports: AssignedReport[] }>,
    ) {
      state.reportsBySchool[action.payload.schoolId] = action.payload.reports;
    },
    addToSchool(
      state,
      action: PayloadAction<{ schoolId: string; report: AssignedReport }>,
    ) {
      const arr = state.reportsBySchool[action.payload.schoolId] || [];
      if (!arr.some((r) => r.reportId === action.payload.report.reportId)) {
        state.reportsBySchool[action.payload.schoolId] = [
          ...arr,
          action.payload.report,
        ];
      }
    },
  },
});

export const { setLoading, setForSchool, addToSchool } =
  assignedReportsSlice.actions;

export default assignedReportsSlice.reducer;
