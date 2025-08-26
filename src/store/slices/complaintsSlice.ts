import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';

// --- START OF MOCK DATA TO BE INCLUDED ---
const commonEmail = 'JDOE@email.com'; // Assuming this is a common email for mock purposes

// Define the structure for an individual complaint
export interface Complaint {
  id: string;
  reportName: string; // Was added for a previous "By Report" idea, can be kept or removed if not used for other views
  schoolName: string;
  assignee?: {
    id: string;
    name: string;
    initials: string;
  };
  complainant: {
    name: string;
    email: string;
  };
  followUp: boolean;
  dateOpened: string;
  dateResolved?: string;
  status: 'New' | 'Open' | 'Resolved';
}

const mockComplaintsOpen: Complaint[] = [
  {
    id: 'C001',
    reportName: 'Safety Audit Report Q2',
    schoolName: 'Avon High School',
    assignee: { id: 'USR001', name: 'Jason Charleston', initials: 'JC' },
    complainant: { name: 'John Doe', email: commonEmail },
    followUp: true,
    dateOpened: '2025-06-10T10:00:00Z',
    dateResolved: '2025-06-19T15:00:00Z',
    status: 'Open',
  },
  {
    id: 'C002',
    reportName: 'Playground Inspection Report',
    schoolName: 'Avon High School',
    assignee: { id: 'USR002', name: 'Jerimiah McLongname', initials: 'JB' },
    complainant: { name: 'John Doe', email: commonEmail },
    followUp: false,
    dateOpened: '2025-06-10T11:00:00Z',
    status: 'Open',
  },
  {
    id: 'C003',
    reportName: 'Safety Audit Report Q2',
    schoolName: 'Danville Middle School',
    complainant: { name: 'John Doe', email: commonEmail },
    followUp: false,
    dateOpened: '2025-06-10T12:00:00Z',
    status: 'Open',
  },
  {
    id: 'C004',
    reportName: 'Cafeteria Standards Review',
    schoolName: 'Danville Middle School',
    complainant: { name: 'John Doe', email: commonEmail },
    followUp: false,
    dateOpened: '2025-06-10T13:00:00Z',
    status: 'Open',
  },
];

const mockComplaintsNew: Complaint[] = [
  {
    id: 'C005',
    reportName: 'Safety Audit Report Q2',
    schoolName: 'North Elementary',
    complainant: { name: 'Jane Smith', email: 'jsmith@email.com' },
    followUp: true,
    dateOpened: '2025-06-12T09:00:00Z',
    status: 'New',
  },
  {
    id: 'C006',
    reportName: 'Playground Inspection Report',
    schoolName: 'Westwood High',
    assignee: { id: 'USR003', name: 'Alice Wonderland', initials: 'AW' },
    complainant: { name: 'Peter Pan', email: 'ppan@email.com' },
    followUp: false,
    dateOpened: '2025-06-11T14:00:00Z',
    status: 'New',
  },
];

const mockComplaintsResolved: Complaint[] = [
  {
    id: 'C007',
    reportName: 'Safety Audit Report Q2',
    schoolName: 'South Middle School',
    assignee: { id: 'USR001', name: 'Jason Charleston', initials: 'JC' },
    complainant: { name: 'Mary Poppins', email: 'mpoppins@email.com' },
    followUp: false,
    dateOpened: '2025-06-01T09:00:00Z',
    dateResolved: '2025-06-05T10:00:00Z',
    status: 'Resolved',
  },
  {
    id: 'C008',
    reportName: 'Cafeteria Standards Review',
    schoolName: 'East High School',
    complainant: { name: 'Harry Potter', email: 'hpotter@email.com' },
    followUp: false,
    dateOpened: '2025-05-20T14:30:00Z',
    dateResolved: '2025-05-28T11:00:00Z',
    status: 'Resolved',
  },
  {
    id: 'C009',
    reportName: 'Playground Inspection Report',
    schoolName: 'Central Academy',
    assignee: { id: 'USR002', name: 'Jerimiah McLongname', initials: 'JB' },
    complainant: { name: 'Tony Stark', email: 'tstark@avengers.com' },
    followUp: true,
    dateOpened: '2025-06-02T16:00:00Z',
    dateResolved: '2025-06-10T10:00:00Z',
    status: 'Resolved',
  },
  {
    id: 'C010',
    reportName: 'Safety Audit Report Q2',
    schoolName: 'Innovation Institute',
    complainant: { name: 'Bruce Wayne', email: 'bwayne@wayne.com' },
    followUp: false,
    dateOpened: '2025-05-15T11:30:00Z',
    dateResolved: '2025-05-22T17:00:00Z',
    status: 'Resolved',
  },
  {
    id: 'C011',
    reportName: 'Cafeteria Standards Review',
    schoolName: 'Oakwood Elementary',
    complainant: { name: 'Diana Prince', email: 'dprince@themyscira.com' },
    followUp: false,
    dateOpened: '2025-06-03T08:00:00Z',
    dateResolved: '2025-06-08T12:00:00Z',
    status: 'Resolved',
  },
  {
    id: 'C012',
    reportName: 'Playground Inspection Report',
    schoolName: 'Riverdale High',
    assignee: { id: 'USR003', name: 'Alice Wonderland', initials: 'AW' },
    complainant: { name: 'Clark Kent', email: 'ckent@dailyplanet.com' },
    followUp: true,
    dateOpened: '2025-06-04T13:00:00Z',
    dateResolved: '2025-06-09T14:00:00Z',
    status: 'Resolved',
  },
];

export interface ComplaintStatusGroup {
  status: 'New' | 'Open' | 'Resolved';
  totalComplaints: number;
  unassignedComplaints: number;
  complaints: Complaint[];
}

const initialMockComplaintsByStatus: ComplaintStatusGroup[] = [
  {
    status: 'New',
    totalComplaints: mockComplaintsNew.length,
    unassignedComplaints: mockComplaintsNew.filter((c) => !c.assignee).length,
    complaints: mockComplaintsNew,
  },
  {
    status: 'Open',
    totalComplaints: mockComplaintsOpen.length,
    unassignedComplaints: mockComplaintsOpen.filter((c) => !c.assignee).length,
    complaints: mockComplaintsOpen,
  },
  {
    status: 'Resolved',
    totalComplaints: mockComplaintsResolved.length,
    unassignedComplaints: mockComplaintsResolved.filter((c) => !c.assignee)
      .length,
    complaints: mockComplaintsResolved,
  },
];
// --- END OF MOCK DATA TO BE INCLUDED ---

export interface ComplaintsState {
  complaintsByStatus: ComplaintStatusGroup[];
  loading: boolean;
  error: string | null;
}

const initialState: ComplaintsState = {
  complaintsByStatus: initialMockComplaintsByStatus, // Use the mock data here
  loading: false, // Set to false initially as data is preloaded
  error: null,
};

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    // Kept for potential future use if we need to load new data or clear
    setComplaintsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setComplaintsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    // This reducer can be used to overwrite or update complaints if needed later
    setComplaintsData: (
      state,
      action: PayloadAction<ComplaintStatusGroup[]>,
    ) => {
      state.complaintsByStatus = action.payload;
      state.loading = false;
      state.error = null;
    },
    // TODO: Add more reducers if needed for CRUD operations on individual complaints
  },
});

// Renamed setComplaints to setComplaintsData to avoid confusion if we re-introduce API loading
export const { setComplaintsLoading, setComplaintsError, setComplaintsData } =
  complaintsSlice.actions;

export const selectComplaintsByStatus = (state: RootState) =>
  state.complaints.complaintsByStatus;
export const selectComplaintsLoading = (state: RootState) =>
  state.complaints.loading;
export const selectComplaintsError = (state: RootState) =>
  state.complaints.error;

export default complaintsSlice.reducer;
