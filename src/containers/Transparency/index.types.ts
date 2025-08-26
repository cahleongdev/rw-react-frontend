import { FileUrl } from '@containers/Reports/index.types';
import { z } from 'zod';

export interface TransparencyDetail {
  help_faqs_url: string;
  contact_form_url: string;
  privacy_policy_url: string;
  website_homepage_url: string;
  custom_domain_url: string;
  contact_phone_number: string;
  contact_email: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  logo_url: string;
  zipcode: string;
  updated_at: string;
}

export interface TransparencyContactDetail {
  contact_phone_number: string;
  contact_email: string;
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface TransparencyLinkFields {
  help_faqs_url: string;
  contact_form_url: string;
  privacy_policy_url: string;
  website_homepage_url: string;
  custom_domain_url: string;
}

export const TransparencyDetailSchema = z.object({
  help_faqs_url: z.string().url().or(z.literal('')),
  contact_form_url: z.string().url().or(z.literal('')),
  privacy_policy_url: z.string().url().or(z.literal('')),
  website_homepage_url: z.string().url().or(z.literal('')),
  custom_domain_url: z.string().url().or(z.literal('')),
  contact_phone_number: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .or(z.literal('')),
  contact_email: z.string().email().or(z.literal('')),
  street_address: z
    .string()
    .min(1, { message: 'Street address is required' })
    .or(z.literal('')),
  city: z.string().min(1, { message: 'City is required' }).or(z.literal('')),
  state: z.string().min(1, { message: 'State is required' }).or(z.literal('')),
  country: z
    .string()
    .min(1, { message: 'Country is required' })
    .or(z.literal('')),
  logo_url: z.string().url().or(z.literal('')),
  zipcode: z
    .string()
    .min(5, { message: 'Zipcode is required' })
    .or(z.literal('')),
});

export interface TransparencyFolder {
  id: string;
  name: string;
  subFolders: TransparencySubFolder[];
  expanded: boolean;
}

export interface TransparencySubFolder {
  id: string;
  name: string;
  reports: TransparencyReport[];
  expanded: boolean;
  direction: Map<string, 'asc' | 'desc'>;
}

export interface TransparencyReport {
  id: string;
  name: string;
  due_date: string;
  file_urls: FileUrl[];
}

export interface TransparencySchool {
  id: string;
  name: string;
  address: string;
  founded_at?: string;
  contract_expires?: string;
  gradeserved: string[];
  contact_phone_number?: string;
  website_url?: string;
  logo?: string;
}

export const TransparencySchoolSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  founded_at: z.string({ message: 'Founded Date is required' }).nullable(),
  contract_expires: z
    .string({ message: 'Contract Date is required' })
    .optional()
    .or(z.literal(''))
    .nullable(),
  gradeserved: z
    .array(z.string())
    .min(1, { message: 'Grades served is required' }),
  contact_phone_number: z
    .string({ message: 'Contact phone number is required' })
    .length(14, { message: 'Contact phone number must be 10 digits' })
    .trim()
    .optional()
    .or(z.literal(''))
    .nullable(),
  website_url: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .optional()
    .or(z.literal(''))
    .nullable(),
  logo: z
    .string()
    .url({ message: 'Logo is Required' })
    .optional()
    .or(z.literal(''))
    .nullable(),
});
