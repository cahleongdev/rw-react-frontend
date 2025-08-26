import axios from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@/api/axiosInstance';
import { MFAMethod } from '@containers/Auth/index.types';
import { IBoardMemberDetail } from './schoolSlice';

export interface SchoolUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  title: string;
  role:
    | 'School_Admin'
    | 'School_User'
    | 'Board_Member'
    | 'Agency_Admin'
    | 'Agency_User'
    | 'Super_Admin';
  agency: string;
  schools: string[];
  schoolId?: string;
  profile_image: string;
  is_active: boolean | null;
  view_only: boolean;
  start_term?: string; // ISO date string, only for Board_Member role
  end_term?: string; // ISO date string, only for Board_Member role
  permissions: {
    Reports: 'View' | 'Edit' | 'Hidden';
    Schools: 'View' | 'Edit' | 'Hidden';
    Complaints: 'View' | 'Edit' | 'Hidden';
    Submissions: 'View' | 'Edit' | 'Hidden';
    Applications: 'View' | 'Edit' | 'Hidden';
    Transparency: 'View' | 'Edit' | 'Hidden';
    Accountability: 'View' | 'Edit' | 'Hidden';
    'ReportWell University': 'View' | 'Edit' | 'Hidden';
  };
  notification_settings: {
    benchmark: boolean;
    comments: boolean;
    daily_report: boolean;
    messages: boolean;
    report_assigned: boolean;
    report_date_changed?: boolean;
    report_rejected: boolean;
    report_returned: boolean;
    weekly_report: boolean;
  };
  mfa_enabled?: boolean;
  mfa_method?: MFAMethod[];
  custom_fields?: Record<string, string> | null;
}

// Simple type for the GET /board_members/ response item
export type BoardMemberBase = Pick<
  IBoardMemberDetail,
  'id' | 'first_name' | 'last_name' | 'start_term' | 'end_term'
>;

interface SchoolUsersState {
  schoolUsers: SchoolUser[]; // Users associated with specific viewed schools/networks
  allBoardMembers: BoardMemberBase[]; // All board members across the agency
  totalItems: number;
  loading: boolean;
}

// --- Async Thunks for Board Members (Re-added) ---

export const fetchBoardMembersForSchool = createAsyncThunk(
  'schoolUsers/fetchBoardMembersForSchool',
  async (schoolId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<BoardMemberBase[]>(
        `/board_members/schools/${schoolId}/`,
      );
      return { schoolId, members: response.data };
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : String(error);
      return rejectWithValue(message || 'Failed to fetch board members');
    }
  },
);

export const createBoardMember = createAsyncThunk(
  'schoolUsers/createBoardMember',
  async (
    {
      schoolId,
      memberData,
    }: {
      schoolId: string;
      memberData: Omit<
        SchoolUser,
        | 'id'
        | 'role'
        | 'agency'
        | 'schools'
        | 'is_active'
        | 'view_only'
        | 'permissions'
        | 'notification_settings'
      > & { custom_fields?: Record<string, string> };
    },
    { rejectWithValue },
  ) => {
    const payload = {
      ...memberData,
      custom_fields: memberData.custom_fields || {},
    };
    try {
      const response = await axiosInstance.post<SchoolUser>(
        `/schools/${schoolId}/board-members/`,
        payload,
      );
      return {
        ...response.data,
        role: 'Board_Member',
        schools: [schoolId],
      } as SchoolUser;
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : String(error);
      return rejectWithValue(message || 'Failed to create board member');
    }
  },
);

// NEW ASYNC THUNK for updating user details (e.g., school associations)
export const updateUserSchoolsAPI = createAsyncThunk(
  'schoolUsers/updateUserSchoolsAPI',
  async (
    { userId, schools }: { userId: string; schools: string[] },
    { dispatch, rejectWithValue },
  ) => {
    try {
      // Assuming the API endpoint is PATCH /users/{userId}/
      // And the payload to update schools is { schools: [...] }
      const response = await axiosInstance.patch<SchoolUser>(
        `/users/${userId}/`,
        { schools },
      );
      // After successful API call, dispatch the existing updateUser reducer to update local state
      dispatch(updateUser({ id: userId, updates: response.data }));
      return response.data; // Return data for further chaining or handling if needed
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : String(error);
      return rejectWithValue(message || 'Failed to update user schools');
    }
  },
);

// NEW ASYNC THUNK for fetching all board members
export const fetchAllBoardMembers = createAsyncThunk(
  'schoolUsers/fetchAllBoardMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await axiosInstance.get<BoardMemberBase[]>('/board_members/');
      return response.data;
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          error.message
        : error instanceof Error
          ? error.message
          : String(error);
      console.error('Error fetching all board members:', message, error);
      return rejectWithValue(message || 'Failed to fetch all board members');
    }
  },
);

export const fetchAllSchoolUsers = createAsyncThunk(
  'schoolUsers/fetchAllSchoolUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<SchoolUser[]>(
        '/users/agency_admin/',
      ); // Adjust endpoint if needed
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch school users');
    }
  },
);

const schoolUsersSlice = createSlice({
  name: 'schoolUsers',
  initialState: {
    schoolUsers: [],
    allBoardMembers: [], // Initialize the new state field
    totalItems: 0,
    loading: false,
  } as SchoolUsersState,
  reducers: {
    setUsers: (
      state,
      action: PayloadAction<{
        data: SchoolUser[];
      }>,
    ) => {
      const { data } = action.payload;
      if (!state.schoolUsers) {
        state.schoolUsers = [];
      }
      state.schoolUsers = data;
    },
    clearUsers: (state) => {
      if (state.schoolUsers) {
        state.schoolUsers = [];
      }
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      state.totalItems = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    deleteUser: (
      state,
      action: PayloadAction<{
        userId: string;
      }>,
    ) => {
      const { userId } = action.payload;
      if (state.schoolUsers) {
        state.schoolUsers = state.schoolUsers.filter(
          (user) => user.id !== userId,
        );
      }
    },
    addUser: (
      state,
      action: PayloadAction<{
        user: SchoolUser;
      }>,
    ) => {
      const { user } = action.payload;
      if (!state.schoolUsers) {
        state.schoolUsers = [];
      }
      state.schoolUsers.push(user);
      state.totalItems += 1;
    },
    updateUser: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<SchoolUser> }>,
    ) => {
      const { id, updates } = action.payload;
      const userIndex = state.schoolUsers.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        state.schoolUsers[userIndex] = {
          ...state.schoolUsers[userIndex],
          ...updates,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Board Member Thunk Reducers ---
      .addCase(fetchBoardMembersForSchool.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoardMembersForSchool.fulfilled, (state, action) => {
        state.loading = false;
        const { schoolId, members } = action.payload;
        const existingUserIds = new Set(state.schoolUsers.map((u) => u.id));

        members.forEach((fetchedMember: BoardMemberBase) => {
          const userUpdateData: Partial<SchoolUser> = {
            ...fetchedMember,
            role: 'Board_Member',
            // DO NOT set schools here initially, handle it below
          };

          if (existingUserIds.has(fetchedMember.id)) {
            // User exists, update them
            const userIndex = state.schoolUsers.findIndex(
              (u) => u.id === fetchedMember.id,
            );
            if (userIndex !== -1) {
              const existingUser = state.schoolUsers[userIndex];
              const updatedSchools = existingUser.schools
                ? [...existingUser.schools]
                : [];
              if (!updatedSchools.includes(schoolId)) {
                updatedSchools.push(schoolId);
              }
              state.schoolUsers[userIndex] = {
                ...existingUser,
                ...userUpdateData, // Apply other updates from fetchedMember
                schools: updatedSchools, // Set the merged schools array
              };
            }
          } else {
            // New user, add them with the current schoolId
            state.schoolUsers.push({
              ...(userUpdateData as SchoolUser), // Cast after spreading all known fields
              schools: [schoolId], // Initialize schools array with the current school
            });
          }
        });
      })
      .addCase(fetchBoardMembersForSchool.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createBoardMember.fulfilled, (state, action) => {
        state.schoolUsers.push(action.payload);
        state.totalItems += 1;
      })
      // Add cases for the new thunk if needed (e.g., for loading states)
      .addCase(updateUserSchoolsAPI.pending, (state) => {
        state.loading = true; // Example: set loading true
      })
      .addCase(updateUserSchoolsAPI.fulfilled, (state) => {
        state.loading = false;
        // The updateUser reducer is already called by the thunk on success,
        // so state is already updated. Can do additional logic here if needed.
      })
      .addCase(updateUserSchoolsAPI.rejected, (state, action) => {
        state.loading = false;
        // Optionally handle API error state, e.g., setting an error message
        console.error('Failed to update user schools via API:', action.payload);
      })
      .addCase(fetchAllBoardMembers.pending, (state) => {
        // Optionally set loading, maybe a specific one?
        state.loading = true;
      })
      .addCase(fetchAllBoardMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.allBoardMembers = action.payload;
      })
      .addCase(fetchAllBoardMembers.rejected, (state, action) => {
        state.loading = false;
        console.error('Failed to fetch all board members:', action.payload);
        // Optionally set an error message in the state
      })
      .addCase(fetchAllSchoolUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSchoolUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolUsers = action.payload;
      })
      .addCase(fetchAllSchoolUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setUsers,
  clearUsers,
  setTotalItems,
  setLoading,
  deleteUser,
  addUser,
  updateUser,
} = schoolUsersSlice.actions;

export default schoolUsersSlice.reducer;
