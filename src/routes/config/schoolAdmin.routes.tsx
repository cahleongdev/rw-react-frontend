import { YourSchoolDetailPage } from '@/pages/SchoolAdmin';
import ReportsPage from '@/pages/SchoolAdmin/ReportsPage';
import { HomePage, MessagingPage, SettingsPage } from '@/pages/Common';

export const SCHOOL_ADMIN_ROUTES = [
  { path: 'your-school', element: <YourSchoolDetailPage /> },
  { path: 'reports', element: <ReportsPage /> },
  { path: 'reports/:report_id', element: <ReportsPage /> },
  { path: 'messaging', element: <MessagingPage /> },
  { path: 'messaging/:conversation_id', element: <MessagingPage /> },
  { path: 'home', element: <HomePage /> },
  { path: 'settings', element: <SettingsPage /> },
  { path: 'settings/:tab', element: <SettingsPage /> },
] as const;
