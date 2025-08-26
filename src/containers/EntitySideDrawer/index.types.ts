export interface AssignedReport {
  id: string;
  name: string;
  status: 'Complete' | 'Pending';
  schoolId: string;
  schoolName: string;
  reportId?: string;
}

export interface AssignedReportItem {
  id: string;
  status: string;
  report: {
    id: string;
    name: string;
  } | null;
}

export interface UploadingFile {
  year: string;
  tempId: string;
  file: File;
  name: string;
  section: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error' | 'cancelled';
  expires: string | null;
}

export enum EntityType {
  AgencyUser = 'Agency User',
  SchoolUser = 'School User',
  School = 'School',
  Network = 'Network',
  BoardMember = 'Board Member',
  User = 'User',
}

export enum EntitySideDrawerTabIds {
  Details = 'details',
  BoardCenter = 'board-center',
  AssignedReports = 'assigned-reports',
  Documents = 'documents',
}

export const EntitySideDrawerTabs = [
  { id: EntitySideDrawerTabIds.Details, label: 'Details' },
  {
    id: EntitySideDrawerTabIds.BoardCenter,
    label: 'Board Center',
    viewBy: [EntityType.Network, EntityType.School],
  },
  { id: EntitySideDrawerTabIds.AssignedReports, label: 'Assigned Reports' },
  { id: EntitySideDrawerTabIds.Documents, label: 'Documents' },
];
