// src/store.ts
import { configureStore } from '@reduxjs/toolkit';

import { initializeAxios } from '@/api/axiosInstance';

import auth, { logout, setAuth } from './slices/authSlice';
import sideMenu from './slices/sideMenuSlice';
import pagination from './slices/paginationSlice';
import users from './slices/usersSlice';
import schools from './slices/schoolsSlice';
import reports from './slices/reportsSlice';
import submissions from './slices/submissionsSlice';
import school from './slices/schoolSlice';
import schoolUsers from './slices/schoolUsersSlice';
import documents from './slices/documentsSlice';
import menu from './slices/menuSlice';
import widgetLayout from './slices/widgetLayoutSlice';
import categories from './slices/categoriesSlice';
import activityLogs from './slices/activityLogSlice';
import customFieldDefinitions from './slices/customFieldDefinitionsSlice';
import assignedReports from './slices/assignedReportsSlice';
import entityDocuments from './slices/entityDocumentsSlice';
import uiState from './slices/uiStateSlice';
import notifications from './slices/notificationsSlice';
import messaging from './slices/messagingSlice';
import agency from './slices/agencySlice';
import agencies from './slices/agenciesSlice';
import complaints from './slices/complaintsSlice';
import announcementsCategories from './slices/announcementsCategoriesSlice';

const store = configureStore({
  reducer: {
    auth,
    sideMenu,
    pagination,
    users,
    schools,
    reports,
    submissions,
    school,
    schoolUsers,
    documents,
    menu,
    widgetLayout,
    announcementsCategories,
    categories,
    activityLogs,
    customFieldDefinitions,
    assignedReports,
    entityDocuments,
    uiState,
    notifications,
    messaging,
    agency,
    complaints,
    agencies,
  },
});

store.subscribe(() => {
  const state = store.getState();
  const { accessToken, refreshToken, isAuthenticated } = state.auth;

  // Ensure localStorage and Redux store are in sync
  if (isAuthenticated && accessToken && refreshToken) {
    // Update localStorage if tokens exist in store
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    initializeAxios(
      { accessToken, refreshToken },
      () => {
        store.dispatch(logout());
      },
      (newAccessToken: string) => {
        store.dispatch(
          setAuth({
            ...state.auth,
            accessToken: newAccessToken,
          }),
        );
      },
    );
  } else if (!isAuthenticated) {
    // Clear localStorage if not authenticated
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
