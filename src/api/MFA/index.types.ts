import { MFAMethod } from '@/containers/Auth/index.types';

export interface GenerateTOTPResponse {
  secret: string;
  qr_code: string;
}

export interface VerifyMFACodeResponse {
  message: string;
  backup_codes: string[];
  mfa_method: MFAMethod[];
}

export interface SendMFACodeResponse {
  message: string;
  method: string;
}

export interface VerifyBackupCodeResponse {
  message: string;
}

export interface GenerateBackupCodesResponse {
  message: string;
  backup_codes: string[];
}

export interface GetMFAContactResponse {
  phone: string;
  email: string;
}

export interface RemoveMFAResponse {
  message: string;
  mfa_method: MFAMethod[];
}
