import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { Network, School } from './schoolsSlice';
import BoardMembersAPI from '@api/boardMembers';

export type SchoolResponse = School | Network;

export interface IBoardMemberDetail {
  id: string;
  first_name: string;
  last_name: string;
  start_term: string;
  end_term: string;
  email: string;
  phone: string;
  title: string;
  schools: string[];
  custom_fields: Record<string, string> | null;
}

interface SchoolState {
  school: SchoolResponse | null;
  boardMembers: IBoardMemberDetail[];
  loading: boolean;
}

const initialState: SchoolState = {
  school: null, // TODO: Not using for now, we are fetching all schools in schoolsSlice
  boardMembers: [],
  loading: false,
};

export const fetchSchoolBoardMemberList = createAsyncThunk<
  { boardMembers: IBoardMemberDetail[] },
  string,
  { rejectValue: string }
>(
  'schools/fetchBoardMemberListForSchool',
  async (schoolId, { rejectWithValue }) => {
    try {
      const boardMembersResult =
        await BoardMembersAPI.getBoardMemberListBySchool(schoolId);
      return { boardMembers: boardMembersResult };
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.detail || 'Failed to fetch board members',
        );
      }
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  },
);

export const assignBoardMemberToSchool = createAsyncThunk<
  { boardMember: IBoardMemberDetail },
  { boardMemberId: string; schoolId: string },
  { rejectValue: string }
>(
  'schools/assignBoardMemberToSchool',
  async ({ schoolId, boardMemberId }, { rejectWithValue }) => {
    try {
      const data = await BoardMembersAPI.assignBoardMemberToSchool(
        boardMemberId,
        schoolId,
      );
      return { boardMember: data };
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.detail || 'Failed to add board member to school',
        );
      }
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  },
);

const schoolsSlice = createSlice({
  name: 'schools',
  initialState,
  reducers: {
    setSchool: (state, action: PayloadAction<SchoolResponse>) => {
      state.school = action.payload;
    },
    setBoardMembers: (state, action: PayloadAction<IBoardMemberDetail[]>) => {
      state.boardMembers = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearSchools: (state) => {
      state.school = null;
      state.boardMembers = [];
    },
    updateSchool: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<SchoolResponse> }>,
    ) => {
      if (state.school?.id === action.payload.id) {
        try {
          state.school = {
            ...state.school,
            ...action.payload.updates,
          };
        } catch (error) {
          console.error('[updateSchool Reducer] Error during update:', error);
        }
      } else {
        console.warn(
          `[updateSchool Reducer] School/Network with ID ${action.payload.id} not found in state.`,
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolBoardMemberList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchoolBoardMemberList.fulfilled, (state, action) => {
        state.loading = false;
        state.boardMembers = action.payload.boardMembers;
      })
      .addCase(fetchSchoolBoardMemberList.rejected, (state, action) => {
        state.loading = false;
        console.error(
          'Failed to fetch board members:',
          action.payload || action.error.message,
        );
      })
      .addCase(assignBoardMemberToSchool.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignBoardMemberToSchool.fulfilled, (state, action) => {
        state.loading = false;
        state.boardMembers = [
          ...state.boardMembers,
          action.payload.boardMember,
        ];
      })
      .addCase(assignBoardMemberToSchool.rejected, (state, action) => {
        state.loading = false;
        console.error(
          'Failed to add board member to school:',
          action.payload || action.error.message,
        );
      });
  },
});

export const {
  setSchool,
  setBoardMembers,
  setLoading,
  clearSchools,
  updateSchool,
} = schoolsSlice.actions;

export default schoolsSlice.reducer;
