import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Agency } from '@/store/types';
import { RootState } from '@/store';
import { fetchMenuItems } from '@/store/slices/menuSlice';
import { AgencyService } from '@/api/agencies'; // Corrected import path

// Define default privileges
const DEFAULT_ADMIN_PRIVILEGES = ['1', '2', '3', '4', '6', '13'];
const DEFAULT_SCHOOL_PRIVILEGES = ['1', '8', '2', 'calendar'];

interface AgenciesState {
  agencies: Agency[];
  loading: boolean;
  error: string | null;
  count: number;
}

const initialState: AgenciesState = {
  agencies: [],
  loading: false,
  error: null,
  count: 0,
};

// Thunks
export const fetchAgencies = createAsyncThunk(
  'agencies/fetchAgencies',
  async (_, { rejectWithValue }) => {
    try {
      return await AgencyService.getAllAgencies();
    } catch (error: any) {
      console.error('Error fetching agencies:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch agencies',
      );
    }
  },
);

export const addAgency = createAsyncThunk(
  'agencies/addAgency',
  async (newAgencyData: Partial<Agency>, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const currentUserRole = state.auth.user?.role;

    let dataToSend = { ...newAgencyData };

    // If the user creating the agency is a Super_Admin, add default privileges
    if (currentUserRole === 'Super_Admin') {
      dataToSend = {
        ...dataToSend,
        admin_privileges: DEFAULT_ADMIN_PRIVILEGES,
        school_privileges: DEFAULT_SCHOOL_PRIVILEGES,
      };
    }

    try {
      // Send dataToSend which includes default privileges if applicable
      // const response = await axios.post('/agencies/', dataToSend); // Old call
      // return response.data as Agency;
      return await AgencyService.addAgency(dataToSend);
    } catch (error: any) {
      console.error('Error adding agency:', error);
      return rejectWithValue(error.response?.data || 'Failed to add agency');
    }
  },
);

export const deleteAgency = createAsyncThunk(
  'agencies/deleteAgency',
  async (agencyId: string, { rejectWithValue }) => {
    try {
      // await axios.delete(`/agencies/${agencyId}/`); // Old Call
      await AgencyService.deleteAgency(agencyId);
      return agencyId; // Still return agencyId for the reducer to filter
    } catch (error: any) {
      console.error('Error deleting agency:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete agency',
      );
    }
  },
);

interface UpdateAgencyPayload {
  agencyId: string;
  updates: Partial<Agency>;
}

// New Async Thunk for updating agency privileges (and other partial updates)
export const updateAgencyThunk = createAsyncThunk(
  'agencies/updateAgencyThunk',
  async (payload: UpdateAgencyPayload, { dispatch, rejectWithValue }) => {
    try {
      // const response = await axios.put( // Old call
      //   `/agencies/${payload.agencyId}/`,
      //   payload.updates,
      // );
      const updatedAgency = await AgencyService.updateAgency(
        payload.agencyId,
        payload.updates,
      );
      // Dispatch the synchronous action to update the store on successful API call
      dispatch(agenciesSlice.actions.updateAgency(payload));
      dispatch(fetchMenuItems());
      // return response.data as Agency;
      return updatedAgency;
    } catch (error: any) {
      console.error('Error updating agency:', error);
      return rejectWithValue(error.response?.data || 'Failed to update agency');
    }
  },
);

const agenciesSlice = createSlice({
  name: 'agencies',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateAgency: (state, action: PayloadAction<UpdateAgencyPayload>) => {
      const { agencyId, updates } = action.payload;
      const agencyIndex = state.agencies.findIndex(
        (agency) => agency.id === agencyId,
      );
      if (agencyIndex !== -1) {
        state.agencies[agencyIndex] = {
          ...state.agencies[agencyIndex],
          ...updates,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAgencies.fulfilled,
        (state, action: PayloadAction<Agency[]>) => {
          state.loading = false;
          state.agencies = action.payload;
          state.count = action.payload.length;
          state.error = null;
        },
      )
      .addCase(fetchAgencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.agencies = [];
        state.count = 0;
      })
      .addCase(addAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAgency.fulfilled, (state, action: PayloadAction<Agency>) => {
        state.loading = false;
        state.agencies.unshift(action.payload);
        state.count += 1;
        state.error = null;
      })
      .addCase(addAgency.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : JSON.stringify(action.payload);
      })
      .addCase(deleteAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAgency.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.agencies = state.agencies.filter(
            (agency) => agency.id !== action.payload,
          );
          state.count -= 1;
          state.error = null;
        },
      )
      .addCase(deleteAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selector to get a specific agency by ID
export const selectAgencyById = (state: RootState, agencyId: string) =>
  state.agencies.agencies.find((agency) => agency.id === agencyId);

export const { setLoading, setError, updateAgency } = agenciesSlice.actions;

export default agenciesSlice.reducer;
