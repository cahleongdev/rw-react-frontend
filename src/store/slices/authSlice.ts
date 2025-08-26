import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { clearAxiosTokens } from '@/api/axiosInstance';
import userApi from '@/api/user';

import { clearUsers, fetchUsers } from './usersSlice';
import { clearSchools } from './schoolsSlice';
import { clearReports } from './reportsSlice';
import { clearSubmissions } from './submissionsSlice';

import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { UpdatePersonalProfile } from '@/api/user/index.types';

interface AuthState {
  isAuthenticated: boolean;
  user: SchoolUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  mfaMethods: string[];
  mfaLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem('accessToken')),
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,
  mfaRequired: false,
  mfaMethods: [],
  mfaLoading: false,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      // Clear any existing tokens before login attempt
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Also clear the axios instance tokens
      clearAxiosTokens();

      const response = await userApi.login(
        credentials.email,
        credentials.password,
      );

      return response;
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { non_field_errors?: string } } })
          .response?.data?.non_field_errors || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  },
);

export const verifyMFALogin = createAsyncThunk(
  'auth/verifyMFALogin',
  async (
    { code, method }: { code: string; method: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await userApi.loginMFAVerify(code, method);
      return response;
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || 'MFA verification failed';
      return rejectWithValue(errorMessage);
    }
  },
);

export const sendMFALoginCode = createAsyncThunk(
  'auth/sendMFALoginCode',
  async (method: string, { rejectWithValue }) => {
    try {
      const response = await userApi.loginMFASendCode(method);
      return response;
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || 'Failed to send MFA code';
      return rejectWithValue(errorMessage);
    }
  },
);

export const resetAllState = createAsyncThunk(
  'auth/resetAllState',
  async (_, { dispatch }) => {
    // dispatch(clearDocuments());
    dispatch(clearUsers());
    dispatch(clearSchools());
    dispatch(clearReports());
    dispatch(clearSubmissions());
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      // Clear all localStorage items
      localStorage.clear();

      // Clear axios instance tokens
      clearAxiosTokens();

      // Reset all state in Redux store
      dispatch(resetAllState());

      // Finally, clear auth state
      dispatch(logout());
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },
);

export const updatePersonalProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<UpdatePersonalProfile>, { rejectWithValue }) => {
    try {
      const response = await userApi.updatePersonalProfile(data);
      return response;
    } catch (error) {
      console.error(error);
      return rejectWithValue('Failed to update profile');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<{ user: SchoolUser }>) => {
      state.user = action.payload.user;
    },
    setAuth: (
      state,
      action: PayloadAction<{
        user: SchoolUser | null;
        accessToken: string | null;
        refreshToken: string | null;
        isAuthenticated: boolean;
      }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.mfaRequired = false;
      state.mfaMethods = [];
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    clearMFAState: (state) => {
      state.mfaRequired = false;
      state.mfaMethods = [];
      state.mfaLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.mfaRequired = false;
        state.mfaMethods = [];
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        // Check if MFA is required
        if (action.payload.mfa_required) {
          state.mfaRequired = true;
          state.mfaMethods = action.payload.mfa_methods || [];
        } else {
          // Complete login without MFA
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.accessToken = action.payload.access;
          state.refreshToken = action.payload.refresh;
          localStorage.setItem('accessToken', action.payload.access);
          localStorage.setItem('refreshToken', action.payload.refresh);
          fetchUsers();
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // MFA Verification
      .addCase(verifyMFALogin.pending, (state) => {
        state.mfaLoading = true;
        state.error = null;
      })
      .addCase(verifyMFALogin.fulfilled, (state, action) => {
        state.mfaLoading = false;
        state.mfaRequired = false;
        state.mfaMethods = [];

        // Complete login after successful MFA
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        localStorage.setItem('accessToken', action.payload.access);
        localStorage.setItem('refreshToken', action.payload.refresh);
        fetchUsers();
      })
      .addCase(verifyMFALogin.rejected, (state, action) => {
        state.mfaLoading = false;
        state.error = action.payload as string;
      })

      // Send MFA Code
      .addCase(sendMFALoginCode.pending, (state) => {
        state.mfaLoading = true;
        state.error = null;
      })
      .addCase(sendMFALoginCode.fulfilled, (state) => {
        state.mfaLoading = false;
      })
      .addCase(sendMFALoginCode.rejected, (state, action) => {
        state.mfaLoading = false;
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updatePersonalProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePersonalProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updatePersonalProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAuth, logout, setCurrentUser, clearMFAState } =
  authSlice.actions;

export default authSlice.reducer;
