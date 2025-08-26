import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/store';

import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import usersAPI from '@/api/users';

interface UsersState {
  users: SchoolUser[]; // Store users by page number
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  totalItems: 0,
  isLoading: false,
  error: null,
};

// Fetch users thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const userRole = state.auth.user?.role;

    // Determine endpoint based on user role
    switch (userRole) {
      case 'Agency_Admin':
        return usersAPI.getAgencyUsers();
      case 'Super_Admin':
        return usersAPI.getSuperAdminUsers();
      default:
        throw new Error('Invalid user role');
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<SchoolUser>) => {
      state.users.push(action.payload);
      state.totalItems += 1;
    },
    setUsers: (state, action: PayloadAction<SchoolUser[]>) => {
      state.users = action.payload;
    },
    clearUsers: (state) => {
      state.users = [];
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      state.totalItems = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.totalItems -= 1;
    },
    updateUser: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<SchoolUser> }>,
    ) => {
      state.users = state.users.map((user) =>
        user.id === action.payload.id
          ? { ...user, ...action.payload.updates }
          : user,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<SchoolUser[]>) => {
          state.isLoading = false;
          state.users = action.payload;
        },
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users.';
      });
  },
});

export const {
  addUser,
  setUsers,
  clearUsers,
  setTotalItems,
  setLoading,
  deleteUser,
  updateUser,
} = usersSlice.actions;

export default usersSlice.reducer;
