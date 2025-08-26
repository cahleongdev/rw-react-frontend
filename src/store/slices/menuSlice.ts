import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  BuildingOffice2Icon,
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  FaceFrownIcon,
  ShareIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  Cog8ToothIcon,
  DocumentMagnifyingGlassIcon,
  UserIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  InboxArrowDownIcon,
  ChartPieIcon,
} from '@heroicons/react/24/solid';
import {
  BuildingOffice2Icon as BuildingOffice2IconOutline,
  ChartBarSquareIcon as ChartBarSquareIconOutline,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconOutline,
  DocumentTextIcon as DocumentTextIconOutline,
  FaceFrownIcon as FaceFrownIconOutline,
  ShareIcon as ShareIconOutline,
  CalendarIcon as CalendarIconOutline,
  BuildingOfficeIcon as BuildingOfficeIconOutline,
  Cog8ToothIcon as Cog8ToothIconOutline,
  DocumentMagnifyingGlassIcon as DocumentMagnifyingGlassIconOutline,
  UserIcon as UserIconOutline,
  CreditCardIcon as CreditCardIconOutline,
  QuestionMarkCircleIcon as QuestionMarkCircleIconOutline,
  InboxArrowDownIcon as InboxArrowDownIconOutline,
  ChartPieIcon as ChartPieIconOutline,
} from '@heroicons/react/24/outline';

import axios from '@/api/axiosInstance';
import { RootState } from '@/store';

// Define a specific list for items controlled by agency admin privileges
const AGENCY_ADMIN_PRIVILEGE_ITEMS = [
  {
    id: '2',
    label: 'Report Templates',
    link: '/reports',
    iconSelected: ClipboardDocumentCheckIcon,
    icon: ClipboardDocumentCheckIconOutline,
  },
  {
    id: '3',
    label: 'Schools',
    link: '/schools',
    iconSelected: BuildingOffice2Icon,
    icon: BuildingOffice2IconOutline,
  },
  {
    id: '4',
    label: 'Submissions',
    link: '/submissions',
    iconSelected: ClipboardDocumentCheckIcon,
    icon: ClipboardDocumentCheckIconOutline,
  },
  {
    id: '5',
    label: 'Applications',
    link: '/applications',
    iconSelected: DocumentTextIcon,
    icon: DocumentTextIconOutline,
  },
  {
    id: '6',
    label: 'Complaints',
    link: '/complaints',
    iconSelected: FaceFrownIcon,
    icon: FaceFrownIconOutline,
  },
  {
    id: '7',
    label: 'Accountability',
    link: '/accountability',
    iconSelected: ShareIcon,
    icon: ShareIconOutline,
  },
  {
    id: '9', // For Reportwell University (Agency context)
    label: 'Reportwell University',
    link: '/reportwell-university',
    iconSelected: CalendarIcon,
    icon: CalendarIconOutline,
  },
  {
    id: '13',
    label: 'Transparency',
    link: '/transparency-settings',
    iconSelected: DocumentMagnifyingGlassIcon,
    icon: DocumentMagnifyingGlassIconOutline,
  },
  {
    id: '17', // Re-added Inbox
    label: 'Inbox',
    link: '/notifications',
    iconSelected: InboxArrowDownIcon,
    icon: InboxArrowDownIconOutline,
  },
  {
    id: '18', // Re-added Analytics
    label: 'Analytics',
    link: '/analytics',
    iconSelected: ChartPieIcon,
    icon: ChartPieIconOutline,
  },
];

// Define items that are always available for an Agency Admin
const ALWAYS_AVAILABLE_AGENCY_ADMIN_ITEMS = [
  {
    id: '11',
    label: 'Settings',
    link: '/settings',
    iconSelected: Cog8ToothIcon,
    icon: Cog8ToothIconOutline,
  },
  {
    id: '12',
    label: 'Agency Settings',
    link: '/agency-settings',
    iconSelected: Cog8ToothIcon,
    icon: Cog8ToothIconOutline,
  },
];

// Define a specific list for items controlled by school admin privileges
const SCHOOL_ADMIN_PRIVILEGE_ITEMS = [
  {
    id: '8',
    label: 'Your School',
    link: '/your-school',
    iconSelected: BuildingOffice2Icon,
    icon: BuildingOffice2IconOutline,
  },
  {
    id: '2', // Reports for School
    label: 'Reports',
    link: '/reports',
    iconSelected: ChartBarSquareIcon,
    icon: ChartBarSquareIconOutline,
  },
  {
    id: '5',
    label: 'Applications',
    link: '/applications',
    iconSelected: DocumentTextIcon,
    icon: DocumentTextIconOutline,
  },
  {
    id: '9',
    label: 'Reportwell University',
    link: '/school-reportwell-university',
    iconSelected: UserIcon,
    icon: UserIconOutline,
  },
  {
    id: '14', // As per PrivilegesSettings
    label: 'Calendar',
    link: '/school-calendar',
    iconSelected: CalendarIcon,
    icon: CalendarIconOutline,
  },
  {
    id: '15',
    label: 'Subscription',
    link: '/school-subscription',
    iconSelected: CreditCardIcon,
    icon: CreditCardIconOutline,
  },
  {
    id: '16',
    label: 'FAQ',
    link: '/school-faq',
    iconSelected: QuestionMarkCircleIcon,
    icon: QuestionMarkCircleIconOutline,
  },
  {
    id: '17', // Re-added Inbox
    label: 'Inbox',
    link: '/notifications',
    iconSelected: InboxArrowDownIcon,
    icon: InboxArrowDownIconOutline,
  },
  {
    id: '18', // Re-added Analytics
    label: 'Analytics',
    link: '/analytics',
    iconSelected: ChartPieIcon,
    icon: ChartPieIconOutline,
  },
  // Note: User's school_privileges included '3'.
  // This ID is 'Schools' for Agency Admin. Its meaning for School Admin is unclear based on current UI mockups for School Menu.
  // If it maps to a specific School Admin menu item, it should be added here with the correct label, link, and icons.
];

// Define items that are always available for a School Admin
const ALWAYS_AVAILABLE_SCHOOL_ADMIN_ITEMS = [
  {
    id: '11',
    label: 'Settings',
    link: '/settings', // Could be /school-settings if routes differ
    iconSelected: Cog8ToothIcon,
    icon: Cog8ToothIconOutline,
  },
];

// MOCK_MENU_ITEMS - This structure is now primarily for Super_Admin or fallback.
const MOCK_MENU_ITEMS = {
  Super_Admin: [
    {
      id: '10',
      label: 'Agency',
      link: '/agencies',
      iconSelected: BuildingOfficeIcon,
      icon: BuildingOfficeIconOutline,
    },
    {
      id: '2',
      label: 'Reports',
      link: '/reports',
      iconSelected: ChartBarSquareIcon,
      icon: ChartBarSquareIconOutline,
    },
    {
      id: '11',
      label: 'Settings',
      link: '/settings',
      iconSelected: Cog8ToothIcon,
      icon: Cog8ToothIconOutline,
    },
  ],
  // School_Admin and Agency_Admin sections are removed as they are dynamically built
};

export interface MenuItem {
  id: string;
  label: string;
  link: string;
  iconSelected: React.FC<React.SVGProps<SVGSVGElement>>;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  permissions?: string[]; // Optional: if you still use this for other purposes
}

interface MenuState {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const userRole = state.auth.user?.role;
    const agencyIdentifier = state.auth.user?.agency;

    try {
      let availableMenuItems: MenuItem[] = [];

      if (userRole === 'Agency_Admin') {
        if (!agencyIdentifier) {
          console.error('Agency identifier not found for Agency_Admin');
          return rejectWithValue('Agency identifier missing');
        }
        const { data: agency } = await axios.get(
          `/agencies/${agencyIdentifier}/`,
        );

        if (!agency) {
          console.error('Agency not found with identifier:', agencyIdentifier);
          return rejectWithValue([...ALWAYS_AVAILABLE_AGENCY_ADMIN_ITEMS]);
        }

        const adminPrivileges = agency.admin_privileges || [];
        const privilegedItems = AGENCY_ADMIN_PRIVILEGE_ITEMS.filter((item) =>
          adminPrivileges.includes(item.id),
        );

        console.log('adminPrivileges', adminPrivileges);
        console.log('privilegedItems', privilegedItems);
        availableMenuItems = [
          ...privilegedItems,
          ...ALWAYS_AVAILABLE_AGENCY_ADMIN_ITEMS,
        ];
      } else if (userRole === 'School_Admin') {
        if (!agencyIdentifier) {
          console.error(
            'Agency identifier not found for School_Admin (to get agency privileges).',
          );
          return rejectWithValue([...ALWAYS_AVAILABLE_SCHOOL_ADMIN_ITEMS]);
        }

        // Fetch THE AGENCY'S details to get school_privileges
        const { data: agency } = await axios.get(
          `/agencies/${agencyIdentifier}/`,
        );

        if (!agency) {
          console.error(
            'Agency not found for School_Admin with agencyId:',
            agencyIdentifier,
          );
          return rejectWithValue([...ALWAYS_AVAILABLE_SCHOOL_ADMIN_ITEMS]);
        }

        const schoolPrivileges = agency.school_privileges || [];
        const privilegedSchoolItems = SCHOOL_ADMIN_PRIVILEGE_ITEMS.filter(
          (item) => schoolPrivileges.includes(item.id),
        );

        console.log(
          'School Admin using agency schoolPrivileges:',
          schoolPrivileges,
        );
        console.log(
          'School Admin privilegedSchoolItems:',
          privilegedSchoolItems,
        );
        availableMenuItems = [
          ...privilegedSchoolItems,
          ...ALWAYS_AVAILABLE_SCHOOL_ADMIN_ITEMS,
        ];
      } else if (userRole === 'Super_Admin') {
        availableMenuItems = MOCK_MENU_ITEMS.Super_Admin;
      }

      return availableMenuItems;
    } catch (error: any) {
      console.error('Failed to fetch menu items:', error);
      if (userRole === 'Agency_Admin') {
        return rejectWithValue([...ALWAYS_AVAILABLE_AGENCY_ADMIN_ITEMS]);
      } else if (userRole === 'School_Admin') {
        return rejectWithValue([...ALWAYS_AVAILABLE_SCHOOL_ADMIN_ITEMS]);
      }
      return rejectWithValue(
        'Failed to fetch menu items for role: ' + userRole,
      );
    }
  },
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload as MenuItem[];
          state.error = 'Failed to fetch full menu items, showing defaults.';
        } else {
          state.items = [];
          state.error =
            (action.payload as string) || 'Failed to fetch menu items';
        }
      });
  },
});

export default menuSlice.reducer;

// Note: The 'Inbox' and 'Analytics' items from your screenshot are not part of MOCK_MENU_ITEMS.Agency_Admin.
// If these are standard for Agency Admins, they should be added to ALWAYS_AVAILABLE_AGENCY_ADMIN_ITEMS
// or fetched via another mechanism if they are also privilege-controlled.
