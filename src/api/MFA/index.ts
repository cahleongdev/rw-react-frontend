/**
 * MFA API
 * @description This is the API for MFA
 */

import axiosInstance from '../axiosInstance';
import {
  GenerateTOTPResponse,
  SendMFACodeResponse,
  VerifyBackupCodeResponse,
  GenerateBackupCodesResponse,
  GetMFAContactResponse,
  RemoveMFAResponse,
  VerifyMFACodeResponse,
} from './index.types';

export const MFAService = {
  generateTOTP: async (method: string) => {
    const response = await axiosInstance.post<GenerateTOTPResponse>(
      '/auth/mfa/generate/',
      {
        method,
      },
    );
    return response.data;
  },

  verifyMFACode: async (code: string, method: string) => {
    const response = await axiosInstance.post<VerifyMFACodeResponse>(
      '/auth/mfa/verify/',
      {
        code,
        method,
      },
    );
    return response.data;
  },

  sendMFACode: async (data: {
    method: string;
    phone?: string;
    phone_method?: string;
    email?: string;
  }) => {
    const response = await axiosInstance.post<SendMFACodeResponse>(
      '/auth/mfa/send_code/',
      data,
    );
    return response.data;
  },

  verifyBackupCode: async (code: string) => {
    const response = await axiosInstance.post<VerifyBackupCodeResponse>(
      '/auth/mfa/verify_backup/',
      {
        code,
      },
    );
    return response.data;
  },

  generateBackupCodes: async () => {
    const response = await axiosInstance.post<GenerateBackupCodesResponse>(
      '/auth/mfa/generate_backup_codes/',
    );
    return response.data;
  },

  getMFAContact: async () => {
    const response = await axiosInstance.get<GetMFAContactResponse>(
      '/users/mfa_contact/',
    );
    return response.data;
  },

  removeMFA: async (method: string) => {
    const response = await axiosInstance.post<RemoveMFAResponse>(
      '/auth/mfa/remove/',
      { method },
    );
    return response.data;
  },
};
