// TODO: Remove this slice and use the agency slice for custom fields
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance'; // Use the configured axios instance
import axios from 'axios';

// Define the structure based on API response for DEFINITIONS
export interface CustomFieldDefinition {
  Name: string;
  Type: string;
}

// Entity types matching the API keys for definitions
export enum CustomFieldEntityType {
  AgencyEntity = 'agency_entity_fields',
  SchoolEntity = 'school_entity_fields',
  NetworkEntity = 'network_entity_fields',
  BoardMember = 'board_member_fields',
  AgencyUser = 'agency_user_fields',
  SchoolUser = 'school_user_fields',
}
// Type alias remains for convenience if needed, but points to enum values
export type EntityTypeWithCustomFields = CustomFieldEntityType;

// State structure for storing definitions fetched from API
interface CustomFieldDefinitionsState {
  [CustomFieldEntityType.AgencyEntity]: CustomFieldDefinition[];
  [CustomFieldEntityType.SchoolEntity]: CustomFieldDefinition[];
  [CustomFieldEntityType.NetworkEntity]: CustomFieldDefinition[];
  [CustomFieldEntityType.BoardMember]: CustomFieldDefinition[];
  [CustomFieldEntityType.AgencyUser]: CustomFieldDefinition[];
  [CustomFieldEntityType.SchoolUser]: CustomFieldDefinition[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Add loading state
  error: string | null;
}

const initialState: CustomFieldDefinitionsState = {
  [CustomFieldEntityType.AgencyEntity]: [],
  [CustomFieldEntityType.SchoolEntity]: [],
  [CustomFieldEntityType.NetworkEntity]: [],
  [CustomFieldEntityType.BoardMember]: [],
  [CustomFieldEntityType.AgencyUser]: [],
  [CustomFieldEntityType.SchoolUser]: [],
  loading: 'idle',
  error: null,
};

// Thunk to fetch initial definitions
export const fetchAgencyData = createAsyncThunk(
  'customFieldDefinitions/fetchAgencyData',
  async (agencyUniqueId: string, { rejectWithValue }) => {
    // Base URL is handled by axiosInstance
    try {
      const response = await axiosInstance.get(`/agencies/${agencyUniqueId}/`);
      // Extract only the definition fields, ensuring they are arrays
      return {
        [CustomFieldEntityType.AgencyEntity]: Array.isArray(
          response.data.agency_entity_fields,
        )
          ? response.data.agency_entity_fields
          : [],
        [CustomFieldEntityType.SchoolEntity]: Array.isArray(
          response.data.school_entity_fields,
        )
          ? response.data.school_entity_fields
          : [],
        [CustomFieldEntityType.NetworkEntity]: Array.isArray(
          response.data.network_entity_fields,
        )
          ? response.data.network_entity_fields
          : [],
        [CustomFieldEntityType.BoardMember]: Array.isArray(
          response.data.board_member_fields,
        )
          ? response.data.board_member_fields
          : [],
        [CustomFieldEntityType.AgencyUser]: Array.isArray(
          response.data.agency_user_fields,
        )
          ? response.data.agency_user_fields
          : [],
        [CustomFieldEntityType.SchoolUser]: Array.isArray(
          response.data.school_user_fields,
        )
          ? response.data.school_user_fields
          : [],
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      // Attempt to get more specific message from Axios error
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(message || 'Failed to fetch agency data');
    }
  },
);

// Thunk to update definitions
export const updateCustomFieldDefinitionsAPI = createAsyncThunk(
  'customFieldDefinitions/updateDefinitions',
  async (
    {
      agencyUniqueId,
      entityTypeKey,
      fields,
    }: {
      agencyUniqueId: string;
      entityTypeKey: EntityTypeWithCustomFields;
      fields: CustomFieldDefinition[];
    },
    { rejectWithValue },
  ) => {
    // Base URL is handled by axiosInstance
    const payload = { [entityTypeKey]: fields };
    try {
      await axiosInstance.put(`/agencies/${agencyUniqueId}/`, payload);
      // Return payload to update state optimistically in reducer
      return { entityTypeKey, fields };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      // Attempt to get more specific message from Axios error
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(message || 'Failed to update definitions');
    }
  },
);

const customFieldDefinitionsSlice = createSlice({
  name: 'customFieldDefinitions',
  initialState,
  reducers: {
    // Optional: Reducer for direct state manipulation if needed,
    // but prefer updates via API thunks.
    // updateCustomFieldDefinitions: (
    //   state,
    //   action: PayloadAction<{
    //     entityType: EntityTypeWithCustomFields;
    //     fields: CustomFieldDefinition[];
    //   }>,
    // ) => {
    //   const { entityType, fields } = action.payload;
    //   if (entityType in state) {
    //      (state as any)[entityType] = fields;
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
      // Fetch initial data
      .addCase(fetchAgencyData.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchAgencyData.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        // Assign all fetched definition types
        state[CustomFieldEntityType.AgencyEntity] =
          action.payload[CustomFieldEntityType.AgencyEntity];
        state[CustomFieldEntityType.SchoolEntity] =
          action.payload[CustomFieldEntityType.SchoolEntity];
        state[CustomFieldEntityType.NetworkEntity] =
          action.payload[CustomFieldEntityType.NetworkEntity];
        state[CustomFieldEntityType.BoardMember] =
          action.payload[CustomFieldEntityType.BoardMember];
        state[CustomFieldEntityType.AgencyUser] =
          action.payload[CustomFieldEntityType.AgencyUser];
        state[CustomFieldEntityType.SchoolUser] =
          action.payload[CustomFieldEntityType.SchoolUser];
        state.error = null;
      })
      .addCase(fetchAgencyData.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Update definitions API result
      .addCase(updateCustomFieldDefinitionsAPI.pending, (state) => {
        // Set loading only if needed, could cause UI flicker
        // state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateCustomFieldDefinitionsAPI.fulfilled, (state, action) => {
        state.loading = 'succeeded'; // Or back to 'idle'?
        const { entityTypeKey, fields } = action.payload;
        // Check if the key exists in our enum (already typed as CustomFieldEntityType)
        if (Object.values(CustomFieldEntityType).includes(entityTypeKey)) {
          state[entityTypeKey] = fields; // Now TypeScript knows this is safe
        }
        state.error = null;
      })
      .addCase(updateCustomFieldDefinitionsAPI.rejected, (state, action) => {
        // Check if payload exists before asserting as string
        const errorMessage =
          typeof action.payload === 'string'
            ? action.payload
            : 'Failed to update definitions';
        state.loading = 'failed';
        state.error = errorMessage;
        // Consider reverting optimistic update here if needed
      });
  },
});

// Export any needed actions (currently none from reducers)
// export const { updateCustomFieldDefinitions } = customFieldDefinitionsSlice.actions;

export default customFieldDefinitionsSlice.reducer;
