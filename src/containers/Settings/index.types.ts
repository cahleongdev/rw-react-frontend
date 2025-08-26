import { z } from 'zod';

export interface SchoolUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  title: string;
  role: string;
  status: React.ReactNode;
  actions: React.ReactNode;
  agency: string;
  school: string;
  profile_image: string;
  is_active: boolean;
  notification_settings: {
    benchmark: boolean;
    comments: boolean;
    daily_report: boolean;
    messages: boolean;
    report_assigned: boolean;
    report_rejected: boolean;
    report_returned: boolean;
    weekly_report: boolean;
  };
}

export interface SchoolUserResponse {
  count: number;
  results: SchoolUser[];
}
export interface SchoolTable {
  id: string;
  name: string;
  grades: string;
  city: string;
  country: string;
  district: string;
  admin: string;
  status: React.ReactNode;
  actions: React.ReactNode;
  type: string;
  address: string;
  state: string;
  zipcode: string;
}

export interface School {
  id: string;
  name: string;
  gradeserved: string[];
  county: string;
  district: string;
  address: string;
  agency: string;
  type: string;
  city: string;
  state: string;
  zipcode: string;
  status: string;
}

export interface SchoolResponse {
  id: string;
  name: string;
  gradeserved: string[];
  county: string;
  district: string;
  address: string;
  agency: string;
  type: string;
  city: string;
  state: string;
  zipcode: string;
  status: string;
}

export interface TableField {
  key: keyof SchoolTable | 'actions';
  label: string;
  orderable: boolean;
}

export type Order = 'asc' | 'desc';

export type Calendar = 'google' | 'microsoft' | '';

export interface Integration {
  name: string;
  logo: string;
  link: string;
  description: string;
  status: string;
}

export interface VerificationContact {
  email: string;
  phone: string;
}

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  });

export enum SecurityPageEventTypes {
  NONE = 'NONE',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  APP_MFA_EDIT = 'APP_MFA_EDIT',
  APP_MFA_REMOVE = 'APP_MFA_REMOVE',
  PHONE_MFA_EDIT = 'PHONE_MFA_EDIT',
  PHONE_MFA_REMOVE = 'PHONE_MFA_REMOVE',
  EMAIL_MFA_EDIT = 'EMAIL_MFA_EDIT',
  EMAIL_MFA_REMOVE = 'EMAIL_MFA_REMOVE',
}
