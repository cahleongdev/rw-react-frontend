import { RootState } from './index';

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectMFARequired = (state: RootState) => state.auth.mfaRequired;
export const selectMFAMethods = (state: RootState) => state.auth.mfaMethods;
export const selectMFALoading = (state: RootState) => state.auth.mfaLoading;
export const selectIsCollapsed = (state: RootState) =>
  state.sideMenu.isCollapsed;

export type FieldType = 'text' | 'date' | 'phone' | 'file' | 'select';

export type EntityTypeWithCustomFields = 'School' | 'Network' | 'User';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  // Add other relevant user profile fields
}

export interface CustomFieldDefinition {
  Name: string;
  Type: string;
}

export interface Agency {
  id: string;
  title: string;
  admin_privileges: string[];
  school_privileges: string[];
  access_school: boolean;
  home_url: string;
  logo_url: string;
  street_address: string;
  city: string;
  state: string;
  county: string;
  zipcode: string;
  authorize_type: string;
  jurisdiction: string;
  calendar_year: string;
  years_operation: string;
  number_of_schools: number;
  number_of_impacted_students: number;
  domain: string;
  annual_budget: string;
  custom_fields: Record<string, string>;
  agency_entity_fields: CustomFieldDefinition[];
  school_entity_fields: CustomFieldDefinition[];
  network_entity_fields: CustomFieldDefinition[];
  board_member_fields: CustomFieldDefinition[];
  agency_user_fields: CustomFieldDefinition[];
  school_user_fields: CustomFieldDefinition[];
  status?: 'active' | 'inactive';
}

// Add Submission Message Type
export interface SubmissionMessage {
  id: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  content: string;
  submission: string; // Submission ID
  created_at: string; // ISO date string
}
