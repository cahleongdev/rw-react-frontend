import {
  ReportTemplatesPage,
  SchoolsPage,
  SubmissionsPage,
  AgencySettingsPage,
  ComplaintsPage,
} from '@/pages/AgencyAdmin';
import {
  HomePage,
  MessagingPage,
  SettingsPage,
  TransparencyPage,
  TransparencyPageExternalView,
} from '@/pages/Common';

export const AGENCY_ADMIN_ROUTES = [
  { path: 'reports', element: <ReportTemplatesPage /> },
  { path: 'reports/preview/:report_id', element: <ReportTemplatesPage /> },
  { path: 'reports/edit/:report_id', element: <ReportTemplatesPage /> },
  { path: 'schools', element: <SchoolsPage /> },
  { path: 'complaints', element: <ComplaintsPage /> },
  {
    path: 'submissions',
    element: <SubmissionsPage />,
  },
  { path: 'messaging', element: <MessagingPage /> },
  { path: 'messaging/:conversation_id', element: <MessagingPage /> },
  { path: 'settings', element: <SettingsPage /> },
  { path: 'settings/:tab', element: <SettingsPage /> },
  { path: 'agency-settings', element: <AgencySettingsPage /> },
  { path: 'agency-settings/:tab', element: <AgencySettingsPage /> },
  {
    path: 'transparency/:agency_id',
    element: <TransparencyPageExternalView />,
  },
  { path: 'transparency-settings', element: <TransparencyPage /> },
  { path: 'home', element: <HomePage /> },
] as const;
