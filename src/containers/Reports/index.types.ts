import { School } from '@/store/slices/schoolsSlice';

export interface Report {
  id: string;
  name: string;
  report: string;
  domain: string;
  due_date: Date;
  actions: React.ReactNode;
}

export interface FileUrl {
  file_url: string;
  file_name: string;
}

export interface Schedule {
  id: string;
  schedule_time: string;
  report_name: string;
}

export interface Question {
  id: string;
  question: string;
  type: string;
  allow_submission: boolean;
  accepted_files: string[];
  options: Option[];
}

export interface Option {
  id: string;
  option: string;
}

export interface SubmissionInstruction {
  id: string;
  type: string;
  auto_accept: boolean;
  allow_submission: boolean;
  questions: Question[];
  accepted_files: string[];
}

export interface Scoring {
  id: string;
  exceed: string;
  meet: string;
  approach: string;
  notmeet: string;
}

export interface EditedBy {
  id: string;
  first_name: string;
  last_name: string;
}

export interface ReportContent {
  step1: {
    title: string;
    description: string;
  };
  step2: {
    title: string;
    description: string;
  };
  step3: {
    title: string;
    description: string;
  };
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ReportResponse {
  id: string;
  school_year: string;
  categories: string[];
  schedules: Schedule[];
  submission_instruction: SubmissionInstruction | null;
  scoring: Scoring | null;
  has_scoring: boolean;
  edited_by: EditedBy | null;
  assigned_schools: School[];
  name: string;
  report: string;
  file_format: string[];
  domain: string;
  use_scoring: boolean;
  schedule_type: string;
  due_date: string | null;
  completion_time: string;
  description: string;
  content: ReportContent;
  video_url: string | null;
  video_cover: string | null;
  file_urls: FileUrl[];
  tag: string | null;
  submission_format: string | null;
  type: string | null;
  recurring_period: string | null;
  recurring_interval: number | null;
  recurring_occurrences: number | null;
  recurring_first_occurrence: string | null;
  approved: boolean;
  agency: string;
}

export interface AssignedSchool {
  id: string;
  name: string;
  assigned_at: string;
}

export type Order = 'asc' | 'desc';

export interface TableField {
  key: keyof Report | 'actions';
  label: string;
  orderable: boolean;
}
