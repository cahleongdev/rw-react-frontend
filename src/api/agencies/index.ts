import axiosInstance from '@/api/axiosInstance';
import { Agency } from '@/store/types';
import { SchoolUser } from '@/store/slices/schoolUsersSlice';
import { InviteUserFormData } from '@containers/AgencySettings/index.types';

export const AgencyService = {
  getAllAgencies: async (): Promise<Agency[]> => {
    const response = await axiosInstance.get('/agencies/');
    return response.data;
  },

  fetchAgency: async (agencyId: string): Promise<Agency> => {
    const response = await axiosInstance.get(`/agencies/${agencyId}/`);
    return response.data;
  },

  updateAgency: async (
    agencyId: string,
    updates: Partial<Agency>,
  ): Promise<Agency> => {
    const response = await axiosInstance.put(`/agencies/${agencyId}/`, updates);
    return response.data;
  },

  addAgency: async (agencyData: Partial<Agency>): Promise<Agency> => {
    const response = await axiosInstance.post('/agencies/', agencyData);
    return response.data;
  },

  deleteAgency: async (agencyId: string): Promise<void> => {
    await axiosInstance.delete(`/agencies/${agencyId}/`);
  },

  getAgencyUsers: async (agencyId?: string): Promise<SchoolUser[]> => {
    const endpoint = agencyId
      ? `/agencies/${agencyId}/users/`
      : '/agencies/users/';
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },

  getAgencyUser: async (
    agencyId: string,
    userId: string,
  ): Promise<SchoolUser> => {
    const response = await axiosInstance.get(
      `/agencies/${agencyId}/users/${userId}/`,
    );
    return response.data;
  },

  createAgencyUser: async (agencyId: string, data: InviteUserFormData) => {
    try {
      const response = await axiosInstance.post(
        `/agencies/${agencyId}/users/`,
        data,
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteAgencyUser: async (agencyId: string, userId: string): Promise<void> => {
    await axiosInstance.delete(`/agencies/${agencyId}/users/${userId}/`);
  },

  bulkDeleteAgencyUsers: async (
    agencyId: string,
    userIds: string[],
  ): Promise<void> => {
    await axiosInstance.delete(`/agencies/${agencyId}/users/`, {
      data: { user_ids: userIds },
    });
  },

  resendMagicLink: async (agencyId: string, userId: string): Promise<void> => {
    await axiosInstance.post(`/agencies/${agencyId}/users/${userId}/`, {
      action: 'resend_magic_link',
    });
  },

  bulkResendMagicLinks: async (
    agencyId: string,
    userIds: string[],
  ): Promise<void> => {
    await axiosInstance.post(`/agencies/${agencyId}/users/bulk/`, {
      action: 'resend_magic_links',
      user_ids: userIds,
    });
  },

  restoreAgencyUser: async (
    agencyId: string,
    userId: string,
  ): Promise<void> => {
    await axiosInstance.post(`/agencies/${agencyId}/users/${userId}/`, {
      action: 'restore',
    });
  },

  bulkRestoreAgencyUsers: async (
    agencyId: string,
    userIds: string[],
  ): Promise<void> => {
    await axiosInstance.post(`/agencies/${agencyId}/users/bulk/`, {
      action: 'restore',
      user_ids: userIds,
    });
  },
};
