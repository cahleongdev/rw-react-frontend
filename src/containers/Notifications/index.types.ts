export enum NotificationType {
  Info = 'info',
  Assignment = 'assignment',
  Comment = 'comment',
  StatusChange = 'status_change',
  Deadline = 'deadline',
  System = 'system',
  User = 'user',
  School = 'school',
  Report = 'report',
  ReportAssignment = 'report_assignment',
  MultipleReportAssignment = 'multiple_report_assignment',
  ReportUnassignment = 'report_unassignment',
  MultipleReportUnassignment = 'multiple_report_unassignment',
  NewComments = 'new_comments',
  ReportSubmission = 'report_submission',
  ApplicationSubmission = 'application_submission',
  ApplicationEvaluation = 'application_evaluation',
  ComplaintAssignment = 'complaint_assignment',
  NewAgencyUser = 'new_agency_user',
  SchoolInfoUpdate = 'school_info_update',
  BoardCalendarUpdate = 'board_calendar_update',
  NewSchoolUsers = 'new_school_users',
}

export interface NotificationLink {
  label: string; // e.g., "Q4 Report"
  id: string;
  entityType:
    | 'report'
    | 'school'
    | 'comment'
    | 'schools'
    | 'application'
    | 'agency'
    | 'complaint'
    | 'user'; // for rendering logic
}

export type FilterType = 'All' | 'Unread' | 'Read';

export interface Notification {
  id: string;
  comment_id?: string;
  report_id?: string;
  school_id?: string;
  application_id?: string;
  agency_id?: string;
  complaint_id?: string;
  user_id?: string;
  receiver_id: string;
  template: string;
  links: NotificationLink[];
  read: boolean;
  type: NotificationType;
  created_at: string; // This will map to created_at
  key?: {
    [key: string]: string;
  };
}
