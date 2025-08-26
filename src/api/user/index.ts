/**
 * User API
 * @description This is the API for auth and user
 */

import axiosInstance from '../axiosInstance';

import { AcceptInviteUserData } from '@/containers/AgencySettings/index.types';
import { ResetMethod } from '@/containers/Auth/index.types';
import { UpdatePersonalProfile } from './index.types';

const userAPI = {
  // Login
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/login/', {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // MFA Login Verification
  loginMFAVerify: async (code: string, method: string) => {
    try {
      const response = await axiosInstance.post('/auth/login/mfa/verify/', {
        code,
        method,
      });

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // Send MFA Code during Login
  loginMFASendCode: async (method: string) => {
    try {
      const response = await axiosInstance.post('/auth/login/mfa/send_code/', {
        method,
      });

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  validateInviteToken: async (token: string) => {
    const response = await axiosInstance.get(
      `/auth/validate_invite_token/${token}/`,
    );

    return response.data;
  },

  acceptInvite: async (data: AcceptInviteUserData) => {
    const response = await axiosInstance.post('/auth/accept_invite/', data);

    return response.data;
  },

  // Password Reset
  getContactInfo: async (email: string) => {
    const response = await axiosInstance.get(
      `/auth/contact_info_for_reset/${email}`,
    );

    return response.data;
  },

  sendResetLink: async (email: string, method: ResetMethod) => {
    const response = await axiosInstance.post('/auth/send_reset_link/', {
      email,
      method,
    });

    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/reset_password/', {
      token,
      newPassword,
    });

    return response.data;
  },

  validateResetToken: async (token: string) => {
    const response = await axiosInstance.get(
      `/auth/validate_reset_token/${token}`,
    );

    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/change_password/', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  updatePersonalProfile: async (data: Partial<UpdatePersonalProfile>) => {
    const response = await axiosInstance.patch('/users/me/', data);
    return response.data;
  },

  requestNewMagicLink: async (email: string) => {
    try {
      const response = await axiosInstance.post(
        '/auth/request_new_magic_link/',
        {
          email,
        },
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default userAPI;
