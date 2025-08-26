import { z } from 'zod';

export enum ResetMethod {
  SMS = 'sms',
  EMAIL = 'email',
}

export interface ContactInfoType {
  email?: string;
  phone?: string;
}

export enum SignUpStep {
  PERSONAL_INFO = 'personal_info',
  PASSWORD = 'password',
}

export enum MFAPMethod {
  SCAN_QR = 'scan_qr',
  PHONE = 'phone',
  EMAIL = 'email',
}

export enum MFAPage {
  MFA_METHOD = 'MFA_METHOD',
  QR_VERIFICATION = 'QR_VERIFICATION',
  VERIFICATION_CODE = 'VERIFICATION_CODE',
  PHONE_VERIFICATION = 'PHONE_VERIFICATION',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  BACKUP_CODES = 'BACKUP_CODES',
}

export enum MFAMethod {
  TOTP = 'totp',
  SMS = 'sms',
  EMAIL = 'email',
  VOICE = 'voice',
  BACKUP_CODE = 'backup_code',
}

export enum PhoneVerificationMethod {
  SMS = 'sms',
  VOICE = 'voice',
}

export const signUpSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
          val.replace(/\s/g, ''),
        ),
      {
        message: 'Invalid phone number',
      },
    ),
  title: z.string().optional(),
  custom_fields: z.record(z.string(), z.string()).optional(),
  role: z.string().min(1, 'Role is required'),
  receive_marketing: z.boolean().optional(),
});
