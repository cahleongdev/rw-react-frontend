import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AgencyService } from '@/api/agencies';
import { Agency } from '../types';
import { SchoolUser } from './schoolUsersSlice';
import { InviteUserFormData } from '@containers/AgencySettings/index.types';

export interface CustomFieldDefinition {
  Name: string;
  Type: string;
}

export enum CustomFieldEntityType {
  AgencyEntity = 'agency_entity_fields',
  SchoolEntity = 'school_entity_fields',
  NetworkEntity = 'network_entity_fields',
  BoardMember = 'board_member_fields',
  AgencyUser = 'agency_user_fields',
  SchoolUser = 'school_user_fields',
}

export type EntityTypeWithCustomFields = CustomFieldEntityType;

interface CustomFieldDefinitions {
  [CustomFieldEntityType.AgencyEntity]: CustomFieldDefinition[];
  [CustomFieldEntityType.SchoolEntity]: CustomFieldDefinition[];
  [CustomFieldEntityType.NetworkEntity]: CustomFieldDefinition[];
  [CustomFieldEntityType.BoardMember]: CustomFieldDefinition[];
  [CustomFieldEntityType.AgencyUser]: CustomFieldDefinition[];
  [CustomFieldEntityType.SchoolUser]: CustomFieldDefinition[];
}

interface AgenciesState {
  agency: Agency | null;
  users: SchoolUser[];
  user: SchoolUser | null;
  loading: boolean;
  error: string | null;
  customFieldDefinitions: CustomFieldDefinitions;
  magicLinkLoading: {
    individual: string[]; // Array of user IDs currently sending magic links
    bulk: boolean; // Whether bulk magic link sending is in progress
  };
}

const initialState: AgenciesState = {
  agency: null,
  users: [],
  user: null,
  loading: false,
  error: null,
  customFieldDefinitions: {
    [CustomFieldEntityType.AgencyEntity]: [],
    [CustomFieldEntityType.SchoolEntity]: [],
    [CustomFieldEntityType.NetworkEntity]: [],
    [CustomFieldEntityType.BoardMember]: [],
    [CustomFieldEntityType.AgencyUser]: [],
    [CustomFieldEntityType.SchoolUser]: [],
  },
  magicLinkLoading: {
    individual: [],
    bulk: false,
  },
};

export const fetchAgency = createAsyncThunk<Agency, string>(
  'agencies/fetchAgency',
  async (agencyId, { rejectWithValue }) => {
    try {
      return await AgencyService.fetchAgency(agencyId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to fetch agency');
      }
      return rejectWithValue('Failed to fetch agency');
    }
  },
);

export const updateAgency = createAsyncThunk<
  Agency,
  { agencyId: string; updates: Partial<Agency> }
>(
  'agencies/updateAgency',
  async ({ agencyId, updates }, { rejectWithValue }) => {
    try {
      return await AgencyService.updateAgency(agencyId, updates);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to update agency');
      }
      return rejectWithValue('Failed to update agency');
    }
  },
);

// Create user thunk
export const createAgencyUser = createAsyncThunk(
  'users/createUser',
  async (
    { agencyId, data }: { agencyId: string; data: InviteUserFormData },
    { rejectWithValue },
  ) => {
    try {
      const response = await AgencyService.createAgencyUser(agencyId, data);
      return response;
    } catch (error) {
      console.error(error);
      return rejectWithValue('Failed to create user');
    }
  },
);

// Create user and send invitation thunk
export const createAndInviteAgencyUser = createAsyncThunk(
  'users/createAndInviteUser',
  async (
    { agencyId, data }: { agencyId: string; data: InviteUserFormData },
    { rejectWithValue },
  ) => {
    try {
      const dataWithInvitation = { ...data, send_invitation: true };
      const response = await AgencyService.createAgencyUser(
        agencyId,
        dataWithInvitation,
      );
      return response;
    } catch (error) {
      console.error(error);
      return rejectWithValue('Failed to create and invite user');
    }
  },
);

export const fetchAgencyUsers = createAsyncThunk<SchoolUser[], string>(
  'agencies/fetchAgencyUsers',
  async (agencyId, { rejectWithValue }) => {
    try {
      return await AgencyService.getAgencyUsers(agencyId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to fetch agency users');
      }
      return rejectWithValue('Failed to fetch agency users');
    }
  },
);

export const fetchAgencyUser = createAsyncThunk<
  SchoolUser,
  { agencyId: string; userId: string }
>(
  'agencies/fetchAgencyUser',
  async ({ agencyId, userId }, { rejectWithValue }) => {
    try {
      return await AgencyService.getAgencyUser(agencyId, userId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to fetch agency user');
      }
      return rejectWithValue('Failed to fetch agency user');
    }
  },
);

export const deleteAgencyUser = createAsyncThunk<
  string,
  { agencyId: string; userId: string }
>(
  'agencies/deleteAgencyUser',
  async ({ agencyId, userId }, { rejectWithValue }) => {
    try {
      await AgencyService.deleteAgencyUser(agencyId, userId);
      return userId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to delete user');
      }
      return rejectWithValue('Failed to delete user');
    }
  },
);

export const bulkDeleteAgencyUsers = createAsyncThunk<
  string[],
  { agencyId: string; userIds: string[] }
>(
  'agencies/bulkDeleteAgencyUsers',
  async ({ agencyId, userIds }, { rejectWithValue }) => {
    try {
      await AgencyService.bulkDeleteAgencyUsers(agencyId, userIds);
      return userIds;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to delete users');
      }
      return rejectWithValue('Failed to delete users');
    }
  },
);

export const resendMagicLink = createAsyncThunk<
  void,
  { agencyId: string; userId: string }
>(
  'agencies/resendMagicLink',
  async ({ agencyId, userId }, { rejectWithValue }) => {
    try {
      await AgencyService.resendMagicLink(agencyId, userId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to resend magic link');
      }
      return rejectWithValue('Failed to resend magic link');
    }
  },
);

export const bulkResendMagicLinks = createAsyncThunk(
  'agency/bulkResendMagicLinks',
  async (
    { agencyId, userIds }: { agencyId: string; userIds: string[] },
    { rejectWithValue },
  ) => {
    try {
      await AgencyService.bulkResendMagicLinks(agencyId, userIds);
      return userIds;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to resend magic links',
      );
    }
  },
);

export const restoreAgencyUser = createAsyncThunk(
  'agency/restoreAgencyUser',
  async (
    { agencyId, userId }: { agencyId: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      await AgencyService.restoreAgencyUser(agencyId, userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to restore user',
      );
    }
  },
);

export const bulkRestoreAgencyUsers = createAsyncThunk(
  'agency/bulkRestoreAgencyUsers',
  async (
    { agencyId, userIds }: { agencyId: string; userIds: string[] },
    { rejectWithValue },
  ) => {
    try {
      await AgencyService.bulkRestoreAgencyUsers(agencyId, userIds);
      return userIds;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to restore users',
      );
    }
  },
);

const agencySlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    updateAgencyUser: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<SchoolUser> }>,
    ) => {
      const { id, updates } = action.payload;
      const userIndex = state.users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        state.users[userIndex] = {
          ...state.users[userIndex],
          ...updates,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgency.fulfilled, (state, action) => {
        state.loading = false;
        state.agency = action.payload;

        state.customFieldDefinitions = {
          [CustomFieldEntityType.AgencyEntity]: Array.isArray(
            action.payload.agency_entity_fields,
          )
            ? action.payload.agency_entity_fields
            : [],
          [CustomFieldEntityType.SchoolEntity]: Array.isArray(
            action.payload.school_entity_fields,
          )
            ? action.payload.school_entity_fields
            : [],
          [CustomFieldEntityType.NetworkEntity]: Array.isArray(
            action.payload.network_entity_fields,
          )
            ? action.payload.network_entity_fields
            : [],
          [CustomFieldEntityType.BoardMember]: Array.isArray(
            action.payload.board_member_fields,
          )
            ? action.payload.board_member_fields
            : [],
          [CustomFieldEntityType.AgencyUser]: Array.isArray(
            action.payload.agency_user_fields,
          )
            ? action.payload.agency_user_fields
            : [],
          [CustomFieldEntityType.SchoolUser]: Array.isArray(
            action.payload.school_user_fields,
          )
            ? action.payload.school_user_fields
            : [],
        };
      })
      .addCase(fetchAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgency.fulfilled, (state, action) => {
        state.loading = false;
        state.agency = action.payload;

        state.customFieldDefinitions = {
          [CustomFieldEntityType.AgencyEntity]: Array.isArray(
            action.payload.agency_entity_fields,
          )
            ? action.payload.agency_entity_fields
            : [],
          [CustomFieldEntityType.SchoolEntity]: Array.isArray(
            action.payload.school_entity_fields,
          )
            ? action.payload.school_entity_fields
            : [],
          [CustomFieldEntityType.NetworkEntity]: Array.isArray(
            action.payload.network_entity_fields,
          )
            ? action.payload.network_entity_fields
            : [],
          [CustomFieldEntityType.BoardMember]: Array.isArray(
            action.payload.board_member_fields,
          )
            ? action.payload.board_member_fields
            : [],
          [CustomFieldEntityType.AgencyUser]: Array.isArray(
            action.payload.agency_user_fields,
          )
            ? action.payload.agency_user_fields
            : [],
          [CustomFieldEntityType.SchoolUser]: Array.isArray(
            action.payload.school_user_fields,
          )
            ? action.payload.school_user_fields
            : [],
        };
      })
      .addCase(updateAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAgencyUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencyUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAgencyUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAgencyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchAgencyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAgencyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgencyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createAgencyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAndInviteAgencyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndInviteAgencyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createAndInviteAgencyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAgencyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAgencyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteAgencyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(bulkDeleteAgencyUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteAgencyUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => !action.payload.includes(user.id),
        );
      })
      .addCase(bulkDeleteAgencyUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resendMagicLink.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        state.magicLinkLoading.individual.push(userId);
        state.error = null;
      })
      .addCase(resendMagicLink.fulfilled, (state, action) => {
        const userId = action.meta.arg.userId;
        state.magicLinkLoading.individual =
          state.magicLinkLoading.individual.filter((id) => id !== userId);

        // Update user status to Inactive (false) after sending magic link
        const userIndex = state.users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
          state.users[userIndex].is_active = false;
        }
      })
      .addCase(resendMagicLink.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        state.magicLinkLoading.individual =
          state.magicLinkLoading.individual.filter((id) => id !== userId);
        state.error = action.payload as string;
      })
      .addCase(bulkResendMagicLinks.pending, (state, action) => {
        state.magicLinkLoading.bulk = true;
        const userIds = action.meta.arg.userIds;
        state.magicLinkLoading.individual.push(...userIds);
        state.error = null;
      })
      .addCase(bulkResendMagicLinks.fulfilled, (state, action) => {
        state.magicLinkLoading.bulk = false;
        const userIds = action.meta.arg.userIds;
        state.magicLinkLoading.individual =
          state.magicLinkLoading.individual.filter(
            (id) => !userIds.includes(id),
          );

        // Update all users' status to Inactive (false) after sending magic links
        userIds.forEach((userId) => {
          const userIndex = state.users.findIndex((user) => user.id === userId);
          if (userIndex !== -1) {
            state.users[userIndex].is_active = false;
          }
        });
      })
      .addCase(bulkResendMagicLinks.rejected, (state, action) => {
        state.magicLinkLoading.bulk = false;
        const userIds = action.meta.arg.userIds;
        state.magicLinkLoading.individual =
          state.magicLinkLoading.individual.filter(
            (id) => !userIds.includes(id),
          );
        state.error = action.payload as string;
      })
      .addCase(restoreAgencyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreAgencyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(restoreAgencyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(bulkRestoreAgencyUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkRestoreAgencyUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => !action.payload.includes(user.id),
        );
      })
      .addCase(bulkRestoreAgencyUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateAgencyUser } = agencySlice.actions;

export default agencySlice.reducer;
