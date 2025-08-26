import { SchoolUser } from '@/store/slices/schoolUsersSlice';

// Define the standard permission keys that should always be shown
export const STANDARD_PERMISSION_KEYS: Array<keyof SchoolUser['permissions']> =
  [
    'Reports',
    'Schools',
    'Complaints',
    'Submissions',
    'Applications',
    'Transparency',
    'Accountability',
    'ReportWell University', // Make sure this matches the key in SchoolUser['permissions'] type
  ];

// Helper function to map API year to folder key (like in EntityInfoDrawer)
export const getFolderKeyFromYear = (
  year: string | null | undefined,
): string => {
  if (!year || !/^[0-9]{4}$/.test(year)) {
    return 'General Documents'; // Default section for null/invalid years
  }
  try {
    const startYear = parseInt(year, 10);
    const endYear = startYear + 1;
    return `${startYear} - ${endYear}`;
  } catch {
    return 'General Documents'; // Fallback
  }
};
