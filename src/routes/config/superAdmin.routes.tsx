import { AgencyManagementPage } from '@/pages/SuperAdmin';
import { HomePage, MessagingPage, SettingsPage } from '@/pages/Common';
// import ReportsPage from '@/pages/Reports/Super';

export const SUPER_ADMIN_ROUTES = [
  // { path: 'reports', element: <ReportsPage /> },
  { path: 'agencies', element: <AgencyManagementPage /> },
  { path: 'agencies/:agencyId/details', element: <AgencyManagementPage /> },
  { path: 'agencies/edit/:agency_id', element: <AgencyManagementPage /> },
  { path: 'messaging', element: <MessagingPage /> },
  { path: 'messaging/:conversation_id', element: <MessagingPage /> },
  { path: 'settings', element: <SettingsPage /> },
  { path: 'settings/:tab', element: <SettingsPage /> },
  { path: 'home', element: <HomePage /> },
] as const;
