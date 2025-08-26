import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { SchoolUser } from './schoolUsersSlice';
import axiosInstance from '@/api/axiosInstance';

export interface SchoolBaseEntity {
  id: string;
  name: string;
  status: string;
  county: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  district: string;
  custom_fields: Record<string, string> | null;
  profile_image?: string;
  users?: SchoolUser[];
  board_meetings?: string[];
}

// School-specific properties
export interface School extends SchoolBaseEntity {
  type: string;
  gradeserved: string[];
  network?: string | null;
  board_meetings?: string[];
  contract_expires?: string;
  opened_in?: string;
  contact_phone_number?: string;
  website?: string;
  logo?: string;
}

// Network-specific properties
export interface Network extends SchoolBaseEntity {
  type: 'Network';
  gradeserved: string[];
  schools?: School[] | null;
}

// Type guard to check if an entity is a Network (utility, can be co-located or imported)
const isNetwork = (entity: SchoolResponse): entity is Network => {
  return entity.type === 'Network';
};

// Union type that can be either a School or a Network
export type SchoolResponse = School | Network;

interface SchoolsState {
  schools: SchoolResponse[];
  totalItems: number;
  loading: boolean;
  initialFetchAttempted: boolean;
}

const initialState: SchoolsState = {
  schools: [],
  totalItems: 0,
  loading: false,
  initialFetchAttempted: false,
};

// Async thunk for fetching all schools for agency admin
export const fetchAllSchoolsForAgencyAdmin = createAsyncThunk<
  { schools: SchoolResponse[]; totalItems: number },
  void,
  { rejectValue: string }
>('schools/fetchAllForAgencyAdmin', async (_, { rejectWithValue }) => {
  try {
    const { data: schoolsResult } = await axiosInstance.get<SchoolResponse[]>(
      '/schools/agency_admin/',
    );
    // Flatten the results before returning
    const flattenedSchools: SchoolResponse[] = schoolsResult.flatMap((item) => {
      if (isNetwork(item) && item.schools) {
        return [item, ...item.schools];
      }
      return [item];
    });
    return { schools: flattenedSchools, totalItems: schoolsResult.length };
  } catch (error: any) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.detail || 'Failed to fetch schools',
      );
    }
    return rejectWithValue(error.message || 'An unknown error occurred');
  }
});

const schoolsSlice = createSlice({
  name: 'schools',
  initialState,
  reducers: {
    setSchools: (state, action: PayloadAction<SchoolResponse[]>) => {
      state.schools = action.payload;
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      state.totalItems = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearSchools: (state) => {
      state.schools = [];
      state.totalItems = 0;
    },
    addSchool: (state, action: PayloadAction<SchoolResponse>) => {
      state.schools.push(action.payload);
      state.totalItems += 1;
    },
    deleteSchool: (state, action: PayloadAction<string>) => {
      const initialLength = state.schools.length;
      state.schools = state.schools.filter(
        (school) => school.id !== action.payload,
      );
      if (state.schools.length < initialLength) {
        state.totalItems -= 1;
      }
    },
    updateSchool: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<SchoolResponse> }>,
    ) => {
      const index = state.schools.findIndex(
        (school) => school.id === action.payload.id,
      );
      if (index !== -1) {
        try {
          state.schools[index] = {
            ...state.schools[index],
            ...action.payload.updates,
          } as SchoolResponse;
        } catch (error) {
          console.error('[updateSchool Reducer] Error during update:', error);
        }
      } else {
        console.warn(
          `[updateSchool Reducer] School/Network with ID ${action.payload.id} not found in state.`,
        );
      }
    },
    // updateAllCustomFields: (
    //   state,
    //   action: PayloadAction<{
    //     entityType: 'School' | 'Network';
    //     fields: { field_name: string; field_type: string }[];
    //   }>,
    // ) => {
    //   const { entityType, fields } = action.payload;
    //   const entity = state.schools.filter(
    //     (school) => school.type === entityType,
    //   );
    //   entity.forEach((entity) => {
    // },
    addSchoolToNetwork: (
      state,
      action: PayloadAction<{ networkId: string; school: School }>,
    ) => {
      const networkIndex = state.schools.findIndex(
        (s) => s.id === action.payload.networkId && s.type === 'Network',
      );
      if (networkIndex !== -1) {
        const network = state.schools[networkIndex] as Network;
        // Ensure schools array exists and add the new school if not already present
        if (!network.schools) {
          network.schools = [];
        }
        if (!network.schools.some((s) => s.id === action.payload.school.id)) {
          network.schools.push(action.payload.school);
        }
        // Replace the network object to ensure new reference
        state.schools[networkIndex] = { ...network } as Network;
        // Replace the schools array to trigger selector re-evaluation
        state.schools = [...state.schools];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSchoolsForAgencyAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSchoolsForAgencyAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.schools = action.payload.schools;
        state.totalItems = action.payload.totalItems;
        state.initialFetchAttempted = true;
      })
      .addCase(fetchAllSchoolsForAgencyAdmin.rejected, (state, action) => {
        state.loading = false;
        state.initialFetchAttempted = true;
        console.error(
          'Failed to fetch schools:',
          action.payload || action.error.message,
        );
      });
  },
});

export const {
  setSchools,
  setTotalItems,
  setLoading,
  clearSchools,
  addSchool,
  deleteSchool,
  updateSchool,
  // updateAllCustomFields,
  addSchoolToNetwork,
} = schoolsSlice.actions;

export default schoolsSlice.reducer;
