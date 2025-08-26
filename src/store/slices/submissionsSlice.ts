import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { SchoolUser } from './schoolUsersSlice';

// Category and ReportResponse are not directly used by this slice anymore
// but might be relevant for other parts of the app that consume submission data
// and need to cross-reference report details. Removing them from direct imports here
// if they solely related to the old ApiSubmissionsByReport types.
// import { Category, ReportResponse } from '@/containers/Reports/index.types';

// --- Core Types (Keep as they seem correct) ---
export type SubmissionStatus =
  | 'completed'
  | 'pending'
  | 'returned'
  | 'incompleted';

export interface SubmissionFile {
  file_id: string;
  file_url: string;
  file_name: string;
}

export interface Submission {
  id: string;
  agency: string;
  due_date: string | null;
  report_schedule: string;
  report: string;
  school: string;
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

// Define the type for the API response
interface SubmissionApiResponse
  extends Omit<
    Submission,
    | 'assigned_member'
    | 'report'
    | 'school'
    | 'created_by'
    | 'updated_by'
    | 'evaluator'
  > {
  report:
    | { id: string; name: string /* ... other report fields if needed ... */ }
    | string; // Can be object or ID string
  school:
    | { id: string; name: string /* ... other school fields if needed ... */ }
    | string; // Can be object or ID string
  assigned_member: SchoolUser | null;
  evaluator: SchoolUser | null; // Assuming evaluator can also be a full user object or null
  created_by: SchoolUser | string; // Assuming created_by can also be a full user object or ID
  updated_by: SchoolUser | string | null; // Assuming updated_by can also be a full user object or ID or null
}

// Removed Unused Types:
// - NestedSubmissionByReport
// - ApiSubmissionsByReport
// - NestedSubmissionBySchool
// - ApiSubmissionsBySchool

// --- UI Filter Related Types (Moved from src/types/submissions) ---
export interface LocalSubmissionFilters {
  category: string;
  teamMember: string;
  school: string;
  status: SubmissionStatus | 'All'; // SubmissionStatus is already defined in this file
  year: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  view: FilterOption[];
  category: FilterOption[];
  teamMember: FilterOption[];
  school: FilterOption[];
  status: FilterOption[];
  year: FilterOption[];
}

// --- Updated Redux State Structure ---
interface SubmissionsState {
  submissions: Submission[];
  loadingSubmissions: boolean;
  errorSubmissions: string | null;
}

const initialState: SubmissionsState = {
  submissions: [],
  loadingSubmissions: false,
  errorSubmissions: null,
};

// --- Async Thunks for Data Fetching ---

const SUBMISSIONS_API_URL = '/submissions';

export const fetchSubmissions = createAsyncThunk<
  Submission[],
  void,
  { rejectValue: string }
>('submissions/fetchSubmissions', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Submission[]>(
      `${SUBMISSIONS_API_URL}/`,
    );
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid data format received for submissions.');
    }
    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to fetch submissions';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('fetchSubmissions error:', error);
    return rejectWithValue(errorMessage);
  }
});

export const assignUserToSubmissions = createAsyncThunk<
  Submission[],
  { userToAssign: SchoolUser | null; submission_ids: string[] },
  { rejectValue: string }
>(
  'submissions/assignUser',
  async ({ userToAssign, submission_ids }, { rejectWithValue }) => {
    try {
      const assigned_user_id = userToAssign ? userToAssign.id : null;
      // Expect SubmissionApiResponse from the API
      const response = await axiosInstance.post<SubmissionApiResponse[]>(
        `${SUBMISSIONS_API_URL}/assigned_user/`,
        {
          assigned_user_id,
          submission_ids,
        },
      );
      // Map API response to the Submission[] type expected by the store
      const mappedData: Submission[] = response.data.map((apiSub) => ({
        ...apiSub,
        report:
          typeof apiSub.report === 'object' ? apiSub.report.id : apiSub.report,
        school:
          typeof apiSub.school === 'object' ? apiSub.school.id : apiSub.school,
        assigned_member: apiSub.assigned_member
          ? apiSub.assigned_member.id
          : null,
        evaluator: apiSub.evaluator ? apiSub.evaluator.id : null,
        created_by:
          typeof apiSub.created_by === 'object'
            ? apiSub.created_by.id
            : apiSub.created_by,
        updated_by:
          apiSub.updated_by && typeof apiSub.updated_by === 'object'
            ? apiSub.updated_by.id
            : (apiSub.updated_by as string | null),
      }));
      return mappedData;
    } catch (error) {
      let errorMessage = 'Failed to assign user to submissions';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateSubmissionDetails = createAsyncThunk<
  Submission,
  { submissionId: string; data: Partial<Submission> },
  { rejectValue: string }
>(
  'submissions/updateDetails',
  async ({ submissionId, data }, { rejectWithValue }) => {
    // const apiPayload: Record<string, any> = { ...data }; // Old way
    try {
      // Construct the payload strictly according to the new required structure
      const finalApiPayload: Record<string, any> = {};

      // 1. assigned_member_id
      // data.assigned_member is string | null (the ID itself as per Submission type)
      if (Object.prototype.hasOwnProperty.call(data, 'assigned_member')) {
        finalApiPayload.assigned_member_id = data.assigned_member;
      } else if (
        Object.prototype.hasOwnProperty.call(data, 'assigned_member_id')
      ) {
        // If data comes with assigned_member_id directly (e.g. from a form)
        finalApiPayload.assigned_member_id = (data as any).assigned_member_id;
      }

      // 2. school_id
      // data.school is string (the ID itself as per Submission type)
      if (Object.prototype.hasOwnProperty.call(data, 'school')) {
        finalApiPayload.school_id = data.school;
      } else if (Object.prototype.hasOwnProperty.call(data, 'school_id')) {
        // If data comes with school_id directly
        finalApiPayload.school_id = (data as any).school_id;
      }

      // 3. file_urls (transform from SubmissionFile[] to string[] of file_ids)
      if (
        Object.prototype.hasOwnProperty.call(data, 'file_urls') &&
        Array.isArray(data.file_urls)
      ) {
        finalApiPayload.file_urls = (data.file_urls as SubmissionFile[])
          .map((file) => file.file_id)
          .filter((id) => id != null); // Ensure no null/undefined IDs
      }

      // 4. submission_content (assume it's correctly structured by the caller)
      if (Object.prototype.hasOwnProperty.call(data, 'submission_content')) {
        finalApiPayload.submission_content = data.submission_content;
      }

      // 5. school_submission_explanation
      if (
        Object.prototype.hasOwnProperty.call(
          data,
          'school_submission_explanation',
        )
      ) {
        finalApiPayload.school_submission_explanation =
          data.school_submission_explanation;
      }

      // Fields like 'status', 'evaluator', 'id', 'agency', 'due_date', 'report_schedule', 'report',
      // 'school_submission_date', 'evaluator_submission_date', 'created_by', 'updated_by'
      // are intentionally EXCLUDED unless specified in the new payload structure.
      // The 'status' field, for example, is not in the user-provided "correct" payload.
      // 'evaluator_id' is also not in the new "correct" payload.

      const response = await axiosInstance.put<Submission>(
        `${SUBMISSIONS_API_URL}/${submissionId}/`,
        finalApiPayload,
      );
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to update submission details';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      // It's helpful to log the payload that was attempted
      console.error(
        'updateSubmissionDetails error:',
        error,
        // 'Attempted payload:', // finalApiPayload is not defined in this scope, error is from outer scope.
        // This console.error is inside the catch block of createAsyncThunk's promise.
        // To log finalApiPayload, it would need to be passed or reconstructed here,
        // or the logging could be done just before the axiosInstance.put call.
        // For now, keeping the original logging structure.
      );
      return rejectWithValue(errorMessage);
    }
  },
);

// --- Slice Definition ---

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    clearAllSubmissionsState: (state) => {
      state.submissions = [];
      state.loadingSubmissions = false;
      state.errorSubmissions = null;
    },
    updateSubmission: (state, action: PayloadAction<Submission>) => {
      const index = state.submissions.findIndex(
        (s) => s.id === action.payload.id,
      );
      if (index !== -1) {
        state.submissions[index] = action.payload;
      } else {
        console.warn(
          'updateSubmission called for an ID not found in the submissions array:',
          action.payload.id,
        );
      }
    },
    clearSubmissions: (state) => {
      state.submissions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.loadingSubmissions = true;
        state.errorSubmissions = null;
      })
      .addCase(
        fetchSubmissions.fulfilled,
        (state, action: PayloadAction<Submission[]>) => {
          state.submissions = action.payload;
          state.loadingSubmissions = false;
        },
      )
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loadingSubmissions = false;
        state.errorSubmissions = action.payload ?? 'Unknown error';
      })
      .addCase(
        assignUserToSubmissions.fulfilled,
        (state: SubmissionsState, action: PayloadAction<Submission[]>) => {
          action.payload.forEach((updatedSubmissionFromApi) => {
            const index = state.submissions.findIndex(
              (sub) => sub.id === updatedSubmissionFromApi.id,
            );
            if (index !== -1) {
              const existingSubmission = state.submissions[index];
              state.submissions[index] = {
                ...existingSubmission, // Start with existing data
                ...updatedSubmissionFromApi, // Overlay with new data from API
                // Explicitly preserve report_schedule if the API payload has it as undefined
                // (meaning it was missing from the response and our mapping carried it as undefined).
                // If the API legitimately sends null or a valid string for report_schedule, that will be used.
                report_schedule:
                  updatedSubmissionFromApi.report_schedule !== undefined
                    ? updatedSubmissionFromApi.report_schedule
                    : existingSubmission.report_schedule,
              };
            } else {
              // For new submissions, if report_schedule is missing from API, it will be undefined.
              // This might be an issue if it's always expected based on Submission type.
              // However, this change addresses existing submissions losing the field.
              state.submissions.push(updatedSubmissionFromApi);
            }
          });
        },
      )
      .addCase(
        updateSubmissionDetails.fulfilled,
        (state, action: PayloadAction<Submission>) => {
          const index = state.submissions.findIndex(
            (s) => s.id === action.payload.id,
          );
          if (index !== -1) {
            state.submissions[index] = action.payload;
          } else {
            console.warn(
              'updateSubmissionDetails.fulfilled: Did not find submission in state to update, ID:',
              action.payload.id,
            );
          }
        },
      );
  },
});

export const { clearAllSubmissionsState, updateSubmission, clearSubmissions } =
  submissionsSlice.actions;

export default submissionsSlice.reducer;
